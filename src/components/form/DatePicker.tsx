import React from 'react';
import { DatePicker } from 'formik-mui-x-date-pickers';
import { Field, useField } from 'formik';
import { Typography } from '@mui/material';
import { useGlobalState } from 'helpers/UserPanelContext';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import theme from 'theme';

export const ETIDatePicker = ({
  fieldName,
  setFieldValue,
  textFieldProps,
  borderColor,
  isDisabled
}: {
  fieldName: string;
  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  textFieldProps: any;
  isDisabled: boolean;
  borderColor: boolean;
}) => {
  const { isMobile } = useGlobalState();
  const [field] = useField(fieldName);
  const { t } = useTranslation(SCOPES.MODULES.ETI, { useSuspense: false });

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      fontFamily: 'roboto',
      display: 'flex',
      flexDirection: 'row-reverse',
      padding: '2px',
      '& fieldset': {
        borderColor: borderColor
          ? field.value
            ? 'details.perseanOrange'
            : 'details.peach'
          : 'transparent',
        borderRadius: '8px',
        borderWidth: '1.5px',
        pointerEvents: 'none'
      },
      '&:hover fieldset ': {
        borderColor: borderColor
          ? field.value
            ? 'details.perseanOrange'
            : 'details.peach'
          : 'transparent',
        borderRadius: '8px',
        pointerEvents: 'none'
      },
      '&.Mui-focused fieldset': {
        borderColor: borderColor
          ? field.value
            ? 'details.perseanOrange'
            : 'details.peach'
          : 'transparent',
        borderRadius: '8px',
        pointerEvents: 'none'
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: borderColor ? `1px solid ${theme.palette.details.perseanOrange}` : 'none'
      },
      '& .MuiIconButton-root': {
        color: 'principal.secondary'
      }
    }
  };

  const containerStyle = {
    width: '100%'
  };
  return (
    <div style={containerStyle}>
      <Field
        component={DatePicker}
        disabled={isDisabled}
        label={
          isMobile ? (
            <Typography typography={'label.mobilePicker'} sx={{ color: 'greyScale.800' }}>
              {fieldName === 'dateStart'
                ? t('label.dateStart')
                : fieldName === 'dateEnd'
                ? t('label.dateEnd')
                : fieldName === 'dateSignupOpen'
                ? t('label.dateSignupOpen')
                : t('label.dateEnd')}
            </Typography>
          ) : null
        }
        textField={{
          ...textFieldProps,
          sx: inputStyle,
          InputLabelProps: { shrink: true },
          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
            e.preventDefault();
          }
        }}
        name={fieldName}
        inputFormat="DD-MM-YYYY"
        mask="__-__-____"
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
