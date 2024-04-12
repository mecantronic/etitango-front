/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { EtiEvent } from '../../../shared/etiEvent';
import { useGlobalState } from 'helpers/UserPanelContext';
import ETIEventDate from 'components/events/ETIEventDate';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import theme from 'theme';

export default function EditEvent({ selectedEvent, setChangeEvent2 }: { selectedEvent: EtiEvent | null, setChangeEvent2: Function }) {

  const { isMobile } = useGlobalState();
  const { t } = useTranslation(SCOPES.MODULES.EVENT_LIST, { useSuspense: false });

  useEffect(() => {
  }, [selectedEvent])

  const scrollbarStyles = {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'details.uranianBlue',
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
    }
  }

  const buttonText = step === 1 ? t('start') : step === 2 ? t('next') : t('next');

  return (
    <>
      {isMobile ? (
        <>
          {step === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
              <Box sx={{ display: 'flex', ...scrollbarStyles, flexDirection: 'column' }}>
                <Box sx={{ width: '100%' }}>
                  <ETIEventDate selectedEvent={selectedEvent} changeEvent={setChangeEvent2} />
                </Box>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Button
                    onClick={() => handleNextStep()}
                    sx={{
                      width: '85%',
                      padding: '12px, 32px, 12px, 32px',
                      borderRadius: '25px',
                      backgroundColor: 'principal.secondary',
                      color: 'background.white',
                      height: '44px',
                      '&:hover': { backgroundColor: 'principal.secondary' },
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
              <Box sx={{ border: `1px solid ${theme.palette.greyScale[300]}`, marginLeft: '20px', marginRight: '20px' }}></Box>

             <Box sx={{ display: 'flex', justifyContent:'center', height: '250px'}}>
              <Typography sx={{ mt: 12}} variant='h3' textAlign={'center'}>{t('tables')}</Typography>
             </Box>
             
              <Box sx={{ width: '100%',display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Button
                    onClick={() => handleNextStep()}
                    sx={{
                      width: '85%',
                      padding: '12px, 32px, 12px, 32px',
                      borderRadius: '25px',
                      backgroundColor: 'principal.secondary',
                      color: 'background.white',
                      height: '44px',
                      '&:hover': { backgroundColor: 'principal.secondary' },
                    }}
                  >
                    {buttonText}
                  </Button>
              </Box>
            </>
          )}
          {step === 3 && (
           <>
           <Box sx={{ border: `1px solid ${theme.palette.greyScale[300]}`, marginLeft: '20px', marginRight: '20px' }}></Box>

           <Box sx={{ display: 'flex', justifyContent:'center', height: '250px'}}>
           <Typography sx={{ mt: 12}} variant='h3' textAlign={'center'}>{t('combos')}</Typography>
           </Box>
              </>
          )}
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto', boxShadow: 3, borderRadius: '12px', backgroundColor: 'background.white', marginX: { xs: '20px', lg: 0 } }}>
            <Box sx={{ display: 'flex', ...scrollbarStyles, flexDirection: 'column' }}>
              <Box sx={{ width: '100%' }}>
                <ETIEventDate selectedEvent={selectedEvent} changeEvent={setChangeEvent2} />
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}