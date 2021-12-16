import {
  Box,
  VStack,
  HStack,
  Avatar,
  Heading,
  Divider,
  AspectRatio,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { FullCourse } from "../../../types/Course";
import { Card, CardHeader, CardBody } from "../../Card";

export const CourseCard = ({ course }: { course: FullCourse }) => {
  return (
    <Card baseColor={course?.settings?.baseColor}>
      <CardHeader>
        <HStack spacing="2">
          <Avatar />
          <VStack align="left" spacing="0">
            <Heading size="s">Course Name</Heading>
            <Heading size="xs">Course Description</Heading>
          </VStack>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="left" spacing={3}>
          <HStack spacing={3} pos="relative">
            <AspectRatio ratio={3} width="100%">
              <Box>
                <VStack
                  spacing={1}
                  paddingRight={28}
                  align="start"
                  height="100%"
                  overflowY="scroll"
                  width="100%"
                  marginRight="-30px"
                ></VStack>
              </Box>
            </AspectRatio>
            <Avatar
              size="xl"
              showBorder
              borderWidth="3px"
              position="absolute"
              right={0}
              top="-4rem"
            />
          </HStack>
          <Divider />
          <HStack spacing={3} justify="end">
            <SettingsIcon />
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};
