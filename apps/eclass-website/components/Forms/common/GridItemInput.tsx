import { GridItem, FormControl, FormLabel, Input } from "@chakra-ui/react";

const InputContainer = ({
  colSpan,
  children,
}: {
  colSpan?: number | number[];
  children: React.ReactNode;
}) => {
  return colSpan ? (
    <GridItem colSpan={colSpan}>{children}</GridItem>
  ) : (
    <>{children}</>
  );
};

interface GridItemInputProps {
  colSpan?: number | number[];
  label?: string;
  defaultValue?: string;
  name: string;
  type?: string;
  isRequired?: boolean;
}
export const GridItemInput = ({
  colSpan,
  label,
  defaultValue,
  name,
  type,
  isRequired = true,
  ...props
}: GridItemInputProps) => (
  <InputContainer colSpan={colSpan}>
    <FormControl isRequired={isRequired} {...props}>
      <FormLabel>{label}</FormLabel>
      <Input defaultValue={defaultValue} name={name} type={type} />
    </FormControl>
  </InputContainer>
);
