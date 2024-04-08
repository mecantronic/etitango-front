import React, { useEffect, useContext } from 'react';
import {
  Button,
  Box,
  Grid,
  PaginationItem,
  Modal,
  useMediaQuery,
  Theme,
  MenuItem,
  Menu,
  Typography
} from '@mui/material';
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
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import { makeStyles } from '@mui/styles';
import ETIModalDeleteEvent from 'components/events/ETIModalDeleteEvent';
import { isSuperAdmin } from 'helpers/firestore/users';
import { UserContext } from 'helpers/UserContext';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';

const useStyles = makeStyles({
  root: {
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
      outline: 'none'
    },
    '& .MuiDataGrid-cell:focus-within': {
      outline: 'none'
    }
  }
});

export function EventListTable(props: {
  events: EtiEvent[];
  isLoading: boolean;
  onDeleteEvent: (id: string) => Promise<void>;
  onSelectEvent: Function;
  selectedRows: string[];
  setSelectedRows: Function;
}) {
  const { events, isLoading, onDeleteEvent, onSelectEvent, selectedRows, setSelectedRows } = props;
  const [showCheckbox, setShowCheckbox] = useState(false);
  const { t } = useTranslation(SCOPES.MODULES.EVENT_LIST, { useSuspense: false });
  const { user } = useContext(UserContext);
  const userIsSuperAdmin = isSuperAdmin(user);
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
  };
  const [trashIconMobile, setTrashIconMobile] = useState(false);
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
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
      setTrashIconMobile(false);
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
      const orderedEvents = events.sort((a: any, b: any) => b.dateStart - a.dateStart);
      const lastEvent = orderedEvents[0];
      setSelectedRows([lastEvent?.id]);
      onSelectEvent(lastEvent);
    }
  }, [!showCheckbox]);

  const classes = useStyles();
  const columns: GridColDef[] = [
    {
      field: isMobile ? 'name' : 'dateStart',
      headerName: isMobile ? t('name') : t('date'),
      width: 250,
      flex: isTablet ? 1 : 0, 
      cellClassName: 'custom-date-cell'
    },
    {
      field: isMobile ? 'dateStart' : 'name',
      headerName: isMobile ? t('date') : t('name'),
      width: 600,
      flex: isTablet ? 1 : 0,
      cellClassName: 'custom-date-cell'
    },
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      width: 50,
      renderHeader: () => <></>
    }
  ];

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
      alert('Error deleting events' + error);
    }
  };

  function CustomFooter() {
    return (
      <Grid>
        {!showCheckbox && userIsSuperAdmin ? (
          <Button onClick={() => setShowCheckbox(!showCheckbox)}>
            <DeleteIcon sx={{ color: 'status.error', height: '32px', width: '32px' }}></DeleteIcon>
          </Button>
        ) : userIsSuperAdmin && (
          <Button onClick={handleOpenModal}>
            <DeleteForeverIcon
              sx={{ color: 'status.error', height: '32px', width: '32px' }}
            ></DeleteForeverIcon>
          </Button>
        )}
        <Modal open={open} onClose={() => handleCloseModal()}>
          <ETIModalDeleteEvent
            handleCloseModal={handleCloseModal}
            handleDeleteButton={handleDeleteButton}
            title={t('title')}
            subtitle={t('subtitle')}
          ></ETIModalDeleteEvent>
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
        color="secondary"
        count={pageCount}
        page={page + 1}
        sx={{ mt: 2 }}
        onChange={(e, value) => apiRef.current.setPage(value - 1)}
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
              backgroundColor: item.page === page + 1 ? 'details.frenchBlue' : 'principal.primary',
              color: 'greyScale.50',
              '&:hover': {
                backgroundColor: item.page === page + 1 ? 'details.frenchBlue' : 'principal.primary'
              }
            }}
          />
        )}
      />
    );
  }

  function CustomContainer() {
    return (
      <Grid container>
        <Grid item xs={6}>
          {' '}
          {!isMobile && <CustomFooter />}
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: { xs: 0, md: 2 } }}>
            <CustomPagination />
          </Box>
        </Grid>
        {trashIconMobile && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {(userIsSuperAdmin && isMobile) && (
                <Button
                  sx={{
                    minWidth: { xs: '0px', md: '0px' },
                    padding: { xs: '10px 0px 0px 0px', md: '10px 0px 0px 0px' }
                  }}
                  onClick={handleOpenModal}
                >
                  <DeleteIcon
                    sx={{ color: 'status.error', height: '32px', width: '32px' }}
                  ></DeleteIcon>
                </Button>
              )}

              <Modal open={open} onClose={handleCloseModal}>
                <ETIModalDeleteEvent
                  handleCloseModal={handleCloseModal}
                  handleDeleteButton={handleDeleteButton}
                  title={t('title')}
                  subtitle={t('subtitle')}
                />
              </Modal>
            </Box>
          </Grid>
        )}
      </Grid>
    );
  }

  return (
    <>
    
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          height: trashIconMobile ? '335px' : '290px',
          boxShadow: { xs: 0, md: 3 },
          borderRadius: { xs: '', md: '12px' },
          backgroundColor: 'background.white',
          marginX: { xs: '20px', lg: 0 }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: { xs: 'details.azure', md: 'background.white' },
            backgroundColor: { xs: '', md: 'details.azure' },
            padding: { xs: '', md: '12px 24px 12px 24px' },
            height: { xs: '70px', md: '40px' }
          }}
        >
          <Typography typography="title.semiBold.h4">{t('eti')}</Typography>

          {isMobile && (
            <Box>
              <Button
                sx={{ minWidth: { xs: '0px', md: '0px' }, padding: { xs: '0px', md: '0px' } }}
                onClick={handleClick}
              >
                <MoreHorizOutlinedIcon sx={{ color: 'details.azure' }}> </MoreHorizOutlinedIcon>
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleCloseOptions}>
                  <Typography typography="label.button">{t('delete')}</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
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
            }
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
          rowHeight={isMobile ? 38 : 25.2}
          headerHeight={30}
          pageSize={5}
          sx={{
            m: { xs: '', md: '20px' },
            borderColor: { xs: 'background.white', md: '' },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'principal.primary',
              color: 'greyScale.50',
              fontSize: '16px',
              lineHeight: '16px',
              fontFamily: 'Montserrat',
              fontWeight: 600
            },
            '& .MuiDataGrid-row': {
              ...(!showCheckbox && {
                '&.Mui-selected': {
                  border: '2px solid #A82548',
                  backgroundColor: 'inherit',
                  width: { xs: '98.9%', sm: '99.4%', lg: '99.6%' }
                }
              })
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'transparent'
            },
            '& .MuiDataGrid-row.Mui-selected:hover': {
              backgroundColor: 'inherit'
            },
            '& .MuiDataGrid-row.Mui-selected:nth-of-type(even):hover': {
              backgroundColor: 'details.aliceBlue'
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: 'details.aliceBlue'
            },
            '& .MuiDataGrid-cellContent': {
              color: 'details.frenchBlue',
              fontSize: '16px',
              lineHeight: '16px',
              fontFamily: 'roboto',
              fontWeight: 400,
             
            },
            '& .css-1yi8l0w-MuiButtonBase-root-MuiCheckbox-root': {
              color: 'details.folly',
              border: '1px',
              '&.Mui-checked': {
                border: '1.5px',
                color: 'principal.secondary',
                backgroundColor: 'transparent'
              }
            },
            '&, [class^=MuiDataGrid]': { border: 'none' }
          }}
          hideFooterSelectedRowCount={true}
          selectionModel={selectedRows}
          onSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection as string[]);
          }}
        />
   
        
        
      </Box>
      
    </>
  );
}

export default EventListTable;