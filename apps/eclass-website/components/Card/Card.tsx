import { createContext, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Flex, extendTheme } from "@chakra-ui/react";
import { hexToRgb } from "../../utils/hexToRgb";

const colors = extendTheme().colors;

const parseChakraColor = (color: string) =>
  hexToRgb(colors[color.split(".")[0]][color.split(".")[1]]).join(", ");

interface IColor {
  baseColor: string;
  hoverShadowColor: string;
  hoverBorderColor: string;
}

interface IPalette {
  [key: string]: IColor;
}

const palette: IPalette = {
  primary: {
    baseColor: "teal.400",
    hoverShadowColor: "teal.300",
    hoverBorderColor: "teal.600",
  },
  dark: {
    baseColor: "gray.700",
    hoverShadowColor: "gray.600",
    hoverBorderColor: "gray.900",
  },
  light: {
    baseColor: "gray.300",
    hoverShadowColor: "gray.200",
    hoverBorderColor: "gray.500",
  },
  red: {
    baseColor: "red.300",
    hoverShadowColor: "red.200",
    hoverBorderColor: "red.500",
  },
  blue: {
    baseColor: "blue.300",
    hoverShadowColor: "blue.200",
    hoverBorderColor: "blue.500",
  },
  green: {
    baseColor: "green.300",
    hoverShadowColor: "green.200",
    hoverBorderColor: "green.500",
  },
  yellow: {
    baseColor: "yellow.300",
    hoverShadowColor: "yellow.200",
    hoverBorderColor: "yellow.500",
  },
  purple: {
    baseColor: "purple.300",
    hoverShadowColor: "purple.200",
    hoverBorderColor: "purple.500",
  },
  orange: {
    baseColor: "orange.300",
    hoverShadowColor: "orange.200",
    hoverBorderColor: "orange.500",
  },
  pink: {
    baseColor: "pink.300",
    hoverShadowColor: "pink.200",
    hoverBorderColor: "pink.500",
  },
};

interface CardProps {
  children: React.ReactNode;
  baseColor?: string;
  shadow?: boolean;
  onClick?: () => void;
  href?: string;
}

export const stylesContext = createContext(palette.primary);

const CardWrapper = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) => {
  // TODO: add passHref and fix menu propagation
  return href ? <Link href={href}>{children}</Link> : <>{children}</>;
};

export const Card = ({
  children,
  baseColor,
  shadow = true,
  onClick,
  href,
  ...props
}: CardProps) => {
  const [styles, setStyles] = useState(
    () => (baseColor && palette[baseColor]) || palette.primary
  );

  const actionable = onClick || href;

  useEffect(() => {
    baseColor && palette[baseColor]
      ? setStyles(palette[baseColor])
      : setStyles(palette.primary);
  }, [baseColor]);

  const cssShadow = useMemo(() => {
    return `0px 0.5px 0.6px rgba(${parseChakraColor(styles.baseColor)} , 0.36),
    0px 1.6px 1.8px -0.8px rgba(${parseChakraColor(styles.baseColor)} , 0.36),
    0px 4.1px 4.6px -1.7px rgba(${parseChakraColor(styles.baseColor)} , 0.36),
    0px 10px 11.3px -2.5px rgba(${parseChakraColor(styles.baseColor)} , 0.36);`;
  }, [styles]);

  const cssHoverShadow = useMemo(() => {
    const parse = parseChakraColor;
    return `0px 0.5px 0.7px rgba(${parse(styles.hoverShadowColor)}, 0.09),
    0px 2.5px 3.3px -0.2px rgba(${parse(styles.hoverShadowColor)}, 0.12),
    0px 4.5px 5.9px -0.4px rgba(${parse(styles.hoverShadowColor)}, 0.15),
    0px 7px 9.2px -0.6px rgba(${parse(styles.hoverShadowColor)}, 0.17),
    0px 10.8px 14.2px -0.8px rgba(${parse(styles.hoverShadowColor)}, 0.2),
    0px 16.6px 21.8px -1px rgba(${parse(styles.hoverShadowColor)}, 0.23),
    0px 25px 32.8px -1.2px rgba(${parse(styles.hoverShadowColor)}, 0.25);`;
  }, [styles]);

  return (
    <stylesContext.Provider value={styles}>
      <CardWrapper href={href}>
        <Flex
          {...props}
          onClick={onClick}
          direction="column"
          borderRadius="2xl"
          borderColor={styles.baseColor}
          _hover={{
            ...(actionable && { borderColor: styles.hoverBorderColor }),
          }}
          borderWidth={1}
          overflow="hidden"
          as={href ? "a" : undefined}
          sx={{
            boxShadow: shadow ? cssShadow : "none",
            "&:hover": {
              ...(actionable && {
                boxShadow: shadow ? cssHoverShadow : "none",
              }),
            },
            ...(actionable && { cursor: "pointer" }),
            transition:
              "box-shadow 0.25s ease-in-out, border-color 0.25s ease-in-out",
          }}
        >
          {children}
        </Flex>
      </CardWrapper>
    </stylesContext.Provider>
  );
};
