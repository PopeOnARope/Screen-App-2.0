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

const buildHistoryQueryBody = ({ candidateNumber, startRow, rowCount }) => ({
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
      Timestamp: 'desc',
    },
    pagination: {
      startRow: startRow || 1,
      rowCount: rowCount || 10,
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
  serverFunctions.putCache('authId', a.authId);
  console.log({ authId: a.authId });
  return a.authId;
}

async function getAuthId() {
  const response = await serverFunctions.getCache('authId');

  if (response) return response;
  return fetchAuthId();
}

async function fetchHistory({
  authId,
  gridId,
  candidateNumber,
  startRow,
  rowCount,
}) {
  const response = await fetch(buildGridUrl(gridId), {
    method: 'POST',
    headers: {
      authId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      buildHistoryQueryBody({ candidateNumber, startRow, rowCount })
    ),
  });
  const history = response.json();

  return history;
}

// TODO implement error handling best practices here
async function fetchAndCombineCandidateHistory({
  authId,
  candidateNumber,
  startRow,
  rowCount,
}) {
  // fetch users message history
  const messagesResponse = await fetchHistory({
    authId,
    gridId: MESSAGES_GRID_ID,
    candidateNumber,
    startRow,
    rowCount,
  });

  const callHistoryResponse = await fetchHistory({
    authId,
    gridId: CALL_GRID_ID,
    candidateNumber,
    startRow,
    rowCount,
  });

  const formattedCalls = formatCallOrMessageData(callHistoryResponse.rows, {
    id: 'SessionId',
    statusDescriptor: 'Event',
  });
  const formattedMessages = formatCallOrMessageData(messagesResponse.rows, {
    id: 'MessageId',
    statusDescriptor: 'Status',
  });

  const combinedSortedHistory =
    formattedMessages.length && formattedCalls.length
      ? [...formattedMessages, ...formattedCalls].map(callOrMessage => {
          const Timestamp = new Date(callOrMessage.Timestamp);
          return { ...callOrMessage, Timestamp };
        })
      : [];

  return combinedSortedHistory;
}

async function getCandidateHistory({
  authId,
  email,
  candidateNumber,
  startRow,
}) {
  // // check the cache
  // const cachedHistory = await serverFunctions.getCache(email);
  // console.log({ cachedHistory });

  // // why is an empty object sometimes getting cached?
  // if (cachedHistory && cachedHistory.length > 5)
  //   return JSON.parse(cachedHistory);

  // if cache is empty, fetch history
  const combinedSortedHistory = await fetchAndCombineCandidateHistory({
    authId,
    candidateNumber,
    email,
    startRow,
  });
  // cache the fetched history
  serverFunctions.putCache(email, JSON.stringify(combinedSortedHistory));

  return combinedSortedHistory;
}

export default {
  getCandidateHistory,
  getAuthId,
  fetchAndCombineCandidateHistory,
};
