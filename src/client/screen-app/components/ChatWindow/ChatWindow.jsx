import React, { useState, useEffect } from 'react';

import { MessageBox, Input } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import Icon from 'react-eva-icons';
import Conference from '../Conference';
import {
  Button,
  MessageWindowContainer,
  MessageListContainer,
  NavbarMiddleContainer,
  Navbar,
  InputContainer,
} from './styles';

import server from '../../../utils/server';
import { getCandidateHistory, getAuthId, sendMessage } from '../../connectors';
import { useGlobalStore } from '../../reducers';

const { serverFunctions } = server;

const NavbarLeft = ({ name, lastTimeStamp }) => (
  <NavbarMiddleContainer>
    <div className="icon-container">
      <Icon size={'xlarge'} name="person" fill={'#fff'} />
    </div>
    <div className="profile-container">
      <h4>{name}</h4>
      <p>Last seen {lastTimeStamp || 'today'}</p>
    </div>
  </NavbarMiddleContainer>
);

const ChatWindow = () => {
  const { state } = useGlobalStore();

  const { _id, screenerAuth, selectedCandidate } = state;

  const { name, candidateNumber, email } = selectedCandidate || {};

  const [message, setMessage] = React.useState('');

  const sendMessageAndUpdate = () => {
    const payload = { message, name, _id, screenerAuth, candidateNumber };
    sendMessage(payload);
    setMessage('');
  };

  if (!selectedCandidate) {
    return <p>loading...</p>;
  }

  return (
    <MessageWindowContainer>
      <Navbar>
        <NavbarLeft name={name} />
        <Conference />
      </Navbar>
      <MessageListContainer>
        <div className="message-list">
          {selectedCandidate &&
            selectedCandidate.history &&
            selectedCandidate.history.map(
              ({ messageId, Timestamp, Message, Direction }, idx) => {
                return (
                  <MessageBox
                    key={idx}
                    date={new Date(Timestamp)}
                    text={Message}
                    position={Direction === 'outbound' ? 'right' : 'left'}
                  />
                );
              }
            )}
        </div>
      </MessageListContainer>
      <InputContainer>
        <Input
          multiline={true}
          onChange={e => setMessage(e.target.value)}
          value={message}
          rightButtons={
            <Button onClick={sendMessageAndUpdate}>
              <Icon name={'arrow-upward'} />
            </Button>
          }
        />
      </InputContainer>
    </MessageWindowContainer>
  );
};

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

const ChatWindowWithData = () => {
  const { state, dispatch } = useGlobalStore();
  const { selectedCandidate, screenerAuth, _id } = state;

  useEffect(() => {
    async function doPoll() {
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
          });
          dispatch({
            type: 'selectedCandidate',
            value: { ...newCandidate, history: newCandidateHistory },
          });
        }
      } else {
        setTimeout(() => {
          doPoll();
        }, 1000);
      }
    }

    doPoll();
  }, [selectedCandidate]);
  return <ChatWindow />;
};

export default ChatWindowWithData;
