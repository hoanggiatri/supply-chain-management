export default function Theme(colors) {
  const { blue, red, gold, cyan, green, grey } = colors;
  const greyColors = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16]
  };
  const contrastText = '#fff';

  return {
    default: {
      lighter: "#D0E6F5",
      light: "#77B7DF",
      main: "#05518B",
      dark: "#033B64",
      darker: "#022840",
      contrastText
    },
    
    primary: {
      lighter: blue[3],
      light: blue[4],
      main: blue[5],
      dark: blue[6],
      darker: blue[7],
      contrastText
    },
    secondary: {
      lighter: grey[4],
      light: grey[5],
      main: grey[6],
      dark: grey[7],
      darker: grey[8],
      contrastText
    },
    error: {
      lighter: red[3],
      light: red[4],
      main: red[6],
      dark: red[7],
      darker: red[8],
      contrastText
    },
    warning: {
      lighter: gold[3],
      light: gold[4],
      main: gold[5],
      dark: gold[6],
      darker: gold[7],
      contrastText
    },
    info: {
      lighter: cyan[5],
      light: cyan[6],
      main: cyan[7],
      dark: cyan[8],
      darker: cyan[9],
      contrastText
    },
    success: {
      lighter: green[4],
      light: green[5],
      main: green[6],
      dark: green[7],
      darker: green[8],
      contrastText
    },
    grey: greyColors
  };
}
