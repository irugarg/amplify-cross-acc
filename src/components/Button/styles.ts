import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.button`
  color: #ffffff;
  border: 0;
  margin: 20px 0;
  border-radius: 4px;
  background-color: #ff9900;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.2;

  &:hover {
    background: ${darken(0.03, '#FF9900')};
  }
`;
