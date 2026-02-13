import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import api from "../../services/AuthService";

import { baseUrl } from "../../constants/constants";

const columns = [
  { id: "firstName", label: "First Name", minWidth: 170 },
  { id: "lastName", label: "Last Name", minWidth: 170 },
  { id: "specialization", label: "Specialization", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 100 },

  {
    id: "medicalId",
    label: "Doctor ID",
    minWidth: 170,
    align: "left",
  },
  {
    id: "createdAt",
    label: "Created At",
    minWidth: 170,
    align: "left",
  },
  { id: "ApproveBtn", label: "Apporve", minWidth: 100 },
  { id: "delBtn", label: "Remove", minWidth: 100 },
];

export default function StickyHeadTable() {
  const [open, setOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [userData, setUserData] = React.useState();

  const handleClickOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setDeleteId();
    setOpen(false);
  };

  const handleDelete = () => {
    console.log("DeleteID", deleteId);
    api
      .delete(`${baseUrl}/doctors/${deleteId}`, {})
      .then((res) => {
        if (res) {
          getUsers();
        }
      })
      .catch((error) => {
        console.log(error);
        return error.response;
      });

    setOpen(false);
  };

  React.useEffect(() => {
    // setUserData();
    getUsers();
  }, []);

  const getUsers = () => {
    api
      .get(`${baseUrl}/doctors`, {})
      .then((res) => {
        console.log(res.data);
        setUserData(res.data);
      })
      .catch((err) => {
        console.log("error " + err);
      });
  };

  const handleApprove = (id) => {
    console.log(`${baseUrl}/doctors/verifyDoctor/${id}`);
    api
      .patch(`${baseUrl}/doctors/verifyDoctor/${id}`, {})
      .then((res) => {
        if (res) {
          getUsers();
        }
      })
      .catch((error) => {
        console.log(error);
        return error.response;
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {userData &&
              userData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "ApproveBtn" &&
                              (!row.medicalIdVerify ? (
                                <Button
                                  onClick={() => {
                                    handleApprove(row._id);
                                  }}
                                  variant="outlined"
                                  size="small"
                                >
                                  Approve
                                </Button>
                              ) : (
                                <Button disabled variant="text" size="small">
                                  Approved
                                </Button>
                              ))}

                            {column.id === "delBtn" && (
                              <>
                                <Button
                                  variant="outlined"
                                  onClick={() => handleClickOpen(row._id)}
                                  color="error"
                                >
                                  Delete
                                </Button>
                                <Dialog
                                  open={open}
                                  onClose={() => handleClose}
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle id="alert-dialog-title">
                                    {"Are you sure?"}
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      This action cannot be undone. This will
                                      permanently delete the doctor from the
                                      database.
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button
                                      color="error"
                                      onClick={() => handleDelete()}
                                    >
                                      Delete
                                    </Button>
                                    <Button onClick={handleClose} autoFocus>
                                      Cancel
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </>
                            )}
                            {column.id !== "ApproveBtn" &&
                              column.id !== "delBtn" &&
                              value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={userData ? userData.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
