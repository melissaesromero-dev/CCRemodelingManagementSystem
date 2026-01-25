
import { DateTimePicker, type DateTimePickerProps } from '@mui/x-date-pickers';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';



type Props<T extends FieldValues> =
  {} & UseControllerProps<T> &
Omit<DateTimePickerProps<false>, 'value' | 'onChange'>;

export default function DateTimeInput<T extends FieldValues>(props: Props<T>) {
  const { name, control, ...pickerProps } = props;
  
  const { field, fieldState } = useController<T>({
    name,
    control,
    });

  const pickerValue =
    field.value && typeof field.value === 'string'
      ? new Date(field.value)
      : null;

  return (
    <DateTimePicker
      {...pickerProps}
      value={pickerValue}
      onChange={(newValue) => {
        if(!newValue) {
          field.onChange('');
          return;
      }

      const date = newValue instanceof Date
        ? newValue
        : new Date(newValue as unknown as string);
    
      field.onChange(date.toISOString());
    }}
      sx={{width: '100%'}}
      slotProps={{
        textField: {
          onBlur: field.onBlur,
          error: !!fieldState.error,
          helperText: fieldState.error?.message
        }
      }}
    />
  );
}