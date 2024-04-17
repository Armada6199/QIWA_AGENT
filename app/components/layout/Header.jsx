import styled from "@emotion/styled";
import MenuIcon from "@mui/icons-material/Menu";
import { Grid, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/system";
import { useRouter } from "next/navigation";
import * as React from "react";
const drawerWidth = 240;
const navActions = [
  { text: "Speech to text", link: "speechtotext" },
  { text: "Text to speech", link: "texttospeech" },
  { text: "Speech to Speech", link: "finalSpeech" },
];
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const router = useRouter();

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        QIWA AI
      </Typography>
      <Divider />
      <Stack spacing={2}>
        <Item sx={{ cursor: "pointer" }} onClick={() => router.push(`/`)}>
          Home
        </Item>
        {navActions.map((item) => (
          <Item
            sx={{ cursor: "pointer" }}
            onClick={() => router.push(`${item.link}`)}
          >
            {item.text}
          </Item>
        ))}
      </Stack>
      <Button sx={{ color: "#fff" }}>Login</Button>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      sx={{
        direction: "ltr",
        display: "flex",
        height: "60px",
        maxHeight: "60px",
        zIndex: 4,
      }}
    >
      <Grid
        container
        alignItems={"center"}
        justifyContent={"space-around"}
        px={4}
        sx={{
          bgcolor: "primary.main ",
          bgcolor: "primary.main",
        }}
      >
        <Grid container item alignItems={"center"}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon sx={{ color: "#fff" }} />
          </IconButton>
          {/* <Image component={"img"} src={qiwaLogo} width={32} height={32} /> */}
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block", color: "#fff" },
            }}
          >
            Qiwa AI
          </Typography>
        </Grid>
        ٍ
      </Grid>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

export default DrawerAppBar;
