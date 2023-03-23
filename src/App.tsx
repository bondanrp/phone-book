/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import { Route, Routes,  BrowserRouter } from "react-router-dom";
import ContactList from "./views/contact-list";
import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache } from '@apollo/client';
import ContactDetail from "./views/contact-detail";
import Nav from "./components/nav";
import ContactForm from "./views/contact-form";

const client = new ApolloClient({
  uri: 'https://wpe-hiring.tokopedia.net/graphql',
  cache: new InMemoryCache(),
});

function App() {

  
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <BrowserRouter>
        <Nav/>
        <div css={css`
        padding-top:70px
        `}>

          <Routes>
            <Route path="/" Component={ContactList} />
            <Route path="/detail/:id" Component={ContactDetail} />
            <Route path="/create" Component={ContactForm} />
          </Routes>
        </div>
        </BrowserRouter>
      </div>
    </ApolloProvider>
  );
}

export default App;
