/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from 'react';
import { Button, Grid, Box, Typography, CircularProgress } from '@mui/material';
import { Form, Formik } from 'formik';
import { mixed, object, string } from 'yup';
import { createOrUpdateDoc } from 'helpers/firestore';
import { EtiEvent } from '../../../shared/etiEvent';
// import ETIAgenda from 'components/ETIAgenda.jsx';
// import ETIAlojamiento from 'components/ETIAlojamiento.jsx';
// import ETIDataBanks from 'components/ETIDataBanks.jsx';
// import ETIMercadoPago from 'components/ETIMercadoPago.jsx';
// import ETICombos from 'components/ETICombo';
// import ETIEventDate from 'components/ETIEventDates';
import { useGlobalState } from 'helpers/UserPanelContext';
import ETIEventDate from 'components/events/ETIEventDate';
// import { ETIPortada } from 'components/ETIPortada';

export default function EditEvent({ selectedEvent, setChangeEvent2, changeEvent2, setChangeEvent3 }: { selectedEvent: EtiEvent | null, setChangeEvent2: Function, changeEvent2: boolean, setChangeEvent3: Function }) {

  const { isMobile } = useGlobalState();

  const alertText: string = 'Este campo no puede estar vacío';
  const alerText2: string = 'Tienes cambios que no seran guardados.'
  const alerText3: string = 'Completa todos los campos.'
  const EventFormSchema = object().shape({
    firstPay: string().required(alertText),
    firstDatePay: mixed()
      .when('firstPay', {
        is: (firstPay: any) => firstPay && firstPay.trim().length > 0,
        then: mixed()
          .transform((originalValue) => (originalValue ? new Date(originalValue) : originalValue))
          .nullable(true)
          .required(alertText)
          .test({
            name: 'is-valid-date',
            test: (value) => !value || (value instanceof Date && !isNaN(value.getTime())),
            message: alertText,
          }),
        otherwise: mixed().nullable(true),
      }),
    firstTimePay: string()
      .when(['firstPay', 'firstDatePay'], {
        is: (firstPay: any, firstDatePay: any) => (firstPay && firstPay.trim().length > 0) || (firstDatePay && firstDatePay !== null),
        then: string().required(alertText),
        otherwise: string().nullable(true),
      }),
    secondPay: string(),
    secondDatePay: mixed()
      .transform((originalValue) => {
        return originalValue ? new Date(originalValue) : originalValue;
      })
      .nullable(true)
      .test({
        name: 'is-valid-date',
        test: (value) => {
          return !value || (value instanceof Date && !isNaN(value.getTime()));
        },
        message: alertText,
      }),
    secondTimePay: string(),
    refundDeadline: mixed()
      .transform((originalValue) => {
        return originalValue ? new Date(originalValue) : originalValue;
      })
      .nullable(true)
      .test({
        name: 'is-valid-date',
        test: (value) => {
          return !value || (value instanceof Date && !isNaN(value.getTime()));
        },
        message: alertText,
      }),
    timeRefundDeadline: string(),
    limitParticipants: string(),
  });
  const idEvent = selectedEvent?.id
  const [eventImage, setEventImage] = useState('')
  const [alojamientoData, setAlojamientoData] = useState([null]);
  const [dataBanks, setDataBanks] = useState([null])
  const [dataMP, setDataMP] = useState([null])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessImage, setShowSuccessImage] = useState(false);
  const [isEditingAlojamiento, setIsEditingAlojamiento] = useState(true);
  const [isEditingDataBanks, setIsEditingDataBanks] = useState(true);
  const [isEditingDataMP, setIsEditingDataMP] = useState(true);
  const [updateAgenda, setUpdateAgenda] = useState(null);
  const [productValues, setProductValues] = useState([null])




  const updateAlojamientoData = (newData: any) => {
    setAlojamientoData(newData);
  };

  const updateDataBanks = (newData: any) => {
    setDataBanks(newData);
  }

  const updateDataMP = (newData: any) => {
    setDataMP(newData);
  }

  useEffect(() => {
  }, [selectedEvent])

  const handleCreateEvent = async (values: any, setSubmitting: Function) => {
    try {
      setIsLoading(true)
      if (!changeEvent2) {
        // if (alojamientoData && alojamientoData.length > 0) {
        //   const alojamientoIsValid = alojamientoData.every(
        //     (alojamiento) => alojamiento?.establecimiento && alojamiento?.direccion
        //   );

        //   if (alojamientoIsValid) {
        //     values.alojamiento = alojamientoData;
        //   } else {
        //     alert(alerText3);
        //     setIsLoading(false);
        //     return;
        //   }
        // }

        // if (dataBanks && dataBanks.length > 0) {
        //   const databanksIsValid = dataBanks.every(
        //     (databanks) => databanks?.nombre && databanks?.alias && databanks?.cbu
        //   );

        //   if (databanksIsValid) {
        //     values.datosBancarios = dataBanks;
        //   } else {
        //     alert(alerText3);
        //     setIsLoading(false);
        //     return;
        //   }
        // }

        // if (dataMP && dataMP.length == 1) {
        //   const dataMPIsValid = dataMP.every(
        //     (dataMp) => dataMp?.link
        //   )
        //   if (dataMPIsValid) {
        //     values.linkMercadoPago = dataMP;
        //   } else {
        //     alert(alerText3);
        //     setIsLoading(false)
        //     return;
        //   }
        // }

        if (productValues && productValues.length > 0) {
          values.combos = productValues;
        }

        if (!isEditingAlojamiento || !isEditingDataBanks || !isEditingDataMP) {
          alert(alerText2)
          setIsLoading(false);
          return;
        }
        if (eventImage) {
          values.imageUrl = eventImage;
        }

        if (updateAgenda) {
          await createOrUpdateDoc('events', { Agenda: updateAgenda }, idEvent);
        }

        setTimeout(async () => {
          await createOrUpdateDoc('events', values, idEvent === 'new' ? undefined : idEvent);
          setChangeEvent3(true);
          setIsLoading(false);

          setShowSuccessImage(true);

          setTimeout(() => {
            setShowSuccessImage(false);
          }, 4500);
        }, 2350);
      } else {
        alert(alerText2)
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false)
      setSubmitting(false);
    }
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

  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    if (isMobile) {
      setStep(step + 1);
      console.log('hola');

    }
  }

  const buttonText = step === 1 ? 'Comenzar' : step === 2 ? 'Siguiente' : 'Siguiente';

  return (
    <>
      {isMobile ? (
        <>
          {step === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto', boxShadow: 3, borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
              <Box sx={{ display: 'flex', ...scrollbarStyles, flexDirection: 'column' }}>
                <Box sx={{ width: '100%' }}>
                  <ETIEventDate selectedEvent={selectedEvent} changeEvent={setChangeEvent2} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
                  <Button
                    onClick={() => handleNextStep()}
                    sx={{
                      width: '115px',
                      padding: '12px, 32px, 12px, 32px',
                      borderRadius: '25px',
                      backgroundColor: '#A82548',
                      height: '44px',
                      '&:hover': { backgroundColor: '#A82548' },
                    }}
                  >
                    {buttonText}
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {step === 2 && (
            <>
              <Box sx={{ border: '1px solid #E0E0E0', marginLeft: '20px', marginRight: '20px' }}></Box>
              <Grid container>
                <Formik
                  enableReinitialize
                  initialValues={{
                    firstPay: selectedEvent?.firstPay || undefined,
                    firstDatePay: selectedEvent?.firstDatePay || null,
                    firstTimePay: selectedEvent?.firstTimePay || undefined,
                    secondPay: selectedEvent?.secondPay || undefined,
                    secondDatePay: selectedEvent?.secondDatePay || null,
                    secondTimePay: selectedEvent?.secondTimePay || undefined,
                    refundDeadline: selectedEvent?.refundDeadline || null,
                    timeRefundDeadline: selectedEvent?.timeRefundDeadline || undefined,
                    limitParticipants: selectedEvent?.limitParticipants || undefined,
                    host: selectedEvent?.host || null,
                    bankData: selectedEvent?.bankData || null,
                    mercadoPagoLink: selectedEvent?.mercadoPagoLink || null
                  }}
                  validationSchema={EventFormSchema}
                  onSubmit={async (values, { setSubmitting }) => {

                    await handleCreateEvent(values, setSubmitting)
                  }}
                >
                  {({ setFieldValue, values, errors, isSubmitting, touched }) => (
                    <Form>
                      <Box sx={{ margin: '0px 20px 0px 20px', backgroundColor: '#FAFAFA', borderRadius: '0px 0px 12px 12px', p: 2 }}>
                        <Grid container spacing={2}>
                          {/* <Grid item md={12} sm={12} xs={12}>
                            <ETIAgenda idEvent={idEvent} eventData={selectedEvent} updateDataAgenda={setUpdateAgenda} />
                          </Grid>

                          <Grid item md={12} sm={12} xs={12}>
                            <ETIAlojamiento idEvent={idEvent} event={selectedEvent} updateAlojamientoData={updateAlojamientoData} isEditingRows={setIsEditingAlojamiento} />
                          </Grid>

                          <Grid item md={12} sm={12} xs={12}>
                            <ETIDataBanks idEvent={idEvent} event={selectedEvent} dataBanks={updateDataBanks} isEditingRows={setIsEditingDataBanks} />
                          </Grid>

                          <Grid item md={12} sm={12} xs={12}>
                            <ETIMercadoPago idEvent={idEvent} event={selectedEvent} dataMP={updateDataMP} isEditingRows={setIsEditingDataMP} />
                          </Grid> */}

                        </Grid>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
                <Button
                  onClick={() => handleNextStep()}
                  sx={{
                    width: '115px',
                    padding: '12px, 32px, 12px, 32px',
                    borderRadius: '25px',
                    backgroundColor: '#A82548',
                    height: '44px',
                    '&:hover': { backgroundColor: '#A82548' },
                  }}
                >
                  {buttonText}
                </Button>
              </Box>
            </>
          )}

          {step === 3 && (
            <Grid item md={12} sm={12} xs={12} sx={{ margin: '0px 20px 0px 20px', p: 2 }}>
              {/* <Formik
                enableReinitialize
                initialValues={{
                  firstPay: selectedEvent?.firstPay || undefined,
                  firstDatePay: selectedEvent?.firstDatePay || null,
                  firstTimePay: selectedEvent?.firstTimePay || undefined,
                  secondPay: selectedEvent?.secondPay || undefined,
                  secondDatePay: selectedEvent?.secondDatePay || null,
                  secondTimePay: selectedEvent?.secondTimePay || undefined,
                  refundDeadline: selectedEvent?.refundDeadline || null,
                  timeRefundDeadline: selectedEvent?.timeRefundDeadline || undefined,
                  limitParticipants: selectedEvent?.limitParticipants || undefined,
                  alojamiento: selectedEvent?.alojamiento || null,
                  datosBancarios: selectedEvent?.datosBancarios || null,
                  linkMercadoPago: selectedEvent?.linkMercadoPago || null
                }}
                validationSchema={EventFormSchema}
                onSubmit={async (values, { setSubmitting }) => {

                  await handleCreateEvent(values, setSubmitting)
                }}
              >
                {({ setFieldValue, values, errors, isSubmitting, touched }) => (
                 
                )}
              </Formik> */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
                    <Button
                      onClick={() => handleNextStep()}
                      sx={{
                        width: '115px',
                        padding: '12px, 32px, 12px, 32px',
                        borderRadius: '25px',
                        backgroundColor: '#A82548',
                        height: '44px',
                        '&:hover': { backgroundColor: '#A82548' },
                      }}
                    >
                      {buttonText}
                    </Button>
                  </Box>
            </Grid>
          )}

          {step === 4 && (
            <Grid item md={12} sm={12} xs={12} sx={{ margin: '0px 20px 0px 20px', p: 2 }}>
              <Formik
                enableReinitialize
                initialValues={{
                  firstPay: selectedEvent?.firstPay || undefined,
                  firstDatePay: selectedEvent?.firstDatePay || null,
                  firstTimePay: selectedEvent?.firstTimePay || undefined,
                  secondPay: selectedEvent?.secondPay || undefined,
                  secondDatePay: selectedEvent?.secondDatePay || null,
                  secondTimePay: selectedEvent?.secondTimePay || undefined,
                  refundDeadline: selectedEvent?.refundDeadline || null,
                  timeRefundDeadline: selectedEvent?.timeRefundDeadline || undefined,
                  limitParticipants: selectedEvent?.limitParticipants || undefined,
                  host: selectedEvent?.host || null,
                  bankData: selectedEvent?.bankData || null,
                  mercadoPagoLink: selectedEvent?.mercadoPagoLink || null
                }}
                validationSchema={EventFormSchema}
                onSubmit={async (values, { setSubmitting }) => {

                  await handleCreateEvent(values, setSubmitting)
                }}
              >
                {({ setFieldValue, values, errors, isSubmitting, touched }) => (
                  <Form>
                    {/* <ETIPortada selectedEvent={selectedEvent} EventImage={setEventImage} /> */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
                      <Button type='submit' disabled={isSubmitting} sx={{ width: '115px', padding: '12px, 32px, 12px, 32px', borderRadius: '25px', backgroundColor: '#A82548', height: '44px', '&:hover': { backgroundColor: '#A82548' } }}>
                        {isLoading ? <CircularProgress sx={{ color: '#ffffff' }} size={30} /> : <><Typography sx={{ color: '#FAFAFA', fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}>{showSuccessImage ? 'Guardado' : 'Guardar'}</Typography>{showSuccessImage && <img src={'/img/icon/Vector.svg'} height={15} width={15} style={{ marginLeft: '10px' }} />}</>}
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>

            </Grid>
          )}

        </>
      ) : (

        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto', boxShadow: 3, borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', ...scrollbarStyles, flexDirection: 'column' }}>
              <Box sx={{ width: '100%' }}>
                <ETIEventDate selectedEvent={selectedEvent} changeEvent={setChangeEvent2} />
              </Box>
              {/* <Box sx={{ border: '1px solid #E0E0E0', marginLeft: '20px', marginRight: '20px' }}></Box>
              <Grid container >
                <Formik
                  enableReinitialize
                  initialValues={{
                    firstPay: selectedEvent?.firstPay || undefined,
                    firstDatePay: selectedEvent?.firstDatePay || null,
                    firstTimePay: selectedEvent?.firstTimePay || undefined,
                    secondPay: selectedEvent?.secondPay || undefined,
                    secondDatePay: selectedEvent?.secondDatePay || null,
                    secondTimePay: selectedEvent?.secondTimePay || undefined,
                    refundDeadline: selectedEvent?.refundDeadline || null,
                    timeRefundDeadline: selectedEvent?.timeRefundDeadline || undefined,
                    limitParticipants: selectedEvent?.limitParticipants || undefined,
                    alojamiento: selectedEvent?.alojamiento || null,
                    datosBancarios: selectedEvent?.datosBancarios || null,
                    linkMercadoPago: selectedEvent?.linkMercadoPago || null
                  }}
                  validationSchema={EventFormSchema}
                  onSubmit={async (values, { setSubmitting }) => {

                    await handleCreateEvent(values, setSubmitting)
                  }}
                >
                  {({ setFieldValue, values, errors, isSubmitting, touched }) => (
                    <Form>
                      <Box sx={{ margin: '0px 20px 0px 20px', backgroundColor: '#FAFAFA', borderRadius: '0px 0px 12px 12px', p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item md={12} sm={12} xs={12}>
                            <ETIAgenda idEvent={idEvent} eventData={selectedEvent} updateDataAgenda={setUpdateAgenda} />
                          </Grid>

                          <Grid item md={12} sm={12} xs={12}>
                            <ETIAlojamiento idEvent={idEvent} event={selectedEvent} updateAlojamientoData={updateAlojamientoData} isEditingRows={setIsEditingAlojamiento} />
                          </Grid>

                          <Grid item md={12} sm={12} xs={12}>
                            <ETIDataBanks idEvent={idEvent} event={selectedEvent} dataBanks={updateDataBanks} isEditingRows={setIsEditingDataBanks} />
                          </Grid>

                          <Grid item md={12} sm={12} xs={12}>
                            <ETIMercadoPago idEvent={idEvent} event={selectedEvent} dataMP={updateDataMP} isEditingRows={setIsEditingDataMP} />
                          </Grid>

                        </Grid>
                      </Box>
                      <Grid item md={12} sm={12} xs={12} sx={{ margin: '0px 20px 0px 20px', p: 2 }}>
                        <ETICombos setFieldValue={setFieldValue} values={values} selectedEvent={selectedEvent} setComboValues={setProductValues} errors={errors} touched={touched} EventImage={setEventImage} />
                      </Grid>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
                        <Button type='submit' disabled={isSubmitting} sx={{ width: '115px', padding: '12px, 32px, 12px, 32px', borderRadius: '25px', backgroundColor: '#A82548', height: '44px', '&:hover': { backgroundColor: '#A82548' } }}>
                          {isLoading ? <CircularProgress sx={{ color: '#ffffff' }} size={30} /> : <><Typography sx={{ color: '#FAFAFA', fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}>{showSuccessImage ? 'Guardado' : 'Guardar'}</Typography>{showSuccessImage && <img src={'/img/icon/Vector.svg'} height={15} width={15} style={{ marginLeft: '10px' }} />}</>}
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Grid> */}
            </Box>
          </Box>
        </>
      )}
    </>
  );
}