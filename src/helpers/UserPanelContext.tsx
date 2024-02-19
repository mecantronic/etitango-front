/* eslint-disable prettier/prettier */
import { createContext, useState, useContext } from "react";
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';

interface IGlobalState {
    isOpen: boolean;
    toggleOpen: () => void;
    isMobile: boolean;
}
  
  const userPanelContext = createContext<IGlobalState | undefined>(undefined);


  export const GlobalStateProvider: React.FC = ({ children}: any) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));
  
    const toggleOpen = () => {
      setIsOpen((prevOpen) => !prevOpen);
    };

  
    const contextValue: IGlobalState = {
      isOpen,
      toggleOpen,
      isMobile
    };
  
    return (
      <userPanelContext.Provider value={contextValue}>
        {children}
      </userPanelContext.Provider>
    );
  };
  
  export const useGlobalState = (): IGlobalState => {
    const context = useContext(userPanelContext);
    if (!context) {
      throw new Error('useGlobalState debe ser utilizado dentro de un GlobalStateProvider');
    }
    return context;
  };
  
  