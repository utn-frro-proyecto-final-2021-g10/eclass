import { Avatar, GridItem, Heading, HStack, VStack } from "@chakra-ui/react";
import { GridContainer } from "../GridContainer";
import { Card, CardHeader } from "../Card";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export const Header = ({ title, subtitle, imageUrl }: HeaderProps) => {
  return (
    <GridContainer bgGradient="linear(to-b, gray.200 50%, gray.300 1px, white 50%)">
      <GridItem colSpan={12} my={5}>
        <Card baseColor="dark">
          <CardHeader>
            <HStack spacing="4" py="4">
              {imageUrl && <Avatar size="lg" name={title} src={imageUrl} />}
              <VStack align="left">
                <Heading fontWeight="300" size="3xl">
                  {title || "eClass"}
                </Heading>
                {subtitle && (
                  <Heading fontWeight="300" size="md">
                    {subtitle}
                  </Heading>
                )}
              </VStack>
            </HStack>
          </CardHeader>
        </Card>
      </GridItem>
    </GridContainer>
  );
};
