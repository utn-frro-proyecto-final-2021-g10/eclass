import {
  Button,
  Grid,
  GridItem,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  TableContainer,
  Link,
} from "@chakra-ui/react";
import { Course } from "@prisma/client";
import { GridContainer } from "../GridContainer";

interface CoursesProps {
  courses: Course[];
}

export const Courses = ({ courses }: CoursesProps) => (
  <GridContainer>
    <GridItem colSpan={[0, 1, 1, 1]} />
    {courses?.length > 0 && (
      <GridItem colSpan={[12, 10, 10, 10]}>
        <Grid gap={5} w="100%">
          <GridItem colSpan={12}>
            <Text fontSize="2xl" fontWeight="bold">
              Editar Cursos
            </Text>
          </GridItem>
          <GridItem colSpan={12}>
            <TableContainer>
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th>Nombre</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {courses &&
                    courses.map((course: any, i: number) => (
                      <Tr key={i}>
                        <Td>{course.name}</Td>
                        <Td>
                          <Link
                            colorScheme="teal"
                            href={`/admin/courses/${course.id}`}
                          >
                            <Button
                              colorScheme="teal"
                              size="sm"
                              variant="outline"
                            >
                              Editar
                            </Button>
                          </Link>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          </GridItem>
        </Grid>
      </GridItem>
    )}
  </GridContainer>
);
