import { useContext, useEffect, useState } from 'react';
import WithAuthentication from '../../withAuthentication';
import { UserRoles } from 'shared/User';
import { EtiEvent } from 'shared/etiEvent';
import * as firestoreEventHelper from 'helpers/firestore/events';
import EventListTable from './eventsListTable';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'etiFirebase';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { EventContext } from 'helpers/EventContext';
import EditEvent from './EditEvent';

const EventsList = () => {
  const [events, setEvents] = useState<EtiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [eventData, setEventData] = useState<EtiEvent | null>(null);
  // eslint-disable-next-line no-unused-vars
  const [changeEvent, setChangeEvent] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showEventListTable, setShowEventListTable] = useState(true);
  const { t } = useTranslation(SCOPES.MODULES.EVENT_LIST, { useSuspense: false });
  const { idNewEvent } = useContext(EventContext);
  useEffect(() => {
    const fetchData = async () => {
      const event = await firestoreEventHelper.getEvents();
      setEvents(event);
      if (event.length > 0) {
        const orderedEvents = event.sort((a: any, b: any) => b.dateStart - a.dateStart);
        const lastEvent = orderedEvents[0];
        const selectedEvent = event.find((element) => element.id === idNewEvent) || lastEvent;
        setEventData(selectedEvent);
        setSelectedRows([selectedEvent.id]);
      } else {
        setEventData(null);
      }
    };
    setIsLoading(true);
    fetchData().catch((error) => alert(error));
    setIsLoading(false);
  }, []);
  useEffect(() => {    
    console.log('este es el valor booleano', showEventListTable);
  }, [showEventListTable]);

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      setIsLoading(true);
      const updatedEvents = await firestoreEventHelper.getEvents();
      setEvents(updatedEvents);
    } catch (error) {
      alert('Error deleting event:' + error);
    } finally {
      setIsLoading(false);
    }
  };

  
  

  return (
    <>
      <WithAuthentication roles={[UserRoles.SUPER_ADMIN]} />
      <Box
        sx={{
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          width: { xs: '100%', lg: 960 },
        }}
      >
        {events.length > 0 ? (
          <>
            {showEventListTable && (
              <EventListTable
                events={events}
                isLoading={isLoading}
                onDeleteEvent={handleDeleteEvent}
                onSelectEvent={setEventData}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
              />
            )}
            <Box sx={{ mt: 5 }}>
              <EditEvent
                selectedEvent={eventData}
                setChangeEvent={setChangeEvent}
                showEventsTable={setShowEventListTable}
              ></EditEvent>
            </Box>
          </>
        ) : (
          <Typography sx={{ textAlign: 'center' }} typography="title.semiBold.h3">
            {t('notEvents')}
          </Typography>
        )}
      </Box>
    </>
  );
};
export default EventsList;