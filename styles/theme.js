import { createTheme } from "@mui/material";

export const dark = {
  direction: "rtl",
  alternate: {
    main: "#2D3748",
    dark: "#24242b",
  },
  cardShadow: "rgba(0, 0, 0, .11)",
  common: {
    black: "#000",
    white: "#fff",
  },
  type: "dark",
  primary: {
    main: "#0C2643",
    light: "rgb(166, 212, 250)",
    dark: "rgb(100, 141, 174)",
    contrastText: "rgba(0, 0, 0, 0.87)",
  },
  secondary: {
    light: "#ffb74d",
    main: "#f9b934",
    dark: "#f57c00",
    contrastText: "rgba(0, 0, 0, 0.87)",
  },
  text: {
    primary: "#EEEEEF",
    secondary: "#AEB0B4",
  },
  divider: "rgba(255, 255, 255, 0.12)",
  background: {
    paper: "#1A202C",
    default: "#121212",
    level2: "#333",
    level1: "#2D3748",
    footer: "#18181f",
  },
};

const theme = createTheme({
  alternate: {
    main: "#2D3748",
    dark: "#24242b",
  },
  direction: "rtl",
  palette: {
    primary: {
      main: "#0C2643",
      main: "#0C2643",
      main: "#0C2643",
    },
    secondary: {
      light: "#ffb74d",
      main: "#f9b934",
      dark: "#f57c00",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
  },
});

export default theme;
