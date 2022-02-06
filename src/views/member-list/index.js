// material-ui
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import Cookies from 'js-cookie';

// Icons
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { pink } from '@mui/material/colors';

// Dialog
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// ==============================|| SAMPLE PAGE ||============================== //

export function AlertDeleteDialog() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const submitDelete = () => {
        console.log('Deleting...!');
        handleClose();
    };

    return (
        <div>
            <DeleteIcon sx={{ color: pink[500] }} onClick={handleClickOpen} />
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title" prop={"Use Google's location service?"} />
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Do you want to delete user ...... ? Are you sure ?</DialogContentText>
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

export function FormDialog() {
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

    const submitChange = () => {
        console.log(pw);
        handleClose();
    };

    return (
        <div>
            <Button onClick={handleClickOpen}>Change Password</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>Enter new password for User ...... </DialogContentText>
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
    const [rows, setRows] = useState([]);

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
            cell: () => FormDialog()
        },
        {
            name: '',
            button: true,
            cell: () => AlertDeleteDialog()
        }
    ];

    // ==============================|| Get members  ||============================== //
    const getMembers = () => {
        const token = Cookies.get('accessToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        axios.get(`https://dodeep-api.mecallapi.com/users`, config).then((response) => setRows(response.data.users));
    };

    useEffect(() => {
        getMembers();
    }, []);
    return (
        <MainCard title="Member list">
            <div style={{ height: 400, width: '100%' }}>
                <DataTable columns={columns} data={rows} pagination />
            </div>
        </MainCard>
    );
};

export default MemberList;
