import React from 'react';

export const initialState = {
  currentView: 'chatWindow',
  // _id: '5fa94ea594a03042572e5963',
  screenerAuth:
    'MTkxMjIyMjA5NTgtYoHPDP1D/f39/f1N/XT9ejn9Jf0FBv39/f39GVz9Ekj9RhD9BwEeElD9Gf39/UH9AUpVbv2Q/QZb/RAAMf0ULQQf/SD9/f1q/W39/XsE/RFrYnf9/f0w/f39EQIkXXYe/f39S/39/f0I/X/9lP1Mb/0M/RL9/VT9SU02D0Z6GEM2Hndmff0Z/XsY/WL9Z/0R/QX9O/39/f39Xf1h/dD9c/0JDf39/Sz9Z/0tfvIz/f39ACX9/f3o/f39/f0Ab/0YIFL9O1n9eP0U/RL9/f1P/Rz9DP1d/Rd9HmE1/R/9VT79Wi/9d0P9OP1gNnb9/Q==',
};

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
      ...newCandidateHistory,
      ...previousCandidateHistory,
    ].filter(
      (v, i, a) =>
        a.findIndex(t => {
          if (t.SessionId) {
            return t.SessionId === v.SessionId;
          }
          return t.MessageId === v.MessageId;
        }) === i
    );
    return {
      ...state,
      selectedCandidate: {
        ...newCandidate,
        history: [...combinedHistory],
      },
      candidates: {
        ...state.candidates,
        [newCandidate.email]: {
          ...newCandidate,
          history: [...combinedHistory],
        },
      },
    };
  };

  const setScreeners = () => {
    return {
      ...state,
      _id: action.value[0]._id,
      screenerAuth: action.value[0].Auth,
      currentView: 'chatWindow',
    };
  };

  switch (action.type) {
    case 'selectedCandidate':
      return updateSelectedCandidate();
    case 'screeners':
      return setScreeners();
    default:
      return { ...state, ...newValue };
  }
}
