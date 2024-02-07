/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, Grid, Box, Typography, CircularProgress } from '@mui/material';
import { Form, Formik } from 'formik';
import { mixed, object, string } from 'yup';
import { createOrUpdateDoc } from 'helpers/firestore';
import { EtiEvent } from '../../../shared/etiEvent';
import ETIAgenda from 'components/ETIAgenda.jsx';
import ETIAlojamiento from 'components/ETIAlojamiento.jsx';
import ETIDataBanks from 'components/ETIDataBanks.jsx';
import ETIMercadoPago from 'components/ETIMercadoPago.jsx';
import ETICombos from 'components/ETICombo';
import ETIEventDate from 'components/ETIEventDates';


export default function NewEditEvent({ selectedEvent, setChangeEvent2, changeEvent2, setChangeEvent3 }: { selectedEvent: EtiEvent | null, setChangeEvent2: Function, changeEvent2: boolean, setChangeEvent3: Function }) {

  const alertText: string = 'Este campo no puede estar vacío';
  const alerText2: string = 'Tienes cambios que no seran guardados.'
  const alerText3: string = 'Completa todos los campos.'
  const EventFormSchema = object({
    firstPay: string().required(alertText),
    firstDatePay: mixed()  
    .transform((originalValue) => {
      return originalValue ? new Date(originalValue) : originalValue;
    })
    .nullable(true) 
    .required(alertText)
    .test({
      name: 'is-valid-date',
      test: (value) => {
        
        return !value || (value instanceof Date && !isNaN(value.getTime()));
      },
      message: alertText, 
    }),
    firstTimePay: string().required(alertText),
    secondPay: string().required(alertText),
    secondDatePay: mixed()  
    .transform((originalValue) => {
      return originalValue ? new Date(originalValue) : originalValue;
    })
    .nullable(true)
    .required(alertText)
    .test({
      name: 'is-valid-date',
      test: (value) => {
        return !value || (value instanceof Date && !isNaN(value.getTime()));
      },
      message: alertText, 
    }),
    secondTimePay: string().required(alertText),
    refundDeadline: mixed()  
    .transform((originalValue) => {
      return originalValue ? new Date(originalValue) : originalValue;
    })
    .nullable(true) 
    .required(alertText)
    .test({
      name: 'is-valid-date',
      test: (value) => {
        return !value || (value instanceof Date && !isNaN(value.getTime()));
      },
      message: alertText, 
    }),
    timeRefundDeadline: string().required(alertText),
    limitParticipants: string().required(alertText),
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

  const updateAlojamientoData = (newData:any) => {
    setAlojamientoData(newData);
    console.log('data de alojamiento desde NewEditEvent -> ', alojamientoData);
  };

  const updateDataBanks = (newData:any) => {
    setDataBanks(newData);
    console.log('data bancaria -> ', dataBanks);
  }

  const updateDataMP = (newData:any) => {
    setDataMP(newData);
    console.log('data MP -> ', dataMP);
  }

  useEffect(() => {
  }, [selectedEvent])

  const handleCreateEvent = async (values: any, setSubmitting: Function) => {
    try {
      setIsLoading(true)
      if(!changeEvent2){
        if (alojamientoData && alojamientoData.length > 0) {
          const alojamientoIsValid = alojamientoData.every(
            (alojamiento) => alojamiento?.establecimiento && alojamiento?.direccion
          );
        
          if (alojamientoIsValid) {
            values.alojamiento = alojamientoData;
          } else {
            alert(alerText3);
            setIsLoading(false);
            return;
          }
        }
    
        if (dataBanks && dataBanks.length > 0) {
          const databanksIsValid = dataBanks.every(
            (databanks) => databanks?.nombre && databanks?.alias && databanks?.cbu
          );

          if (databanksIsValid) {
            values.datosBancarios = dataBanks;
          } else {
            alert(alerText3);
            setIsLoading(false);
            return;
          }
        }
    
        if (dataMP && dataMP.length == 1) {
          const dataMPIsValid = dataMP.every(
            (dataMp) => dataMp?.link
          )
          if (dataMPIsValid){
            values.linkMercadoPago = dataMP;
          } else {
            alert(alerText3);
            setIsLoading(false)
            return;
          }
        }

        if (productValues && productValues.length > 0) {
          values.combos = productValues;
        }

       if(!isEditingAlojamiento || !isEditingDataBanks || !isEditingDataMP){
          alert(alerText2)
          setIsLoading(false);
          return;
        }
        if(eventImage){
          values.imageUrl = eventImage;
        }

        if(updateAgenda){
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


  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto', width: '960px', boxShadow: 3, borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', ...scrollbarStyles, flexDirection: 'column' }}>
          <Box sx={{ width: '100%' }}>
            <ETIEventDate selectedEvent={selectedEvent} changeEvent={setChangeEvent2} />
          </Box>
            <Box sx={{border: '1px solid #E0E0E0', marginLeft: '20px', marginRight: '20px'}}></Box>
          <Grid container >
            <Formik
              enableReinitialize
              initialValues={{
                firstPay: selectedEvent?.firstPay || '',
                firstDatePay: selectedEvent?.firstDatePay || null,
                firstTimePay: selectedEvent?.firstTimePay || '',
                secondPay: selectedEvent?.secondPay || '',
                secondDatePay: selectedEvent?.secondDatePay || null,
                secondTimePay: selectedEvent?.secondTimePay || '',
                refundDeadline: selectedEvent?.refundDeadline || null,
                timeRefundDeadline: selectedEvent?.timeRefundDeadline || '',
                limitParticipants: selectedEvent?.limitParticipants || '',
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
                        <ETIAgenda idEvent={idEvent} eventData={selectedEvent}  updateDataAgenda={setUpdateAgenda}/>
                      </Grid>
                      
                      <Grid item md={12} sm={12} xs={12}>
                        <ETIAlojamiento idEvent={idEvent} event={selectedEvent} updateAlojamientoData={updateAlojamientoData} isEditingRows={setIsEditingAlojamiento}/>
                      </Grid>

                      <Grid item md={12} sm={12} xs={12}>
                        <ETIDataBanks idEvent={idEvent} event={selectedEvent} dataBanks={updateDataBanks} isEditingRows={setIsEditingDataBanks} /> 
                      </Grid>

                      <Grid item md={12} sm={12} xs={12}>
                        <ETIMercadoPago idEvent={idEvent} event={selectedEvent} dataMP={updateDataMP} isEditingRows={setIsEditingDataMP} /> 
                      </Grid>

                      <Grid item md={12} sm={12} xs={12}>
                        <ETICombos setFieldValue={setFieldValue} values={values} selectedEvent={selectedEvent} setComboValues={setProductValues} errors={errors} touched={touched} EventImage={setEventImage}/>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
                    <Button type='submit' disabled={isSubmitting} sx={{ width: '115px', padding: '12px, 32px, 12px, 32px', borderRadius: '25px', backgroundColor: '#A82548', height: '44px', '&:hover': { backgroundColor: '#A82548' } }}>
                      {isLoading ? <CircularProgress sx={{ color: '#ffffff' }} size={30} /> : <><Typography sx={{ color: '#FAFAFA', fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}>{showSuccessImage ? 'Guardado' : 'Guardar'}</Typography>{showSuccessImage && <img src={'/img/icon/Vector.svg'} height={15} width={15} style={{marginLeft: '10px'}}/>}</>}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

//4500 milisegundos