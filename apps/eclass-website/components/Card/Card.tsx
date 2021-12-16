import { createContext, useEffect, useState } from "react";
import { Flex, extendTheme } from "@chakra-ui/react";
import { hexToRgb } from "../../utils/hexToRgb";

const colors = extendTheme().colors;

interface IColor {
  baseColor: string;
  shadowColor: number[];
}

interface IPalette {
  [key: string]: IColor;
}

const palette: IPalette = {
  primary: {
    baseColor: "teal.400",
    shadowColor: hexToRgb(colors.teal[400]),
  },
  dark: {
    baseColor: "gray.700",
    shadowColor: hexToRgb(colors.gray[700]),
  },
  light: {
    baseColor: "gray.300",
    shadowColor: hexToRgb(colors.gray[300]),
  },
  red: {
    baseColor: "red.300",
    shadowColor: hexToRgb(colors.red[300]),
  },
  blue: {
    baseColor: "blue.300",
    shadowColor: hexToRgb(colors.blue[300]),
  },
  green: {
    baseColor: "green.300",
    shadowColor: hexToRgb(colors.green[300]),
  },
  yellow: {
    baseColor: "yellow.300",
    shadowColor: hexToRgb(colors.red[300]),
  },
  purple: {
    baseColor: "purple.300",
    shadowColor: hexToRgb(colors.purple[300]),
  },
  orange: {
    baseColor: "orange.300",
    shadowColor: hexToRgb(colors.orange[300]),
  },
  pink: {
    baseColor: "pink.300",
    shadowColor: hexToRgb(colors.pink[300]),
  },
};

interface CardProps {
  children: React.ReactNode;
  baseColor?: string;
  shadow?: boolean;
}

export const stylesContext = createContext(palette.primary);

export const Card = ({
  children,
  baseColor,
  shadow = true,
  ...props
}: CardProps) => {
  const [styles, setStyles] = useState(
    () => (baseColor && palette[baseColor]) || palette.primary
  );

  useEffect(() => {
    baseColor && palette[baseColor]
      ? setStyles(palette[baseColor])
      : setStyles(palette.primary);
  }, [baseColor]);

  return (
    <stylesContext.Provider value={styles}>
      <Flex
        {...props}
        direction="column"
        borderRadius="2xl"
        borderColor={styles.baseColor}
        borderWidth={1}
        overflow="hidden"
        sx={{
          boxShadow: shadow
            ? `0px 6px 10px rgba(${styles.shadowColor.join(
                ", "
              )}, 0.14), 0px 1px 18px rgba(${styles.shadowColor.join(
                ", "
              )}, 0.12 ), 0px 3px 5px rgba(${styles.shadowColor.join(
                ", "
              )}, 0.2 )`
            : "none",
        }}
      >
        {children}
      </Flex>
    </stylesContext.Provider>
  );
};
