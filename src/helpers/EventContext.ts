import { createContext } from 'react';
export const EventContext = createContext({
  idNewEvent: '',
  // eslint-disable-next-line no-unused-vars
  setIdNewEvent: (idNewEvent: string) => {}
});

export interface IEventContext {
  idNewEvent: string;
  // eslint-disable-next-line no-unused-vars
  setIdNewEvent: (idNewEvent: string) => void;
}
