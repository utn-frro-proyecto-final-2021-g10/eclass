import { createContext, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Flex, extendTheme, FlexProps } from "@chakra-ui/react";
import { hexToRgb } from "../../utils/hexToRgb";

const colors = extendTheme().colors;

const parseChakraColor = (color: string) =>
  hexToRgb(colors[color.split(".")[0]][color.split(".")[1]]).join(", ");

interface IColor {
  base: string;
  shadow: string;
  border: string;
}

interface IPalette {
  [key: string]: IColor;
}

const palette: IPalette = {
  primary: {
    base: "teal.400",
    shadow: "teal.300",
    border: "teal.600",
  },
  dark: {
    base: "gray.700",
    shadow: "gray.600",
    border: "gray.900",
  },
  light: {
    base: "gray.300",
    shadow: "gray.200",
    border: "gray.500",
  },
  red: {
    base: "red.300",
    shadow: "red.200",
    border: "red.500",
  },
  blue: {
    base: "blue.300",
    shadow: "blue.200",
    border: "blue.500",
  },
  green: {
    base: "green.300",
    shadow: "green.200",
    border: "green.500",
  },
  yellow: {
    base: "yellow.300",
    shadow: "yellow.200",
    border: "yellow.500",
  },
  purple: {
    base: "purple.300",
    shadow: "purple.200",
    border: "purple.500",
  },
  orange: {
    base: "orange.300",
    shadow: "orange.200",
    border: "orange.500",
  },
  pink: {
    base: "pink.300",
    shadow: "pink.200",
    border: "pink.500",
  },
};

interface CardProps extends FlexProps {
  children: React.ReactNode;
  baseColor?: string;
  hasShadow?: boolean;
  onClick?: () => void;
  href?: string;
  borderColor?: string;
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
  hasShadow = true,
  onClick,
  href,
  borderColor,
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
    return `0px 0.5px 0.6px rgba(${parseChakraColor(styles.base)} , 0.36),
    0px 1.6px 1.8px -0.8px rgba(${parseChakraColor(styles.base)} , 0.36),
    0px 4.1px 4.6px -1.7px rgba(${parseChakraColor(styles.base)} , 0.36),
    0px 10px 11.3px -2.5px rgba(${parseChakraColor(styles.base)} , 0.36);`;
  }, [styles]);

  const cssHoverShadow = useMemo(() => {
    const parse = parseChakraColor;
    return `0px 0.5px 0.7px rgba(${parse(styles.shadow)}, 0.09),
    0px 2.5px 3.3px -0.2px rgba(${parse(styles.shadow)}, 0.12),
    0px 4.5px 5.9px -0.4px rgba(${parse(styles.shadow)}, 0.15),
    0px 7px 9.2px -0.6px rgba(${parse(styles.shadow)}, 0.17),
    0px 10.8px 14.2px -0.8px rgba(${parse(styles.shadow)}, 0.2),
    0px 16.6px 21.8px -1px rgba(${parse(styles.shadow)}, 0.23),
    0px 25px 32.8px -1.2px rgba(${parse(styles.shadow)}, 0.25);`;
  }, [styles]);

  return (
    <stylesContext.Provider value={styles}>
      <CardWrapper href={href}>
        <Flex
          onClick={onClick}
          direction="column"
          borderRadius="2xl"
          borderColor={borderColor || styles.base}
          _hover={{
            ...(actionable && { borderColor: styles.border }),
          }}
          borderWidth={1}
          overflow="hidden"
          as={href ? "a" : undefined}
          sx={{
            boxShadow: hasShadow ? cssShadow : "none",
            "&:hover": {
              ...(actionable && {
                boxShadow: hasShadow ? cssHoverShadow : "none",
              }),
            },
            ...(actionable && { cursor: "pointer" }),
            transition:
              "box-shadow 0.25s ease-in-out, border-color 0.25s ease-in-out",
          }}
          {...props}
        >
          {children}
        </Flex>
      </CardWrapper>
    </stylesContext.Provider>
  );
};
