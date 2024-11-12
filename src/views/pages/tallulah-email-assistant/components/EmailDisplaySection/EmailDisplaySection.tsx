import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Box, Button, Drawer, LinearProgress, Tooltip, Typography, styled } from '@mui/material';
import styles from './EmailDisplaySection.module.css';
import { GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import AppStripedDataGrid from '@/components/AppStripedDataGrid';
import { EmailsService, GetEmail_Out } from '@/tallulah-ts-client';
import EmailDetailedView from '../EmailDetailedView';
import ReplyIcon from '@mui/icons-material/Reply';
import { formatReceivedTime, getEmailLabel } from '@/utils/helper';

export interface IEmailDisplaySection {
  mailBoxId: string;
  setSelectionModel: (selectionModel: any) => void;
  selectionModel: string[];
  sortKey: string;
  sortDirection: -1 | 1;
  filterByTags: string[];
  filterByState: string[];
}

export interface EmailDisplaySectionRef {
  // Define functions or values you want to expose here
  handleEmailRefresh: () => void;
  // Add more as needed...
}

const resetPaginationData = {
  count: 0,
  next: 0,
  limit: 25
};

const EmailDisplaySection: React.ForwardRefRenderFunction<EmailDisplaySectionRef, IEmailDisplaySection> = (
  { mailBoxId, selectionModel, setSelectionModel, filterByTags, filterByState, ...props },
  ref
) => {
  const [rows, setRows] = useState<GetEmail_Out[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationData, setPaginationData] = useState(resetPaginationData);

  const getEmails = async (offset = 0) => {
    setLoading(true);
    const filterTags = filterByTags.length > 0 ? filterByTags : undefined;

    const filterStateStrings = filterByState.length > 0 ? filterByState : undefined;
    enum EmailState {
      NEW = 'NEW',
      TAGGED = 'TAGGED',
      RESPONDED = 'RESPONDED',
      FAILED = 'FAILED'
    }

    const filterState = filterStateStrings
      ?.map((state) => {
        if (state === 'NEW') {
          return EmailState.NEW;
        } else if (state === 'TAGGED') {
          return EmailState.TAGGED;
        } else if (state === 'RESPONDED') {
          return EmailState.RESPONDED;
        } else if (state === 'NOT RESPONDED') {
          return [EmailState.NEW, EmailState.TAGGED];
        } else {
          return EmailState.FAILED;
        }
      })
      .flat();

    const response = await EmailsService.getAllEmails(
      mailBoxId,
      offset,
      resetPaginationData.limit,
      props.sortKey,
      props.sortDirection,
      filterTags,
      filterState
    );

    setLoading(false);
    setPaginationData({
      count: response.count,
      limit: response.limit,
      next: response.next
    });
    setRows([...response.messages]);
  };

  const handleEmailRefresh = () => {
    const newOffset = page * resetPaginationData.limit;
    getEmails(newOffset);
  };

  useImperativeHandle(ref, () => ({
    handleEmailRefresh
  }));

  useEffect(() => {
    getEmails();
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!active) {
        return;
      }

      const newOffset = page * resetPaginationData.limit;

      getEmails(newOffset);
    })();

    return () => {
      active = false;
    };
  }, [page]);

  useEffect(() => {
    const newOffset = 0 * resetPaginationData.limit;
    setPage(0);
    getEmails(newOffset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.sortDirection, props.sortKey, filterByTags, filterByState]);

  const handleViewNextEmailClicked = (currentEmailId: string) => {
    const currentEmailIndex = rows.findIndex((email) => email.id === currentEmailId);
    if (currentEmailIndex === -1) return;
    const nextEmailIndex = currentEmailIndex + 1;
    if (nextEmailIndex >= rows.length) return;
    setSelectedRow(rows[nextEmailIndex]);
  };

  const handleViewPreviousEmailClicked = (currentEmailId: string) => {
    const currentEmailIndex = rows.findIndex((email) => email.id === currentEmailId);
    if (currentEmailIndex === -1) return;
    const previousEmailIndex = currentEmailIndex - 1;
    if (previousEmailIndex < 0) return;
    setSelectedRow(rows[previousEmailIndex]);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerClassName: 'table--header',
      headerName: 'Name',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '120ch',
            fontSize: '0.8rem'
          }}
        >
          {params.row.from_address.emailAddress.address}
        </Typography>
      )
    },
    {
      field: 'body',
      headerClassName: 'table--header',
      headerName: 'Body',
      flex: 3,
      type: 'string',
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          {params.row.message_state === 'RESPONDED' ? (
            <Tooltip title="You have already responded to this email">
              <ReplyIcon
                sx={{
                  color: '#61a15f',
                  marginRight: '10px'
                }}
              />
            </Tooltip>
          ) : null}
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '120ch',
              fontSize: '0.8rem'
            }}
          >
            {params.row.body.content.replace(/<[^>]*>?/gm, '')}
          </Typography>
        </Box>
      )
    },
    {
      field: 'tag',
      headerClassName: 'table--header',
      headerName: 'Category',
      flex: 0.7,
      type: 'string',
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {params.row.message_state === 'NEW' ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.65rem',
                  backgroundColor: '#f5f5f5',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}
                variant="body1"
              >
                New
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                marginTop: '6px',
                display: 'flex'
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.65rem',
                  backgroundColor: `${getEmailLabel(params.row.label)?.color}`,
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}
                variant="body1"
              >
                {params.row.label}
              </Typography>
            </Box>
          )}
        </Box>
      )
    },
    {
      field: 'date',
      headerClassName: 'table--header',
      headerName: '',
      flex: 0.3,
      type: 'string',
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography
            sx={{
              fontStyle: 'italic',
              fontSize: '0.8rem',
              color: '#757575'
            }}
            variant="body1"
          >
            {formatReceivedTime(params.row.received_time)}
          </Typography>
        </Box>
      )
    }
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#fff'
      }}
    >
      <AppStripedDataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pagination
        checkboxSelection
        pageSize={25}
        rowsPerPageOptions={[25]}
        rowCount={paginationData.count}
        paginationMode="server"
        onPageChange={(newPage: any) => {
          setPage(newPage);
        }}
        disableSelectionOnClick
        getRowId={(row: any) => row.id}
        getCellClassName={(params: any) => {
          return styles.cell;
        }}
        getRowHeight={(params: any) => {
          return 70;
        }}
        onRowClick={(params: any) => {
          // filter row with selected row id and
          const filteredRows = rows.filter((row) => row.id === params.row.id);
          setSelectedRow(filteredRows[0]);
          setOpenDrawer(true);
        }}
        onSelectionModelChange={(newSelectionModel: GridSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
        loading={loading}
        keepNonExistentRowsSelected
        emptyRowsMessage="No emails found. Kindly refresh."
      />
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{
          sx: { width: '60%', padding: '20px 0 0 20px' }
        }}
      >
        <EmailDetailedView
          data={selectedRow}
          handleViewNextEmailClicked={handleViewNextEmailClicked}
          handleViewPreviousEmailClicked={handleViewPreviousEmailClicked}
          mailBoxId={mailBoxId}
          handleEmailRefresh={handleEmailRefresh}
        />
      </Drawer>
    </Box>
  );
};

const ForwadedEmailDisplaySection = forwardRef<EmailDisplaySectionRef, IEmailDisplaySection>(EmailDisplaySection);

export default ForwadedEmailDisplaySection;
