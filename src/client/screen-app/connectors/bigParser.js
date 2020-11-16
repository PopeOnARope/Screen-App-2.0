import server from '../../utils/server';

import { formatCallOrMessageData } from '../../utils/reducers';
import {
  BASE_BP_LOGIN_URL,
  BASE_BP_GRID_URL,
  LOGIN_CREDENTIALS,
  MESSAGES_GRID_ID,
  CALL_GRID_ID,
} from '../data/constants';

const { serverFunctions } = server;

const buildGridUrl = gridId => `${BASE_BP_GRID_URL}/grid/${gridId}/search`;

const buildHistoryQueryBody = ({ candidateNumber }) => ({
  query: {
    columnFilter: {
      filters: [
        {
          column: 'Candidate #',
          operator: 'EQ',
          keyword: `${candidateNumber}`,
        },
      ],
      filtersJoinOperator: 'AND',
    },
    globalColumnFilterJoinOperator: 'OR',
    sort: {
      age: 'asc',
    },
    pagination: {
      startRow: 1,
      rowCount: 50,
    },
    sendRowIdsInResponse: true,
    showColumnNamesInResponse: true,
  },
});

async function fetchAuthId() {
  console.info('fetching auth id');
  const response = await fetch(BASE_BP_LOGIN_URL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(LOGIN_CREDENTIALS),
  });
  const a = await response.json();
  serverFunctions.putCache({ authId: a.authId });
  return a.authId;
}

async function getAuthId() {
  const response = await serverFunctions.getCache('authId');

  if (response) return response;
  return fetchAuthId();
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
async function fetchAndCombineCandidateHistory({
  authId,
  candidateNumber,
  email,
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
    formattedMessages.length &&
    formattedMessages[formattedMessages.length - 1].MessageId;
  const lastCallId =
    formattedCalls.length &&
    formattedCalls[formattedCalls.length - 1].SessionId;

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

  console.log({ cacheableHistory });
  serverFunctions.putCache({
    ...cacheableHistory,
    [email]: JSON.stringify({ lastMessageId, lastCallId }),
  });
  console.log('candidate history fetched and formatted');
  console.log({ combinedSortedHistory });

  return combinedSortedHistory;
}

async function getCandidateHistory({ authId, email, candidateNumber }) {
  // check for an authId
  console.log({ authId, candidateNumber, email });

  // Check cache for employees MostRecentMessageId
  const lastCallAndMessageId = await serverFunctions.getCache(email);

  if (lastCallAndMessageId) {
    const { lastCallId, lastMessageId } = JSON.parse(lastCallAndMessageId);
    console.log(
      'last message id successfully loaded from cache. Loading last message.'
    );
    console.log({ lastMessageId, lastCallId });

    const cachedMessages = await loadEntriesFromCache(
      lastMessageId,
      [],
      'Previous Message Id'
    );

    const cachedCalls = await loadEntriesFromCache(
      lastCallId,
      [],
      'PreviousSessionId'
    );
    // TODO account for situation where last message id is present but messages are not
    if (cachedMessages || cachedCalls) {
      const cachedHistory = await [...cachedCalls, ...cachedMessages].sort(
        (a, b) => b.Timestamp - a.Timestamp
      );
      return cachedHistory;
    }
  }
  console.log('looks like the cache is empty, querying big parser');

  return fetchAndCombineCandidateHistory({
    authId,
    candidateNumber,
    email,
  });
}

export default {
  getCandidateHistory,
  getAuthId,
};
