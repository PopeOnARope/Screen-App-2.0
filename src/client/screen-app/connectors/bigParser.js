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
      Timestamp: 'desc',
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
  serverFunctions.putCache('authId', a.authId);
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
  const history = response.json();

  return history;
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

  const combinedSortedHistory = [...formattedMessages, ...formattedCalls]
    .map(callOrMessage => {
      const Timestamp = new Date(callOrMessage.Timestamp);
      return { ...callOrMessage, Timestamp };
    })
    .sort((a, b) => a.Timestamp - b.Timestamp);

  serverFunctions.putCache(email, JSON.stringify(combinedSortedHistory));

  return combinedSortedHistory;
}

async function getCandidateHistory({ authId, email, candidateNumber }) {
  const cachedHistory = await serverFunctions.getCache(email);

  if (cachedHistory) return JSON.parse(cachedHistory);

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
