import React from "react";
import {
  Drawer,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import InsightsIcon from "@mui/icons-material/Insights";
import SettingsIcon from "@mui/icons-material/Settings";
import SummarizeIcon from "@mui/icons-material/Summarize";

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          backgroundColor: "#5c5c5c",
          color: "#fff",
          boxSizing: "border-box",
        },
        "& .MuiListItemIcon-root": {
          color: "#91ac27",
          opacity: 0.5,
        },
      }}
    >
      <List sx={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <ListItemButton
          component={Link}
          to="/"
          sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              style: {
                color: (theme) => theme.palette.primary.main,
                opacity: 0.5,
              },
            }}
            primary="Home"
          />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="demo/setup"
          sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              style: {
                color: (theme) => theme.palette.primary.main,
                opacity: 0.5,
              },
            }}
            primary="Setup"
          />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="demo/insights"
          sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <ListItemIcon>
            <InsightsIcon />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              style: {
                color: (theme) => theme.palette.primary.main,
                opacity: 0.5,
              },
            }}
            primary="Insights"
          />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="demo/other"
          sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <ListItemIcon>
            <SummarizeIcon />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              style: {
                color: (theme) => theme.palette.primary.main,
                opacity: 0.5,
              },
            }}
            primary="Other"
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
