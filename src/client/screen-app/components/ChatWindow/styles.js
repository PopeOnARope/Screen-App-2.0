import styled from 'styled-components';
import { sharedButtonStyles, sharedContainerStyles } from '../../styles';

export const Button = styled.button`
  ${sharedButtonStyles}
  height: auto;
  border-radius: 12px;
`;

export const MessageWindowContainer = styled.div`
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
    font-size: ${props => props.theme.small}px;
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
  .message-list {
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

export const MessageListContainer = styled.div`
  background: ${props => props.theme.primaryExtraLight};
  flex-grow: 4;
`;

export const NavbarMiddleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Navbar = styled.div`
  background: #fcfcfe;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 10px 10px 3px 10px;
  height: 48px;
  position: fixed;
  z-index: 2;
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.grayMedium};
`;

export const InputContainer = styled.div`
  position: fixed;
  z-index: 2;
  bottom: 0;
  width: 100%;
  border-top: 1px solid ${props => props.theme.grayMedium};
`;
