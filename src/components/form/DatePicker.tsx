/* eslint-disable prettier/prettier */
import React from 'react';
import { DatePicker } from 'formik-mui-x-date-pickers';
import { makeStyles } from '@mui/styles';
import { Field, useField } from 'formik';
import { format } from 'date-fns';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import EventIcon from '@mui/icons-material/Event'; 
import { Typography } from '@mui/material';

interface Localization {
  title: {
    [key: string]: string;
  };
}

const l10n: Localization = {
  title: { en: 'title', es: 'título' }
};

export const ETIDatePicker = ({
  fieldName,
  setFieldValue,
  textFieldProps,
  specialCase,
  borderColor,
  isMobile,
  textOfLabel,
}: {
  fieldName: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  textFieldProps: any;
  specialCase: boolean;
  borderColor: boolean;
  isMobile: boolean;
  textOfLabel: string;
}) => {
  const [field] = useField(fieldName);
  const useStyles = makeStyles({
    root: {
      '& .MuiFormHelperText-root': {
        width: '165px',
        margin: '2px 0px 0px 2px'
      },
      '& .MuiOutlinedInput-root': {
        fontFamily: 'inter',
        width: '165px',
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
          borderColor: field.value ? '#E68650' : '#FDE4AA'
        },
        '& .MuiIconButton-root': {
          color: '#A82548'
        }
      }
    }
  });

  const classes = useStyles();
  
  return (
    <div>
      <Field
        component={DatePicker}
        disablePast
        textField={{
          ...textFieldProps,
          className: classes.root,
          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
            e.preventDefault();
          }
        }}
        inputProps={{
          style: {
            fontFamily: 'inter'
          },
        }}
        label={isMobile ? (
          <Typography sx={{ fontSize: {xs: '12px', lg: '16px'}, fontWeight: {xs: '700', lg: '600'} }}>{textOfLabel}</Typography>
        ) : undefined}
        name={fieldName}
        value={isMobile ? (field.value || format(new Date(), 'dd/MM/yyyy')) : field.value}
        onChange={(value: any) => {
          if (value && value.toDate) {
            setFieldValue(fieldName, value.toDate());
          } else {
            setFieldValue(fieldName, null);
          }
        }}
      />
    </div>
  );
};
