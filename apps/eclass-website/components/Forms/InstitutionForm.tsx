import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { Institution } from "@prisma/client";
import institution from "../../pages/institution";

interface Props {
  institution: Institution;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}
const InstitutionForm = ({ institution, handleSubmit }: Props) => {
  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel>Name: </FormLabel>
        <Input defaultValue={institution?.name || ""} name="name"></Input>
        <FormLabel>description</FormLabel>
        <Input
          defaultValue={institution?.description || ""}
          name="description"
        ></Input>
        <FormLabel>imageUrl</FormLabel>
        <Input
          defaultValue={institution?.imageUrl || ""}
          name="imageUrl"
        ></Input>
        <FormLabel>address</FormLabel>
        <Input defaultValue={institution?.address || ""} name="address"></Input>
        <FormLabel>city</FormLabel>
        <Input defaultValue={institution?.city || ""} name="city"></Input>
        <FormLabel>state</FormLabel>
        <Input defaultValue={institution?.state || ""} name="state"></Input>
        <FormLabel>phone</FormLabel>
        <Input defaultValue={institution?.phone || ""} name="phone"></Input>
        <FormLabel>email</FormLabel>
        <Input defaultValue={institution?.email || ""} name="email"></Input>
        <FormLabel>website</FormLabel>
        <Input defaultValue={institution?.website || ""} name="website"></Input>
        <Button type="submit">Update</Button>
      </FormControl>
    </form>
  );
};

export default InstitutionForm;
