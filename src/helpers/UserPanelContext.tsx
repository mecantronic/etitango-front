import { createContext, useState, useContext } from "react";

interface IGlobalState {
    isOpen: boolean;
    toggleOpen: () => void;
   
  }
  
  const userPanelContext = createContext<IGlobalState | undefined>(undefined);

  export const GlobalStateProvider: React.FC = ({ children}: any) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
  
    const toggleOpen = () => {
      setIsOpen((prevOpen) => !prevOpen);
    };

  
    const contextValue: IGlobalState = {
      isOpen,
      toggleOpen
    
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
  
  