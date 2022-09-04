import {
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  Button,
} from "@chakra-ui/react";
import { User } from "@prisma/client";

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  buttonText: string;
  user?: any | null;
}
const UserForm = ({ handleSubmit, buttonText, user = null }: Props) => {
  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel>First Name: </FormLabel>
        <Input name="firstName" defaultValue={user?.firstName || ""}></Input>
        <FormLabel>Last Name: </FormLabel>
        <Input name="lastName" defaultValue={user?.lastName || ""}></Input>
        <FormLabel>Birth Date: </FormLabel>
        <Input
          name="birthDate"
          type={"date"}
          defaultValue={user?.birthDate || ""}
        ></Input>
        <FormLabel>Email: </FormLabel>
        <Input
          name="email"
          type={"email"}
          defaultValue={user?.email || ""}
        ></Input>
        <FormLabel>Image Url: </FormLabel>
        <Input
          name="profileImageUrl"
          defaultValue={user?.profileImageUrl || ""}
        ></Input>
        <FormLabel>Password: </FormLabel>
        <Input name="password" type={"password"}></Input>
        <FormLabel>Role: </FormLabel>
        <RadioGroup name="role" defaultValue={user?.role || ""}>
          <Radio value={"student"}>Student</Radio>
          <Radio value={"professor"}>Professor</Radio>
          <Radio value={"admin"}>Admin</Radio>
        </RadioGroup>
        <Button type="submit">{buttonText}</Button>
      </FormControl>
    </form>
  );
};

export default UserForm;
