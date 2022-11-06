import { FormLabel, Grid, GridItem, Input, Text } from "@chakra-ui/react";

interface Props {
  questions: any;
}
export const Questions = ({ questions }: Props) => {
  return (
    <>
      <Text>{questions.join(", ")}</Text>
      {questions.map((question: any, i: number) => {
        <Grid bg="red">
          <GridItem key={i} colSpan={1} width="100%" justifySelf="end">
            <FormLabel>Question {question}</FormLabel>
          </GridItem>
          <GridItem colSpan={4}>
            <Input placeholder="Answer to your question(optional)" />
          </GridItem>
        </Grid>;
      })}
    </>
  );
};
