import { FormControl, FormHelperText, InputLabel, MenuItem, Select, type SelectProps } from "@mui/material";
import { useId } from "react";
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";

type TextValueLike = {text: unknown; value: unknown};

function isTextValue(x: unknown): x is TextValueLike {
  return typeof x === "object" && x !== null && "text" in x && "value" in x;
}
type Props<T extends FieldValues, TItem = { text: string; value: string}> = {
    items: TItem[];
    label: string;
    allowEmpty?: boolean;
    emptyLabel?: string;
    getText?: (item: TItem) => string;
    getValue?: (item: TItem) => string | number;
    onChange?: SelectProps['onChange'];
} & UseControllerProps<T> & 
    Omit<SelectProps, "name" | "value" | "label">;

export default function SelectInput<T extends FieldValues, TItem = unknown>(props: Props<T, TItem>) {

    const { disabled, ...controllerProps } = props;

    const {field, fieldState} = useController({...controllerProps});

    const labelId = useId();
    const textOf: (i: TItem) => string =
    props.getText ?? ((i) => (isTextValue(i) ? String((i as TextValueLike).text) : String(i)));

    const valueOf: (i: TItem) => string | number =
    props.getValue ?? ((i) => (isTextValue(i) ? String((i as TextValueLike).value) : String(i)));

    
    return (
        <FormControl 
            fullWidth error={!!fieldState.error}
            variant="outlined"
            disabled={disabled}
            sx={{
                // Hide the notch when the label is NOT shrunk (no selection yet)
                '& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink) + .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline legend':
                {
                    maxWidth: 0,  
                },

                // Restore the notch when the label *is* shrunk (after selection)
                '& .MuiInputLabel-outlined.MuiInputLabel-shrink + .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline legend':
                {
                    maxWidth: '1000px', 
                },
            }}
            >
            <InputLabel>{props.label}</InputLabel>
            <Select
                {...field}
                labelId = {labelId}
                label = {props.label}
                disabled={disabled}
                onChange={(e, child) => {            
                    field.onChange(e.target.value);
                    props.onChange?.(e, child);
                }}
                onBlur={field.onBlur}
                inputRef={field.ref}
                value = {field.value ?? ""}                  
                
                >
                {props.allowEmpty && (
                    <MenuItem value=''>
                        {props.emptyLabel ?? 'None'}
                    </MenuItem>
                )}
                {props.items.map(item => {
                    const val = valueOf(item);
                    return (
                            <MenuItem key={val} value={val}>
                                {textOf(item)}
                            </MenuItem>
                        );
                })}
            </Select>
            <FormHelperText>
                {fieldState.error?.message}
            </FormHelperText>
        </FormControl>
    )
}