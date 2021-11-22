import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyle } from './components/GlobalStyle';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { DashBoard } from './pages/DashBoard/DashBoard';
import { DiaryEntryPage } from './pages/DiaryEntry/DiaryEntryPage';

export const App = () => {
  useEffect(() => {
    (async () => {
      const helloRequest = await fetch('/api');
      const helloJson = await helloRequest.json();
      console.log(helloJson);
    })();
  });

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Routes>
          <Route path={'/'} element={<DashBoard />} />
          <Route path={'/diary/:id'} element={<DiaryEntryPage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};
