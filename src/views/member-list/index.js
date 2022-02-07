// material-ui
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

// project imports
import Cookies from 'js-cookie';

// Icons
import { Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { pink } from '@mui/material/colors';

// Dialog
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import Swal from 'sweetalert2';

// ==============================|| SAMPLE PAGE ||============================== //

export function AlertDeleteDialog(id) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const submitDelete = () => {
        const token = Cookies.get('accessToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        axios.delete(`https://dodeep-api.mecallapi.com/users/${id}`, config).then((res) => {
            handleClose();
            console.log(res.data);
            Swal.fire({
                title: res.data.message,
                text: `Status : ${res.data.status}`,
                icon: 'success',
                confirmButtonText: 'Close'
            });
            window.location.reload();
        });
    };

    return (
        <div>
            <DeleteIcon sx={{ color: pink[500] }} onClick={handleClickOpen} />
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title" prop={"Use Google's location service?"} />
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Do you want to delete userID {id} ? Are you sure ?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={submitDelete} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export function FormDialog(id) {
    const [open, setOpen] = useState(false);
    const [pw, setPw] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setPw(e.target.value);
    };

    const submitChange = async () => {
        const token = Cookies.get('accessToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        await axios.patch(`https://dodeep-api.mecallapi.com/users/${id}`, { password: pw }, config).then((res) => {
            handleClose();
            console.log(res.data);
            Swal.fire({
                title: res.data.message,
                text: `Status : ${res.data.status}`,
                icon: 'success',
                confirmButtonText: 'Close'
            });
        });
    };

    return (
        <div>
            <Button onClick={handleClickOpen}>Change Password</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>Enter new password for UserID {id} </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Password"
                        onChange={handleChange}
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={submitChange}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const MemberList = () => {
    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [error, setError] = useState('');

    const columns = [
        {
            name: 'UserID',
            selector: (row) => row.userId
        },
        {
            name: 'First Name',
            selector: (row) => row.fname
        },
        {
            name: 'Last Name',
            selector: (row) => row.lname
        },
        {
            name: 'Username',
            selector: (row) => row.username
        },
        {
            name: '',
            button: true,
            cell: (id) => FormDialog(id.userId)
        },
        {
            name: '',
            button: true,
            cell: (id) => AlertDeleteDialog(id.userId)
        }
    ];

    // ==============================|| Get members  ||============================== //
    const getMembers = async (page) => {
        setIsLoaded(true);
        const token = Cookies.get('accessToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        fetch(`https://dodeep-api.mecallapi.com/users?page=${page}&per_page=${perPage}&delay=1`, config)
            .then((res) => res.json())
            .then((result) => {
                setData(result.users);
                setTotalRows(result.total);
            })
            .catch((err) => setError(err));
        setIsLoaded(false);
    };

    const handlePageChange = (page) => {
        getMembers(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setIsLoaded(true);
        const token = Cookies.get('accessToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        fetch(`https://dodeep-api.mecallapi.com/users?page=${page}&per_page=${newPerPage}&delay=1`, config)
            .then((res) => res.json())
            .then((result) => {
                setData(result.users);
                setTotalRows(result.total);
            })
            .catch((err) => setError(err));
        setIsLoaded(false);
    };

    useEffect(() => {
        getMembers(1);
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    if (isLoaded) {
        return <div>Loading. . . </div>;
    }
    return (
        <div style={{ height: '100%', width: '100%', borderRadius: '1.25rem 1.25rem 0px 0px' }}>
            <Typography to="/">
                <Button style={{ margin: '0 0 10px 10px' }} variant="contained" color="success" href="/pages/register/register3">
                    Add Members
                </Button>
            </Typography>
            <DataTable
                columns={columns}
                data={data}
                progressPending={isLoaded}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />
        </div>
    );
};

export default MemberList;
