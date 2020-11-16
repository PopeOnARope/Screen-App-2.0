import React from 'react';

export const initialState = { currentView: 'chatWindow' };
export const GlobalStore = React.createContext(initialState);
export const useGlobalStore = () => React.useContext(GlobalStore);

export default function rootReducer(state, action) {
  const newValue = { [action.type]: action.value };
  console.log({ action });

  const updateSelectedCandidate = () => {
    const previousCandidate = (state.candidates &&
      state.candidates[action.value.email]) || { history: [] };
    const newCandidate = action.value;
    const newCandidateHistory = newCandidate.history || [];
    const previousCandidateHistory = previousCandidate.history || [];
    const combinedHistory = [
      ...new Set([...newCandidateHistory, ...previousCandidateHistory]),
    ];
    return {
      ...state,
      selectedCandidate: {
        ...newCandidate,
        history: [...combinedHistory],
        candidates: { ...state.candidates, [newCandidate.email]: newCandidate },
      },
    };
  };

  switch (action.type) {
    case 'selectedCandidate':
      return updateSelectedCandidate();

    default:
      return { ...state, ...newValue };
  }
}
