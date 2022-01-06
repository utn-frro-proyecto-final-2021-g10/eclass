import { useContext } from "react";
import { Box } from "@chakra-ui/react";
import { stylesContext } from "./Card";

interface CardHeaderProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const CardHeader = ({
  children,
  onClick,
  ...props
}: CardHeaderProps) => {
  const styles = useContext(stylesContext);

  return (
    <Box
      px="4"
      py="3"
      onClick={onClick}
      background={styles.baseColor}
      color="white"
      cursor={onClick && "pointer"}
      {...props}
    >
      {children}
    </Box>
  );
};
