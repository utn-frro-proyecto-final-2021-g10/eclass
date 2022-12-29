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
  options?: string[] | { value: string; label: string }[];
  isRequired?: boolean;
  mb?: number;
  size?: string;
}
export const GridItemInput = ({
  colSpan,
  label,
  defaultValue,
  name,
  type,
  options,
  isRequired = true,
  size,
  ...props
}: GridItemInputProps) => (
  <InputContainer colSpan={colSpan}>
    <FormControl isRequired={isRequired} {...props}>
      <FormLabel fontSize={size}>{label}</FormLabel>
      {type !== "select" ? (
        <Input
          defaultValue={defaultValue}
          name={name}
          type={type}
          size={size}
        />
      ) : (
        <Select defaultValue={defaultValue} name={name}   size={size}>
          {options?.map((option) => (
            <>
              {typeof option === "string" ? (
                <option key={option} value={option}>
                  {option}
                </option>
              ) : (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )}
            </>
          ))}
        </Select>
      )}
    </FormControl>
  </InputContainer>
);
