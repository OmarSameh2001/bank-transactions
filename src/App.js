import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Main from "./Components/Main/Main";
import Navbar from "./Components/Navbar/Navbar";

export default function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Navbar />
      <Main />
    </QueryClientProvider>
  );
}
