import {
  SEND_MESSAGE_URL,
  START_CONFERENCE_URL,
  KICK_URL,
  ENTER_SCREENER_URL,
  EXIT_SCREENER_URL,
} from '../data/constants';

const getRequestBody = ({
  name,
  _id,
  screenerAuth,
  candidateNumber,
  message,
}) => ({
  body: JSON.stringify({
    candidate: {
      _id,
      Name: name,
      'Phone #': JSON.stringify(candidateNumber),
    },
    message,
  }),
  method: 'POST',
  mode: 'no-cors',
  headers: {
    'Content-Type': 'application/json',
    auth: screenerAuth,
    _id,
  },
});

async function sendMessage(args) {
  console.log(getRequestBody(args));
  const response = await fetch(SEND_MESSAGE_URL, getRequestBody(args));
  return response;
}

async function startConference(args) {
  console.log(getRequestBody(args));
  const response = await fetch(START_CONFERENCE_URL, getRequestBody(args));
  return response;
}

async function kickCandidate(args) {
  const response = await fetch(KICK_URL, getRequestBody(args));
  return response;
}

async function enterScreener(args) {
  const response = await fetch(ENTER_SCREENER_URL, getRequestBody(args));
  return response;
}

async function exitScreener(args) {
  const response = await fetch(EXIT_SCREENER_URL, getRequestBody(args));
  return response;
}

export default {
  sendMessage,
  startConference,
  kickCandidate,
  enterScreener,
  exitScreener,
};
