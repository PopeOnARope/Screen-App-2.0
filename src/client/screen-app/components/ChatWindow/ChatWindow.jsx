import React, { useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'timeago.js';
import { MessageBox, Input } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import Icon from 'react-eva-icons';
import Conference from '../Conference';
import { callStatusKeys } from '../../data/constants';
import PollingManager from './PollingManager';
import {
  Button,
  MessageListContainer,
  MessageWindowContainer,
  NavbarLeftContainer,
  Navbar,
  InputContainer,
} from './styles';

import { sendMessage } from '../../connectors';
import { useGlobalStore } from '../../reducers';

const NavbarLeft = ({ name, history }) => {
  const lastIncomingMessage = [...history]
    .reverse()
    .find(m => m.Direction === 'inbound');

  const lastSeen = lastIncomingMessage && format(lastIncomingMessage.Timestamp);

  return (
    <NavbarLeftContainer>
      <div className="icon-container">
        <Icon size={'xlarge'} name="person" fill={'#fff'} />
      </div>
      <div className="profile-container">
        <h4>{name}</h4>
        {lastSeen && <p>Last seen {lastSeen}</p>}
      </div>
    </NavbarLeftContainer>
  );
};

const CallBox = styled.div`
  background: ${props => props.theme.grayDark};
  border-radius: 5px;
  width: max-content;
  align-items: center;
  margin: 8px auto;
  padding: 8px;
  p {
    display: flex;
    color: #222;
    i {
      margin-right: 5px;
    }
  }
`;

const getMessageStatus = ({ Status, Direction }) => {
  if (Direction === 'outbound') {
    return Status === 'delivered' ? 'received' : Status;
  }
  return null;
};

const ChatWindow = () => {
  const [message, setMessage] = React.useState('');
  const { state, dispatch } = useGlobalStore();

  const messagesEndRef = React.useRef(null);
  const inputRef = React.useRef();

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const { _id, screenerAuth, selectedCandidate } = state;

  const { name, candidateNumber, email } = selectedCandidate || {};

  async function sendMessageAndUpdate() {
    // payload to send to api
    const payload = {
      message,
      name,
      _id,
      screenerAuth,
      candidateNumber,
    };
    // payload to dispatch locally to populate the chat window while we await delivery confirmation
    const fakeId = Math.random()
      .toString(36)
      .slice(2);
    const messageObject = {
      Message: message,
      Timestamp: new Date().toISOString(),
      Direction: 'outbound',
      Status: 'sent',
      fakeId,
    };
    console.log({ message });
    dispatch({ type: 'sendMessage', value: messageObject });
    sendMessage(payload)
      .then(() => {
        dispatch({ type: 'deliveredMessage', value: fakeId });
      })
      .catch(() => {
        dispatch({ type: 'failedMessage', value: fakeId });
      });
    inputRef.current.clear();
    setMessage('');
  }

  useEffect(scrollToBottom, [selectedCandidate]);

  return (
    <MessageWindowContainer>
      <Navbar>
        <NavbarLeft {...selectedCandidate} />
        {/* <Conference /> */}
      </Navbar>
      <MessageListContainer>
        <div className="message-list">
          <button>load more</button>
          {selectedCandidate.history &&
            selectedCandidate.history.map(
              (
                { MessageId, Timestamp, Message, Direction, Status, SessionId },
                idx
              ) => {
                if (SessionId) {
                  //initiated, in-progress, completed
                  return (
                    <CallBox>
                      <p>
                        <Icon
                          name={callStatusKeys[Status].iconName}
                          fill={callStatusKeys[Status].fill}
                        />{' '}
                        {callStatusKeys[Status].title}{' '}
                        {callStatusKeys[Status].showTime && format(Timestamp)}
                      </p>
                    </CallBox>
                  );
                }
                return (
                  <MessageBox
                    key={idx}
                    date={new Date(Timestamp)}
                    text={`${Message}`}
                    position={Direction === 'outbound' ? 'right' : 'left'}
                    status={getMessageStatus({ Direction, Status })}
                  />
                );
              }
            )}
        </div>
        <div ref={messagesEndRef} />
      </MessageListContainer>
      <InputContainer>
        <Input
          multiline={true}
          onChange={e => setMessage(e.target.value)}
          value={message}
          ref={inputRef}
          onKeyPress={e => {
            if (e.shiftKey && e.charCode === 13) {
              return true;
            }
            if (e.charCode === 13) {
              sendMessageAndUpdate();
              e.preventDefault();
              return false;
            }
          }}
          rightButtons={
            <Button
              onClick={() => {
                sendMessageAndUpdate();
              }}
            >
              <Icon name={'arrow-upward'} />
            </Button>
          }
        />
      </InputContainer>
    </MessageWindowContainer>
  );
};

const ChatWindowWithData = () => (
  <PollingManager>
    <ChatWindow />
  </PollingManager>
);
export default ChatWindowWithData;
