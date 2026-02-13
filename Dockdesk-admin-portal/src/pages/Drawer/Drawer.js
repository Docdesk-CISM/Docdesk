import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import { blue } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MedicationIcon from "@mui/icons-material/Medication";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import SummarizeIcon from "@mui/icons-material/Summarize";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../hooks/useAuthContext";

const drawerWidth = 240;

function ResponsiveDrawer({ Inp }) {
  const { user } = useAuthContext();
  const [userName, setUserName] = React.useState();
  console.log(user);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const [timeLeft, setTimeLeft] = React.useState(60);

  // React.useEffect(() => {
  //   // exit early when we reach 0
  //   if (!timeLeft) return;

  //   console.log(user)
  //   console.log(userName);
  //   if (userName == null || undefined) {
  //     setUserName(user.fName);
  //   } else {
  //     setTimeLeft(0);
  //   }

  //   const intervalId = setInterval(() => {
  //     setTimeLeft(timeLeft - 1);
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  // }, [timeLeft]);

  const navigate = useNavigate();

  console.log(userName);

  React.useEffect(() => {
    setUserName(user.fName);
  }, [user]);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />

      <List>
        {["Dashboard", "Doctors", "Patients"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index === 0 ? <DashboardIcon /> : <></>}
                {index === 1 ? <MedicationIcon /> : <></>}
                {index === 2 ? <VaccinesIcon /> : <></>}
                {/* {index === 3 ? <SummarizeIcon /> : <></>} */}
              </ListItemIcon>
              {index === 0 ? (
                <ListItemText
                  primary={text}
                  onClick={() => {
                    navigate("/");
                  }}
                />
              ) : (
                <></>
              )}
              {index === 1 ? (
                <ListItemText
                  primary={text}
                  onClick={() => {
                    navigate("/doctors");
                  }}
                />
              ) : (
                <></>
              )}
              {index === 2 ? (
                <ListItemText
                  primary={text}
                  onClick={() => {
                    navigate("/patients");
                  }}
                />
              ) : (
                <></>
              )}
              {index === 3 ? (
                <ListItemText
                  primary={text}
                  onClick={() => {
                    navigate("/doctors");
                  }}
                />
              ) : (
                <></>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {["Create New Admin", "Logout"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {/* {index === 0 ? <SettingsIcon /> : <></>} */}
                {index === 0 ? <AddCircleOutlineIcon /> : <></>}
                {index === 1 ? <LogoutIcon /> : <></>}
              </ListItemIcon>

              {/* {index === 0 ? (
                <ListItemText
                  primary={text}
                  onClick={() => {
                    navigate("/settings");
                  }}
                />
              ) : (
                <></>
              )} */}
              {index === 0 ? (
                <ListItemText
                  primary={text}
                  onClick={() => {
                    navigate("/createAdmin");
                  }}
                />
              ) : (
                <></>
              )}
              {index === 1 ? (
                <ListItemText
                  primary={text}
                  onClick={() => {
                    navigate("/logout");
                  }}
                />
              ) : (
                <></>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{ width: "300px" }}
            component="div"
          >
            DocDesk PORTAL
          </Typography>

          <Grid container justifyContent="flex-end">
            <Typography
              variant="h6"
              noWrap
              sx={{ marginRight: "20px", marginTop: "3px" }}
              component="div"
            >
              Welcome {userName}
            </Typography>
            <Avatar sx={{ bgcolor: blue[500] }}>
              <PersonIcon />
            </Avatar>
          </Grid>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {Inp}
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
