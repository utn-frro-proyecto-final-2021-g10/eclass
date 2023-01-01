import { ReactNode } from "react";
import { Avatar, GridItem, Heading, HStack, VStack } from "@chakra-ui/react";
import { Skeleton } from "../Skeleton";
import { GridContainer } from "../GridContainer";
import { Card, CardHeader } from "../Card";

const HeaderContainer = ({ children }: { children: ReactNode }) => (
  <GridContainer bgGradient="linear(to-b, gray.200 50%, gray.300 1px, white 50%)">
    <GridItem colSpan={12} my={5}>
      {children}
    </GridItem>
  </GridContainer>
);
interface HeaderProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  children?: ReactNode;
}

export const Header = ({
  title,
  subtitle,
  imageUrl,
  children,
}: HeaderProps) => {
  const Wrapper = ({ children }: { children: ReactNode }) =>
    title && subtitle ? <>{children}</> : <Skeleton>{children}</Skeleton>;

  return (
    <HeaderContainer>
      <Wrapper>
        <Card baseColor="dark">
          <CardHeader>
            <HStack spacing="4" py={[2, 3, 4]} position="relative">
              {imageUrl && (
                <Avatar
                  w="32"
                  h="32"
                  p="2"
                  bg="gray.600"
                  name={title}
                  src={imageUrl}
                />
              )}
              <VStack align="left" w="100%">
                <Heading fontWeight="300" fontSize={["2xl", "4xl", "6xl"]}>
                  {title || "eClass"}
                </Heading>
                <HStack justify={subtitle ? "space-between" : "flex-end"}>
                  {subtitle && (
                    <Heading
                      fontWeight="300"
                      fontSize={["md", "lg", "xl"]}
                      mr="10"
                    >
                      {subtitle || "eClass"}
                    </Heading>
                  )}
                </HStack>
              </VStack>
              {children}
            </HStack>
          </CardHeader>
        </Card>
      </Wrapper>
    </HeaderContainer>
  );
};

interface AvatarHeaderProps {
  children?: ReactNode;
  imageUrl?: string;
  name?: string;
}

export const AvatarHeader = ({
  imageUrl,
  name,
  children,
}: AvatarHeaderProps) => {
  return (
    <HeaderContainer>
      <HStack spacing="4" py={[2, 3, 4]} justify="center">
        <Avatar
          width="260px"
          height="260px"
          name={name}
          src={imageUrl}
          borderWidth="10px"
        >
          {children}
        </Avatar>
      </HStack>
    </HeaderContainer>
  );
};
