import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { fetchAuthId } from '../utils/connectors';
import Container from './components/Container';

// get the authid for big parser and inject it here.
const ContainerWithAuthId = () => {
  // TODO: ADD ERROR HANDLING AND LOAD
  const [authId, setAuthId] = useState(false);

  useEffect(() => {
    fetchAuthId().then(result => {
      setAuthId(result.authId);
    });
  }, []);
  return authId ? <Container authId={authId} /> : <p>loading...</p>;
};

ReactDOM.render(<ContainerWithAuthId />, document.getElementById('index'));
