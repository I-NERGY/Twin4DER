import Sidebar from "./components/sidebar";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, Container, Toolbar } from "@mui/material";
import Home from "./pages/home";
import Settings from "./pages/settings";
import Insights from "./pages/insights";
import Other from "./pages/other";
import ErrorPage from "./pages/404";

function App() {
  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Toolbar />
        <Box>
          <Container maxWidth="lg">
            {
              <Routes>
                <Route exact path={"/"} element={<Home/>} />
                <Route path={"demo/settings"} element={<Settings/>} />
                <Route path={"demo/insights"} element={<Insights/>} />
                <Route path={"demo/other"} element={<Other/>} />
                <Route
                  path="*"
                  element={<ErrorPage/>}
                />
              </Routes>
            }
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
