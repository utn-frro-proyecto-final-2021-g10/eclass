import { Flex, FormLabel, GridItem, Input, Text } from "@chakra-ui/react";

export const Questions = ({ questions }) => {
  return (
    <>
      {/* <Text> Se cargo Questions {questions} </Text> */}
      {questions.forEach((question: Number) => {
        <>
          <GridItem colSpan={1} width="100%" justifySelf="end">
            <FormLabel>Question {question}</FormLabel>
          </GridItem>
          <GridItem colSpan={4}>
            <Input placeholder="Answer to your question(optional)" />
          </GridItem>
        </>;
      })}
    </>
  );
};
