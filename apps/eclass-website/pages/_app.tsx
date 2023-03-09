import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BaseLayout } from "../layouts/base-layout";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <BaseLayout>{page}</BaseLayout>);
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ChakraProvider>
          {
            // @ts-ignore
            getLayout(<Component {...pageProps} />)
          }
        </ChakraProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
