import React from 'react';
import rootReducer, { initialState, GlobalStore } from '../reducers';

const Provider = ({ children }) => {
  const [state, dispatch] = React.useReducer(rootReducer, initialState);
  return (
    <GlobalStore.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStore.Provider>
  );
};

export default Provider;
