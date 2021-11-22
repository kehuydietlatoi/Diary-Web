import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components/macro';
const headerHeight = '85px';
const footerHeight = '50px';

export const MaxWidthCSS = css`
  max-width: 860px;
  margin: auto;
`;
const Header = styled.header`
  height: 100%;
  width: 100%;
  text-align: center;
  display: -ms-flexbox;
  align-items: center;
  padding: 10px 10px;
`;

const Main = styled.main`
  min-height: calc(100vh - ${headerHeight} - ${footerHeight});
  padding: 0 25px;
  ${MaxWidthCSS}
`;

const Footer = styled.footer`
  height: ${footerHeight};
  padding: 0 25px;
  ${MaxWidthCSS};
`;

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Header>
        <div
          css={`
            font-size: 25px;
            letter-spacing: 2.3px;
            flex: 1;
          `}
        >
          <h1
            css={`
              font-size: xxx-large;
            `}
          >
            My Diary
          </h1>
        </div>
        <div>
          <nav>
            <Link to="/">Home</Link>
          </nav>
        </div>
      </Header>
      <Main>{children}</Main>
      <Footer>Made By kehuydiet</Footer>
    </>
  );
};
