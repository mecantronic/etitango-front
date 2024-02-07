/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Container, Grid, Box, Typography, Paper } from '@mui/material';
import WithAuthentication from '../../withAuthentication';
import { Translation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { date, object, string } from 'yup';
import { createOrUpdateDoc, getDocument, updateEventWithImageUrl } from 'helpers/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../App.js';
import { getEvent } from '../../../helpers/firestore/events';
import { EtiEvent } from '../../../shared/etiEvent';
import { UserRoles } from '../../../shared/User';
import { ETIDatePicker } from '../../../components/form/DatePicker';
import RolesList from '../roles/RolesList';
import CloudinaryUploadWidget from 'components/CloudinaryUploadWidget';
import { Cloudinary } from "@cloudinary/url-gen";
import EventListTable from './eventsListTable';
import * as firestoreEventHelper from 'helpers/firestore/events';
import EditEventsTable from 'components/EditEventsTable';
//import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import ETIAgenda from 'components/ETIAgenda';
import ETIAlojamiento from 'components/ETIAlojamiento';
import ETIDataBanks from 'components/ETIDataBanks';
import ETIMercadoPago from 'components/ETIMercadoPago';

export default function EditEvent() {

  const [publicId, setPublicId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageEvent, setImageEvent] = useState("");

  const [events, setEvents] = useState<EtiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [eventExists, setEventExists] = useState()

  // Replace with your own cloud name
  const cloudNameCredencial = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const cloudPresetCredencial = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  const cloudName = cloudNameCredencial;
  // Replace with your own upload preset
  const uploadPreset = cloudPresetCredencial;

  const uwConfig = {
    cloudName,
    uploadPreset
  }

  const cld = new Cloudinary({
    cloud: {
      cloudName
    }
  });

  //const myImage = cld.image(publicId);

  const alertText: string = 'Este campo no puede estar vacío';

  const EventFormSchema = object({
    dateEnd: date().required(alertText),
    dateSignupOpen: date().required(alertText),
    dateStart: date().required(alertText),
    location: string().required(alertText),
    name: string().required(alertText)
  });

  const [event, setEvent] = useState<EtiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<EtiEvent | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const eventExists = await getDocument(`events/${id}`);
        if (eventExists) {
          const event = await getEvent(id);
          setEvent(event);
          setImageEvent(event.imageUrl);
        } else {
          navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
        }
        setLoading(false);
      }
    };
    fetchData().catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const evts = await firestoreEventHelper.getEvents();
      setEvents(evts);
    };
    setIsLoading(true);
    fetchData().catch((error) => console.error(error));
    setIsLoading(false);
  }, []);


  const save = async (values: any, setSubmitting: Function) => {
    try {
      const eventId = await createOrUpdateDoc('events', values, id === 'new' ? undefined : id);
      if (eventId && imageUrl) {
        await updateEventWithImageUrl(eventId, imageUrl)
      }
      navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      //TODO global error handling this.setState({errors: error.response.event})
    }
  };
  return (
    <Translation
      ns={[SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP, SCOPES.MODULES.PROFILE]}
      useSuspense={false}
    >
      {(t) => (
        <>
          <WithAuthentication
            roles={[UserRoles.ADMIN]}
            redirectUrl={`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`}
          />
          <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center',}}>
            {/* Lista de eventos */}
          <Box sx={{
            marginLeft: '100px',
            maxHeight: '300px',
            maxWidth: '90%',
            width: '100%',
            overflow: 'auto',
            //border: '2px solid red'
          }}
          >
          
          </Box>
          {loading ? (
            <CircularProgress />
          ) : (
            <Container maxWidth="lg"
              sx={{
                //border: '2px solid red',
                marginTop: 3, mx: 3,
                marginBottom: '30px',
                marginLeft: '100px',
              }}>
              <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={3}
              >

                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  //border: '2px solid black',
                  flexDirection: 'column',
                  width: '100%',
                }}
                >
                
                </Box>
              </Grid>

            </Container>
          )}
          </Box>
          
        </>
      )}
    </Translation>
  );
}
