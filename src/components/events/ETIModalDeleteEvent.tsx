import { Box, Typography, Button, useMediaQuery, Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';

const ETIModalDeleteEvent = ({
  handleCloseModal,
  handleDeleteButton,
  title,
  subtitle
}: {
  handleCloseModal: Function;
  handleDeleteButton: Function;
  title: string;
  subtitle: string;
}) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const { t } = useTranslation(SCOPES.MODULES.EVENT_LIST, { useSuspense: false });

  const styleModal = {
    position: 'absolute' as 'absolute',
    top: { xs: '', sm: '22.5%' },
    left: { xs: '', sm: '46%' },
    bottom: { xs: '0', sm: '' },
    bgcolor: 'greyScale.100',
    border: '1px solid #000',
    boxShadow: 24,
    borderRadius: 3,
    p: 3,
    overflow: 'none',
    width: { xs: '100%', sm: '422px' },
    height: { xs: 'auto', sm: '209px' }
  };

  return (
    <Box sx={{ ...styleModal }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography typography="title.medium.h6">{title}</Typography>
        </Box>

        <Box sx={{ borderBottom: '1px solid #E0E0E0', width: '100%' }}></Box>
        {!isMobile && 
          <Box sx={{ mt: 2 }}>
            <Typography typography="body.regular.l">{subtitle}</Typography>
          </Box>
        }

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', width: '65%' }}>
          <Box>
            <Button
              sx={{
                color: 'principal.secondary',
                border: '1px solid #9E9E9E',
                height: '44px',
                width: '104px',
                borderRadius: '25px',
                gap: '8px',
                marginLeft: 'auto'
              }}
              onClick={() => handleCloseModal()}
            >
              <Typography typography="body.medium.m">{t('cancel')}</Typography>
            </Button>
          </Box>

          <Box sx={{ justifyContent: 'center' }}>
            <Button
              sx={{
                color: 'background.white',
                backgroundColor: 'principal.secondary',
                '&:hover': { backgroundColor: 'principal.secondary' },
                height: '44px',
                width: '104px',
                borderRadius: '25px',
                gap: '8px',
                marginLeft: 'auto'
              }}
              onClick={() => handleDeleteButton()}
            >
              <Typography typography="body.medium.m">{t('remove')}</Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ETIModalDeleteEvent;