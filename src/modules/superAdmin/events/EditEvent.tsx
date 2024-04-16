import { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { EtiEvent } from '../../../shared/etiEvent';
import { useGlobalState } from 'helpers/UserPanelContext';
import ETIEventDate from 'components/events/ETIEventDate';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import theme from 'theme';
import EtiButton from 'components/button/EtiButton';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';

export default function EditEvent({
  selectedEvent,
  setChangeEvent,
  showEventsTable
}: {
  selectedEvent: EtiEvent | null;
  setChangeEvent: Function;
  showEventsTable: Function;
}) {
  const { isMobile } = useGlobalState();
  const { t } = useTranslation(SCOPES.MODULES.EVENT_LIST, { useSuspense: false });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, [selectedEvent]);

  const scrollbarStyles = {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'details.uranianBlue',
      borderRadius: '12px'
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
      boxShadow: '1px 0px 2px 0px #6695B7',
      borderRadius: '12px'
    }
  };

  const steps = [
    { id: 1, description: 'Paso 1' },
    { id: 2, description: 'Paso 2' },
    { id: 3, description: 'Paso 3' }
  ];

  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    if (isMobile) {
      setStep(step + 1);
      if (step >= 1) {
        showEventsTable(false);
      }
    }
  };

  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <>
      {isMobile ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {step === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                <Box sx={{ display: 'flex', ...scrollbarStyles, flexDirection: 'column' }}>
                  <Box sx={{ width: '100%' }}>
                    <ETIEventDate selectedEvent={selectedEvent} changeEvent={setChangeEvent} />
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      flexDirection: 'column',
                      mb: 2
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                    >
                      {steps.map((stepItem) => (
                        <div
                          key={stepItem.id}
                          style={{
                            width: step === stepItem.id ? '18px' : '10px',
                            height: step === stepItem.id ? '18px' : '10px',
                            borderRadius: '50%',
                            backgroundColor:
                              step === stepItem.id
                                ? `${theme.palette.details.perseanOrange}`
                                : `${theme.palette.greyScale[400]}`,
                            marginRight: '8px',
                            marginBottom: '16px'
                          }}
                        />
                      ))}
                    </Box>
                    <Box
                      sx={{
                        margin: 'auto',
                        width: '100%'
                      }}
                    >
                      <EtiButton
                        isLoading={isLoading}
                        title={t('next')}
                        styleKey="largePrimaryButton"
                        onClick={handleNextStep}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {step === 2 && (
              <>
                <Box
                  sx={{
                    border: `1px solid ${theme.palette.greyScale[300]}`,
                    marginLeft: '20px',
                    marginRight: '20px'
                  }}
                ></Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', height: '250px' }}>
                  <Typography sx={{ mt: 12 }} typography={'title.bold.h3'} textAlign={'center'}>
                    {t('tables')}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  {/* Botón "go back" con icono */}

                  {steps.map((stepItem) => (
                    <div
                      key={stepItem.id}
                      style={{
                        width: step === stepItem.id ? '18px' : '10px',
                        height: step === stepItem.id ? '18px' : '10px',
                        borderRadius: '50%',
                        backgroundColor:
                          step === stepItem.id
                            ? `${theme.palette.details.perseanOrange}`
                            : `${theme.palette.greyScale[400]}`,
                        marginRight: '8px',
                        marginBottom: '16px'
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ width: '100%', margin: 'auto' }}>
                  <EtiButton
                    isLoading={isLoading}
                    title={t('next')}
                    styleKey="largePrimaryButton"
                    onClick={handleNextStep}
                  />
                </Box>
              </>
            )}

            {step === 3 && (
              <>
                <Box
                  sx={{
                    border: `1px solid ${theme.palette.greyScale[300]}`,
                    marginLeft: '20px',
                    marginRight: '20px'
                  }}
                ></Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', height: '250px' }}>
                  <Typography sx={{ mt: 12 }} typography={'title.bold.h3'} textAlign={'center'}>
                    {t('combos')}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  {steps.map((stepItem) => (
                    <div
                      key={stepItem.id}
                      style={{
                        width: step === stepItem.id ? '18px' : '10px',
                        height: step === stepItem.id ? '18px' : '10px',
                        borderRadius: '50%',
                        backgroundColor:
                          step === stepItem.id
                            ? `${theme.palette.details.perseanOrange}`
                            : `${theme.palette.greyScale[400]}`,
                        marginRight: '8px',
                        marginBottom: '16px'
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ width: '100%', margin: 'auto' }}>
                  <EtiButton
                    isLoading={isLoading}
                    title={t('next')}
                    styleKey="largePrimaryButton"
                    onClick={handleNextStep}
                  />
                </Box>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              boxShadow: 3,
              borderRadius: '12px',
              backgroundColor: 'background.white',
              marginX: { xs: '20px', lg: 0 }
            }}
          >
            <Box sx={{ display: 'flex', ...scrollbarStyles, flexDirection: 'column' }}>
              <Box sx={{ width: '100%' }}>
                <ETIEventDate selectedEvent={selectedEvent} changeEvent={setChangeEvent} />
              </Box>
            </Box>
          </Box>
        </>
      )}
      {step !== 1 && (
        <Box sx={{ position: 'absolute', top: '20px', left: '20px' }}>
          <IconButton onClick={handleGoBack}>
            <ArrowBackIosOutlinedIcon />
          </IconButton>
        </Box>
      )}
    </>
  );
}
