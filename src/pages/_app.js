import '@/styles/globals.css'
import '@/styles/app.css';
import { SessionProvider } from 'next-auth/react'
import ReducerProvider from "utils/ReducerContext";
import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    }
  }
})
export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={client}>
      <React.Suspense fallback='Loading...'>
        {/* <SessionProvider session={pageProps.session}> */}
          <ReducerProvider>
            <Component {...pageProps} />
          </ReducerProvider>
        {/* </SessionProvider> */}
      </React.Suspense>
    </QueryClientProvider>
  ) 
}
