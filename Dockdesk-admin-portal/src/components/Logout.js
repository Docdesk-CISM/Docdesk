import { useLogout } from "../hooks/useLogout";
import * as React from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import WarningIcon from "@mui/icons-material/Warning";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";

export default function Logout() {
  const { logout } = useLogout();

  return (
    <div className="LogOutContainer">
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CssBaseline />
        <WarningIcon fontSize="large" color="error" />
        <Typography variant="h5" sx={{ marginTop: 2 }}>
          Confirm Logout?
        </Typography>
        <Button onClick={logout} variant="contained" sx={{ mt: 3, mb: 2 }}>
          Log Out
        </Button>
      </Container>
    </div>
  );
}
