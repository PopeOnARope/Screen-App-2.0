import React from 'react';
import MessageHistory from './ChatWindow';
import Welcome from './Welcome';
import CreateAccount from './CreateAccount';
import { useGlobalStore } from '../reducers';

import CodeInput from './CodeInput';

const Container = () => {
  // TODO find a clean way to listen for changes in the sheet
  const { state } = useGlobalStore();
  const { currentView } = state;

  return (
    <React.Fragment>
      {currentView === 'welcome' && <Welcome />}
      {currentView === 'createAccount' && <CreateAccount />}
      {currentView === 'codeInput' && <CodeInput />}
      {currentView === 'chatWindow' && <MessageHistory />}
    </React.Fragment>
  );
};

const ContainerWithProvider = () => <Container />;

export default ContainerWithProvider;
