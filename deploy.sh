#!/bin/bash

# Exit on error
set -e

echo "Starting build and deploy process..."

# Check if AWS credentials are configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "Error: AWS credentials not configured. Please run 'aws configure' first."
    echo "For more information, visit: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html"
    exit 1
fi

# Install dependencies
echo "Installing/updating dependencies..."
npm install

# Fetch environment variables from AWS SSM
echo "Fetching environment variables from AWS SSM..."
REACT_APP_GOOGLE_API_KEY=$(aws ssm get-parameter --name "GOOGLE_API_KEY" --with-decryption --query "Parameter.Value" --output text)
REACT_APP_GOOGLE_AUTH_KEY=$(aws ssm get-parameter --name "GOOGLE_AUTH_KEY" --with-decryption --query "Parameter.Value" --output text)
REACT_APP_BACKEND_SERVICE_PATH=$(aws ssm get-parameter --name "BACKEND_SERVICE_PATH" --query "Parameter.Value" --output text)

# Create .env file
echo "Creating .env file..."
echo "REACT_APP_BACKEND_SERVICE_PATH=$REACT_APP_BACKEND_SERVICE_PATH" > .env
echo "REACT_APP_GOOGLE_API_KEY=$REACT_APP_GOOGLE_API_KEY" >> .env
echo "REACT_APP_GOOGLE_AUTH_KEY=$REACT_APP_GOOGLE_AUTH_KEY" >> .env

# Unset sensitive environment variables
unset REACT_APP_GOOGLE_API_KEY REACT_APP_GOOGLE_AUTH_KEY REACT_APP_BACKEND_SERVICE_PATH

# Build the application
echo "Building the application..."
npm run build

# Get AWS account ID and bucket name
echo "Preparing to deploy to S3..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BUCKET_NAME="fryrank-app-spa-bucket-${ACCOUNT_ID}"

echo "Deploying to S3 bucket: s3://$BUCKET_NAME/"

# Sync build directory to S3
aws s3 sync build/ "s3://$BUCKET_NAME/" --delete

echo "Deployment completed successfully!"
echo "Your application is now available at: https://$BUCKET_NAME.s3.amazonaws.com/index.html"
