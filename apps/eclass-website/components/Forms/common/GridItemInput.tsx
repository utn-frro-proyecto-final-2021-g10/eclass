import {
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { Fragment } from "react";

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
  placeholder?: string;
  isRequired?: boolean;
  mb?: number;
  size?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}
export const GridItemInput = ({
  colSpan,
  label,
  defaultValue,
  name,
  type,
  options,
  placeholder,
  isRequired = true,
  size,
  disabled,
  min,
  max,
  ...props
}: GridItemInputProps) => (
  <InputContainer colSpan={colSpan}>
    <FormControl isRequired={isRequired} {...props}>
      {label && <FormLabel fontSize={size}>{label}</FormLabel>}
      {type !== "select" ? (
        <Input
          defaultValue={defaultValue}
          name={name}
          type={type}
          size={size}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
        />
      ) : (
        <Select
          defaultValue={defaultValue}
          name={name}
          textTransform="capitalize"
          size={size}
          disabled={disabled}
        >
          {options?.map((option, i) => (
            <Fragment key={i}>
              {typeof option === "string" ? (
                <option value={option}>{option}</option>
              ) : (
                <option value={option.value}>{option.label}</option>
              )}
            </Fragment>
          ))}
        </Select>
      )}
    </FormControl>
  </InputContainer>
);
