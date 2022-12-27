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
import { Novelty } from "@prisma/client";
import { GridContainer } from "../GridContainer";

interface NoveltiesProps {
  novelties: Novelty[];
}

export const Novelties = ({ novelties }: NoveltiesProps) => (
  <GridContainer>
    <GridItem colSpan={[0, 1, 1, 1]} />
    <GridItem colSpan={[12, 10, 10, 10]}>
      <Grid gap={5} w="100%">
        <GridItem colSpan={12}>
          <Text fontSize="2xl" fontWeight="bold">
            Editar noticias
          </Text>
        </GridItem>
        <GridItem colSpan={12}>
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Título</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {novelties &&
                  novelties.map((novelty: any, i: number) => (
                    <Tr key={i}>
                      <Td>{novelty.title}</Td>
                      <Td>
                        <Link
                          colorScheme="teal"
                          href={`/admin/novelties/${novelty.id}`}
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
