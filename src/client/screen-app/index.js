import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import Container from './components/Container';
import Provider from './components/Provider';

const theme = {
  // colors
  primary: '#1fa1ec',
  primaryLight: '#4db4ef',
  primaryLighter: '#C1E2F5',
  primaryExtraLight: '#EBF1F2',
  primaryDark: '#0f7ab8',
  grayMedium: '#B1B1B1',
  error: '#FF0000',
  // fonts
  xsmall: `${0.8 * 14}`,
  small: `${0.8 * 16}`,
  medium: `${0.8 * 20}`,
  large: `${0.8 * 22}`,
  xlarge: `${0.8 * 24}`,
};

const ContainerWithStyles = () => {
  return (
    <Provider>
      <ThemeProvider theme={theme}>
        <Container />
      </ThemeProvider>
    </Provider>
  );
};

ReactDOM.render(<ContainerWithStyles />, document.getElementById('index'));
