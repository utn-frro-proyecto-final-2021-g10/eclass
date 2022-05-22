import { Flex, Grid } from "@chakra-ui/react";
import type { FlexProps } from "@chakra-ui/react";
interface GridContainerProps extends FlexProps {
  children: React.ReactNode;
}

export const GridContainer = ({ children, ...props }: GridContainerProps) => {
  return (
    <Flex justify="center" {...props}>
      <Grid
        gap={5}
        maxW="1300"
        mx="5"
        templateColumns="repeat(12, 1fr)"
        w="100%"
      >
        {children}
      </Grid>
    </Flex>
  );
};
