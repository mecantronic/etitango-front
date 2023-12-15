import * as React from 'react';
import { Grid, Link, Typography, Avatar, Paper, Box} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';


export default function AppFooter() {
  const { t } = useTranslation([SCOPES.COMPONENTS.FOOTER, SCOPES.COMPONENTS.BAR], {
    useSuspense: false
  });
  const links = [
    { href: '/', title: 'ETI' },
    { href: '/historia-del-eti', title: t(`${SCOPES.COMPONENTS.BAR}.history`) },
    { href: '/', title: 'Comisiones Etianas' },
    { href: '/comision-de-genero-who', title: t(`${SCOPES.COMPONENTS.BAR}.genderWho`) },
  
  ];
  return (

    <Box
      // border={1}
      // borderColor={'red'}
      mt={2}
      mb={2}
      spacing={4}
      paddingX={10}
      paddingY={5}
       sx={{ backgroundColor: 'rgba(33, 33, 33, 1)'}}
      // direction={'column'}
    >
      <Grid
      container
      > 

      {/* PRIMER COLUMNA  */}
      <Grid 
      item xs={12} md={3} sm={6}
      
      
      >
        <div>
        <Typography  fontWeight={'bold'} color={'#5FB4FC'} >
            Más sobre ETI
            {/* {t('links.title').toUpperCase()} */}
          </Typography>
        </div>
  
        

      </Grid>

    {/* SEGUNDA COLUMNA */}
      <Grid 
        
        item xs={12} md={3} sm={6}
        >
            <Typography fontWeight={'bold'} color={'#5FB4FC'}>
              Quienes somos
              {/* {t('about.title').toUpperCase()} */}
            </Typography>
      </Grid>

{/* TERCERA COLUMNA */}
      <Grid
          
          item xs={12} md={3} sm={6}
          
          >

          <Typography fontWeight={'bold'}  color={'#5FB4FC'}>
            Encuéntranos en 
            {/* {t('socialNetworks.title').toUpperCase()} */}
          </Typography>

          </Grid>

  {/* CUARTA COLUMNA */}
          <Grid 
       
        item xs={12} md={3} sm={6}
        >

          {/* <img
                src="/img/icon/tango_logo.png"
                alt="ETI"
                sx={{ width: '20px', height: '20px' }}
              /> */}
        
        </Grid>

    {/* PRIMERA COLUMNA DESCRIPCION */}
        <Grid
           
            item xs={12} md={3} sm={6}
            container
            justifyContent={'space-evenly'}
            direction={'column'}
            // style={{ height: '15vh' }}
            pl={2}
            
            
          >{links.map((link) => (
            <Link
              variant="p"
              color="#5FB4FC"
              underline="none"
              display={'flex'}
              href={link.href}
              key={link.href}
            >
              {link.title}
            </Link>
          ))}
          
          </Grid>
       
    
     
        {/* LO Q VA ADENTRO DEL SEGUNDO GRID */}
        <Grid
         
          item xs={12} md={3} sm={6}
            
            // style={{ height: '15vh' }}
            pl={2}
            
          >
          <Typography mt={2} color={'white'}>
            {t('about.description')}
          </Typography>
          
      </Grid>

      {/* TERCER GRID  */}

           <Grid
          
           item xs={12} md={3} sm={6}
          // style={{ height: '15vh' }}
          pl={2}
          
          
        > 
          <Link mt={2} sx={{ display: 'flex', alignItems: 'center' }} underline='none' color={'#5FB4FC'} href="http://facebook.com/groups/305562943758" target="_blank">
            Facebook
            <Avatar
              src="/img/icon/facebook.png"
              alt="ETI"
              sx={{ width: '24px', height: '24px', ml: 3 }}
              
            />
             
          </Link>
           
        </Grid> 

      {/* CUARTO GRID */}
         <Grid 
      
        item xs={12} md={3} sm={6}
        display={'flex'}
        alignItems={'flex-end'}
        direction={'column'}
        >
        
        
      
           <img
                src="/img/icon/tango_logo.png"
                alt="ETI"
                sx={{ width: '20px', height: '20px' }}
              /> 
       </Grid>
         



      </Grid>
    </Box>

  );
}
