// material-ui
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

// project imports
import Cookies from 'js-cookie';

// Icons
import { Button, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { pink, amber } from '@mui/material/colors';

// Dialog
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

// ==============================|| SAMPLE PAGE ||============================== //

// ==============================|| Delete Dialog ||============================== //
export function AlertDeleteDialog(id, fname, lname) {
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
                    <DialogContentText id="alert-dialog-description">Do you want to delete</DialogContentText>
                    <p>
                        userID:{id} Name : {fname} {lname}
                    </p>
                    <p>Are you sure ?</p>
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

// ==============================|| Edit Information Dialog ||============================== //

export function EditDialog(id, fnames, lnames) {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({
        fname: '',
        lname: ''
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setData({ ...data, [e.target.name]: value });
    };

    const submitChange = async () => {
        const token = Cookies.get('accessToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        await axios.patch(`https://dodeep-api.mecallapi.com/users/${id}`, { fname: data.fname, lname: data.lname }, config).then((res) => {
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

    useEffect(() => {
        setData({ fname: fnames, lname: lnames });
    }, [fnames, lnames]);

    return (
        <div>
            <EditIcon sx={{ color: amber[500] }} onClick={handleClickOpen} />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit user information</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        UserID : {id} Fullname : {fnames} {lnames}
                    </DialogContentText>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' }
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            autoFocus
                            margin="dense"
                            id="fname"
                            name="fname"
                            label="First Name"
                            onChange={handleChange}
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="lname"
                            name="lname"
                            label="Last Name"
                            onChange={handleChange}
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={submitChange}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export function Edit(id) {
    return (
        <>
            <Link to={{ pathname: `/edit/${id}` }}>
                <EditIcon sx={{ color: amber[500] }} />
            </Link>
        </>
    );
}

const MemberList = () => {
    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
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
            cell: (id) => Edit(id.userId)
        },
        {
            name: '',
            button: true,
            cell: (id) => AlertDeleteDialog(id.userId, id.fname, id.lname)
        }
    ];

    const handlePageChange = (page) => {
        setPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setPage(page);
    };

    useEffect(() => {
        // ==============================|| Get members  ||============================== //
        const getMembers = async () => {
            setIsLoaded(true);
            const token = Cookies.get('accessToken');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            fetch(`https://dodeep-api.mecallapi.com/users?page=${page}&per_page=${perPage}&delay=1`, config)
                .then((res) => res.json())
                .then((result) => {
                    setData(result.data);
                    setTotalRows(result.total);
                })
                .catch((err) => setError(err));
            setIsLoaded(false);
        };
        getMembers();
    }, [page, perPage]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    if (isLoaded) {
        return <div>Loading. . . </div>;
    }
    return (
        <div style={{ height: '100%', width: '100%', borderRadius: '1.25rem 1.25rem 0px 0px' }}>
            <Typography to="/">
                <Button style={{ margin: '0 0 10px 10px' }} variant="contained" color="success" href="/register">
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
