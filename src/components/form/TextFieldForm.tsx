import { Field, useField } from 'formik';
import { TextField } from 'formik-mui';
import { useGlobalState } from 'helpers/UserPanelContext';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';

export const TextFieldForm = ({
  fieldName,
  placeHolder,
  isDisabled
}: {
  fieldName: string;
  placeHolder: string;
  isDisabled: boolean;
}) => {
  const { isMobile } = useGlobalState();
  const [field] = useField(fieldName);
  const { t } = useTranslation(SCOPES.MODULES.ETI, { useSuspense: false });

  return (
    <Field
      component={TextField}
      label={
        isMobile ? (
          <Typography typography={'label.mobilePicker'} sx={{ color: 'greyScale.800' }}>
            {t('label.name')}
          </Typography>
        ) : null
      }
      required
      disabled={isDisabled}
      fullWidth
      placeholder={placeHolder}
      name={fieldName}
      InputLabelProps={{ shrink: true, required: false }}
      sx={{
        '& .MuiOutlinedInput-root': {
          fontFamily: 'roboto',
          '& fieldset': {
            borderColor: field.value ? 'details.perseanOrange' : 'details.peach',
            borderRadius: '8px',
            borderWidth: '1.5px',
            pointerEvents: 'none'
          },
          '&:hover fieldset ': {
            borderColor: field.value ? 'details.perseanOrange' : 'details.peach',
            borderRadius: '8px',
            pointerEvents: 'none'
          },
          '&.Mui-focused fieldset': {
            borderColor: field.value ? 'details.perseanOrange' : 'details.peach',
            borderRadius: '8px',
            pointerEvents: 'none'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: field.value ? 'details.perseanOrange' : 'details.peach'
          }
        }
      }}
    />
  );
};
