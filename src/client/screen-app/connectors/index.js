import bigParser from './bigParser';
import authentication from './authentication';
import sendAndRecieve from './sendAndRecieve';

export const {
  getCandidateHistory,
  getAuthId,
  fetchAndCombineCandidateHistory,
} = bigParser;

export const { createAccount, verifyAccount } = authentication;

export const {
  sendMessage,
  startConference,
  kickCandidate,
  enterScreener,
  exitScreener,
} = sendAndRecieve;
