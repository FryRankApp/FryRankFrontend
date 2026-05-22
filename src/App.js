import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {useSelector} from "react-redux";

import { Header } from './components/Common';
import { routes } from "./routes"
import { APIProvider } from '@vis.gl/react-google-maps';

function App() {
  const loggedIn = useSelector((state) => state.userReducer.loggedIn);
  return (
    <div className="min-h-screen bg-slate-50">
      <Router>
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
        <Header loggedIn={loggedIn}/>
        <main className="mx-auto flex w-full max-w-6xl justify-center px-3 py-6 sm:px-5">
              <div className="flex w-full justify-center">
                <Routes>
                  {routes.map((route, key) => (
                    <Route
                      exact
                      path={route.path}
                      key={key}
                      element={<route.component />}
                    />
                  ))}
                </Routes>
              </div>
        </main>
      </APIProvider>
      </Router>
    </div>
  );
}

export default App;
