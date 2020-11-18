import { BASE_AUTHENTICATION_URL } from '../data/constants';

const getUrl = method => `${BASE_AUTHENTICATION_URL}/${method}`;

const baseRequestProperties = {
  method: 'POST',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
  },
};

async function createAccount({ phoneNumber, location }) {
  const response = await fetch(getUrl('create'), {
    ...baseRequestProperties,
    body: JSON.stringify({ phoneNumber, location }),
  });
  return response;
}

async function verifyAccount({ phoneNumber, password }) {
  const response = await fetch(getUrl('verify'), {
    ...baseRequestProperties,
    body: JSON.stringify({ phoneNumber, password }),
  });
  return response;
}

export default { createAccount, verifyAccount };
