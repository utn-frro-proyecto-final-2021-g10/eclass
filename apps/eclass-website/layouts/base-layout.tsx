import Head from "next/head";
import { Flex } from "@chakra-ui/react";
import { Navigation } from "../components/Navigation";

export interface BaseLayoutProps {
  children: React.ReactNode;
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
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
        <Navigation />
        {children}
      </Flex>
    </>
  );
};
