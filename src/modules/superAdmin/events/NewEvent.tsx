/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useContext, useState } from 'react';
import { Button, CircularProgress, Grid, Box, Typography, Modal, Chip, Icon } from '@mui/material';
import WithAuthentication from '../../withAuthentication';
import { Translation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { date, object, string } from 'yup';
import { createOrUpdateDoc } from 'helpers/firestore';
import { ROUTES } from '../../../App.js';
import { EtiEvent } from '../../../shared/etiEvent';
import { UserRoles } from '../../../shared/User';
import { ETIDatePicker } from '../../../components/form/DatePicker';
import RolesNewEvent from '../roles/RolesNewEvent';
import { LocationPicker } from 'components/form/LocationPicker';
import { makeStyles } from '@mui/styles';
import ETITimePicker2 from 'components/ETITimePicker2';
import { assignEventAdmins } from '../../../helpers/firestore/users';
import { UserContext } from 'helpers/UserContext'; 
import { useGlobalState } from 'helpers/UserPanelContext';

const AddButton = ({ onClick, isMobile }) => (
  <Button
    sx={{
      padding: '12px, 16px, 12px, 16px',
      alignItems: 'flex-end',
      width: isMobile ? '134px' : 'auto',
      height: isMobile ? '40px' : 'auto',
      borderRadius: isMobile ? '12px' : 'auto',
      color: isMobile ? '#FFFFFF' : '#A82548',
      backgroundColor: isMobile ? '#5FB4FC' : 'transparent',
      display: 'flex',
      justifyContent: 'center'
      
    }}
    onClick={onClick}
  >
    <Icon sx={{ display: 'flex', width: '4em', mr: '-8px' }}>
      <Typography sx={{ mr: isMobile ? 1 : 0, color: isMobile ? '#FFFFFF' : '#A82548', fontFamily: 'Roboto', fontWeight: 500 }}>
        Agregar
      </Typography>
      <img src={ isMobile ? '/img/icon/user-cirlce-add-white.svg' : '/img/icon/user-cirlce-add.svg'} height={25} width={25}/>
    </Icon>
  </Button>
);

export default function NewEvent(props: { etiEventId: string, onChange: Function }) {
  
  const { isMobile } = useGlobalState();
  const { etiEventId, onChange } = props
  const alertText: string = 'Este campo no puede estar vacío';
  const EventFormSchema = object({
    dateStart: date().nullable().transform((originalValue) => { const parsedDate = new Date(originalValue); return isNaN(parsedDate.getTime()) ? undefined : parsedDate; }).required(alertText),
    dateEnd: date().nullable().when('dateStart', (dateStart, schema) => (dateStart && schema.min(dateStart, "No puede ser anterior a la fecha de inicio"))).required(alertText),
    dateSignupOpen: date().nullable().when('dateStart', (dateStart, schema) => {
      if (dateStart) {
        const dateStartEqual = new Date(dateStart.getTime() - 1);
        return schema.max(dateStartEqual, "No puede ser igual o posterior a la fecha de inicio");
      }
      return schema;
    }).required(alertText),
    dateSignupEnd: date()
      .nullable()
      .when('dateStart', (dateStart, schema) => {
        if (dateStart) {
          const dateStartEqual = new Date(dateStart.getTime() - 1);
          return schema.max(dateStartEqual, "No puede ser igual o posterior a la fecha de inicio");
        }
        return schema;
      })
      .when('dateSignupOpen', (dateSignuopOpen, schema) => (dateSignuopOpen && schema.min(dateSignuopOpen, "No puede ser anterior a la fecha de inscripcion")))
      .required(alertText),
    timeStart: string().required(alertText),
    timeEnd: string().required(alertText),
    timeSignupOpen: string().required(alertText),
    timeSignupEnd: string().required(alertText),
    name: string().required(alertText),
    // country: string().nullable(true).required(alertText),
    province: string()
      .nullable(true)
      .when('country', {
        is: 'Argentina',
        then: string().nullable(true).required(alertText)
      }),
    city: string()
      .nullable(true)
      .when('country', {
        is: 'Argentina',
        then: string().nullable(true).required(alertText)
      }),
  });
  const [event, setEvent] = useState<EtiEvent>();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [idNuevo, setIdNuevo] = useState('');
  const [enable, setEnable] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [admins, setAdmins] = useState<string[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = (values: string[] | null) => {
    setOpen(false)
    if (values && values.length > 0) {
      setAdmins((prevAdmins) => {
        const uniqueNewAdmins = values.filter((newAdmin: any) => !prevAdmins.some((admin: any) => admin.email === newAdmin.email));
        const combinedAdmins = [...prevAdmins, ...uniqueNewAdmins];
        const uniqueAdmins = combinedAdmins.filter((admin: any, index, self) => self.findIndex((a: any) => a.email === admin.email) === index);
        return uniqueAdmins;
      });
    }
  };

  const handleDelete = (email: string) => {
    try {
      setAdmins((currentAdmins) => currentAdmins.filter((admin: any) => admin.email !== email));
    } catch (error) {
      console.error('Error al borrar administrador:', error);
    }
  };

  const handleCreateEvent = async (values: any, setSubmitting: Function) => {
    try {
      setIsLoading(true)
      if (etiEventId) {
        const selectedEmails = admins.map((admin: any) => admin.email);
        const validateRuote: RegExp = /^[a-zA-Z0-9]{20,}$/;
        const idV: boolean = validateRuote.test(etiEventId);
        const idEvento = await createOrUpdateDoc('events', values, etiEventId === 'new' ? undefined : idV);
        await assignEventAdmins(selectedEmails, idEvento);
        setIdNuevo(idEvento);
        setEnable(true)
        onChange(idEvento)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error);
      setEnable(false)
      setIsLoading(false)
      setSubmitting(false);
    }
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#FAFAFA',
    border: '1px solid #000',
    boxShadow: 24,
    borderRadius: 6,
    padding: isMobile ? '24px 16px 24px 16px' : '32px',
    overflow: 'auto',
    width: '900px',
    height: '500px',
  };

  const scrollbarStyles = {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#C0E5FF',
      borderRadius: '12px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
      boxShadow: '1px 0px 2px 0px #6695B7',
      borderRadius: '12px',
    },
  };

  const useStyles = makeStyles({
    root: {
      '& .MuiFormHelperText-root': {
        margin: isMobile ? '0' : '2px 0px 0px 2px'
      },
      '& .MuiOutlinedInput-root': {
        fontFamily: 'inter',
        '& fieldset': {
          borderRadius: '8px',
          borderWidth: '1.5px',
          pointerEvents: 'none'
        },
        '&:hover fieldset ': {
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '&.Mui-focused fieldset': {
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#FDE4AA',
        }
      },
    },
    filled: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#E68650',
        },
        '&:hover fieldset ': {
          borderColor: '#E68650',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#E68650',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E68650',
        }
      },
    },
  });

  const classes = useStyles()


  return (
    <Translation
      ns={[SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP, SCOPES.MODULES.PROFILE]}
      useSuspense={false}
    >
      {(t) => (
        <>
          <WithAuthentication
            roles={[UserRoles.SUPER_ADMIN]}
            redirectUrl={`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`}
          />
          {loading ? (
            <CircularProgress />
          ) : (
            <Box sx={{ 
              display:'flex', 
              flexDirection: 'column', 
              boxShadow: {xs: '', md: 3, lg: 3}, 
              width: { 
                xs: 380,
                sm: '100%',
                md: '100%',
                lg: 960, 
              },
             
              borderRadius: '12px', 
              overflow: 'auto', 
              backgroundColor: '#FFFFFF',
               
              }}>
                
              <Box sx={{ color: { xs: '#4B84DB', md: '#FFFFFF' }, backgroundColor: { xs: '', md: '#4B84DB' }, padding: {xs: '3px 24px 12px 3px', sm: '12px 24px 12px 24px'}, fontWeight: 600, fontSize: '24px', lineHeight: '16px', fontFamily: 'Montserrat', height: '40px' }}>
                Nuevo ETI
              </Box>

              <Box sx={{ display: 'flex', ...scrollbarStyles }}>
                <Grid container>
                  <Grid item xs={12}>
                    <Formik
                      enableReinitialize
                      initialValues={{
                        dateEnd: event?.dateEnd || '',
                        dateSignupOpen: event?.dateSignupOpen || '',
                        dateStart: event?.dateStart || '',
                        dateSignupEnd: event?.dateSignupEnd || '',
                        timeStart: event?.timeStart || '',
                        timeEnd: event?.timeEnd || '',
                        timeSignupOpen: event?.timeSignupOpen || '',
                        timeSignupEnd: event?.timeSignupEnd || '',
                        location: event?.location || null,
                        name: event?.name || '',
                        combos: event?.combos || ['Dos Milongas', 'Asamblea Etiana', 'Comida de despedida'],
                        admins: event?.admins || []
                      }}
                      validationSchema={EventFormSchema}
                      onSubmit={async (values, { setSubmitting }) => {
                        await handleCreateEvent(values, setSubmitting);
                      }}
                    >
                      {({ setFieldValue, touched, errors, values, isSubmitting }) => (
                        <Form>
                          <Box sx={{ margin: {sm: '20px', xs: 0}, backgroundColor: {xs: '#FFFFFF', sm: '#FAFAFA'}, borderRadius: '12px', p: 2 }}>

                            <Grid container gap={2}>
                              <Typography sx={{ color: '#212121', fontWeight: {xs: 600, md: 500, lg: 500}, fontSize: {xs: '12px', md: '16px', lg: '16px'}, mb: {xs: '-12px', md: ''} }}>Nombre para el evento</Typography>
                              <Grid item md={12} sm={12} xs={12}>
                                <Field
                                  name="name"
                                  placeholder="Nuevo ETI"
                                  component={TextField}
                                  required
                                  fullWidth
                                  classes={{ root: values.name ? classes.filled : classes.root }}
                                />
                              </Grid>

                              <Grid item md={12} sm={12} xs={12} >
                                <LocationPicker
                                  values={values}
                                  errors={errors}
                                  t={t}
                                  setFieldValue={setFieldValue}
                                  touched={touched}
                                  location={event}
                                  borderColor={enable}
                                  specialCase={false}
                                  colorFont={'#424242'}
                                  fontFamily={'Montserrat'}
                                  // fontWeight={500}
                                  fontWeight = {{xs: '600', md: '500', lg: '500'}}
                                  fontSize= {{xs: '12px', md: '16px', lg: '16px'}}
                                  isDisabled={false}
                                />
                              </Grid>

                              <Grid item md={12} sm={12} xs={12} sx={{mt: {xs: 2, sm: 2, md: 0}}}>
                              <Typography sx={{ color: '#424242', fontWeight: 500, display: {xs: 'none', md: 'flex' } }}>Desde el</Typography>
                                <Grid container alignItems={'flex-start'}>
                                  <Grid item sx={{mr: {xs: 0, sm: '19px'}}}>
                                    <ETIDatePicker
                                        textFieldProps={{ fullWidth: true }}
                                        fieldName="dateStart"
                                        setFieldValue={setFieldValue}
                                        borderColor={enable}
                                        specialCase={false}
                                        isMobile={isMobile} 
                                        textOfLabel={'Desde el'}                                    
                                    />
                                  </Grid>
                                  <Typography sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500, display: {xs: 'none', md: 'flex' }}}>a las</Typography>
                                  <Grid item >
                                  <Grid item sx={{ml: {xs: '13px', sm: 3, md: 0}}}>
                                    <ETITimePicker2
                                      value={values['timeStart']}
                                      onChange={(value) => setFieldValue('timeStart', value)}
                                      isDisabled={false}
                                      error={touched['timeStart'] && !!errors['timeStart']}
                                      helperText={touched['timeStart'] && errors['timeStart']}
                                      isMobile={isMobile}
                                    />
                                  </Grid>
                                  </Grid>
                                    
                                </Grid>
                              </Grid>

                              <Grid item md={12} sm={12} xs={12} sx={{mt: {xs: 2, sm: 2, md: 0}}}>
                              <Typography sx={{ color: '#424242', fontWeight: 500, display: {xs: 'none', md: 'flex' } }}>Hasta el</Typography>
                                <Grid container alignItems={'flex-start'}>
                                  <Grid item sx={{mr: {xs: 0, sm: '19px'}}}>
                                    <ETIDatePicker
                                      textFieldProps={{ fullWidth: true }}
                                      fieldName="dateEnd"
                                      setFieldValue={setFieldValue}
                                      borderColor={enable}
                                      specialCase={false}
                                      isMobile={isMobile}
                                      textOfLabel={'Hasta el'} 
                                    />
                                  </Grid>
                                  <Typography sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500, display: {xs: 'none', md: 'flex' }}}>a las</Typography>
                                  <Grid item >
                                    <Grid item sx={{ml: {xs: '13px', sm: 3, md: 0}}}>
                                      <ETITimePicker2
                                        value={values['timeEnd']}
                                        onChange={(value) => setFieldValue('timeEnd', value)}
                                        isDisabled={false}
                                        error={touched['timeEnd'] && !!errors['timeEnd']}
                                        helperText={touched['timeEnd'] && errors['timeEnd']}
                                        isMobile={isMobile}
                                      />
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>

                              <Grid item md={12} sm={12} xs={12} sx={{mt: {xs: 2, sm: 2, md: 0}}}>
                                <Typography sx={{ color: '#424242', fontWeight: 500, display: {xs: 'none', md: 'flex'}}}>Inicio de inscripciones</Typography>
                                <Grid container alignItems={'flex-start'}>
                                  <Grid item sx={{mr: {xs: 0, sm: '19px'}}}>
                                    <ETIDatePicker
                                      textFieldProps={{ fullWidth: true }}
                                      fieldName="dateSignupOpen"
                                      setFieldValue={setFieldValue}
                                      borderColor={enable}
                                      specialCase={false}
                                      isMobile={isMobile}
                                      textOfLabel={'Inicio de inscripciones'} 
                                    />
                                  </Grid>
                                  <Typography sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500, display: {xs: 'none', md: 'flex' } }}>a las</Typography>
                                  <Grid item >
                                    <Grid item sx={{ml: {xs: '13px', sm: 3, md: 0}}}>
                                      <ETITimePicker2
                                        value={values['timeSignupOpen']}
                                        onChange={(value) => setFieldValue('timeSignupOpen', value)}
                                        isDisabled={false}
                                        error={touched['timeSignupOpen'] && !!errors['timeSignupOpen']}
                                        helperText={touched['timeSignupOpen'] && errors['timeSignupOpen']}
                                        isMobile={isMobile}
                                      />
                                    </Grid>
                                  </Grid>
                                  <Typography sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500, display: {xs: 'none', md: 'flex' }}}>hasta el</Typography>
                                  <Grid item sx={{mt: {xs: 4, sm: 4, md: 0}, display: {xs: 'none', sm: 'none', md: 'flex'}}}>
                                    <ETIDatePicker
                                      textFieldProps={{ fullWidth: true }}
                                      fieldName="dateSignupEnd"
                                      setFieldValue={setFieldValue}
                                      borderColor={enable}
                                      specialCase={false}
                                      isMobile={isMobile}
                                      textOfLabel={''} 
                                    />
                                  </Grid>
                                  <Typography sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500, display: {xs: 'none', md: 'flex' }}}>hasta las</Typography>
                                  <Grid item sx={{mt: {xs: 4, sm: 4, md: 0}, display: {xs: 'none', sm: 'none', md: 'flex'}}}>
                                    <Grid item sx={{ml: {xs: 2, sm: 3, md: 0}}}>
                                      <ETITimePicker2
                                        value={values['timeSignupEnd']}
                                        onChange={(value) => setFieldValue('timeSignupEnd', value)}
                                        isDisabled={false}
                                        error={touched['timeSignupEnd'] && !!errors['timeSignupEnd']}
                                        helperText={touched['timeSignupEnd'] && errors['timeSignupEnd']}
                                        isMobile={isMobile}
                                      />
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>

                              <Grid item xs={12} sx={{mt:{ xs: 1, md: 0}}}>
                                <Grid container gap={2}>
                                  <Typography sx={{ color: '##424242', fontWeight: 500, display: {xs: 'none', md: 'display'}}}>Colaboradores en la organización del evento</Typography>
                                  <Grid item xs={12} sx={{ border: admins.length ? '1.5px solid #E68650' : '1.5px solid #FDE4AA', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', height: {xs: '75px', md: '48px'} }}>
                                      {admins.length ? (<>
                                        {admins.map((admin: any, index) => (
                                          <Chip key={index} label={admin.name} onDelete={() => handleDelete(admin.email)} variant="outlined" sx={{ m: 1, borderRadius: '8px', color: '#A82548', fontFamily: 'Roboto', fontWeight: 500, fontSize: '14px' }} />
                                        ))}



                                      </>) : <Typography sx={{ display: 'flex', alignItems: {xs: 'none', md: 'center'}, ml: 1, color: {xs: '#212121', md: '#9E9E9E'}, fontFamily: 'Roboto', fontSize: {xs: '12px', md: '16px', lg: '16px'}, fontWeight: {xs: 500, lg: 400, md: 400} }}> Organizadores </Typography>}
                                    </Box>
                                    <Grid item sx={{display: {xs: 'none', md: 'flex'}}}>
                                      <AddButton onClick={handleOpen} isMobile={isMobile}/>
                                    </Grid>
                                  </Grid>
                                  <Box sx={{display: {xs:'flex', md: 'none'},justifyContent: 'flex-end', width: '100%'}}>
                                    <AddButton onClick={handleOpen} isMobile={isMobile}/>
                                  </Box>
                                </Grid>
                                  <Modal open={open} onClose={() => handleClose([])} >
                                    <Box sx={{ ...style, display: 'flex', flexDirection: 'column',width: {xs: '390px', md: '920px'} }}>
                                      <RolesNewEvent isMobile={isMobile} handleClose={handleClose} selectedRows={admins} />
                                    </Box>
                                  </Modal>
                              </Grid>
                            </Grid>
                          </Box>
                        
                           {isMobile && <Box sx={{border:'1px solid #E0E0E0', margin: '18px 18px 0px 18px'}}></Box>}

                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
                            <Button type='submit' disabled={isSubmitting} sx={{ width: {md: '115px', xs: '100%'}, padding: '12px, 32px, 12px, 32px', borderRadius: '25px', backgroundColor: '#A82548', height: '44px', '&:hover': { backgroundColor: '#A82548' } }}>
                              {isLoading ? <CircularProgress sx={{ color: '#ffffff' }} size={30} /> : <Typography sx={{ color: '#FAFAFA', fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}>Crear</Typography>}
                            </Button>
                          </Box>
                        </Form>
                      )}
                    </Formik>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </>
      )}
    </Translation>
  );
}
