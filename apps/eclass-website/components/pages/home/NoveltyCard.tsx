import {
  Box,
  VStack,
  Heading,
  Divider,
  AspectRatio,
  Text,
  Image,
} from "@chakra-ui/react";
import { Card, CardHeader } from "../../Card";
import { Novelty } from "@prisma/client";

export const NoveltyCard = ({ novelty }: { novelty: Novelty }) => {
  return (
    <a href={novelty.link} target="_blank" rel="noopener noreferrer">
      <Card baseColor="dark" href={novelty.link}>
        <CardHeader>
          <AspectRatio ratio={1.75} width="100%">
            <Box spacing={0}>
              {novelty.imageUrl && (
                <Image
                  src={novelty.imageUrl}
                  alt={novelty.title}
                  width="50%"
                  height="100%"
                  objectFit="cover"
                  borderRadius="lg"
                  position="absolute"
                  top={0}
                  right={0}
                />
              )}
              <Box
                width="100%"
                height="100%"
                borderRadius="lg"
                position="absolute"
                top={0}
                left={0}
                zIndex={1}
                bgGradient="linear(to-l, rgba(0,0,0, 0), gray.700, gray.700)"
              />
              <VStack
                spacing={3}
                align="left"
                width="100%"
                p={3}
                position="absolute"
                bottom={0}
                left={0}
                zIndex={2}
              >
                <Box>
                  <Heading color={"white"} size="lg">
                    {novelty.title}
                  </Heading>
                  <Text color={"white"}>{novelty.description}</Text>
                </Box>
                <Divider />
                <Text color={"white"} fontSize="xs">
                  {new Date(novelty.date).toLocaleDateString()}
                </Text>
              </VStack>
            </Box>
          </AspectRatio>
        </CardHeader>
      </Card>
    </a>
  );
};
