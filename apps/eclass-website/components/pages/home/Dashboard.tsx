import { GridItem, Modal, useToast } from "@chakra-ui/react"
import { Course } from "@prisma/client"
import { useState } from "react"
import { useCurrentUser } from "../../../hooks/useCurrentUser"
import { eventToFormValues } from "../../../utils/eventToFormValues"
import CourseForm from "../../Forms/CourseForm"
import { GridContainer } from "../../GridContainer"
import { CourseCard } from "./CourseCard"
import { Enrollment } from "./Enrollment"

interface Props {
    initialCourses: Course[]
}

export const Dashboard = ({ initialCourses }: Props) => {
    const me = useCurrentUser()
    const toast = useToast()
    const [courses, setCourses] = useState(initialCourses)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const values = eventToFormValues(e)

        const course = {
            name: values.name,
            slug: values.slug,
            description: values.description,
            moreInfo: values.moreInfo,
            imageUrl: values.imageUrl,
            enrollmentId: values.enrollmentId,
            owner: {
                connect: {
                    id: me?.id,
                }
            },
            settings: {
                create: {
                    baseColor: values.color,
                },
            },
        };

        const result = await fetch(`/api/v1/course`, {
            method: "POST",
            body: JSON.stringify(course),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (result.status === 200) {
            toast({
                title: "Created",
                description: "Course created succesfully",
                status: "success",
                isClosable: true,
            });

            const response = await fetch("/api/v1/user/me", {
                method: "GET",
            });
            const data = await response.json();
            const user = data.user;
            setCourses(user.ownedCourses)
            // Todo: update courses on result ok

        } else {
            toast({
                title: "Error",
                description: "Error creating course",
                status: "error",
                isClosable: true,
            });
        }
    };

    return (
        <>
            {me?.role == "student" && <Enrollment />}
            <GridContainer>
                {courses &&
                    courses.map((course, i) => (
                        <GridItem key={i} colSpan={[12, 12, 6, 4]}>
                            <CourseCard course={course} />
                        </GridItem>
                    ))}

            </GridContainer>

            {me?.role == "professor" && <CourseForm users={[me]} handleSubmit={handleSubmit} professorId={me.id.toString()} />}
        </>
    )
}

