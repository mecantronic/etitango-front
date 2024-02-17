/* eslint-disable prettier/prettier */
import React, { createContext, FC, useContext } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';

interface MobileContextProps {
  isMobile: boolean;
}

export const MobileContext = createContext<MobileContextProps | undefined>(undefined);

export const MobileProvider: FC = ({ children }) => {
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  );
};
