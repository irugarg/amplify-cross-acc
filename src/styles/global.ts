import { createGlobalStyle } from 'styled-components';
import amazonEmberWoff from '../assets/fonts/amazon-ember_bd.woff';
import amazonEmberWoff2 from '../assets/fonts/amazon-ember_bd.woff2';

export default createGlobalStyle`

@font-face {
        font-family: 'Font Name';
        src: local('Font Name'), local('FontName'),
        url(${amazonEmberWoff}),
        url(${amazonEmberWoff2});
        font-weight: 300;
        font-style: normal;
    }

* {
  margin: 0;
  padding: 0;
  outline: 0;
  box-sizing: border-box;
}

html, body, #root {
  height: 100vh;
}

body {
  background-color: #3b4550;
  -webkit-font-smoothing: antialiased !important;
}

h1,h2,h3,h4,h5, span {
  color: white;
}

body, input, button {
  color: #222;
  font-size: 14px;
  font-family: amazonEmberWoff2, sans-serif
}

button {
  cursor: pointer;
}
`;
