import { GridItem } from "@chakra-ui/react"
import { Course } from "@prisma/client"
import { useCurrentUser } from "../../../hooks/useCurrentUser"
import { GridContainer } from "../../GridContainer"
import { CourseCard } from "./CourseCard"
import { Enrollment } from "./Enrollment"

interface Props {
    courses: Course[]
}

export const Dashboard = ({ courses }: Props) => {
    const me = useCurrentUser()

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
        </>
    )
}