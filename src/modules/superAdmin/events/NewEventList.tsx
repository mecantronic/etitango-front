/* eslint-disable prettier/prettier */
import React, { useEffect, useContext } from 'react';
import { Button, Box, Grid, PaginationItem, Modal, useMediaQuery, Theme, MenuItem, Menu } from '@mui/material';
import { EtiEvent } from 'shared/etiEvent';
import { useState } from 'react';
import {
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  DataGrid,
  GridColDef,
  GridCell
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import { makeStyles } from '@mui/styles';
import ETIModalDeleteEvent from 'components/ETIModalDeleteEvent';
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

export function NewEventList(props: { events: EtiEvent[]; isLoading: boolean, onDeleteEvent: (id: string) => Promise<void>, onSelectEvent: Function, selectedRows: string[], setSelectedRows: Function }) {
  const { events, isLoading, onDeleteEvent, onSelectEvent, selectedRows, setSelectedRows } = props;
  const [showCheckbox, setShowCheckbox] = useState(false)
  const { user } = useContext(UserContext)
  const userIsSuperAdmin = isSuperAdmin(user)
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseOptions = () => {
    setTrashIconMobile(!trashIconMobile);
    setShowCheckbox(!showCheckbox);
    setAnchorEl(null);
  }
  const [trashIconMobile, setTrashIconMobile] = useState(false)
  const [open, setOpen] = React.useState(false)
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
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
      const eventosOrdenados = events.sort((a: any, b: any) => b.dateStart - a.dateStart);
      const ultimoEvento = eventosOrdenados[0];
      setSelectedRows([ultimoEvento?.id])
      onSelectEvent(ultimoEvento)
    }

  }, [!showCheckbox]);

  const classes = useStyles();
  const columns: GridColDef[] = [
    {
      field: isMobile ? 'name' : 'dateStart',
      headerName: isMobile ? 'Nombre' : 'Fecha',
      width: 250,
      flex: isMobile ? 1 : 0,
      cellClassName: 'custom-date-cell',
    },
    {
      field: isMobile ? 'dateStart' : 'name',
      headerName: isMobile ? 'Fecha' : 'Nombre',
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
        setTrashIconMobile(false);
      }
    } catch (error) {
      console.error('Error al eliminar los eventos', error);
    }
  };


  function CustomFooter() {
    return (
      <Grid>
        {!showCheckbox && userIsSuperAdmin ? (
          <Button onClick={() => setShowCheckbox(!showCheckbox)}>
            <img src="/img/icon/btnDelete.svg" alt="Icono Trash" />
          </Button>
        ) : userIsSuperAdmin ? (
          <Button onClick={handleOpenModal}>
            <img src="/img/icon/btnTrashWhite.svg" alt="Icono Borrar" />
          </Button>
        ) : null}
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
        sx={{ mt: 2 }}
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: { xs: 0, md: 2 } }}>
            <CustomPagination />
          </Box>
        </Grid>
        {trashIconMobile && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>

              {userIsSuperAdmin ? (
                <Button
                  sx={{ minWidth: { xs: '0px', md: '0px' }, padding: { xs: '10px 0px 0px 0px', md: '10px 0px 0px 0px' } }}
                  onClick={handleOpenModal}
                >
                  <img src="/img/icon/btnDelete.svg" alt="Icono Trash" />
                </Button>
              ) : null}

              <Modal
                open={open}
                onClose={handleCloseModal}
              >
                <ETIModalDeleteEvent open={open} handleCloseModal={handleCloseModal} handleDeleteButton={handleDeleteButton} title1={'¿Eliminar elementos seleccionados?'} title2={'Los ETI seleccionados serán eliminados'} />
              </Modal>
            </Box>
          </Grid>)}
      </Grid>
    );
  }

  return (
    <>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: trashIconMobile ? '335px' : '290px', boxShadow: { xs: 0, md: 3 }, borderRadius: { xs: '', md: '12px' }, backgroundColor: { xs: '', md: '#FFFFFF' } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: { xs: '#4B84DB', md: '#FFFFFF' }, backgroundColor: { xs: '', md: '#4B84DB' }, padding: { xs: '', md: '12px 24px 12px 24px' }, fontWeight: 600, fontSize: '24px', lineHeight: { xs: '', md: '16px' }, fontFamily: 'Montserrat', height: '40px' }}>
          ETIs

          {isMobile && <Box>
            <Button
              sx={{ minWidth: { xs: '0px', md: '0px' }, padding: { xs: '0px', md: '0px' } }}
              onClick={handleClick}
            >
              <img src="/img/icon/more-circle.svg" alt="DropdownETI" />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleCloseOptions}>
                Eliminar
              </MenuItem>
            </Menu>
          </Box>}
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
                setSelectedRows([selectedEventId]);
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
            m: { xs: '', md: '20px' },
            borderColor: { xs: '#ffffff', md: '' },
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
