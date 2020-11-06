import React from 'react';
// import WelcomeIcon from '../../../assets/welcomeIcon.png';
import WelcomeSVG from '../../../assets/Unknown 1.svg';
import styled from 'styled-components';
import { useGlobalStore } from './Provider';

const Button = styled.button`
  width: 100%;
  padding: 2px;
  background: ${props => props.theme.primary};
  border-radius: 10px;
  height: 50px;
  color: #fff;
  border: none;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 33px;
  font-family: Nunito;
  &:hover {
    background: ${props => props.theme.primaryLight};
    cursor: pointer;
  }
`;

const Welcome = () => {
  const { dispatch } = useGlobalStore();
  return (
    <React.Fragment>
      <h1>Welcome to Screen!</h1>
      <img src={WelcomeSVG}></img>
      <div className="lower-content">
        <p>
          Read our <a href="_blank"> Privacy Policy</a>. Tap “Agree & Continue”
          to accept the <a href="_blank">Terms of Service</a>.
        </p>
        <Button
          onClick={() => {
            dispatch({ type: 'currentView', value: 'verify' });
          }}
        >
          Agree and Continue
        </Button>
      </div>
    </React.Fragment>
  );
};

export default Welcome;
