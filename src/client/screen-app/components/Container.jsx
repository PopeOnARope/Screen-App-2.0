import React from 'react';
import styled from 'styled-components';
import MessageHistory from './MessageHistory';
import Welcome from './Welcome';
import Verify from './Verify';
import { fetchAuthId } from '../../utils/connectors';
import Provider, { useGlobalStore } from './Provider';

const CANDIDATE_DATA = {
  'Candidate #': '12345',
  Email: 'jason@gmail.com',
};

const ContainerContainer = styled.div`
  padding: auto 12px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  font-family: Nunito;
  h1 {
    color: ${props => props.theme.primary};
    margin-bottom: 109px;
  }
  p {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    text-align: center;
  }
  .lower-content {
    margin-top: 100px;
  }
`;

const Container = props => {
  // TODO find a clean way to listen for changes in the sheet

  const { state, dispatch } = useGlobalStore();
  const { authId, currentView } = state;

  React.useEffect(() => {
    if (!authId) {
      fetchAuthId().then(result => {
        dispatch({ type: 'authId', value: result.authId });
      });
    }
  }, []);

  return (
    <ContainerContainer>
      {currentView === 'welcome' && <Welcome />}
      {currentView === 'verify' && <Verify />}
      {currentView === 'history' && (
        <MessageHistory
          authId={props.authId}
          candidateNumber={CANDIDATE_DATA['Candidate #']}
          candidateEmail={CANDIDATE_DATA.Email}
        />
      )}
    </ContainerContainer>
  );
};

const ContainerWithProvider = () => (
  <Provider>
    <Container />
  </Provider>
);

export default ContainerWithProvider;
