import styled from 'styled-components';

export const Container = styled.div`
  background: #272d3a;
  padding: 20px 0;
  height: 80px;
`;

export const Content = styled.header`
  display: flex;
  align-items: center;
  max-width: 900px;
  justify-content: space-between;
  margin: 0 auto;

  nav {
    display: flex;
    align-items: center;

    a {
      color: white;
      font-weight: bold;
    }

    img {
      margin-right: 20px;
      padding-right: 20px;
      border-right: 1px solid #eee;
    }

    aside {
      display: flex;
      align-items: center;
    }
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;

  img {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin-left: 10px;
  }

  div {
    display: flex;
    flex-direction: column;
    line-height: 15px;

    margin-left: 20px;
    padding-left: 20px;
    border-left: 1px solid #eee;

    line-height: 20px;

    a {
      color: white;
    }

    strong {
      color: #ff9900;
    }
  }
`;
