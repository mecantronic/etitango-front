/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, Menu, MenuItem, ListItemIcon, } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createOrUpdateDoc } from 'helpers/firestore'; 
import ETIModalMaps from './ETIModalMaps';

const ETIAlojamiento = ( { idEvent, event, updateAlojamientoData, isEditingRows }) => {

  const [rows, setRows] = useState([]);
  const [editRowsModel, setEditRowsModel] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDataModified, setIsDataModified] = useState(false);

  const [idCounter, setIdCounter] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const rowHeight = 23;
  const headerHeight = 23;
  const totalHeight = rows.length * rowHeight + headerHeight;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if(event?.alojamiento) {
      setRows(event?.alojamiento);
      updateAlojamientoData(rows)
    } else {
      setRows([])
    }
  }, [event?.alojamiento])

  useEffect(() => {
    const updatedRows = rows.map((row) => {
      const edits = editRowsModel[row.id];
      if (edits) {
        const updatedEdits = Object.keys(edits).reduce((acc, key) => {
          acc[key] = edits[key].value;
          return acc;
        }, {});
        return { ...row, ...updatedEdits };
      }
      return row;
    });
    setRows(updatedRows);
    updateAlojamientoData(updatedRows)

    setIsDataModified(Object.keys(editRowsModel).length > 0);
  }, [editRowsModel ]);
  
  

  const handleAddRow = () => {
    // setIdCounter(idCounter + 1);
    // const newRow = { id: idCounter, name: '', address: ''};
    // setRows((prevRows) => {
    //   const updatedRows = [...prevRows, newRow];
    //   console.log('rows after adding:', updatedRows);
    //   return updatedRows;
    // });
    const updateRows = rows.map((row) => {
      const edits = editRowsModel[row.id];
      return edits ? {...row, ...edits} : row;
    });
    setRows(updateRows);

    setIdCounter(idCounter + 1);
    const newRow = { id: idCounter, establecimiento: '', direccion: ''};
    setRows((prevRows) => [...prevRows, newRow]);
  };
  
  const handleRemoveRow = () => {
    // if(rows.length > 0){
    //   const newRows = rows.slice(0, -1);
    //   setRows(newRows);
    //   console.log('rows after removing:', newRows);
    // }
    const updatedRows = rows.map((row) => {
      const edits = editRowsModel[row.id];
      return edits ? {...row, ...edits} : row;
    });

    setRows(updatedRows);

    if (rows.length > 0){
      const newRows = rows.slice(0, -1);
      setRows(newRows)
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    isEditingRows(isEditing)
    handleMenuClose();
  };

  const handleConfirmClick = async () => {
    const id = idEvent;

    // Verifica si hay cambios antes de enviar la información
    if (isDataModified) {
      const updatedRows = Object.keys(editRowsModel).map((id) => {
        const row = rows.find((r) => r.id === parseInt(id));
        return { ...row, ...editRowsModel[id] };
      });

      for (const row of updatedRows) {
        await createOrUpdateDoc('events', row, id);
      }

      // Actualiza el estado isDataModified después de enviar la información
      setIsDataModified(false);
    }

    setIsEditing(false);
    isEditingRows(isEditing)
  };

  const columns = [
    { field: 'establecimiento', headerName: 'Nombre del establecimiento',width: 350, editable: isEditing },
    { field: 'direccion', headerName: 'Dirección de Google Maps', width: 400, editable: isEditing },
  ];


  return (
    <Box sx={{display: 'flex', mt: 2}}>
      <Grid container rowSpacing={0} columnSpacing={{ md: 0 }}>
        <Grid item xs={10}>
          <Typography variant='h6' fontWeight="600">Alojamiento</Typography>
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {isEditing && (
            <Button
              variant='contained'
              style={{ background: 'transparent', boxShadow: 'none', border: 'none', margin: 0 }}
              onClick={handleConfirmClick}
            >
              <img src={'/img/icon/btnConfirm.svg'} alt="btnConfirm" style={{ width: '100%', height: 'auto' }} />
            </Button>
          )}
          <Button
            variant='contained'
            style={{ background: 'transparent', boxShadow: 'none', border: 'none', margin: 0, }}
            onClick={handleOpenModal}
          >
            <img src={'/img/icon/btnMoreInfoMaps.svg'} alt="btnOpenModal" style={{ width: '100%', height: 'auto' }} />
          </Button>
          <ETIModalMaps isOpen={isModalOpen} handleCloseModal={handleCloseModal} />
          <Button
            variant='contained'
            style={{ background: 'transparent', boxShadow: 'none', border: 'none', margin: 0 }}
            onClick={handleMenuClick}
          >
            <img src={'/img/icon/btnTresPuntos.svg'} alt="btnOptions" style={{ width: '100%', height: 'auto' }} />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEditClick}>
            <ListItemIcon>
                <img src={'/img/icon/btnEdit.svg'}/>
            </ListItemIcon>
            <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#0075D9', alignItems: 'center' }}>
                Editar
            </Typography>
            </MenuItem>
            <MenuItem onClick={handleRemoveRow}>
            <ListItemIcon>
                <img src={'/img/icon/btnTrash.svg'}/>
            </ListItemIcon>
            <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#0075D9', alignItems: 'center' }}>
                Eliminar
            </Typography>
            </MenuItem>
          </Menu>
          <Button
            variant='contained'
            style={{ background: 'transparent', boxShadow: 'none', border: 'none', margin: 0 }}
            onClick={handleAddRow}
          >
            <img src={'/img/icon/btnPlus.svg'} alt="btnAdd" style={{ width: '100%', height: 'auto' }} />
          </Button>
        </Grid>
        <Grid container>
          <Grid item xs={12} sx={{ height: `${totalHeight}px`, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              editRowsModel={editRowsModel}
              localeText={{ noRowsLabel: '  '}}
              onEditRowsModelChange={setEditRowsModel}
              hideFooter = {true}
              rowHeight={22}
              headerHeight={22}
              disableColumnMenu={true}
              disableExport={true}
              filterable={false}
              sx={{
                mb: 2,
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#5FB4FC',
                    color: '#FAFAFA',
                    fontSize: '16px',
                    lineHeight: '16px',
                    fontFamily: 'inter',
                    fontWeight: 600
                },
                '& .MuiDataGrid-row:nth-of-type(even)': {
                    backgroundColor: '#DBEEFF',
                },
                '& .MuiDataGrid-cellContent': {
                    color: '#0075D9',
                    fontSize: '16px',
                    lineHeight: '16px',
                    fontFamily: 'Inter',
                    fontWeight: 400
                },
                '.MuiDataGrid-colCell': {
                  borderRight: 'none'
                }
            }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ETIAlojamiento;
