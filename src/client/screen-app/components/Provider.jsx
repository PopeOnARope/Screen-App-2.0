import React from 'react';
import rootReducer, { initialState } from '../reducers';

const GlobalStore = React.createContext(initialState);

export const useGlobalStore = () => React.useContext(GlobalStore);

const Provider = ({ children }) => {
  const [state, dispatch] = React.useReducer(rootReducer, initialState);
  return (
    <GlobalStore.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStore.Provider>
  );
};

export default Provider;
