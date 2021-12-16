import { Flex, Spinner } from "@chakra-ui/react";

export const Loader = () => (
  <Flex justify="center" align="center" flex={1}>
    <Spinner size="xl" colorScheme="blackAlpha" />
  </Flex>
);
