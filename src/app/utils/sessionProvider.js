"use client";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`@import url('https://fonts.googleapis.com/css2?family=Paytone+One&display=swap');

.paytoneOne {
  font-family: 'Paytone One', sans-serif;
}
`;

const NextAuthSessionProvider = ({ children }) => {
  return (
    <SessionProvider>
      <GlobalStyle />
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
};

export default NextAuthSessionProvider;
