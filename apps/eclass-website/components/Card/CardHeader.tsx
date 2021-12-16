import { useContext } from "react";
import { Box } from "@chakra-ui/react";
import { stylesContext } from "./Card";

interface CardHeaderProps {
  children: React.ReactNode;
}

export const CardHeader = ({ children, ...props }: CardHeaderProps) => {
  const styles = useContext(stylesContext);

  return (
    <Box px="4" py="3" background={styles.baseColor} color="white" {...props}>
      {children}
    </Box>
  );
};
