import React, { useEffect, useState } from 'react';
import MessageHistory from './MessageHistory';
import { getCandidateHistory } from '../../utils/connectors';
import server from '../../utils/server';

const { serverFunctions } = server;

const CANDIDATE_NUMBER = '12345';

const CANDIDATE_DATA = {
  'Candidate #': '12345',
  Email: 'jason@gmail.com',
};

/*  

Higher order component that manages which view is rendered based on the application state.
* needs to be able to -
* 1. when the application loads -
    -get selected row from spread sheet.
    -if no row is selected, display <NoCandidateSelected/>
    -if a row is selected, query the message history and call history for the candidate,
    -splice the two together
    -and display the messages component
  2. When the user selects a candidate
    -query the user's message/call history and display
      -if request fails, get a new auth token from big parser

* */

// This component will handle switching out the different main components of the app.

const Container = props => {
  // TODO find a clean way to listen for changes in the sheet
  return (
    <div>
      <h1>Container</h1>

      <MessageHistory
        authId={props.authId}
        candidateNumber={CANDIDATE_DATA['Candidate #']}
        candidateEmail={CANDIDATE_DATA.Email}
      />
    </div>
  );
};

export default Container;
