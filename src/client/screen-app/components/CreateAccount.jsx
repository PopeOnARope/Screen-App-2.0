import React from 'react';
import Icon from 'react-eva-icons';
import styled from 'styled-components';
import { useGlobalStore } from '../reducers';

import {
  sharedContainerStyles,
  sharedInputStyles,
  sharedButtonStyles,
} from '../styles';
import { countryCodes } from '../data/countryCodes';
import { createAccount } from '../connectors';
import { reduceToNumbers } from '../../utils/helpers';

const VerifyContainer = styled.div`
  ${sharedContainerStyles}
  padding: 26px;

  p {
    text-align: left;
  }
`;

const Button = styled.button`
  ${sharedButtonStyles}
  border-radius: 36px;
  height: 56px;
  width: 56px;
`;

const CountryCodeInput = styled.span`
  ${sharedInputStyles}
  width: 48px;
  padding: 0px;
  margin-bottom: 36px;
  display: flex;
  flex-direction: column-reverse;
`;

const Input = styled.input`
  ${sharedInputStyles}
  margin-top: 2px;
  margin-left: 18px;
  margin-bottom: 36px;
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
    dispatch({ type: 'userCountryCode', value: country.code });

    createAccount({
      phoneNumber: unformattedNumber,
      location: country.code,
    }).then(dispatch({ type: 'currentView', value: 'codeInput' }));
  }

  return (
    <VerifyContainer>
      <h2>Verify your Phone Number</h2>
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
        <Icon name={'arrow-forward-outline'} size={'xlarge'} />
      </Button>
    </VerifyContainer>
  );
};

export default CreateAccount;
