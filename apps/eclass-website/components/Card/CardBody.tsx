import { Box } from "@chakra-ui/react";

interface CardBodyProps {
  children: React.ReactNode;
}

export const CardBody = ({ children, ...props }: CardBodyProps) => (
  <Box px="4" py="3" w="100%" {...props}>
    {children}
  </Box>
);
