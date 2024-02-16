/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { Box, Typography, Button, useMediaQuery, Theme } from "@mui/material";

const ETIModalDeleteEvent = ({handleCloseModal, open, handleDeleteButton, title1, title2} : {handleCloseModal : Function, open : boolean, handleDeleteButton: Function, title1: string, title2: string}) => {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

const styleModal = {
        position: 'absolute' as 'absolute',
        top: {xs:'', sm: '22.5%'},
        left: {xs:'', sm: '46%'},
        bottom: {xs: '0', sm: ''},

        // transform: 'translate(-50%, -50%)',
        bgcolor: '#F5F5F5',
        border: '1px solid #000',
        boxShadow: 24,
        borderRadius: 3,
        p: 3,
        overflow: 'none',
        width: {xs: '100%', sm: '422px'},
        // eslint-disable-next-line prettier/prettier
        height: {xs: 'auto', sm: '209px'},     
 };

return (
    <Box sx={{...styleModal}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
            <Box sx={{ mb: 2}}>
                <Typography variant="h6">{title1}</Typography>
            </Box>
             

            <Box sx={{borderBottom: '1px solid #E0E0E0', width: '100%'}}>

            </Box>
            {!isMobile ? 
            <Box sx={{ mt: 2}}>
            <Typography sx={{fontFamily: 'roboto'}}>{title2}</Typography>
            </Box> : null
            }

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', width: '65%'}}>
                <Box >
                <Button sx={{color: '#A82548', border: '1px solid #9E9E9E', height: '44px', width: '104px', borderRadius: '25px', gap: '8px', marginLeft: 'auto', fontFamily: 'roboto', fontSize: '14px'}} onClick={() => handleCloseModal()}>Cancelar</Button>
                </Box>

                <Box sx={{justifyContent: 'center'}}>
                <Button sx={{color: 'white', background: '#A82548', height: '44px', width: '104px', borderRadius: '25px', gap: '8px', marginLeft: 'auto', fontFamily: 'roboto', fontSize: '14px'}} onClick={() => handleDeleteButton()}>Borrar</Button>
                </Box>
            </Box>

        </Box>
    </Box>
)
}

export default ETIModalDeleteEvent;
