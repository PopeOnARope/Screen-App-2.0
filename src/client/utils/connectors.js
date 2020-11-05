import server from './server';

import { reduceCallOrMessageData } from './reducers';
import {
  BASE_BP_LOGIN_URL,
  LOGIN_CREDENTIALS,
  MESSAGES_GRID_ID,
  CALL_GRID_ID,
  buildHistoryQueryBody,
  buildGridUrl,
} from './constants';

const { serverFunctions } = server;

export async function fetchAuthId() {
  const response = await fetch(BASE_BP_LOGIN_URL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(LOGIN_CREDENTIALS),
  });
  return response.json();
}

async function fetchHistory({ authId, gridId, candidateNumber }) {
  const response = await fetch(buildGridUrl(gridId), {
    method: 'POST',
    headers: {
      authId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildHistoryQueryBody({ candidateNumber, gridId })),
  });
  return response.json();
}

async function loadMessagesFromCache(MessageId, arr) {
  console.log({ cachedMessages: arr });
  console.log({ MessageId });
  const lm = await serverFunctions.getCache(MessageId);
  const lastMessage = JSON.parse(lm);
  console.log({ lastMessage });
  if (lastMessage) {
    arr.push(lastMessage);
    return loadMessagesFromCache(lastMessage['Previous Message Id'], arr);
  }
  return arr;
}

// TODO implement error handling best practices here
export async function fetchAndCombineCandidateHistory({
  authId,
  candidateNumber,
  candidateEmail,
}) {
  // fetch users message history
  const messagesResponse = await fetchHistory({
    authId,
    gridId: MESSAGES_GRID_ID,
    candidateNumber,
  });

  const callHistoryResponse = await fetchHistory({
    authId,
    gridId: CALL_GRID_ID,
    candidateNumber,
  });

  const formattedCalls = reduceCallOrMessageData(callHistoryResponse.rows, {
    id: 'SessionId',
    statusDescriptor: 'Event',
  });
  const formattedMessages = reduceCallOrMessageData(messagesResponse.rows, {
    id: 'MessageId',
    statusDescriptor: 'Status',
  });

  // grab the last message object and cache the messageId under the candidates email.
  const lastMessageId =
    formattedMessages[formattedMessages.length - 1].MessageId;
  const lastCallId = formattedMessages[formattedMessages.length - 1].MessageId;

  const combinedSortedHistory = [...formattedMessages, ...formattedCalls]
    .map(callOrMessage => {
      const Timestamp = new Date(callOrMessage.Timestamp);
      return { ...callOrMessage, Timestamp };
    })
    .sort((a, b) => b.Timestamp - a.Timestamp);

  // format data for cache
  const cacheableHistory = combinedSortedHistory.reduce((acc, cv, idx, arr) => {
    const newKeyValuePair = cv.MessageId
      ? { [cv.MessageId]: JSON.stringify(cv) }
      : { [cv.SessionId]: JSON.stringify(cv) };
    return { ...acc, ...newKeyValuePair };
  }, {});

  // add the data to the cache
  serverFunctions.putCache({
    ...cacheableHistory,
    [candidateEmail]: lastMessageId,
  });

  return combinedSortedHistory;
}

export async function getCandidateHistory({
  authId,
  candidateNumber,
  candidateEmail,
}) {
  // Check cache for employees MostRecentMessageId
  const lastMessageId = await serverFunctions.getCache(candidateEmail);

  if (lastMessageId) {
    console.log(
      'last message id successfully loaded from cache. Loading last message.'
    );
    console.log({ lastMessageId });
    const cachedMessages = loadMessagesFromCache(lastMessageId, []);
    if (cachedMessages.length) {
      return cachedMessages;
    }
  }
  console.log('looks like the cache is empty, querying big parser');

  return fetchAndCombineCandidateHistory({
    authId,
    candidateNumber,
    candidateEmail,
  });
}
