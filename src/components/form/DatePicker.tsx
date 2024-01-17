/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { makeStyles } from '@mui/styles';
import { Field } from 'formik';
import { IconButton } from '@mui/material';
import EventIcon from '@mui/icons-material/Event'; // Importa el icono de calendario
import { DatePicker } from 'formik-mui-x-date-pickers';
import { styled } from '@mui/material/styles';

const CustomSVGIcon = () => (
  <img src="/img/icon/calendar-add.svg" alt="Custom Icon" width="24" height="24" /> // Usar la ruta a tu SVG externo
);

//Styles

const StyledStaticDatePicker = styled(StaticDatePicker)({
  '.MuiPickersToolbar-root': {
    color: '#ad1457',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: '#e91e63',
    border: '0px solid',
    backgroundColor: '#f8bbd0'
  }
});

// const useStyles = makeStyles({
//   root: {
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: '#E68650',
//         borderRadius: '8px',
//         borderWidth: '2px'
//       },
//       '&:hover fieldset ': {
//         borderColor: '#E68650',
//         borderRadius: '8px',
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#E68650',
//         borderRadius: '8px',
//       },
//       '& .MuiIconButton-root': { // Estilos para el icono del DatePicker
//         color: '#A82548', // Cambiar el color del icono aquí

//       //}
//       }
//     }

//   },
// });

export const ETIDatePicker = ({
  fieldName,
  setFieldValue,
  textFieldProps,
  specialCase,
  borderColor
}: {
  fieldName: string;
  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  textFieldProps: any;
  specialCase: boolean;
  borderColor: boolean;
}) => {
  const [showStaticPicker, setShowStaticDatePicker] = useState(false);

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
          borderColor: specialCase ? 'transparent' : borderColor ? 'transparent' : 'transparent',
          borderRadius: '8px',
          borderWidth: '1.5px',
          pointerEvents: 'none'
        },
        '&:hover fieldset ': {
          borderColor: specialCase ? 'transparent' : borderColor ? 'transparent' : 'transparent',
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '&.Mui-focused fieldset': {
          borderColor: specialCase ? 'transparent' : borderColor ? 'transparent' : 'transparent',
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: specialCase ? 'transparent' : borderColor ? 'transparent' : 'transparent'
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
      <IconButton onClick={() => setShowStaticDatePicker(true)}>
        <EventIcon />
      </IconButton>

      {/* git pus{showStaticPicker && <StaticDatePicker onClose={() => setShowStaticDatePicker(false)} />} */}

      <Field
        component={StaticDatePicker}
        disablePast
        textField={{
          ...textFieldProps,
          className: classes.root // Agregar las clases al StaticDatePicker
        }}
        inputProps={{
          style: {
            fontFamily: 'inter'
          }
        }}
        name={fieldName}
        inputFormat="DD-MM-YYYY"
        onChange={(value: any) => setFieldValue(fieldName, value.toDate())}
      />
    </div>
  );
};
