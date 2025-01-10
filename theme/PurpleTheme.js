import { createTheme } from '@mui/material/styles';

const purpleTheme = createTheme({
  palette: {
    primary: {
      main: '#8e24aa',
      light: '#c158dc',
      dark: '#5c007a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ba68c8',
      light: '#ee98fb',
      dark: '#883997',
      contrastText: '#000000',
    },
    background: {
      default: '#f3e5f5',
      paper: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default purpleTheme;
