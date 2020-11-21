import React, { useEffect } from 'react';
import {
  getCandidateHistory,
  getAuthId,
  fetchAndCombineCandidateHistory,
} from '../../connectors';
import { useGlobalStore } from '../../reducers';
import server from '../../../utils/server';
import useInterval from './useInterval';
import { getMostRecentMessageId } from '../../../utils/helpers';

const { serverFunctions } = server;

async function checkForSelectionChange(previousCandidate) {
  const {
    name,
    email,
    candidateNumber,
    row,
  } = await serverFunctions.getRowOfSelection();
  // check that the highlighted row is a candidate, not empty or a heading
  const candidateSelected = row > 1 && name && name.length;
  const selectionIsDifferent =
    !previousCandidate || email !== previousCandidate.email;
  const selectionChanged = candidateSelected && selectionIsDifferent;

  return {
    selectionChanged,
    newCandidate: { name, email, candidateNumber },
  };
}

const candidateHasLocalMessages = (state, email) =>
  state.candidates && state.candidates[email];

const PollingManager = props => {
  const { state, dispatch } = useGlobalStore();
  const { selectedCandidate } = state;

  async function pollSelectedCandidate() {
    const authId = state.authId || (await getAuthId());
    if (!state.authId) dispatch({ type: 'authId', value: authId });
    const { selectionChanged, newCandidate } = await checkForSelectionChange(
      selectedCandidate
    );

    if (selectionChanged || !selectedCandidate) {
      if (candidateHasLocalMessages(state, newCandidate.email)) {
        dispatch({
          type: 'selectedCandidate',
          value: newCandidate,
        });
      } else {
        const newCandidateHistory = await getCandidateHistory({
          ...newCandidate,
          authId,
          startRow: 1,
        });

        dispatch({
          type: 'selectedCandidate',
          value: { ...newCandidate, history: newCandidateHistory },
        });
      }
    } else {
      setTimeout(() => {
        pollSelectedCandidate();
      }, 1000);
    }
  }

  async function pollRecentMessages() {
    if (state.authId && selectedCandidate) {
      const history = await fetchAndCombineCandidateHistory({
        authId: state.authId,
        candidateNumber: selectedCandidate.candidateNumber,
        startRow: 1,
        rowCount: 10,
      });

      // is the newest fetch message new?
      const hasNewMessages =
        getMostRecentMessageId(selectedCandidate.history) !==
        getMostRecentMessageId(history);
      console.log({ hasNewMessages });
      if (hasNewMessages) {
        dispatch({ type: 'newMessages', value: history });
      }
    }
  }

  useEffect(() => {
    pollSelectedCandidate();
  }, [selectedCandidate]);

  useInterval(() => {
    pollRecentMessages();
  }, 3000);

  if (!selectedCandidate || selectedCandidate.name === 'Name') {
    return <p>Please select a row on the sheet.</p>;
  }
  return <React.Fragment>{props.children};</React.Fragment>;
};

export default PollingManager;
