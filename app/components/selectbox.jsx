import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { Controller } from "react-hook-form"

export default function SelectComponent({  
    name,
    label,
    control,
    defaultValue,
    children,
    ...props }) {
    const lableIdTxt = name + "-" + label
    return (
        <FormControl {...props} fullWidth className="my-4">
            <InputLabel id={lableIdTxt}>{label}</InputLabel>
            <Controller
                render={({ field }) => (
                    <Select {...field}>
                        {children}
                    </Select>
                )}
                name={name}
                control={control}
                defaultValue={defaultValue}
                rules={{required:true}}
            />
        </FormControl>
    )
}