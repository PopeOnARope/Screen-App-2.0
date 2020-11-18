import React, { Fragment, FunctionComponent } from 'react';
import Icon from 'react-eva-icons';
import styled, { css } from 'styled-components';
import { useGlobalStore } from '../reducers';
import { startConference } from '../connectors';

const defaultPhoneProps = {
  color: 'black',
  state: 'default',
  filled: true,
};

const defaultConnectionProps = {
  color: 'black',
  connected: true,
};

const ConferenceProps = {
  leftPhone: defaultPhoneProps,
  rightPhone: defaultPhoneProps,
  size: 'small',
  connection: defaultConnectionProps,
};

const ConferenceContainer = styled.div`
  display: inline-flex;
  // margin-top: 8px;
`;

const IconContainer = styled.div`
  padding: 0.5em;
  display: flex;
  justify-content: center;
`;

const StackedIconContainer = styled(IconContainer)`
  i {
    position: absolute;
  }
`;
const FlippedIconContainer = styled(IconContainer)`
  transform: scale(-1, 1);
`;

const Button = styled.button`
  background: transparent;
  border: none !important;
  cursor: pointer;
`;

const getPhoneProps = ({ filled = false, state, color = '#eee' }) => ({
  name: `phone${state === 'default' ? '' : `-${state}`}${
    filled ? '' : '-outline'
  }`,
  fill: color,
});

const Conference = ({ size }) => {
  const { state } = useGlobalStore();
  const { _id, screenerAuth, selectedCandidate } = state;
  const [leftPhone, setLeftPhone] = React.useState(defaultPhoneProps);
  const [rightPhone, setRightPhone] = React.useState(defaultPhoneProps);
  const [connection, setConnection] = React.useState(defaultConnectionProps);
  if (!selectedCandidate) {
    return <React.Fragment />;
  }
  const { name, candidateNumber } = selectedCandidate;

  const startConferenceAndUpdate = () => {
    console.log('starting conference');
    startConference({ _id, screenerAuth, name, candidateNumber });
    setLeftPhone({ ...defaultPhoneProps, state: 'call' });
  };

  return (
    <ConferenceContainer>
      <FlippedIconContainer>
        <Button onClick={startConferenceAndUpdate}>
          <Icon size={size} {...getPhoneProps(leftPhone)}></Icon>
        </Button>
      </FlippedIconContainer>
      <StackedIconContainer>
        <Icon
          size={size}
          name="more-horizontal-outline"
          fill={connection.color}
        ></Icon>
        {!connection.connected && (
          <Icon size={size} name="close-outline" fill={connection.color}></Icon>
        )}
      </StackedIconContainer>
      <IconContainer>
        <Button>
          <Icon size={size} {...getPhoneProps(rightPhone)}></Icon>
        </Button>
      </IconContainer>
    </ConferenceContainer>
  );
};

const ConferenceWithState = () => {
  return <Conference size={'xlarge'} />;
};

export default ConferenceWithState;
