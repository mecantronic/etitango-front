/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { TimePicker } from 'formik-mui-x-date-pickers';
import { makeStyles } from '@mui/styles';
import { Field, useField } from 'formik';

export const ETITimePicker = ({
  
  fieldName,
  setFieldValue,
  textFieldProps,
  specialCase,
  borderColor,
  
}: {
  fieldName: string;
  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  textFieldProps: any;
  specialCase: boolean;
  borderColor: boolean;
}) => {
  
  const [field] = useField(fieldName)
  const useStyles = makeStyles({
    root: {
      '& .MuiFormHelperText-root': {
        width: '110px',
        margin: '2px 0px 0px 2px'
         },   
        '& .MuiFormLabel-root': {
          left: '30%',
          top: '5%'
        },
      '& .MuiOutlinedInput-root': {
        fontFamily: 'inter',
        width: '110px',
        display: 'flex',
        flexDirection: 'row-reverse',
        padding: '2px',
        '& fieldset': {
          borderColor: field.value ? '#E68650' : '#FDE4AA',
          borderRadius: '8px',
          borderWidth: '1.5px',
          pointerEvents: 'none'
        },
        '&:hover fieldset ': {
          borderColor: field.value ? '#E68650' : '#FDE4AA',
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '&.Mui-focused fieldset': {
          borderColor: field.value ? '#E68650' : '#FDE4AA',
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: field.value ? '#E68650' : '#FDE4AA',
        },
        '& .MuiIconButton-root': {
            color: '#A82548', 
          },
          '& .MuiFormHelperText-root': {
            width: '110px'
          }       
      },
    },
  });

  const classes = useStyles();

  const [hora, setHora] = useState()
return (
  <Field
      component={TimePicker}
      disablePast
      textField={{
        ...textFieldProps,
        className: classes.root, // Agregar las clases al DatePicker
      }}
      inputProps={{
        style: {
          fontFamily: 'inter',
        },
      }}
      label={hora}
      name={fieldName}
      inputFormat="00:00"
      onChange={(value:any) => {
        if (value && value.format) {
            const horaComoString = value.format('HH:mm A');
            console.log('hora como string ->', horaComoString);
            setHora(horaComoString.slice(0,-3))
            setFieldValue(fieldName, horaComoString);
          }
      }}
  />
)};
