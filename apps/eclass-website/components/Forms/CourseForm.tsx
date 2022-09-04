import { FormControl, FormLabel, Input, RadioGroup, Radio, Button } from "@chakra-ui/react"
import { Color, Course } from "@prisma/client"
import course from "../../pages/api/v1/course"
import users from "../../pages/users"


interface Props {
    course?: any;
    users: any[];
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const CourseForm = ({ course = null, users, handleSubmit }: Props) => {

    return (
        <form onSubmit={handleSubmit}>
            <FormControl>
                <FormLabel>Name: </FormLabel>
                <Input name="name" defaultValue={course?.name || ""}></Input>
                <FormLabel>Description: </FormLabel>
                <Input name="description" defaultValue={course?.description || ""}></Input>
                <FormLabel>Slug: </FormLabel>
                <Input name="slug" defaultValue={course?.slug || ""}></Input>
                <FormLabel>More Info: </FormLabel>
                <Input name="moreInfo" defaultValue={course?.moreInfo || ""}></Input>
                <FormLabel>Image Url: </FormLabel>
                <Input name="imageUrl" defaultValue={course?.imageUrl || ""}></Input>
                <FormLabel>Enrollment ID: </FormLabel>
                <Input name="enrollmentId" defaultValue={course?.enrollmentId || ""}></Input>
                <FormLabel>Owner: </FormLabel>
                <RadioGroup
                    name="owner"
                    defaultValue={course?.owner.id}
                    display={"flex"}
                    flexDir={"column"}
                >
                    {users.map((user: any) => (
                        <Radio
                            key={user.id}
                            value={user.id}
                        >{`${user.id} - ${user.lastName}, ${user.firstName}`}</Radio>
                    ))}
                </RadioGroup>
                <FormLabel>Color: </FormLabel>
                <RadioGroup
                    name="color"
                    defaultValue={course?.settings.baseColor}
                    display={"flex"}
                    flexDir={"column"}
                >
                    <Radio value={Color.blue}>{Color.blue}</Radio>
                    <Radio value={Color.green}>{Color.green}</Radio>
                    <Radio value={Color.orange}>{Color.orange}</Radio>
                    <Radio value={Color.pink}>{Color.pink}</Radio>
                    <Radio value={Color.purple}>{Color.purple}</Radio>
                    <Radio value={Color.red}>{Color.red}</Radio>
                    <Radio value={Color.yellow}>{Color.yellow}</Radio>
                </RadioGroup>
            </FormControl>
            <Button type="submit">Update</Button>
        </form>
    )
}

export default CourseForm;