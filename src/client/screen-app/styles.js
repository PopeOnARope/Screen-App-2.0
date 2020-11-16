import styled, { css } from 'styled-components';

export const sharedContainerStyles = css`
  padding: auto 12px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  font-family: Nunito;
  h1 {
    color: ${props => props.theme.primary};
    margin-bottom: 109px;
  }
  p {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    text-align: center;
  }
  .lower-content {
    margin-top: 100px;
  }
`;

export const sharedInputStyles = css`
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid ${props => props.theme.grayMedium};
  border-radius: 0px;
  background: none;
  box-shadow: none;
  display: block;
  width: 100%;
  height: 34px;
  padding: 6px 12px;
  line-height: 1.42857143;
  color: #555;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  margin-bottom: 48px;
  font-family: Nunito;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  letter-spacing: -0.24px;
  &:focus {
    border: none;
    border-bottom: 2px solid ${props => props.theme.primaryDark};
    outline: none !important;
    box-shadow: none;
  }
`;

export const sharedButtonStyles = css`
  width: 100%;
  padding: 2px;
  background: ${props => props.theme.primary};
  border-radius: 10px;
  height: 50px;
  color: #fff;
  border: none;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 33px;
  font-family: Nunito;
  &:hover {
    background: ${props => props.theme.primaryLight};
    cursor: pointer;
  }
`;
