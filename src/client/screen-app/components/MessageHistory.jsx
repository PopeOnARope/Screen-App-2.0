import React, { useState, useEffect } from 'react';
import server from '../../utils/server';
import { getCandidateHistory } from '../../utils/connectors';

const { serverFunctions } = server;

const MessageHistory = ({ candidateHistory }) => {
  return (
    <React.Fragment>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {candidateHistory.map(({ MessageId, SessionId }) => (
          <div key={MessageId} style={{ border: '1px solid lightblue' }}>
            {MessageId}
            {SessionId}
          </div>
        ))}
      </pre>
    </React.Fragment>
  );
};

const MessageHistoryWithData = ({
  authId,
  candidateNumber,
  candidateEmail,
}) => {
  // TODO: ADD ERROR HANDLING AND LOAD
  const [candidateHistory, setCandidateHistory] = useState([]);
  serverFunctions.putCache('foo', 'bar', 1500);

  const updateComponent = () =>
    getCandidateHistory({
      authId,
      candidateNumber,
      candidateEmail,
    }).then(result => {
      setCandidateHistory(result);
    });

  // useEffect(() => {
  //   getCandidateHistory({
  //     authId: props.authId,
  //     candidateNumber: CANDIDATE_DATA['Candidate #'],
  //     candidateEmail: CANDIDATE_DATA.Email,
  //   }).then(result => {
  //     setCandidateHistory(result);
  //   });
  // }, []);
  return candidateHistory && candidateHistory.length ? (
    <React.Fragment>
      <button onClick={updateComponent}></button>
      <MessageHistory candidateHistory={candidateHistory} />
    </React.Fragment>
  ) : (
    <p>
      <button onClick={updateComponent}></button>
    </p>
  );
};

export default MessageHistoryWithData;
