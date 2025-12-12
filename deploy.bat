@echo off
setlocal enabledelayedexpansion

echo Starting build and deploy process...

:: Check if AWS credentials are configured
aws sts get-caller-identity >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: AWS credentials not configured. Please run 'aws configure' first.
    echo For more information, visit: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
    exit /b 1
)

echo Installing/updating dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo Error: npm ci failed
    exit /b %ERRORLEVEL%
)

echo Fetching environment variables from AWS SSM...
for /f "tokens=*" %%a in ('aws ssm get-parameter --name "GOOGLE_API_KEY" --with-decryption --query "Parameter.Value" --output text') do set REACT_APP_GOOGLE_API_KEY=%%a
for /f "tokens=*" %%a in ('aws ssm get-parameter --name "GOOGLE_AUTH_KEY" --with-decryption --query "Parameter.Value" --output text') do set REACT_APP_GOOGLE_AUTH_KEY=%%a
for /f "tokens=*" %%a in ('aws ssm get-parameter --name "BACKEND_SERVICE_PATH" --query "Parameter.Value" --output text') do set REACT_APP_BACKEND_SERVICE_PATH=%%a

echo Creating .env file...
echo REACT_APP_BACKEND_SERVICE_PATH=!REACT_APP_BACKEND_SERVICE_PATH! > .env
echo REACT_APP_GOOGLE_API_KEY=!REACT_APP_GOOGLE_API_KEY! >> .env
echo REACT_APP_GOOGLE_AUTH_KEY=!REACT_APP_GOOGLE_AUTH_KEY! >> .env

set REACT_APP_GOOGLE_API_KEY=
set REACT_APP_GOOGLE_AUTH_KEY=
set REACT_APP_BACKEND_SERVICE_PATH=

echo Building the application...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo Error: Build failed
    exit /b %ERRORLEVEL%
)

echo Preparing to deploy to S3...
for /f "tokens=*" %%a in ('aws sts get-caller-identity --query Account --output text') do set ACCOUNT_ID=%%a
set BUCKET_NAME=fryrank-app-spa-bucket-%ACCOUNT_ID%

echo Deploying to S3 bucket: s3://%BUCKET_NAME%/

aws s3 sync build/ s3://%BUCKET_NAME%/ --delete

if %ERRORLEVEL% NEQ 0 (
    echo Error: S3 sync failed
    exit /b %ERRORLEVEL%
)

echo Deployment completed successfully!
echo Your application is now available at: https://%BUCKET_NAME%.s3.amazonaws.com/index.html

endlocal
