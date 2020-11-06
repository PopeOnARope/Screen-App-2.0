import React from 'react';
// import WelcomeIcon from '../../../assets/welcomeIcon.png';
import WelcomeSVG from '../../../assets/Unknown 1.svg';
import styled, { css } from 'styled-components';
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

const sharedInputStyles = css`
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid ${props => props.theme.grayMedium};
  border-radius: 0px;
  background: none;
  box-shadow: none;
  display: block;
  width: 100%;
  height: 34px;
  padding: 6px 12px;
  line-height: 1.42857143;
  color: #555;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  margin-bottom: 48px;
  font-family: Nunito;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  letter-spacing: -0.24px;
`;

const Input = styled.input`
  ${sharedInputStyles}
`;

const Select = styled.select`
  ${sharedInputStyles}
  padding: 0px;
`;

const Verify = () => {
  const { dispatch } = useGlobalStore();
  return (
    <React.Fragment>
      <h1>Verify your Phone Number</h1>
      <p>
        Screen will send you an SMS message to verify your phone number. Enter
        your country code and phone number:
      </p>
      <Select>
        <option value="united states">United States</option>
        <option value="mexico">Mexico</option>
        <option value="canada">Canada</option>
      </Select>
      <Input />
      <Button
        onClick={() => {
          dispatch({ type: 'currentView', value: 'history' });
        }}
      >
        Continue
      </Button>
    </React.Fragment>
  );
};

export default Verify;
