import { Avatar, GridItem, Heading, HStack, VStack } from "@chakra-ui/react";
import { Skeleton } from "../Skeleton";
import { GridContainer } from "../GridContainer";
import { Card, CardHeader } from "../Card";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export const Header = ({ title, subtitle, imageUrl }: HeaderProps) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    title && subtitle ? <>{children}</> : <Skeleton>{children}</Skeleton>;

  return (
    <GridContainer bgGradient="linear(to-b, gray.200 50%, gray.300 1px, white 50%)">
      <GridItem colSpan={12} my={5}>
        <Wrapper>
          <Card baseColor="dark">
            <CardHeader>
              <HStack spacing="4" py={[2, 3, 4]}>
                {imageUrl && <Avatar size="lg" name={title} src={imageUrl} />}
                <VStack align="left">
                  <Heading fontWeight="300" fontSize={["2xl", "4xl", "6xl"]}>
                    {title || "eClass"}
                  </Heading>
                  {subtitle && (
                    <Heading fontWeight="300" fontSize={["md", "lg", "xl"]}>
                      {subtitle || "eClass"}
                    </Heading>
                  )}
                </VStack>
              </HStack>
            </CardHeader>
          </Card>
        </Wrapper>
      </GridItem>
    </GridContainer>
  );
};
