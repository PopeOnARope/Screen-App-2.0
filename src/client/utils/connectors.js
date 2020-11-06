import server from './server';

import { formatCallOrMessageData } from './reducers';
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

async function loadEntriesFromCache(MessageId, arr, previousKey) {
  console.log({ cachedMessages: arr });
  console.log({ MessageId });
  const lm = await serverFunctions.getCache(MessageId);
  const lastMessage = JSON.parse(lm);
  console.log({ lastMessage });
  if (lastMessage) {
    arr.push(lastMessage);
    return loadEntriesFromCache(lastMessage[previousKey], arr);
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

  const formattedCalls = formatCallOrMessageData(callHistoryResponse.rows, {
    id: 'SessionId',
    statusDescriptor: 'Event',
  });
  const formattedMessages = formatCallOrMessageData(messagesResponse.rows, {
    id: 'MessageId',
    statusDescriptor: 'Status',
  });

  // grab the last message object and cache the messageId under the candidates email.
  const lastMessageId =
    formattedMessages[formattedMessages.length - 1].MessageId;
  const lastCallId = formattedCalls[formattedCalls.length - 1].SessionId;

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
    [candidateEmail]: JSON.stringify({ lastMessageId, lastCallId }),
  });
  console.log('candidate history fetched and formatted');
  console.log({ combinedSortedHistory });

  return combinedSortedHistory;
}

export async function getCandidateHistory({
  authId,
  candidateNumber,
  candidateEmail,
}) {
  // Check cache for employees MostRecentMessageId
  const lastCallAndMessageId = await serverFunctions.getCache(candidateEmail);

  if (lastCallAndMessageId) {
    const { lastCallId, lastMessageId } = JSON.parse(lastCallAndMessageId);
    console.log(
      'last message id successfully loaded from cache. Loading last message.'
    );
    console.log({ lastMessageId, lastCallId });

    const cachedMessages = loadEntriesFromCache(
      lastMessageId,
      [],
      'Previous Message Id'
    );

    const cachedCalls = loadEntriesFromCache(
      lastCallId,
      [],
      'PreviousSessionId'
    );
    // TODO account for situation where last message id is present but messages are not
    return [...cachedCalls, cachedMessages].sort(
      (a, b) => b.Timestamp - a.Timestamp
    );
  }
  console.log('looks like the cache is empty, querying big parser');

  return fetchAndCombineCandidateHistory({
    authId,
    candidateNumber,
    candidateEmail,
  });
}
