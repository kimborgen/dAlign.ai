import logo from './logo.svg';
import './App.css';
import Box from '@mui/material/Box';
import Main from "./components/Main.jsx"
import { ThemeProvider, createTheme} from "@mui/material";
import { SafeThemeProvider } from '@safe-global/safe-react-components'




function App() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#444444',
      }}
    >
      <SafeThemeProvider mode="dark">
      {(safeTheme) => (
        <ThemeProvider theme={safeTheme}>
          <Main />
        </ThemeProvider>
      )}
      </SafeThemeProvider>
    </Box>
  );
}

export default App;
