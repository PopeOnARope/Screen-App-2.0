import bigParser from './bigParser';
import authentication from './authentication';

export const { getCandidateHistory, getAuthId } = bigParser;

export const { createAccount, verifyAccount } = authentication;
