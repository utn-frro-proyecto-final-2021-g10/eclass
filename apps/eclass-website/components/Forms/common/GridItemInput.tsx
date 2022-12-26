import {
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";

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
  options?: string[];
  isRequired?: boolean;
  mb?: number;
}
export const GridItemInput = ({
  colSpan,
  label,
  defaultValue,
  name,
  type,
  options,
  isRequired = true,
  ...props
}: GridItemInputProps) => (
  <InputContainer colSpan={colSpan}>
    <FormControl isRequired={isRequired} {...props}>
      <FormLabel>{label}</FormLabel>
      {type !== "select" ? (
        <Input defaultValue={defaultValue} name={name} type={type} />
      ) : (
        <Select defaultValue={defaultValue} name={name}>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      )}
    </FormControl>
  </InputContainer>
);
