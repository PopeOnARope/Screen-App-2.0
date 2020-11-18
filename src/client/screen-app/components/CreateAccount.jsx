import React from 'react';
// import WelcomeIcon from '../../../assets/welcomeIcon.png';
import styled, { css } from 'styled-components';
import { useGlobalStore } from '../reducers';

import { sharedContainerStyles, sharedInputStyles } from '../styles';
import { countryCodes } from '../data/countryCodes';
import { createAccount } from '../connectors';
import { reduceToNumbers } from '../../utils/helpers';

const VerifyContainer = styled.div`
  ${sharedContainerStyles}
  padding: 7px;
  h1 {
    margin-bottom: 12px;
    text-align: center;
    font-size: ${props => props.theme.large}px;
  }
  p {
    text-align: left;
  }
`;

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
  font-size: ${props => props.theme.xlarge}px;
  line-height: 33px;
  font-family: Nunito;
  &:hover {
    background: ${props => props.theme.primaryLight};
    cursor: pointer;
  }
`;

const CountryCodeInput = styled.span`
  ${sharedInputStyles}
  width: 48px;
  padding: 0px;
`;

const Input = styled.input`
  ${sharedInputStyles}
  margin-left: 18px;
`;

const Select = styled.select`
  ${sharedInputStyles}
  padding: 0px;
`;

const FormElementContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
`;

const normalizeInput = (value, previousValue) => {
  if (!value) return value;
  const currentValue = value.replace(/[^\d]/g, '');
  const cvLength = currentValue.length;

  if (!previousValue || value.length > previousValue.length) {
    if (cvLength < 4) return currentValue;
    if (cvLength < 7)
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(
      3,
      6
    )}-${currentValue.slice(6, 10)}`;
  }
};

const getCountryByName = n => {
  return countryCodes.find(({ name }) => name === n);
};

const CreateAccount = () => {
  //   const { dispatch } = useGlobalStore();
  const { dispatch } = useGlobalStore();
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [country, setCountry] = React.useState(
    getCountryByName('United States')
  );

  const handlecandidateNumberChange = ({ target: { value } }) => {
    setPhoneNumber(normalizeInput(value, phoneNumber));
  };

  const handleCountryChange = ({ target: { value } }) => {
    setCountry(getCountryByName(value));
  };

  async function handleSubmit() {
    // strip all of the () and + etc from the phone number
    const unformattedNumber = `${reduceToNumbers(
      country.dial_code
    )}${reduceToNumbers(phoneNumber)}`;
    dispatch({ type: 'userPhoneNumber', value: unformattedNumber });

    createAccount({
      phoneNumber: unformattedNumber,
      location: country.code,
    }).then(dispatch({ type: 'currentView', value: 'codeInput' }));
  }

  return (
    <VerifyContainer>
      <h1>Enter your Phone Number</h1>
      <p>
        Screen will send you an SMS message to verify your phone number. Enter
        your country code and phone number:
      </p>
      <Select value={country.name} onChange={handleCountryChange}>
        {countryCodes.map(({ name }, idx) => (
          <option key={idx} value={name}>
            {name}
          </option>
        ))}
      </Select>
      <FormElementContainer>
        <CountryCodeInput value={country.dail_code}>
          {country.dial_code}
        </CountryCodeInput>
        <Input onChange={handlecandidateNumberChange} value={phoneNumber} />
      </FormElementContainer>
      <Button
        onClick={() => {
          handleSubmit();
        }}
      >
        Continue
      </Button>
    </VerifyContainer>
  );
};

export default CreateAccount;
