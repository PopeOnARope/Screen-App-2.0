import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MessageBox, MessageList, Input } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import Icon from 'react-eva-icons';
import { sharedButtonStyles, sharedContainerStyles } from '../styles';
import Conference from './Conference';

import server from '../../utils/server';
import { getCandidateHistory, getAuthId } from '../connectors';
import { useGlobalStore } from '../reducers';

const { serverFunctions } = server;

const defaultPhoneProps = {
  color: 'black',
  state: 'default',
};
const ConferenceProps = {
  leftPhone: defaultPhoneProps,
  rightPhone: defaultPhoneProps,
  size: 'small',
  connection: {
    color: 'black',
    connected: true,
  },
};

const Button = styled.button`
  ${sharedButtonStyles}
  height: auto;
  border-radius: 12px;
`;

const MessageWindowContainer = styled.div`
  ${sharedContainerStyles}
  display: flex;
  justify-content: space-between;
  height: 100%;
  margin: 0px;
  .rce-navbar.light {
    background: #fcfcfe;
  }

  h4 {
    margin: 0px;
    font-weight: 400;
    font-size: 16px;
  }
  p {
    margin: 0px;
    font-size: 12px;
    color: ${props => props.theme.grayMedium};
  }
  .icon-container {
    background: linear-gradient(315deg, #d1d5db 0%, #eeeeee 100%);
    box-shadow: 2px 2px 7px #e5e5e5;
    border-radius: 20px;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 0px 12px;
  }
  .rce-mlist {
    flex-grow: 4;
  }
  .rce-container-mlist.message-list {
    margin-top: 68px;
    margin-bottom: 48px;
    .rce-mbox {
      margin-right: 35px;
      margin-left: 25px;
      box-shadow: none;
      svg {
        filter: none;
      }
    }
    .rce-mbox-right {
      margin-left: 35px;
      margin-right: 25px;
      background: ${props => props.theme.primaryLighter};
      svg {
        fill: ${props => props.theme.primaryLighter};
      }
    }
  }
`;

const MessageListContainer = styled.div`
  background: ${props => props.theme.primaryExtraLight};
  flex-grow: 4;
`;

const NavbarLeftContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const NavbarMiddleContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Navbar = styled.div`
  background: #fcfcfe;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 10px 10px;
  height: 48px;
  position: fixed;
  z-index: 2;
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.grayMedium};
`;

const InputContainer = styled.div`
  position: fixed;
  z-index: 2;
  bottom: 0;
  width: 100%;
  border-top: 1px solid ${props => props.theme.grayMedium};
`;

const NavbarLeft = ({ name, lastTimeStamp }) => (
  <NavbarLeftContainer></NavbarLeftContainer>
);

const NavbarMiddle = ({ name, lastTimeStamp }) => (
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

const exampleMessage = {
  position: 'right',
  type: 'text',
  text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
  date: new Date(),
};
const ChatWindow = ({ selectedCandidate }) => {
  const { name, candidateNumber, email } = selectedCandidate || {};

  return (
    <MessageWindowContainer>
      <Navbar>
        <NavbarLeft />
        <NavbarMiddle name={name} />
        <Conference {...ConferenceProps} size={'large'} />
      </Navbar>
      <MessageListContainer>
        <MessageList
          className="message-list"
          lockable={true}
          toBottomHeight={'100%'}
          dataSource={
            selectedCandidate &&
            selectedCandidate.history &&
            selectedCandidate.history.map(
              ({ Message, Direction, Timestamp }) => ({
                position: Direction === 'outbound' ? 'right' : 'left',
                text: Message,
                date: new Date(Timestamp),
              })
            )
          }
        />
      </MessageListContainer>
      <InputContainer>
        <Input
          multiline={true}
          rightButtons={
            <Button>
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
  const { selectedCandidate } = state;

  useEffect(() => {
    async function doPoll() {
      const authId = state.authId || (await getAuthId());
      const { selectionChanged, newCandidate } = await checkForSelectionChange(
        selectedCandidate
      );

      if (selectionChanged) {
        if (candidateHasLocalMessages(state, newCandidate.email)) {
          dispatch({
            type: 'selectedCandidate',
            value: newCandidate,
          });
        }
        const newCandidateHistory = await getCandidateHistory({
          ...newCandidate,
          authId,
        });

        dispatch({
          type: 'selectedCandidate',
          value: { ...newCandidate, history: newCandidateHistory },
        });
      } else {
        setTimeout(() => {
          doPoll();
        }, 1000);
      }
    }

    doPoll();
  }, [selectedCandidate]);
  return <ChatWindow selectedCandidate={selectedCandidate} />;
};

export default ChatWindowWithData;
