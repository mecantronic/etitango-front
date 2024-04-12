/* eslint-disable prettier/prettier */
import {
  Box,
  Button,
  Chip,
  Grid,
  Modal,
  Typography,
  useMediaQuery,
  Theme,
  CircularProgress
} from '@mui/material';
import { Form, Formik } from 'formik';
import { createOrUpdateDoc } from 'helpers/firestore';
import { useContext, useEffect, useState } from 'react';
import { EtiEvent } from 'shared/etiEvent';
import { date, object, string } from 'yup';
import { UserContext } from 'helpers/UserContext';
import { isSuperAdmin } from 'helpers/firestore/users';
import { UserFullData } from 'shared/User';
import * as firestoreUserHelper from 'helpers/firestore/users';
import RolesNewEvent from 'modules/superAdmin/roles/RolesNewEvent';
import { EtiLocationPicker } from 'components/form/EtiLocationPicker';
import { ETITimePicker } from 'components/form/EtiTimePicker';
import { ETIDatePicker } from 'components/form/DatePicker';
import { assignEventAdmin, unassignEventAdmins } from 'helpers/firestore/users';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { TextFieldForm } from 'components/form/TextFieldForm';
import { useGlobalState } from 'helpers/UserPanelContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AddButton } from 'components/button/AddButton';
import { styles } from 'modules/superAdmin/events/EventForm.styles';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import theme from 'theme';

interface Admin {
  name: string;
  email: string;
}
export default function ETIEventDate({
  selectedEvent,
  changeEvent
}: {
  selectedEvent: EtiEvent | null;
  changeEvent: Function;
}) {
  const idEvent = selectedEvent?.id;
  const { isMobile } = useGlobalState();
  const { t } = useTranslation(SCOPES.MODULES.ETI, { useSuspense: false });
  // eslint-disable-next-line no-unused-vars
  const [event, setEvent] = useState<EtiEvent>();
  const { user } = useContext(UserContext);
  const userIsSuperAdmin = isSuperAdmin(user);
  const isMedium = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const [enable, setEnable] = useState(false);
  const EventFormSchema = object({
    dateEnd: date().required(t('alertText')),
    dateSignupOpen: date().required(t('alertText')),
    dateStart: date().required(t('alertText')),
    location: string().required(t('alertText')),
    name: string().required(t('alertText')),
    country: string().nullable(true).required(t('alertText')),
    province: string()
      .nullable(true)
      .when('country', {
        is: 'Argentina',
        then: string().nullable(true).required(t('alertText'))
      }),
    city: string()
      .nullable(true)
      .when('country', {
        is: 'Argentina',
        then: string().nullable(true).required(t('alertText'))
      })
  });
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<UserFullData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminsToDelete, setAdminsToDelete] = useState<string[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = (values: string[] | null) => {
    setOpen(false);
    if (values && values.length > 0) {
      setAdmins((prevAdmins: any) => {
        const uniqueNewAdmins = values.filter(
          (newAdmin: any) => !prevAdmins.some((admin: any) => admin.email === newAdmin.email)
        );
        const combinedAdmins = [...prevAdmins, ...uniqueNewAdmins];
        const uniqueAdmins = combinedAdmins.filter(
          (admin: any, index, self) => self.findIndex((a: any) => a.email === admin.email) === index
        );
        return uniqueAdmins;
      });
    }
  };
  useEffect(() => {
    setIsLoading(true);

    let unsubscribe: Function;
    let userss: Function;

    const fetchData = async () => {
      unsubscribe = await firestoreUserHelper.getAdmins(setUsers, setIsLoading, idEvent);
    };

    fetchData().catch((error) => {
      alert(error);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (userss) {
        userss();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedEvent && selectedEvent.admins && users.length > 0) {
      const adminsArray: { id: string; name: string; email: string }[] = [];
      selectedEvent.admins.forEach((element: string) => {
        users.forEach((user: any) => {
          if (element === user.id) {
            adminsArray.push({
              id: user.id,
              name: `${user.nameFirst} ${user.nameLast}`,
              email: user.email
            });
          }
        });
      });
      setAdmins(adminsArray);
    }
  }, [selectedEvent]);

  const handleDelete = (email: string) => {
    try {
      setAdminsToDelete((prevAdminsToDelete) => [...prevAdminsToDelete, email]);
      setAdmins((currentAdmins) => currentAdmins.filter((admin: any) => admin.email !== email));
    } catch (error) {
      alert('Error deleting administrator' + error);
    }
  };

  const handleEditDataEvent = async (values: any) => {
    try {
      if (enable === false) {
        setEnable(true);
        changeEvent(true);
      } else {
        if (idEvent) {
          const selectedEmails = admins.map((admin: any) => admin.email);
          await createOrUpdateDoc('events', values, idEvent === 'new' ? undefined : idEvent);
          const emailsToDelete = adminsToDelete.filter((email) => !selectedEmails.includes(email));
          await unassignEventAdmins(emailsToDelete, idEvent);

          await assignEventAdmin(selectedEmails, idEvent);
          setEnable(false);
          changeEvent(false);
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          dateEnd: selectedEvent?.dateEnd || '',
          dateSignupOpen: selectedEvent?.dateSignupOpen || '',
          dateStart: selectedEvent?.dateStart || '',
          name: selectedEvent?.name || '',
          country: selectedEvent?.country || '',
          province: selectedEvent?.province || '',
          city: selectedEvent?.city || '',
          admins: selectedEvent?.admins || '',
          timeStart: selectedEvent?.timeStart || '',
          timeEnd: selectedEvent?.timeEnd || '',
          timeSignupOpen: selectedEvent?.timeSignupOpen || ''
        }}
        validationSchema={EventFormSchema}
        onSubmit={async (values) => {
          await handleEditDataEvent(values);
        }}
      >
        {({ setFieldValue, touched, errors, values, isSubmitting }) => (
          <Form>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px 0px 24px 0px',
                margin: '0px 20px 0px 20px'
              }}
            >
              <Typography typography={'title.semiBold.h4'}>{t('titleInfoGeneral')}</Typography>
              <Box sx={{ display: 'flex', mr: 1, alignItems: 'center' }}>
                {userIsSuperAdmin ? (
                  <>
                    {!enable && !isMobile && (
                      <Typography
                        typography={'title.semiBold.h4'}
                        sx={{
                          color: 'details.frenchBlue',
                          mr: 1
                        }}
                      >
                        {selectedEvent?.name}
                      </Typography>
                    )}
                    {enable && !isMobile && (
                      <TextFieldForm
                        fieldName="name"
                        placeHolder={'selectedEvent?.name'}
                        isDisabled={false}
                      />
                    )}
                    <Button onClick={() => handleEditDataEvent(values)}>
                      {!enable && !isMobile ? (
                        <BorderColorIcon sx={{ color: 'details.perseanOrange' }}></BorderColorIcon>
                      ) : (
                        <CheckCircleIcon
                          sx={{ width: '38px', height: '38px', color: 'status.success' }}
                        />
                      )}
                    </Button>
                  </>
                ) : (
                  <Typography
                    typography={'title.semiBold.h4'}
                    sx={{ color: 'details.frenchBlue', mr: 1 }}
                  >
                    {selectedEvent?.name}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                margin: '0px 20px 0px 20px',
                backgroundColor: 'greyScale.50',
                borderRadius: '12px 12px 0px 0px',
                p: 2
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <TextFieldForm
                      fieldName="name"
                      placeHolder={'selectedEvent?.name'}
                      isDisabled={!enable}
                    />
                  </Box>
                  <EtiLocationPicker
                    values={values}
                    errors={errors}
                    setFieldValue={setFieldValue}
                    touched={touched}
                    location={event}
                    colorFont={theme.palette.details.frenchBlue}
                    isDisabled={!enable}
                  />
                </Grid>

                {!isMobile ? (
                  <Grid item md={12} sm={12} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item md={6} sm={4} xs={4} lg={4}>
                        <Typography
                          typography={'label.desktop'}
                          sx={{ color: 'details.frenchBlue' }}
                        >
                          {t('label.from')}
                        </Typography>
                        <Grid
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            border: {
                              md: 'none',
                              lg: `1px solid ${theme.palette.details.perseanOrange}`
                            },
                            alignItems: 'center',
                            borderRadius: 2
                          }}
                        >
                          <Box sx={{ pr: { md: '5px', lg: 0 } }}>
                            <ETIDatePicker
                              textFieldProps={{ fullWidth: true }}
                              fieldName="dateStart"
                              setFieldValue={setFieldValue}
                              borderColor={isMedium ? true : false}
                              isDisabled={!enable}
                            />
                          </Box>

                          <Box
                            sx={{
                              display: { md: 'flex', lg: 'inherit' },
                              justifyContent: { md: 'center', lg: 'inherit' },
                              width: { md: '30%', lg: 'inherit' }
                            }}
                          >
                            <Typography
                              typography={'label.desktop'}
                              sx={{
                                color: 'details.frenchBlue',
                                width: 'max-content'
                              }}
                            >
                              {t('label.time')}
                            </Typography>
                          </Box>

                          <Box>
                            <ETITimePicker
                              value={values['timeStart']}
                              onChange={(value: any) => setFieldValue('timeStart', value)}
                              borderColor={isMedium ? true : false}
                              isDisabled={!enable}
                            />
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid item md={6} sm={4} xs={4} lg={4}>
                        <Typography
                          typography={'label.desktop'}
                          sx={{ color: 'details.frenchBlue' }}
                        >
                          {t('label.until')}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            border: {
                              md: 'none',
                              lg: `1px solid ${theme.palette.details.perseanOrange}`
                            },
                            alignItems: 'center',
                            borderRadius: 2
                          }}
                        >
                          <Box>
                            <ETIDatePicker
                              textFieldProps={{ fullWidth: true }}
                              fieldName="dateEnd"
                              setFieldValue={setFieldValue}
                              borderColor={isMedium ? true : false}
                              isDisabled={!enable}
                            />
                          </Box>
                          <Box
                            sx={{
                              display: { md: 'flex', lg: 'inherit' },
                              justifyContent: { md: 'center', lg: 'inherit' },
                              width: { md: '30%', lg: 'inherit' }
                            }}
                          >
                            <Typography
                              typography={'label.desktop'}
                              sx={{
                                color: 'details.frenchBlue',
                                width: 'max-content'
                              }}
                            >
                              {t('label.time')}
                            </Typography>
                          </Box>
                          <Box>
                            <ETITimePicker
                              value={values['timeEnd']}
                              onChange={(value: any) => setFieldValue('timeEnd', value)}
                              borderColor={isMedium ? true : false}
                              isDisabled={!enable}
                            />
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item md={6} sm={4} xs={4} lg={4}>
                        <Typography
                          typography={'label.desktop'}
                          sx={{ color: 'details.frenchBlue' }}
                        >
                          {t('label.inscriptions')}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            border: {
                              md: 'none',
                              lg: `1px solid ${theme.palette.details.perseanOrange}`
                            },
                            alignItems: 'center',
                            borderRadius: 2
                          }}
                        >
                          <Box>
                            <ETIDatePicker
                              textFieldProps={{ fullWidth: true }}
                              fieldName="dateSignupOpen"
                              setFieldValue={setFieldValue}
                              borderColor={isMedium ? true : false}
                              isDisabled={!enable}

                              // isDisabled={!enable}
                            />
                          </Box>
                          <Box
                            sx={{
                              display: { md: 'flex', lg: 'inherit' },
                              justifyContent: { md: 'center', lg: 'inherit' },
                              width: { md: '30%', lg: 'inherit' }
                            }}
                          >
                            <Typography
                              typography={'label.desktop'}
                              sx={{
                                color: 'details.frenchBlue',
                                width: 'max-content'
                              }}
                            >
                              {t('label.time')}
                            </Typography>
                          </Box>
                          <Box>
                            <ETITimePicker
                              value={values['timeSignupOpen']}
                              onChange={(value: any) => setFieldValue('timeSignupOpen', value)}
                              borderColor={isMedium ? true : false}
                              isDisabled={!enable}
                            />
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  <>
                    <Box
                      sx={{
                        borderBottom: `1px solid ${theme.palette.greyScale[400]}`,
                        width: '100%',
                        ml: 2,
                        mt: 2
                      }}
                    ></Box>
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
                                isDisabled={!enable}
                              />
                            </Grid>

                            <Grid item xs={6} sm={6} md={3}>
                              <ETITimePicker
                                value={values['timeStart']}
                                onChange={(value: any) => setFieldValue('timeStart', value)}
                                error={touched['timeStart'] && !!errors['timeStart']}
                                helperText={touched['timeStart'] && errors['timeStart']}
                                borderColor={true}
                                isDisabled={!enable}
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
                                isDisabled={!enable}
                              />
                            </Grid>

                            <Grid item xs={6} sm={6} md={3}>
                              <ETITimePicker
                                value={values['timeEnd']}
                                onChange={(value: any) => setFieldValue('timeEnd', value)}
                                error={touched['timeEnd'] && !!errors['timeEnd']}
                                helperText={touched['timeEnd'] && errors['timeEnd']}
                                borderColor={true}
                                isDisabled={!enable}
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
                                isDisabled={!enable}
                              />
                            </Grid>

                            <Grid item xs={6} sm={6} md={3} lg={2}>
                              <ETITimePicker
                                value={values['timeSignupOpen']}
                                onChange={(value: any) => setFieldValue('timeSignupOpen', value)}
                                error={touched['timeSignupOpen'] && !!errors['timeSignupOpen']}
                                helperText={touched['timeSignupOpen'] && errors['timeSignupOpen']}
                                borderColor={true}
                                isDisabled={!enable}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Box
                      sx={{
                        borderBottom: `1px solid ${theme.palette.greyScale[400]}`,
                        width: '100%',
                        ml: 2,
                        mt: 2
                      }}
                    ></Box>
                  </>
                )}

                <Grid item md={12} sm={12} xs={12}>
                  <Grid
                    container
                    gap={2}
                    sx={{
                      border: `1.5px solid ${theme.palette.details.perseanOrange}`,
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        minHeight: { xs: '75px', md: '48px' }
                      }}
                    >
                      {admins.length === 0 ? (
                        <Typography typography={'label.button'} color="text.disabled" sx={{ p: 2 }}>
                          {t('placeholders.noAdmins')}
                        </Typography>
                      ) : (
                        admins.map((admin: any, index) => (
                          <Chip
                            key={index}
                            label={admin.name}
                            {...(enable ? { onDelete: () => handleDelete(admin.email) } : {})}
                            variant="outlined"
                            sx={{
                              ...styles.chipStyles
                            }}
                          />
                        ))
                      )}
                    </Box>
                    {enable && !isMobile && <AddButton onClick={handleOpen}></AddButton>}
                  </Grid>
                  <Modal open={open} onClose={() => handleClose([])}>
                    <Box sx={{ ...styles.modalStyle }}>
                      <RolesNewEvent handleClose={handleClose} selectedRows={admins} />
                    </Box>
                  </Modal>
                  {enable && (
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: { xs: 'flex', md: 'none' },
                        justifyContent: 'flex-end',
                        mt: 2
                      }}
                    >
                      <AddButton onClick={handleOpen}></AddButton>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
                {isMobile ? (
                  <Button onClick={() => handleEditDataEvent(values)}>
                    {!enable ? (
                      <BorderColorIcon sx={{ color: 'details.perseanOrange' }}></BorderColorIcon>
                    ) : (
                      <CheckCircleIcon
                        sx={{ width: '38px', height: '38px', color: 'status.success' }}
                      />
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleEditDataEvent(values)}
                    type="submit"
                    disabled={isSubmitting}
                    sx={{
                      width: '115px',
                      padding: '12px, 32px, 12px, 32px',
                      borderRadius: '25px',
                      backgroundColor: 'principal.secondary',
                      height: '44px',
                      '&:hover': { backgroundColor: 'principal.secondary' }
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress sx={{ color: 'background.white' }} size={30} />
                    ) : (
                      <>
                        <Typography
                          typography={'label.button'}
                          sx={{
                            color: 'greyScale.50'
                          }}
                        >
                          {t('saveButton')}
                        </Typography>
                      </>
                    )}
                  </Button>
                )}
              </Box>
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  borderBottom: `1px solid ${theme.palette.greyScale[400]}`,
                  width: '100%',
                  mt: 2
                }}
              ></Box>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}
