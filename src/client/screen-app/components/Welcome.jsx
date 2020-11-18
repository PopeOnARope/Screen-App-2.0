import React from 'react';
import styled from 'styled-components';
// import WelcomeIcon from '../../../assets/welcomeIcon.png';
import WelcomeSVG from '../../../assets/Unknown 1.svg';
import { useGlobalStore } from '../reducers';

import { sharedButtonStyles, sharedContainerStyles } from '../styles';

const WelcomeContainer = styled.div`
  ${sharedContainerStyles}
  padding: ${props => props.theme.xsmall}px;
`;

const Button = styled.button`
  ${sharedButtonStyles}
`;

const Welcome = () => {
  const { dispatch } = useGlobalStore();
  return (
    <WelcomeContainer>
      <h1>Welcome to Screen!</h1>
      <img src={WelcomeSVG}></img>
      <div className="lower-content">
        <p>
          Read our <a href="_blank"> Privacy Policy</a>. Tap “Agree & Continue”
          to accept the <a href="_blank">Terms of Service</a>.
        </p>
        <Button
          onClick={() => {
            dispatch({ type: 'currentView', value: 'createAccount' });
          }}
        >
          Agree and Continue
        </Button>
      </div>
    </WelcomeContainer>
  );
};

export default Welcome;
