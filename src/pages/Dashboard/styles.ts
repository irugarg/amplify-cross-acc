import styled, { keyframes, css } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

interface IContainerProps {
  isLoading: boolean;
}

export const Container = styled.div<IContainerProps>`
  max-width: 1080px;
  margin: 20px auto;
  display: flex;

  ${(props) =>
    props.isLoading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `};
`;

export const LeftSide = styled.div`
  max-width: 400px;
  border-right: 1px solid #fff;
  margin-right: 10px;
  flex: 1;
  form {
    display: flex;
    margin: 10px;
    align-items: center;

    button {
      margin-left: 10px;
    }

    div {
      flex: 1;
      input {
      }
    }
  }
`;

export const RightSide = styled.div`
  max-width: 580px;
  margin: 0, auto;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ChimeList = styled.ul`
  list-style: none;
  max-width: 580px;
  flex: 1;

  li {
    padding: 10px;
    border-radius: 10px;
    display: flex;
    background-color: #272d3a;
    /* justify-content: center; */
    /* background: white; */

    & + li {
      border-top: 1px solid;
      margin-top: 10px;
    }

    img {
      align-self: center;
      max-width: 150px;
      border-radius: 50%;
      border: 2px solid #eee;
    }

    > strong {
      font-size: 16px;
      line-height: 20px;
      color: #333;
      margin-top: 5px;
    }

    > span {
      font-size: 21px;
      font-weight: bold;
      margin: 5px 0 20px;
    }

    button {
      overflow: hidden;
      background: #ff9900;
      color: #fff;
      border: 0;
      border-radius: 3px;
      margin-top: auto;

      display: flex;
      align-items: center;

      transition: background 0.2s;

      div {
        display: flex;
        align-items: ccenter;
        padding: 12px;
        background: rgba(0, 0, 0, 0.1);

        svg {
          margin-right: 5px;
        }
      }
      span {
        flex: 1;
        text-align: center;
        font-weight: bold;
      }
    }
  }
`;

export const Avatar = styled.div`
  img {
    width: 50px;
    height: 50px;
  }
`;

export const Teste = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  flex: 1;
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: 12px;
    line-height: 2px;
    margin-top: 5px;
    color: gray;
  }

  strong {
    font-size: 16px;
    line-height: 20px;
    color: #ff9900;
    margin-top: 5px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  strong {
    font-size: 16px;
    line-height: 20px;
    color: #ff9900;
  }
`;

export const InfiniteScroll = styled.div`
  margin-top: 30px;
  justify-content: center;
  display: flex;
`;
