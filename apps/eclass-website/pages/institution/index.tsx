import { Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Loader } from "../../components/Loader"
import { eventToFormValues } from "../../utils/eventToFormValues"

interface Props {
    institutionData: any
}

const InstitutionPage = ({ institutionData }: Props) => {
    const toast = useToast()
    const [institution, setInstitution] = useState<any | null>()
    useEffect(() => setInstitution(institutionData), [institutionData])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const values = eventToFormValues(e)
        const updatedInstitution = {
            id: "institution",
            name: values.name,
            description: values.description,
            imageUrl: values.imageUrl,
            address: values.address,
            city: values.city,
            state: values.state,
            phone: values.phone,
            email: values.email,
            website: values.website,
        }

        const result = await fetch(`/api/v1/institution/`, {
            method: "PUT",
            body: JSON.stringify(updatedInstitution),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (result.status === 200) {
            toast({
                title: 'Update',
                status: 'success',
                description: 'Institution updated succesfully',
                isClosable: true
            })
            const response = await fetch(`/api/v1/institution/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const data = await response.json()
                setInstitution(data.institution)
            }
        }
        else {
            toast({
                title: 'Error',
                status: 'error',
                description: 'Error updating institution',
                isClosable: true
            })
        }

    }

    return (
        <form onSubmit={handleSubmit}>
            <FormControl>
                <FormLabel>Name: </FormLabel>
                <Input defaultValue={institution?.name || ""} name="name"></Input>
                <FormLabel>description</FormLabel>
                <Input defaultValue={institution?.description || ""} name="description"></Input>
                <FormLabel>imageUrl</FormLabel>
                <Input defaultValue={institution?.imageUrl || ""} name="imageUrl"></Input>
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
    )
}

export const getServerSideProps = async () => {
    const institution = await prisma.institution.findFirst();
    return {
        props: {
            institutionData: institution,
        },
    };
};

export default InstitutionPage