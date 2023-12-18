import * as React from 'react';
import { useEffect, useState } from 'react';
import { AppBar, Avatar, Box, Button, Link, Menu, Toolbar, Typography, MenuItem, Stack } from '@mui/material';
import Container from '@mui/material/Container';
import { getDocument } from 'helpers/firestore';
import { auth } from '../etiFirebase';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { PRIVATE_ROUTES, ROUTES } from '../App.js';
import { useLocation } from 'react-router-dom';
import { USERS } from 'helpers/firestore/users';


const EtiAppBar = () => {
  const [isSignedIn, setIsSignedIn] = useState(!!auth.currentUser); // Local signed-in state.
  const [userData, setUserData] = useState({})
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation(SCOPES.COMPONENTS.BAR, { useSuspense: false });
  const { pathname: currentRoute } = useLocation();
  const superAdmin = userData.roles

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser?.uid) {
        const [user] = await Promise.all([
          getDocument(`${USERS}/${auth.currentUser.uid}`),
          
        ]);
        setUserData({ ...user});
        // setLoading(false);
        console.log(user)
      }
    };
    fetchData().catch((error) => console.error(error));
  }, [auth.currentUser?.uid]);

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (

    <AppBar
      elevation={0}
      position="static"
      sx={{ backgroundColor: '#4B84DB', paddingX: 2 }}
      id="appbar"
    >
      <Container 
      maxWidth="xl" id="container">
        <Toolbar
          disableGutters
          id="toolbar"
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
       
          <Box>
            <Link href="/">
              <Avatar
              border={1}
              borderColor={'red'}
              src="/img/icon/ETI_logo.png"
              alt="ETI"
              sx={{ width: '128px', height: '97px' }}
            />
            </Link>
          </Box>
          
          <Box
            border={1}
            borderColor={'red'}
            sx={{ flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end' }}
            display={'flex'}
            id="botonera"
          >
            {isSignedIn ? (
              !PRIVATE_ROUTES.includes(currentRoute) && (
                <>  
                  <Box border={1} borderColor={'red'} sx={{ height: 70}}>
                    <Stack direction="column" sx={{ height: 20, mt: '10px' }}>
                      <Typography variant='h4b' color={'white'} sx={!superAdmin ? { justifyContent: 'center', alignItems: 'center', textAlign: 'center' } : {}}>
                        {userData.nameFirst} {userData.nameLast}
                      </Typography>
                      {superAdmin ? (
                        <Typography variant='h7' color={'white'} sx={{ textAlign: 'end' }}>
                          Superadmin
                        </Typography>
                      ) : (
                        <Typography variant='h7' color={'white'} sx={{ textAlign: 'center' }}>
                          {/* Puedes dejar este espacio en blanco si no deseas mostrar ningún texto */}
                        </Typography>
                      )}
                    </Stack>
                  </Box>



                {/* <Box border={1} borderColor={'red'} sx={{ height: 70 }}>
                  <Stack direction="column"  sx={{height: 20, mt: '5px' }}>
                    <Typography variant='h4b' color={'white'} >
                      {userData.nameFirst} {userData.nameLast}
                    </Typography>
                      {superAdmin && (
                    <Typography variant='h7' color={'white'} sx={{textAlign:'end'}}>
                      Superadmin
                    </Typography>
                          )}
                  </Stack>
                </Box> */}
        
                <Box>
                      <Button 
                      onClick={handleOpen}
                      > 
                        <img
                          src="/img/icon/settings_user.png"
                          alt="ETI"
                          sx={{ width: '48px', height: '48px' }}
                        >
                        </img>
                      </Button>
                    
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                       
                         <MenuItem onClick={handleClose}>
                         <Button
                          color="primary"
                          variant="text"
                          underline="none"
                          href={'/user/profile'}
                        >
                          PANEL GENERAL
                        </Button>
                         </MenuItem>

                        <MenuItem onClick={handleClose}>
                        <Button
                          color="primary"
                          variant="text"
                          underline="none"
                          onClick={() => auth.signOut()}
                          href={'/'}
                          key={'signout'}
                        >
                          {t('logout').toUpperCase()}
                        </Button>
                        
                        
                        </MenuItem>
                        
                      </Menu> 

                </Box>
                </>
              )
            ) : (
              <Button
                border={1}
                borderColor={"red"}
                color="secondary"
                variant="contained"
                underline="none"
                onClick={() => auth.signIn()}
                href={'/sign-in'}
                key={'sign-in'}
                sx={{ fontSize: 12, align: 'center', margin: '3px', textAlign: 'center' }}
              >
                {t('signin').toUpperCase()}
              </Button>
            )}
          </Box>

         
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default EtiAppBar;