import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  max-width: 300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: calc(100% - 80px);
  width: 100%;

  form {
    display: flex;
    flex-direction: column;
    width: 100%;

    a {
      align-self: center;
      text-decoration: none;
      color: #fff;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }
  }
`;
