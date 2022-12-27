import Head from "next/head";
import { Flex } from "@chakra-ui/react";
import { Loader } from "../components/Loader";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useInstitution } from "../hooks/useInstitution";

export interface BaseLayoutProps {
  children: React.ReactNode;
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const me = useCurrentUser();
  const { institution } = useInstitution();

  return (
    <>
      <Head>
        <title>
          E-Class {institution?.name ? `| ${institution.name}` : ""}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content={`E-Class ${
            institution?.name ? `| ${institution.name}` : ""
          }`}
        />
        <meta name="author" content="PencilPaperScissor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex as="main" direction="column" minH="100vh">
        {me ? (
          <>
            <Navigation />
            {children}
            <Footer />
          </>
        ) : (
          <Loader />
        )}
      </Flex>
    </>
  );
};
