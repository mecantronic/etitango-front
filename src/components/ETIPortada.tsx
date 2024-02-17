/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { FC, useEffect, useState } from "react";
import { EtiEvent } from "shared/etiEvent";
import { Button, Box, Typography, Grid } from '@mui/material';
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import { deleteImageUrlFromEvent } from "helpers/firestore";

interface ETIPortadaProps {
    selectedEvent: EtiEvent | null;
    EventImage: any;
}

export const ETIPortada: FC<ETIPortadaProps> = ({ selectedEvent, EventImage }) => {

    const idEvent = selectedEvent?.id

    const [imageUrlEvent, setImageUrlEvent] = useState('');

    const cloudNameCredencial = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const cloudPresetCredencial = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    const cloudName = cloudNameCredencial;
    const uploadPreset = cloudPresetCredencial;

    const uwConfig = {
        cloudName,
        uploadPreset
    };

    const handleUpdateImage = (uploadImageUrl: string) => {
        setImageUrlEvent(uploadImageUrl);
        EventImage(uploadImageUrl)
    }

    useEffect(() => {
        if (selectedEvent?.imageUrl) {
            setImageUrlEvent(selectedEvent.imageUrl);
        }
    }, [selectedEvent?.imageUrl]);

    return (

        <Grid container alignItems="center">
            <Grid item xs={12}>
                <Typography  sx={{ color: '#212121', fontWeight: 500, fontSize: '20px' }}>
                    Portada
                </Typography>
            </Grid>
            {/** Add Cloudinary  */}
            <Box
                sx={{
                    display: 'flex',
                    maxHeight: '300px',
                    marginTop: '20px'
                }}
            >
                <Box
                    component="img"
                    sx={{
                        height: 550,
                        width: 450,
                        maxHeight: { xs: 550, md: 190 },
                        maxWidth: { xs: 450, md: 360 },
                        borderRadius: '16px'
                    }}
                    alt="Imagen representativa del evento"
                    src={imageUrlEvent ? imageUrlEvent : '/img/imageNotFound.svg'}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', ml: 5 }}>
                    <CloudinaryUploadWidget
                        uwConfig={uwConfig}
                        onImageUpload={(uploadedImageUrl: string) =>{
                            handleUpdateImage(uploadedImageUrl)
                        }}
                    />

                    <Button
                        sx={{
                            width: '115px',
                            padding: '12px, 32px, 12px, 32px',
                            borderRadius: '12px',
                            ml: 3,
                            border: '1px solid #9E9E9E',
                            backgroundColor: 'transparent',
                            height: '44px',
                            '&:hover': { backgroundColor: 'transparent' }
                        }}

                        onClick={async () => {
                            try {
                                const success = await deleteImageUrlFromEvent(idEvent);
                                if (success) {
                                    setImageUrlEvent('');
                                    alert('Imagen eliminada con exito!')
                                }
                            } catch (error) {
                                console.error('eliminar imagen fallo ', error);
                                alert('Eliminar imagen fallo')
                            }
                        }}
                    >
                        <Typography
                            sx={{
                                color: '#A82548',
                                fontWeight: 500,
                                fontSize: '14px',
                                lineHeight: '20px'
                            }}
                        >
                            Eliminar
                        </Typography>
                    </Button>
                </Box>
            </Box>
        </Grid>
    )
}