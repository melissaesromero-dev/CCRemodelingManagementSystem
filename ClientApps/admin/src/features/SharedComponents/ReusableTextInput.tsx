
import { TextField, type TextFieldProps } from '@mui/material';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';



type RHFTextFieldProps<T extends FieldValues> =
  UseControllerProps<T> &
  Omit<TextFieldProps, "name" | "defaultValue" | "onChange" | "value" | "inputRef">;

export default function TextInput<T extends FieldValues>({
  name,
  control,
  rules,
  ...textFieldProps
}: RHFTextFieldProps<T>) {
  const { field, fieldState } = useController<T>({ name, control, rules });

  return (
    <TextField
      {...textFieldProps}
      {...field}
      value={field.value ?? ''}
      fullWidth
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  );
}