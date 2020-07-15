import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  max-width: 700px;
  margin: 50px auto;

  form {
    display: flex;
    flex-direction: column;
    justify-items: center;
    margin-top: 30px;

    > h1 {
      margin: 20px 0;
    }

    hr {
      margin: 20px;
      background: rgba(255, 255, 255, 0.2);
      border: 0;
      height: 1px;
    }
  }

  > a {
    display: block;
    text-align: center;
    color: #ffffff;
    width: 100%;
    border: 0;
    margin: 10px 0;
    border-radius: 4px;
    background-color: #f64c75;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    transition: background 0.2;
    text-decoration: none;

    &:hover {
      background: ${darken(0.08, '#f64c75')};
    }
  }
`;

export const ProfilePhoto = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  align-self: center;

  img {
    border-radius: 50%;
    height: 150px;
    width: 150px;
  }

  > label {
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background-color: #ff9900;
    transition: background 0.2;
    padding: 10px;
    border: 0;
    opacity: 0.8;
    cursor: pointer;

    &:hover {
      background: ${darken(0.05, '#FF9900')};
    }

    color: #000000;

    svg {
      align-items: center;
      justify-items: center;
    }

    input {
      display: none;
    }
  }
`;
