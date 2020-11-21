import React from 'react';
// import WelcomeIcon from '../../../assets/welcomeIcon.png';
import styled, { css } from 'styled-components';
import ReactCodeInput from 'react-verification-code-input';
import { useGlobalStore } from '../reducers';

import {
  sharedContainerStyles,
  sharedInputStyles,
  sharedButtonStyles,
} from '../styles';
import { verifyAccount, createAccount } from '../connectors';

const CodeInputContainer = styled.div`
  ${sharedContainerStyles}
  padding: 24px;

  p {
    text-align: left;
    width: 100%;
  }
  .faded {
    color: ${props => props.theme.grayMedium};
  }
  h2 {
    margin-bottom: 0px;
  }
  .code-input {
    width: 275px !important;
    input {
      ${sharedInputStyles}
      display: inline;
      width: 58px;
      height: 54px;
      border: none;
      border-radius: none;
      border-radius: 0;
      border-bottom: 1px solid #bbb;
      margin: 5px;
      padding: 0px;
    }
  }
  .error {
    color: ${props => props.theme.error};
  }
`;

const Button = styled.button`
  ${sharedButtonStyles}
`;

const CodeInput = () => {
  const { dispatch, state } = useGlobalStore();
  const [timeRemaining, setTimeRemaining] = React.useState(30);
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(false);
  // const [mounted, mount] = React.useState(true);
  // count down in seconds
  React.useEffect(() => {
    let mounted = true;
    if (mounted) {
      setTimeout(() => {
        if (mounted && timeRemaining > 0) setTimeRemaining(timeRemaining - 1);
      }, 1000);
    }
    return function cleanup() {
      mounted = false;
    };
  });

  async function handleSubmit() {
    verifyAccount({
      phoneNumber: state.userPhoneNumber,
      password,
    })
      .then(r => r.json())
      .then(r => {
        dispatch({ type: 'screeners', value: r.screeners });
      })
      .catch(err => {
        setPassword('');
        setError(err);
      });
  }

  async function sendNewCode() {
    createAccount({
      phoneNumber: state.userPhoneNumber,
      location: state.userCountryCode,
    });
    setTimeRemaining(30);
    setError(false);
    setPassword('');
  }

  return (
    <CodeInputContainer>
      <h2>Enter your Verification Code</h2>
      <p>
        We just sent a verification code to the phone number you gave us. Please
        enter the code below
      </p>
      <ReactCodeInput
        fields={6}
        className={error ? 'code-input error' : 'code-input'}
        fieldWidth={34}
        onChange={value => setPassword(value)}
        value={password}
      />
      {error && (
        <p className="error">
          You have entered an incorrect password. Please try again.
        </p>
      )}
      {!error && (
        <p className={'faded'}>Resend code in {timeRemaining} seconds.</p>
      )}

      <Button onClick={!timeRemaining || error ? sendNewCode : handleSubmit}>
        {!timeRemaining || error ? 'Resend Code' : 'Submit'}
      </Button>
    </CodeInputContainer>
  );
};

export default CodeInput;
