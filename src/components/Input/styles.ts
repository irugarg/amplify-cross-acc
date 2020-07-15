import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
}

export const Container = styled.div<ContainerProps>`
  border: 1px solid #272d3a;
  color: #666360;
  border-radius: 10px;
  padding: 16px;
  background: #272d3a;

  & + div {
    margin-top: 8px;
  }

  ${(props) =>
    props.isFocused &&
    css`
      color: #ff9900;
      border-color: #ff9900;
    `}
  input {
    width: 100%;
    border: 0;
    background: transparent;
    color: #f4ede8;
    /* border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px; */

    &::placeholder {
      color: #666360;
    }
  }
`;
