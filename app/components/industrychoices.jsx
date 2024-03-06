
"use client"
import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Controller } from "react-hook-form";

const ReactHookFormSelect = ({
  name,
  label,
  control,
  defaultValue,
  children,
  ...props
}) => {
  const labelId = `${name}-label`;
  return (
    <FormControl {...props} fullWidth className='my-4'>
      <InputLabel id={labelId}>{label}</InputLabel>
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
  );
};
export default ReactHookFormSelect;