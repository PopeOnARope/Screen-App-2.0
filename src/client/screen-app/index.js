import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { fetchAuthId } from '../utils/connectors';
import Container from './components/Container';

const theme = {
  primary: '#1fa1ec',
  primaryLight: '#4db4ef',
  grayMedium: '#B1B1B1',
};

// get the authid for big parser and inject it here.
const ContainerWithAuthId = () => {
  // TODO: ADD ERROR HANDLING AND LOAD
  const [authId, setAuthId] = useState(false);

  const GlobalStore = React.createContext();

  useEffect(() => {
    fetchAuthId().then(result => {
      setAuthId(result.authId);
    });
  }, []);
  return authId ? (
    <ThemeProvider theme={theme}>
      <Container authId={authId} />
    </ThemeProvider>
  ) : (
    <p>loading...</p>
  );
};

ReactDOM.render(<ContainerWithAuthId />, document.getElementById('index'));
