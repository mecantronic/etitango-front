import { Grid, TextField as TextFieldMUI, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import { getProvinces, getCities } from 'helpers/thirdParties/georef';
import { FormikValues, useField } from 'formik';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import { SCOPES } from 'helpers/constants/i18n';
import { useTranslation } from 'react-i18next';
import { useGlobalState } from 'helpers/UserPanelContext';

export const EtiLocationPicker = ({
  values,
  touched,
  errors,
  location,
  setFieldValue,
  colorFont,
  isDisabled
}: {
  values: FormikValues;
  touched: any;
  errors: any;
  colorFont: string;
  isDisabled: boolean;
  setFieldValue: any;
  location?: { country: string; province?: string; city?: string };
}) => {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const { t } = useTranslation(SCOPES.COMMON.FORM, { useSuspense: false });
  const { isMobile } = useGlobalState();

  useEffect(() => {
    const getFormData = async () => {
      const provinces = (await getProvinces()) as string[];
      setProvinces(provinces);
      location?.province && handleProvinceChange(location.province);
    };
    getFormData().catch((error) => console.error(error));
  }, []);

  const handleProvinceChange = async (value: string | null, userControlled?: boolean) => {
    if (value) {
      const cities = await getCities(value);
      setCities(cities);
      location?.city && setFieldValue('city', location.city);
    } else {
      setCities([]);
    }
    setFieldValue('province', value);
    if (userControlled) {
      setFieldValue('city', null);
    }
  };

  const [field] = useField('province' && 'city');
  const inputStyle = {
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
      },
      '& .MuiIconButton-root': {
        color: 'principal.secondary'
      }
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item md={6} sm={6} xs={6}>
        {!isMobile ? (
          <Typography typography={{ md: 'label.desktop' }} style={{ color: colorFont }}>
            {t('province')}
          </Typography>
        ) : null}
        <Autocomplete
          disablePortal
          fullWidth
          disabled={isDisabled}
          options={provinces}
          getOptionLabel={(option) => option}
          onChange={(_, value) => handleProvinceChange(value, true)}
          value={values?.province || null}
          defaultValue={location?.province}
          renderInput={(params) => (
            <TextFieldMUI
              {...params}
              name="province"
              error={touched['province'] && !!errors['province']}
              helperText={touched['province'] && errors['province']}
              variant="outlined"
              placeholder={t('province')}
              label={
                isMobile ? (
                  <Typography typography={'label.mobilePicker'} sx={{ color: 'greyScale.800' }}>
                    {t('province')}
                  </Typography>
                ) : null
              }
              InputProps={{
                ...params.InputProps,
                startAdornment: <FmdGoodOutlinedIcon sx={{ color: 'principal.secondary' }} />
              }}
              sx={{
                ...inputStyle,
                mt: { xs: 2, md: 0 }
              }}
            />
          )}
        />
      </Grid>
      <Grid item md={6} sm={6} xs={6}>
        {!isMobile ? (
          <Typography typography={{ md: 'label.desktop' }} style={{ color: colorFont }}>
            {t('city')}
          </Typography>
        ) : null}
        <Autocomplete
          disablePortal
          fullWidth
          disabled={isDisabled}
          options={cities}
          getOptionLabel={(option) => option}
          onChange={(_, value) => setFieldValue('city', value)}
          value={values?.city || null}
          defaultValue={location?.city}
          renderInput={(params) => (
            <TextFieldMUI
              {...params}
              name="city"
              error={touched['city'] && !!errors['city']}
              helperText={touched['city'] && errors['city']}
              variant="outlined"
              placeholder={t('city')}
              label={
                isMobile ? (
                  <Typography typography={'label.mobilePicker'} sx={{ color: 'greyScale.800' }}>
                    {t('city')}
                  </Typography>
                ) : null
              }
              InputProps={{
                ...params.InputProps,
                startAdornment: <FmdGoodOutlinedIcon sx={{ color: 'principal.secondary' }} />
              }}
              sx={{
                ...inputStyle,
                mt: { xs: 2, md: 0 }
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};
