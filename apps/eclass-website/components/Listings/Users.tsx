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
import { User } from "@prisma/client";
import { GridContainer } from "../GridContainer";

interface UsersProps {
  users: User[];
}

export const Users = ({ users }: UsersProps) => (
  <GridContainer>
    <GridItem colSpan={[0, 1, 1, 1]} />
    <GridItem colSpan={[12, 10, 10, 10]}>
      <Grid gap={5} w="100%">
        <GridItem colSpan={12}>
          <Text fontSize="2xl" fontWeight="bold">
            Editar Usuarios
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
                {users &&
                  users.map((user: any, i: number) => (
                    <Tr key={i}>
                      <Td>
                        {user.firstName} {user.lastName}
                      </Td>
                      <Td>
                        <Link
                          colorScheme="teal"
                          href={`/admin/users/${user.id}`}
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
  </GridContainer>
);
