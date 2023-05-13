import logo from './logo.svg';
import './App.css';
import Box from '@mui/material/Box';
import Main from "./components/Main.jsx"

function App() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#EEEEEE',
      }}
    >
      <Main />
    </Box>
  );
}

export default App;
