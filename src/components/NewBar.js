import * as React from 'react';
import { useEffect, useState } from 'react';
import { AppBar, Avatar, Box, Button, Link, Menu, Toolbar, Typography, MenuItem, Stack, IconButton } from '@mui/material';
import Container from '@mui/material/Container';
import { getDocument } from 'helpers/firestore';
import { auth } from '../etiFirebase';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { PRIVATE_ROUTES, ROUTES } from '../App.js';
import { useLocation } from 'react-router-dom';
import { USERS } from 'helpers/firestore/users';
import MenuIcon from "@mui/icons-material/Menu";
import UserPanel from 'modules/user/components/panel/userPanel';
import { useGlobalState } from 'helpers/UserPanelContext';


const NewAppBar = () => {
  const [isSignedIn, setIsSignedIn] = useState(!!auth.currentUser); // Local signed-in state.
  const [userData, setUserData] = useState({})
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [openDashboard, setOpenDashboard] = useState(false)
  const { t } = useTranslation(SCOPES.COMPONENTS.BAR, { useSuspense: false });
  const { pathname: currentRoute } = useLocation();
  const { toggleOpen } = useGlobalState()

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser?.uid) {
        const [user] = await Promise.all([
          getDocument(`${USERS}/${auth.currentUser.uid}`),
          
        ]);
        setUserData({ ...user});
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

  // const handleOpenDashboard = () => {
  //   setOpenDashboard(true)
  // }




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
       
          <Box
          sx={{ 
            width: '128px', 
            height: '97px', 
            display: {
              xs: 'none',
              sm: 'none',
              lg: 'block'
            }
            }}>
            <Link href="/">
              <img
              src="/img/icon/ETILogo.svg"
              alt="ETI"
              
            />
            </Link>
          </Box>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick= {() => toggleOpen()}
            sx={{
              color: 'white',
              mr: 2,
              display: {
                xs: "flex",
                sm: "flex",
                lg: 'none'
              }
            }}
          >
            <MenuIcon 
            sx={{
              height: '32px',
              width: '32px'
            }}/>
          </IconButton>
        {/* <UserPanel isOpen={openDashboard} ></UserPanel> */}

          
          <Box
            sx={{ 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'flex-end',
              display: {
                xs: 'none',
                sm: 'none',
                lg: 'flex'
              }
               }}
            
            id="botonera"
          >
            {isSignedIn ? (
              !PRIVATE_ROUTES.includes(currentRoute) && (
                <>  
                  <Box  sx={{ height: 70, }}>
                    <Stack direction="column" sx={{ height: 20, mt: '5px',  }}>
                      <Typography fontFamily={'Work Sans'} variant='h4b' color={'white'} sx={!userData.roles || userData.roles.admin ? {mt: 1.5} : {}}>
                        {userData.nameFirst} {userData.nameLast}
                      </Typography>
                      {userData.roles && (userData.roles.superadmin || userData.roles.Superadmin || userData.roles.superAdmin) ? (
                        <Typography fontFamily={'Work Sans'} variant='h7' color={'white'} sx={{ textAlign: 'end' }}>
                          Superadmin
                        </Typography>
                      ) : (
                        <Typography fontFamily={'Work Sans'} variant='h7' color={'white'} sx={{ textAlign: 'center' }}>
                          
                        </Typography>
                      )}
                    </Stack>
                  </Box>
        
                <Box
                sx={{ width: '48px', height: '48px' }}>
                      <Button 
                      onClick={handleOpen}
                      > 
                        <img
                          src="/img/icon/settingUser.svg"
                          alt="ETI"
                          
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
                          href={'/dashboard'}
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

          <Box
          sx={{ 
            display: {
              xs: 'block',
              sm: 'block',
              lg: 'none'
            }
            }}>
            <Link href="/">
              <img
              src="/img/icon/ETILogo.svg"
              alt="ETI"
              style={{
                width: '76px', 
                height: '64px', 
              }}  
              
            />
            </Link>
          </Box>

         
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NewAppBar;
