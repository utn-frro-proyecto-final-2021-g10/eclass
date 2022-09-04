import { FormControl, FormLabel, Input, Button, useToast } from "@chakra-ui/react"
import { NextPage } from "next"
import React from "react"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { eventToFormValues } from "../utils/eventToFormValues"

const ProfilePage: NextPage = () => {
    const me = useCurrentUser()
    const toast = useToast()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const values = eventToFormValues(e)

        const user = {
            id: me?.id,
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            profileImageUrl: values.profileImageUrl,
            role: values.role,
            birthDate: new Date(values.birthDate),
        }

        const result = await fetch(`/api/v1/user/updateMyInfo`, {
            method: "PUT",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (result.status === 200) {
            toast({
                title: 'Updated',
                description: 'Information updated succesfully',
                status: 'success',
                isClosable: true,
            })
        } else {
            toast({
                title: 'Error',
                description: 'Error updating information',
                status: 'error',
                isClosable: true,
            })
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <FormLabel>First Name: </FormLabel>
                    <Input name="firstName" defaultValue={me?.firstName}></Input>
                    <FormLabel>Last Name: </FormLabel>
                    <Input name="lastName" defaultValue={me?.lastName}></Input>
                    <FormLabel>Birth Date: </FormLabel>
                    <Input
                        name="birthDate"
                        defaultValue={
                            me?.birthDate === undefined ?
                                me?.birthDate :
                                new Date().toISOString().substring(0, 10)}
                        type={"date"}>
                    </Input>
                    <FormLabel>Email: </FormLabel>
                    <Input defaultValue={me?.email} name="email" type={"email"}></Input>
                    <FormLabel>Image Url: </FormLabel>
                    <Input defaultValue={me?.profileImageUrl} name="profileImageUrl"></Input>
                    <Button type="submit">Update</Button>
                </FormControl>

            </form>
        </>

    )
}

export default ProfilePage;