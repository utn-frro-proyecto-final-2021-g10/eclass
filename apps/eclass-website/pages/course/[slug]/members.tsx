import type { NextPage } from "next";
import { useContext, useEffect, useState, useMemo } from "react";
import { prisma } from "../../../lib/prisma";
import { CourseLayout, courseContext } from "../../../layouts/course-layout";
import type { User, CourseMember, Course } from "@prisma/client";
import { Button, GridItem, HStack, Collapse } from "@chakra-ui/react";
import { MemberList } from "../../../components/pages/course/members/MemberList";
import { EmailIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

const Members: NextPage<{
  course: Course;
  students: User[];
  professors: User[];
}> = ({ course, students, professors }) => {
  const { setCourse } = useContext(courseContext);
  const [selectState, setSelectState] = useState(false);
  const [checkedStudentsEmails, setCheckedStudentsEmails] = useState({});
  const [checkedProfessorsEmails, setCheckedProfessorsEmails] = useState({});
  const me = useCurrentUser();

  const resetEmailLists = () => {
    setCheckedStudentsEmails(
      Object.fromEntries(
        students
          .filter((student) => student.id !== me?.id)
          .map((student) => [student.email, false])
      )
    );
    setCheckedProfessorsEmails(
      Object.fromEntries(
        professors
          .filter((professor) => professor.id !== me?.id)
          .map((professor) => [professor.email, false])
      )
    );
  };

  const emailList = useMemo(() => {
    const list = {
      ...checkedStudentsEmails,
      ...checkedProfessorsEmails,
    };
    return Object.keys(list).filter((email) => list[email]);
  }, [checkedStudentsEmails, checkedProfessorsEmails]);

  useEffect(() => {
    resetEmailLists();
  }, [me, students, professors]);

  useEffect(() => {
    setCourse(course);
  }, []);

  return (
    <>
      <GridItem colSpan={12}>
        <Collapse in={selectState} animateOpacity>
          <HStack>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              leftIcon={<SmallCloseIcon />}
              onClick={() => {
                setSelectState(false);
                resetEmailLists();
              }}
            >
              Cancelar
            </Button>
            <Button
              isDisabled={emailList.length === 0}
              as="a"
              size="sm"
              variant="outline"
              leftIcon={<EmailIcon />}
              href={`mailto:${emailList.join(",")}`}
              onClick={(e) => {
                setTimeout(() => {
                  resetEmailLists();
                  setSelectState(false);
                }, 0);
              }}
            >
              Enviar mensaje global
            </Button>
          </HStack>
        </Collapse>
      </GridItem>

      <GridItem colSpan={12}>
        <MemberList
          heading="Profesor"
          pluralHeading="Profesores"
          users={professors}
          selectState={selectState}
          onEnableSelect={() => setSelectState(true)}
          checkedEmails={checkedProfessorsEmails}
          setCheckedEmails={setCheckedProfessorsEmails}
        />
      </GridItem>

      <GridItem colSpan={12}>
        <MemberList
          heading="Alumno"
          pluralHeading="Alumnos"
          users={students}
          selectState={selectState}
          onEnableSelect={() => setSelectState(true)}
          checkedEmails={checkedStudentsEmails}
          setCheckedEmails={setCheckedStudentsEmails}
        />
      </GridItem>
    </>
  );
};

// @ts-ignore
Members.getLayout = function getLayout(page: NextPage) {
  return <CourseLayout>{page}</CourseLayout>;
};

interface CourseMemberWithUser extends CourseMember {
  user: User;
}

export const getServerSideProps = async (context: any) => {
  // TODD: check if the user belongs to the course
  const courseData = await prisma.course.findUnique({
    where: {
      slug: context.params.slug,
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
              profileImageUrl: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const { members: membersData, ...course } = courseData;
  const members = membersData?.map(
    (member: CourseMemberWithUser) => member.user
  );
  const students = members?.filter((member: User) => member.role === "student");
  const professors = members?.filter(
    (member: User) => member.role === "professor"
  );

  return {
    props: { course, students, professors },
  };
};

export default Members;
