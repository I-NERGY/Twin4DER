import Sidebar from "./components/sidebar";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Box, Container, Toolbar } from "@mui/material";
import Home from "./pages/home";
import SecureSetup from "./pages/setup";
import Insights from "./pages/insights";
import Login from "./pages/login";
import ErrorPage from "./pages/404";
import Keycloak from 'keycloak-js';


const kc = new Keycloak({
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  url: process.env.REACT_APP_KEYCLOAK_URL,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID
});

// // must match to the configured value in keycloak
// redirectUri: 'http://localhost:4200/your_url',   

/*
kc.init({ 
  onLoad: 'login-required',
  checkLoginIframe: false,
  pkceMethod: 'S256',
  redirectUri: 'http://digital-twin.k8s.eonerc.rwth-aachen.de/oauth2/callback'
  }).then((auth) => {
  if (auth) {
    console.log('Authenticated');
  } else {
    console.log('Not Authenticated');
  }
});
*/

function buttonInit() {
  kc.init({ 
    onLoad: 'login-required',
    checkLoginIframe: false,
    pkceMethod: 'S256',
    redirectUri: 'http://digital-twin.k8s.eonerc.rwth-aachen.de/oauth2/callback'
    }).then((auth) => {
    if (auth) {
      console.log('Authenticated');
    } else {
      console.log('Not Authenticated');
    }
  }).catch((error) => {
    console.error("Failed to log in", error);
  })
}

function buttonLogin() {
  kc.login()
}

function App() {
  return (
    <div>
      <h1>App</h1>
        <button onClick={buttonInit} label='Init' severity="success" />
        <button onClick={buttonLogin}  label='Login' severity="success" />
    </div>
    /*
    <BrowserRouter>
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Toolbar />
        <Box>
          <Container maxWidth="lg">
            {
              <Routes>
                <Route exact path={"/"} element={<Home/>} />
                <Route path={"demo/setup"} element={<SecureSetup/>} />
                <Route path={"demo/insights"} element={<Insights/>} />
                <Route path={"oauth2/callback"} element={<Login/>} />
                <Route
                  path="*"
                  element={<ErrorPage/>}
                />
              </Routes>
            }
          </Container>
        </Box>
      </Box>
    </BrowserRouter>
    */
  );
}

export default App;
