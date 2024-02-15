/* eslint-disable prettier/prettier */
import React, {useEffect, useContext} from 'react';
import { Button, Paper, Box, Typography, Grid, PaginationItem, Modal, useMediaQuery, Theme, MenuItem, Menu, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, DataGridProps, GridCell } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { EtiEvent } from 'shared/etiEvent';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  GridFooterContainer,
  GridSelectionModel,
  GRID_CHECKBOX_SELECTION_COL_DEF
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import { makeStyles } from '@mui/styles';
import Checkbox from '@mui/material/Checkbox';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'etiFirebase';
import ETIModalDeleteEvent from 'components/ETIModalDeleteEvent';
import * as firestoreUserHelper from 'helpers/firestore/users';
import { UserFullData, UserRolesListData } from 'shared/User';
import { isSuperAdmin } from 'helpers/firestore/users';
import { UserContext } from 'helpers/UserContext';

const useStyles = makeStyles({
  root: {
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
    '& .MuiDataGrid-cell:focus-within': {
      outline: 'none',
    },

  }
});

export function NewEventList(props: { events: EtiEvent[]; isLoading: boolean, onDeleteEvent: (id: string) => Promise<void>, onSelectEvent: Function, selectedRows : string[], setSelectedRows : Function }) {
  const { events, isLoading, onDeleteEvent, onSelectEvent, selectedRows, setSelectedRows } = props;
  // const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const fields = events[0] ? Object.keys(events[0]) : [];
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false)
  const [showCheckbox, setShowCheckbox] = useState(false)
  const [usuarios, setUsuarios] = useState<UserFullData[]>([]);
  const { user } = useContext(UserContext)
  const userIsSuperAdmin = isSuperAdmin(user)
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setTrashIconMobile(true)
  };
  const [trashIconMobile, setTrashIconMobile] = useState(false)
  const [open, setOpen] = React.useState(false)
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.dateStart).getTime();
    const dateB = new Date(b.dateStart).getTime();
    return dateB - dateA;
  });
  const handleOpenModal = () => {
    if (selectedRows.length > 0) {
      setOpen(true);
    } else {
    setShowCheckbox(false);
    setTrashIconMobile(false)
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (showCheckbox) {
      setSelectedRows([]);
    }
  }, [showCheckbox]);
  
  useEffect(() => {
      if (!showCheckbox && events.length > 0) {
        const eventosOrdenados = events.sort((a:any, b:any) => b.dateStart - a.dateStart);
        const ultimoEvento = eventosOrdenados[0];
        setSelectedRows([ultimoEvento?.id])
        onSelectEvent(ultimoEvento)
    }
    
  }, [!showCheckbox]);
  
  useEffect(() => {
    setLoading(true)
    let usuarios2: Function;

    const fetchData = async () => {
        usuarios2 = await firestoreUserHelper.getAllUsers(setUsuarios, setLoading)
    };
    fetchData().catch((error) => {
        console.error(error);
    });
    return () => {
        if (usuarios2) {
            usuarios2()
        }
    };
}, []);

  const classes = useStyles();
  const columns: GridColDef[] = [ 
    {
      field: 'dateStart',
      headerName: 'Fecha',
      width: 250,
      flex: isMobile ? 1 : 0,
      cellClassName: 'custom-date-cell',
    },
    {
    field: 'name',
    headerName: 'Nombre',
    width: 600,
    flex: isMobile ? 1 : 0,
    cellClassName: 'custom-date-cell',
  },
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    width: 50,
    renderHeader: () => <></>
  },
  ]

  const getEtiEventValues = (event: EtiEvent) => {
    let output: any = { ...event };
    const dateFields: (keyof EtiEvent)[] = ['dateStart', 'dateEnd', 'dateSignupOpen'];
    dateFields.forEach((field) => {
      if (event[field]) {
        output[field] = (event[field]! as Date).toLocaleDateString()!;
      }
    });
    return output;
  };

  const handleDeleteButton = async () => {
    try {
      if (selectedRows.length > 0) {
        await handleCloseModal();
        await Promise.all(selectedRows.map((eventId) => onDeleteEvent(eventId)));
        
        setShowCheckbox(false);
      }
    } catch (error) {
      console.error('Error al eliminar los eventos', error);
    }
  };
  function CustomFooter() {
    return (
      isMobile ? 
<Grid>
  <IconButton
    aria-label="more"
    id="long-button"
    aria-controls={openMenu ? 'long-menu' : undefined}
    aria-expanded={openMenu ? 'true' : undefined}
    aria-haspopup="true"
    onClick={handleClick}
  >
    <img src="/img/icon/more-circle.svg" alt="DropdownETI" />
  </IconButton>
  <Menu
    id="long-menu"
    anchorEl={anchorEl}
    open={openMenu}
    onClose={handleClose}
  >
    <MenuItem onClick={handleClose}>
      Eliminar
    </MenuItem>
  </Menu>
</Grid>
    :   
     <Grid>   
    {!showCheckbox && userIsSuperAdmin ? (
        <Button onClick={() => setShowCheckbox(!showCheckbox)}>
        <img src="/img/icon/btnDelete.svg" alt="Icono Trash" />
        </Button>
      ) : userIsSuperAdmin ? (
        <Button onClick={handleOpenModal}>
        <img src="/img/icon/btnTrashWhite.svg" alt="Icono Borrar" />
      </Button>
      ): null}
      <Modal
      open={open}
      onClose={() => handleCloseModal()}
      >
      <ETIModalDeleteEvent open={open} handleCloseModal={handleCloseModal} handleDeleteButton={handleDeleteButton} title1={'¿Eliminar elementos seleccionados?'} title2={'Los ETI seleccionados serán eliminados'}></ETIModalDeleteEvent>
      </Modal>
  </Grid>

    );
  }
 

  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    
    return (
     
      <Pagination
        color='secondary'
        count={pageCount}
        page={page + 1}
        sx={{mt: 2}}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              fontWeight: 600,
              borderRadius: '100px',
              fontSize: '12px',
              minWidth: '24px',
              minHeight: '24px',
              height: '24px',
              width: '24px',
              backgroundColor: item.page === page + 1 ? '#0075D9' : '#5FB4FC',
              color: item.page === page + 1 ? '#FAFAFA' : '#FAFAFA',
              '&:hover': {
                backgroundColor: item.page === page + 1 ? '#0075D9' : '#5FB4FC',
              },
            }}
          />
        )}
     
      />
      
    );
  }

  function CustomContainer() {
    return (
      <Grid container>
        <Grid item xs={6}> {!isMobile && <CustomFooter />}</Grid>
        <Grid item xs={6}>
          <Box sx={{display: 'flex', justifyContent: 'flex-end', mr: 2}}>
            <CustomPagination />
          </Box>
          </Grid>
          <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
          {trashIconMobile && (
            <div>
              {!showCheckbox && userIsSuperAdmin ? (
                <Button onClick={() => { setShowCheckbox(!showCheckbox)}}>
                  <img src="/img/icon/btnDelete.svg" alt="Icono Trash" />
                </Button>
              ) : userIsSuperAdmin ? (
                <Button onClick={handleOpenModal}>
                  <img src="/img/icon/btnTrashWhite.svg" alt="Icono Borrar" />
                </Button>
              ) : null}
              <Modal
                open={open}
                onClose={handleCloseModal}
              >
                <ETIModalDeleteEvent open={open} handleCloseModal={handleCloseModal} handleDeleteButton={handleDeleteButton} title1={'¿Eliminar elementos seleccionados?'} title2={'Los ETI seleccionados serán eliminados'} />
              </Modal>
            </div>
          )}
        </Box>
      </Grid>
      </Grid>
    );
  }
    
  return (
    <>
    <Box
      sx={{display: 'flex', flexDirection: 'column', overflow: 'auto', height: '290px', boxShadow: {xs: 0, sm: 3}, borderRadius: {xs: '',sm:'12px'}, backgroundColor: {xs: '', sm:'#FFFFFF'}}}
    >
              <Box sx={{display: 'flex',alignItems: 'center', justifyContent: 'space-between' ,color: {xs: '#4B84DB', sm: '#FFFFFF'}, backgroundColor: {xs: '', sm: '#4B84DB'}, padding: {xs: '', sm:'12px 24px 12px 24px'}, fontWeight: 600, fontSize: '24px', lineHeight: {xs: '', sm:'16px'}, fontFamily: 'Montserrat', height: '40px' }}>
                ETIs

              {isMobile && <CustomFooter />}
              </Box>
      
        <DataGrid
        className={classes.root}
        rows={sortedEvents.map(getEtiEventValues)} 
        columns={columns}
        loading={isLoading}
        checkboxSelection={showCheckbox}
        
        components={{
          Pagination: CustomContainer,
          Cell: (params) => {
            if (showCheckbox) {
              return (
                <div onClick={(e) => e.stopPropagation()}>
                  <GridCell {...params} />
                </div>
              );
            } else {
              return <GridCell {...params} />;
            }
          },
        
        }}
        onRowClick={(event) => {
          if (!showCheckbox) {
            const selectedEventId = event.row.id as string;
            const isSelected = selectedRows.includes(selectedEventId);
        
            if (isSelected) {
              setSelectedRows((prevSelectedRows: string[]) =>
                prevSelectedRows.filter((rowId) => rowId !== selectedEventId)
              );
            } else {
              setSelectedRows((prevSelectedRows: string[]) => [selectedEventId]);
            }
        
            const selectedEvent = events.find((event) => event.id === selectedEventId);
            if (selectedEvent) {
              onSelectEvent(selectedEvent);
            }
          }
        }}     
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.id}
        rowHeight={isMobile ? 35 : 22}
        headerHeight={22}
        pageSize={5}
        sx={{
          m: {xs: '',sm:'20px'},
          borderColor: {xs: '#ffffff', sm: ''},
          '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#5FB4FC',
              color: '#FAFAFA',
              fontSize: '16px',
              lineHeight: '16px',
              fontFamily: 'inter',
              fontWeight: 600
          },
          '& .MuiDataGrid-row': {
            ...(!showCheckbox && {
              '&.Mui-selected': {
                border: '2px solid #A82548',
                backgroundColor: 'inherit'
              },
            }),
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'transparent',
          },
          '& .MuiDataGrid-row.Mui-selected:hover': {
            backgroundColor: 'inherit'
          },
          '& .MuiDataGrid-row.Mui-selected:nth-of-type(even):hover': {
            backgroundColor: '#DBEEFF', 
          },
          '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: '#DBEEFF'
          },
          '& .MuiDataGrid-cellContent': {
              color: '#0075D9',
              fontSize: '16px',
              lineHeight: '16px',
              fontFamily: 'Inter',
              fontWeight: 400,
          },
          '& .css-1yi8l0w-MuiButtonBase-root-MuiCheckbox-root': {
            color: '#EE4254',
            border: '1px',
            '&.Mui-checked': {
              border: '1.5px',
              color: '#A82548',
              backgroundColor: 'transparent', 
            },
          
          }

      }}
      hideFooterSelectedRowCount={true}
      selectionModel={selectedRows}
      onSelectionModelChange={(newSelection) => {
        setSelectedRows(newSelection as string[]);
      }
    }
      
        />
       
      </Box>
    </>
  );
}

export default NewEventList;
