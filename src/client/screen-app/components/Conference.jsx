import React, { Fragment, FunctionComponent } from 'react';
import Icon from 'react-eva-icons';
import styled, { css } from 'styled-components';

// export type Phone = {
//   color?: string
//   filled?: boolean
//   state: 'default' | 'call' | 'missed' | 'off'
// }

// export type Connection = {
//   color?: string
//   connected: boolean
// }

// export type ConferenceProps = {
//   leftPhone: Phone
//   rightPhone: Phone
//   connection: Connection
//   size: 'small' | 'medium' | 'large' | 'xlarge'
// }

const ConferenceContainer = styled.div`
  display: inline-flex;
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

const getPhoneProps = ({ filled = false, state, color = '#eee' }) => ({
  name: `phone${state === 'default' ? '' : `-${state}`}${
    filled ? '' : '-outline'
  }`,
  fill: color,
});

const Conference = ({ leftPhone, rightPhone, connection, size }) => (
  <ConferenceContainer>
    <FlippedIconContainer>
      <Icon size={size} {...getPhoneProps(leftPhone)}></Icon>
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
      <Icon size={size} {...getPhoneProps(rightPhone)}></Icon>
    </IconContainer>
  </ConferenceContainer>
);
export default Conference;
