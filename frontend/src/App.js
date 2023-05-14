import logo from './logo.svg';
import './App.css';
import Box from '@mui/material/Box';
import Main from "./components/Main.jsx"
import { ThemeProvider, createTheme} from "@mui/material";
import { SafeThemeProvider } from '@safe-global/safe-react-components'
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/46798/dalign/v0.0.1",
  cache: new InMemoryCache()
});


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
            <ApolloProvider client={client}>
              <Main />
            </ApolloProvider>
        </ThemeProvider>
      )}
      </SafeThemeProvider>
    </Box>
  );
}

export default App;
