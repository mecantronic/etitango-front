/* eslint-disable prettier/prettier */
import { Box, Button, Chip, Grid, Modal, Typography, useMediaQuery, Theme, CircularProgress } from "@mui/material";
import { Field, Form, Formik } from 'formik';
import { createOrUpdateDoc } from "helpers/firestore";
import { useContext, useEffect, useState } from "react";
import { EtiEvent } from "shared/etiEvent";
import { date, object, string } from 'yup';
import { UserContext } from "helpers/UserContext";
import { isSuperAdmin } from "helpers/firestore/users";
import { TextField } from 'formik-mui';
import { makeStyles } from '@mui/styles';
import { UserFullData } from "shared/User";
import * as firestoreUserHelper from 'helpers/firestore/users';
import RolesNewEvent from "modules/superAdmin/roles/RolesNewEvent";
import { EtiLocationPicker } from "components/form/EtiLocationPicker";
import { ETITimePicker } from "components/form/EtiTimePicker";
import { ETIDatePicker } from "components/form/DatePicker";
import { assignEventAdmin, unassignEventAdmins } from "helpers/firestore/users";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { TextFieldForm } from "components/form/TextFieldForm";
import { useGlobalState } from "helpers/UserPanelContext";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AddButton } from "components/button/AddButton";
import { styles } from "modules/superAdmin/events/EventForm.styles";

interface Admin {
  name: string;
  email: string;
}
export default function ETIEventDate({ selectedEvent, changeEvent }: { selectedEvent: EtiEvent | null, changeEvent: Function }) {
  // const [showAdmins, setShowAdmins] = useState(false)
  const idEvent = selectedEvent?.id
  const {isMobile} = useGlobalState()
  
  const [event, setEvent] = useState<EtiEvent>();
  const [showSuccessImage, setShowSuccessImage] = useState(false);
  const { user } = useContext(UserContext)
  const userIsSuperAdmin = isSuperAdmin(user)
  const isMedium = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const [enable, setEnable] = useState(false)
  const alertText: string = 'Este campo no puede estar vacío';
  const EventFormSchema = object({
    dateEnd: date().required(alertText),
    dateSignupOpen: date().required(alertText),
    dateStart: date().required(alertText),
    location: string().required(alertText),
    name: string().required(alertText),
    country: string().nullable(true).required(alertText),
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
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<UserFullData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminsToDelete, setAdminsToDelete] = useState<string[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = (values: string[] | null) => {
    setOpen(false)
    if (values && values.length > 0) {
      setAdmins((prevAdmins: any) => {
        const uniqueNewAdmins = values.filter((newAdmin: any) => !prevAdmins.some((admin: any) => admin.email === newAdmin.email));
        const combinedAdmins = [...prevAdmins, ...uniqueNewAdmins];
        const uniqueAdmins = combinedAdmins.filter((admin: any, index, self) => self.findIndex((a: any) => a.email === admin.email) === index);
        return uniqueAdmins;
      });
      // setShowAdmins(false)
    }
  };
  useEffect(() => {
    setIsLoading(true);

    let unsubscribe: Function;
    let usuarios2: Function;

    const fetchData = async () => {
      unsubscribe = await firestoreUserHelper.getAdmins(setUsers, setIsLoading, idEvent);
      // usuarios2 = await firestoreUserHelper.getAllUsers(setUsuarios, setIsLoading)
    };

    fetchData().catch((error) => {
      console.error(error);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      } if (usuarios2) {
        usuarios2()
      }
    };
  }, []);

  useEffect(() => {
    if (selectedEvent && selectedEvent.admins && users.length > 0) {
      const adminsArray: {id: string; name: string; email: string }[] = [];
      selectedEvent.admins.forEach((element: string) => {
        users.forEach((user: any) => {
          if (element === user.id) {
            adminsArray.push({
              id: user.id,
              name: `${user.nameFirst} ${user.nameLast}`,
              email: user.email,
            })
          }
        });
      });    
      setAdmins(adminsArray)
    }
  }, [selectedEvent]);


  const handleDelete = (email: string) => {
    try {
      setAdminsToDelete((prevAdminsToDelete) => [...prevAdminsToDelete, email]);
      setAdmins((currentAdmins) => currentAdmins.filter((admin: any) => admin.email !== email));
    } catch (error) {
      console.error('Error al borrar administrador:', error);
    } finally {
      // setLoading(false);
    }
  };


  const handleEditDataEvent = async (values: any) => {
    try {
      if (enable === false) {
        setEnable(true)
        changeEvent(true)
      } else {
        if (idEvent) {
          const selectedEmails = admins.map((admin: any) => admin.email);
          // if (selectedEmails.length === 0) {
          //   if (admins.length === 0) {
          //     setShowAdmins(true)
          //     throw new Error('Tienes que seleccionar al menos un admin.');
          //   }
          // }
          await createOrUpdateDoc('events', values, idEvent === 'new' ? undefined : idEvent);
          const emailsToDelete = adminsToDelete.filter((email) => !selectedEmails.includes(email));
          await unassignEventAdmins(emailsToDelete, idEvent);

          await assignEventAdmin(selectedEmails, idEvent);
          // setShowAdmins(false)
          setEnable(false)
          changeEvent(false)
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const styleModal = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#FAFAFA',
    border: '1px solid #000',
    boxShadow: 24,
    borderRadius: 6,
    p: 4,
    overflow: 'auto',
    width: '900px',
    height: '500px',
  };

  const useStyles = makeStyles({
    root: {
      '& .MuiFormHelperText-root': {
        margin: '2px 0px 0px 2px'
      },
      '& .MuiOutlinedInput-root': {
        fontFamily: 'inter',
        padding: '12px 16px 12px 16px',
        height: '42px',
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
        padding: '12px 16px 12px 16px',
        height: '42px',
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
    <>
      <Formik
        enableReinitialize
        initialValues={{
          dateEnd: selectedEvent?.dateEnd || '',
          dateSignupOpen: selectedEvent?.dateSignupOpen || '',
          dateStart: selectedEvent?.dateStart || '',
          name: selectedEvent?.name || '',
          // country: selectedEvent?.country || '',
          province: selectedEvent?.province || '',
          city: selectedEvent?.city || '',
          admins: selectedEvent?.admins || '',
          timeStart: selectedEvent?.timeStart || '',
          timeEnd: selectedEvent?.timeEnd || '',
          timeSignupOpen: selectedEvent?.timeSignupOpen || '',
          // timeSignupEnd: selectedEvent?.timeSignupEnd || '',
        }}
        validationSchema={EventFormSchema}
        onSubmit={async (values) => {
          await handleEditDataEvent(values);
        }}
      >
        {({ setFieldValue, touched, errors, values, isSubmitting }) => (
          <Form>
            <Box sx={{ display: {xs: 'none', md:'flex'}, justifyContent: 'space-between', alignItems: 'center',  padding: '24px 0px 24px 0px', margin: '0px 20px 0px 20px' }}>
              <Typography sx={{fontWeight: 600, fontSize: '24px', }}>Información general</Typography>
              <Box sx={{ display: 'flex', mr: 1, alignItems: 'center' }}>
                {userIsSuperAdmin ? <>
                  {!enable && !isMobile && (
                    <Typography sx={{ fontWeight: 600, fontSize: '24px', color: '#0075D9', mr: 1 }}>{selectedEvent?.name}</Typography>
                  )}
                  {enable && !isMobile && (
                      <Field
                        name="name"
                        placeholder={selectedEvent?.name}
                        component={TextField}
                        required
                        fullWidth
                        classes={{ root: values.name ? classes.filled : classes.root }}
                      />
                  )}
                  <Button onClick={() => handleEditDataEvent(values)}>
                   {!enable && !isMobile ? <BorderColorIcon sx={{ color: '#E68650'}}></BorderColorIcon> : <CheckCircleIcon sx={{ width: '38px', height: '38px', color: '#91F18B'}}/>}
                  </Button>
                </> : <Typography sx={{ fontWeight: 600, fontSize: '24px', color: '#0075D9', mr: 1 }}>{selectedEvent?.name}</Typography>}
              </Box>
            </Box>
            <Box sx={{ margin: '0px 20px 0px 20px', backgroundColor: '#FAFAFA', borderRadius: '12px 12px 0px 0px', p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                  sx={{display: {xs: 'flex', md: 'none'}}}>
                     <TextFieldForm
                        fieldName='name'
                        placeHolder={'selectedEvent?.name'} 
                        isDisabled={!enable} 
                      />
                  </Box>


                  <EtiLocationPicker
                    values={values}
                    errors={errors}
                    // t={undefined}
                    setFieldValue={setFieldValue}
                    touched={touched}
                    location={event}
                   // borderColor={false}
                   // specialCase={true}
                    colorFont={'#0075D9'}
                    // fontFamily={'Inter'}
                    // fontWeight={400}
                    isDisabled={!enable}
                  />
                </Grid>

                {!isMobile ? 
                <Grid item md={12} sm={12} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item md={6} sm={4} xs={4} lg={4} >
                      <Typography style={{ fontFamily: 'roboto', color: '#0075D9' }}>
                        Desde
                      </Typography>
                      <Grid sx={{  display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', border: {md: 'none', lg: '1px solid #E68650'}, alignItems: 'center',  borderRadius: 2 }}>
                        <Box sx={{ pr: {md: '5px', lg: 0}}}>
                          <ETIDatePicker
                            textFieldProps={{ fullWidth: true }}
                            fieldName="dateStart"
                            setFieldValue={setFieldValue}
                            borderColor={isMedium ? true : false}
                         
                          //  isDisabled={!enable}
                          />
                        </Box>

                        <Box sx={{ display: {md:'flex', lg: 'inherit'}, justifyContent: {md: 'center', lg: 'inherit'}, width: {md:'30%', lg: 'inherit'}}}>
                          <Typography style={{ fontFamily: 'roboto', color: '#0075D9', fontSize: '16px', width: 'max-content' }}>a las</Typography>
                        </Box>
                        
                     <Box >
                      <ETITimePicker 
                            value={values['timeStart']}
                            onChange={(value: any) => setFieldValue('timeStart', value)}
                            borderColor={isMedium ? true : false}
                           // isDisabled={!enable}
                            // showBorders={false}
                          />
                       
                     </Box>
                          
                      </Grid>
                    </Grid>
                     

                    <Grid item md={6} sm={4} xs={4} lg={4}>
                      <Typography style={{ fontFamily: 'roboto', color: '#0075D9' }}>
                        Hasta
                      </Typography>

                      <Box sx={{  display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly',border: {md: 'none', lg: '1px solid #E68650'}, alignItems: 'center', borderRadius: 2 }}>
                        <Box>
                          <ETIDatePicker
                            textFieldProps={{ fullWidth: true }}
                            fieldName="dateEnd"
                            setFieldValue={setFieldValue}
                            borderColor={isMedium ? true : false}
                            
                           // isDisabled={!enable}
                          />
                        </Box>
                        <Box sx={{ display: {md:'flex', lg: 'inherit'}, justifyContent: {md: 'center', lg: 'inherit'}, width: {md:'30%', lg: 'inherit'}}}>
                          <Typography style={{ fontFamily: 'roboto', color: '#0075D9', fontSize: '16px', width: 'max-content' }}>a las</Typography>
                        </Box>
                        <Box >
                          <ETITimePicker 
                            value={values['timeEnd']}
                            onChange={(value: any) => setFieldValue('timeEnd', value)}
                            borderColor={isMedium ? true : false}
                           // isDisabled={!enable}
                           // showBorders={false}
                          />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item md={6} sm={4} xs={4} lg={4} >
                      <Typography style={{ fontFamily: 'roboto', color: '#0075D9' }}>
                        Inscripciones
                      </Typography>

                      <Box sx={{  display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', border: {md: 'none', lg: '1px solid #E68650'}, alignItems: 'center',  borderRadius: 2 }}>
                        <Box>
                          <ETIDatePicker
                            textFieldProps={{ fullWidth: true }}
                            fieldName="dateSignupOpen"
                            setFieldValue={setFieldValue}
                            borderColor={isMedium ? true : false}
                            
                            // isDisabled={!enable}
                          />
                        </Box>
                        <Box sx={{ display: {md:'flex', lg: 'inherit'}, justifyContent: {md: 'center', lg: 'inherit'}, width: {md:'30%', lg: 'inherit'}}}>
                          <Typography style={{ fontFamily: 'roboto', color: '#0075D9', fontSize: '16px', width: 'max-content' }}>a las</Typography>
                        </Box>
                        <Box>
                          <ETITimePicker 
                            value={values['timeSignupOpen']}
                            onChange={(value: any) => setFieldValue('timeSignupOpen', value)}
                            borderColor={isMedium ? true : false}
                            // isDisabled={!enable}
                            // showBorders={false}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                : <>
                
                <Box sx={{borderBottom: '1px solid #BDBDBD', width: '100%', ml: 2, mt: 2}}></Box> 
                <Grid item md={12} sm={12} xs={12}>
                   <Grid container spacing={2}>
                   <Grid item md={12} sm={12} xs={12}>
                               
                                <Grid container spacing={3} alignItems={'flex-start'}>
                                  <Grid item xs={6} sm={6} md={4} lg={2.5}>
                                    <ETIDatePicker
                                      textFieldProps={{ fullWidth: true }}
                                      fieldName="dateStart"
                                      setFieldValue={setFieldValue}
                                      borderColor={true}
                                    />
                                  </Grid>
                                
                                  <Grid item xs={6} sm={6} md={3}>
                                    <ETITimePicker
                                      value={values['timeStart']}
                                      onChange={(value: any) => setFieldValue('timeStart', value)}
                                      error={touched['timeStart'] && !!errors['timeStart']}
                                      helperText={touched['timeStart'] && errors['timeStart']}
                                      borderColor={true}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>

                              <Grid item md={12} sm={12} xs={12}>
                              
                                <Grid container spacing={3}>
                                  <Grid item xs={6} sm={6} md={4} lg={2.5}>
                                    <ETIDatePicker
                                      textFieldProps={{ fullWidth: true }}
                                      fieldName="dateEnd"
                                      setFieldValue={setFieldValue}
                                      borderColor={true}
                                    />
                                  </Grid>
                                 
                                  <Grid item xs={6} sm={6} md={3}>
                                    <ETITimePicker
                                      value={values['timeEnd']}
                                      onChange={(value: any) => setFieldValue('timeEnd', value)}
                                      error={touched['timeEnd'] && !!errors['timeEnd']}
                                      helperText={touched['timeEnd'] && errors['timeEnd']}
                                      borderColor={true}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>

                              <Grid item lg={4.8} md={12} sm={12} xs={12}>
                                
                                <Grid container spacing={3} alignItems={'flex-start'}>
                                  <Grid item xs={6} sm={6} md={4} lg={6}>
                                    <ETIDatePicker
                                      textFieldProps={{ fullWidth: true }}
                                      fieldName="dateSignupOpen"
                                      setFieldValue={setFieldValue}
                                      borderColor={true}
                                    />
                                  </Grid>
                               
                                  <Grid item xs={6} sm={6} md={3} lg={2}>
                                    <ETITimePicker
                                      value={values['timeSignupOpen']}
                                      onChange={(value: any) =>
                                        setFieldValue('timeSignupOpen', value)
                                      }
                                      error={
                                        touched['timeSignupOpen'] && !!errors['timeSignupOpen']
                                      }
                                      helperText={
                                        touched['timeSignupOpen'] && errors['timeSignupOpen']
                                      }
                                      borderColor={true}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                              </Grid>
                        
                        </Grid>  

                        <Box sx={{borderBottom: '1px solid #BDBDBD', width: '100%', ml: 2, mt: 2}}></Box>         
                        </>
                }


                <Grid item md={12} sm={12} xs={12}>
                  <Grid container gap={2} sx={{ border: '1.5px solid #E68650', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', minHeight: { xs: '75px', md: '48px' } }}>
                    {admins.length === 0 ? (
                        <Typography variant="body2" color="text.disabled" sx={{ fontWeight: 500, p: 2 }}>
                          En este evento no se han añadido administradores.
                        </Typography>
                      ) : (
                        admins.map((admin: any, index) => (
                          <Chip key={index} label={admin.name} {...(enable ? { onDelete: () => handleDelete(admin.email) } : {})} variant="outlined" sx={{ m: 1, borderRadius: '8px', color: '#A82548', fontFamily: 'Roboto', fontWeight: 500, fontSize: '14px' }} />
                        ))
                      )}
                    </Box>
                    {enable && !isMobile &&
                      
                        <AddButton onClick={handleOpen}></AddButton>
                      
                    }
                  </Grid>
                  <Modal open={open} onClose={() => handleClose([])}>
                    <Box sx={{ ...styles.modalStyle }}>
                      <RolesNewEvent handleClose={handleClose} selectedRows={admins}/>
                    </Box>
                  </Modal>
                  {enable && <Grid
                                    item
                                    xs={12}
                                    sx={{
                                      display: { xs: 'flex', md: 'none' },
                                      justifyContent: 'flex-end',
                                      mt: 2
                                    }}
                                  >
                                    <AddButton onClick={handleOpen}></AddButton>
                                  </Grid>}
                </Grid>
              </Grid>

              

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
                  {isMobile ?  <Button onClick={() => handleEditDataEvent(values)}>
                        {!enable  ? <BorderColorIcon sx={{ color: '#E68650'}}></BorderColorIcon> : <CheckCircleIcon sx={{ width: '38px', height: '38px', color: '#91F18B'}}/>}
                        </Button>
                      :
                        <Button type='submit' disabled={isSubmitting} sx={{ width: '115px', padding: '12px, 32px, 12px, 32px', borderRadius: '25px', backgroundColor: '#A82548', height: '44px', '&:hover': { backgroundColor: '#A82548' } }}>
                          {isLoading ? <CircularProgress sx={{ color: '#ffffff' }} size={30} /> : <><Typography sx={{ color: '#FAFAFA', fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}>{showSuccessImage ? 'Guardado' : 'Guardar'}</Typography>{showSuccessImage && <img src={'/img/icon/Vector.svg'} height={15} width={15} style={{ marginLeft: '10px' }} />}</>}
                        </Button>}
                        
              </Box>
              <Box sx={{display: {xs: 'flex', md: 'none'}, borderBottom: '1px solid #BDBDBD', width: '100%', mt: 2}}></Box> 
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}