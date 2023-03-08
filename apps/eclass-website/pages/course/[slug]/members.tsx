import type { NextPage } from "next";
import { useState, useMemo, useEffect } from "react";
import { CourseLayout } from "../../../layouts/course-layout";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useCurrentCourse } from "../../../hooks/useCurrentCourse";
import type { User, CourseMember } from "@prisma/client";
import { Button, GridItem, HStack, Collapse } from "@chakra-ui/react";
import { MemberList } from "../../../components/pages/course/members/MemberList";
import { EmailIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { Loader } from "../../../components/Loader";

const Members: NextPage<{ courseId: string }> = ({ courseId }) => {
  const me = useCurrentUser();
  const courseData = useCurrentCourse(courseId);

  const { students, professors } = useMemo(() => {
    if (courseData.status === "success") {
      const { members: rawMembers } = courseData.data;
      const members = rawMembers.map((u: CourseMemberWithUser) => u.user);
      const students = members.filter((u: User) => u.role === "student");
      const professors = members.filter((u: User) => u.role === "professor");

      return { students, professors };
    }

    return { students: [], professors: [] };
  }, [courseData]);

  const [selectState, setSelectState] = useState(false);
  const [checkedStudents, setCheckedStudents] = useState({});
  const [checkedProfessors, setCheckedProfessors] = useState({});

  const resetEmailLists = () => {
    setCheckedStudents(
      Object.fromEntries(
        students
          .filter((u: User) => u.id !== me?.id)
          .map((u: User) => [u.email, false])
      )
    );
    setCheckedProfessors(
      Object.fromEntries(
        professors
          .filter((u: User) => u.id !== me?.id)
          .map((u: User) => [u.email, false])
      )
    );
  };

  useEffect(() => {
    resetEmailLists();
  }, []);

  const emailList: string[] = useMemo(() => {
    const list = {
      ...checkedStudents,
      ...checkedProfessors,
    };

    return Object.keys(list).filter(
      (email) => list[email as keyof typeof list]
    );
  }, [checkedStudents, checkedProfessors]);

  if (courseData.status === "loading") {
    return (
      <GridItem colSpan={12}>
        <Loader />
      </GridItem>
    );
  }

  return (
    <>
      <GridItem colSpan={12} display={selectState ? "block" : "none"}>
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
          checkedEmails={checkedProfessors}
          setCheckedEmails={setCheckedProfessors}
          owner={courseData.data.ownerId}
        />
      </GridItem>

      <GridItem colSpan={12}>
        <MemberList
          heading="Alumno"
          pluralHeading="Alumnos"
          users={students}
          selectState={selectState}
          onEnableSelect={() => setSelectState(true)}
          checkedEmails={checkedStudents}
          setCheckedEmails={setCheckedStudents}
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
  return {
    props: { courseId: context.params.slug },
  };
};

export default Members;
