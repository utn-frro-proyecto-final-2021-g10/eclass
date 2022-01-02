import Head from "next/head";
import { Flex } from "@chakra-ui/react";
import { Loader } from "../components/Loader";
import { Navigation } from "../components/Navigation";
import { useCurrentUser } from "../hooks/useCurrentUser";

export interface BaseLayoutProps {
  children: React.ReactNode;
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const me = useCurrentUser();
  
  return (
    <>
      <Head>
        <title>E-Class</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="E-Class" />
        <meta name="author" content="PencilPaperScissor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex as="main" direction="column" minH="100vh" pb={5}>
        {me ? <>
          <Navigation />
        {children}
        </> : <Loader />}
      </Flex>
    </>
  );
};
