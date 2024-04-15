import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import ScrollToTop from './hooks/ScrollToTop.tsx';
import App from './App.tsx';
import theme from './theme.ts';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <BrowserRouter>
        <Notifications />
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
