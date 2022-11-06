import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { eventToFormValues } from "../../../../../utils/eventToFormValues";
import { Card, CardBody } from "../../../../Card";

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}
export const TaskForm = ({ handleSubmit }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const today = new Date();
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  return (
    <>
      <Grid justify="center" width="100%" height="auto">
        <Card>
          <CardBody>
            <HStack align="center" justify="space-between">
              <HStack>
                <Avatar size="sm" />
                <Text fontSize="sm">Create a task!</Text>
              </HStack>
              <Button onClick={() => setShowForm(!showForm)}>
                {showForm ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </Button>
            </HStack>

            {showForm && (
              <form onSubmit={handleSubmit}>
                <FormControl>
                  <FormLabel>Name: </FormLabel>
                  <Input name="name"></Input>
                  <FormLabel>Description: </FormLabel>
                  <Input name="description"></Input>
                  <FormLabel>Date Start: </FormLabel>
                  <Input name="dateStart" type={"date"}></Input>
                  <FormLabel>Date End: </FormLabel>
                  <Input
                    name="dateEnd"
                    type={"date"}
                    defaultValue={tomorrow.toISOString().substring(0, 10)}
                  ></Input>
                  <Button type="submit">Create</Button>
                </FormControl>
              </form>
            )}
          </CardBody>
        </Card>
      </Grid>
    </>
  );
};
