// material-ui
import { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import Cookies from 'js-cookie';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import { FormControl } from '@mui/material';

// ==============================|| SAMPLE PAGE ||============================== //


const SamplePage = () => {
    const [rows, setRows] = useState([]);
    // ==============================|| Columns Config  ||============================== //
    // const MatEdit = ({ index }) => {

    //     const handleEditClick = () => {
    //         console.log(index);
    //     }
    //     return <FormControlLabel
    //         control={
    //             <IconButton color="secondary" aria-label="add an alarm" onClick={handleEditClick} >
    //                 <EditIcon style={{ color: blue[500] }} />
    //             </IconButton>
    //         }
    //     />
    // };

    const columns = [
        { field: 'userId', hide: true, identity: true },
        { field: 'fname', headerName: 'First name', width: 130 },
        { field: 'lname', headerName: 'Last name', width: 130 },
        { field: 'username', headerName: 'Username', width: 150 },
        // {
        //     field: 'edit',
        //     headerName: '',
        //     sortable: false,
        //     width: 140,
        //     disableClickEventBubbling: true,
        //     renderCell: (params) => (
        //         <div style={{ cursor: "pointer" }}>
        //             <MatEdit index={params.row.id} />
        //         </div>
        //     ),
        // },
        {
            field: 'edit',
            headerName: '',
            sortable: false,
            width: 140,
            disableClickEventBubbling: true,
            renderCell: (params) => (
                <div style={{ cursor: "pointer" }}>
                    <EditIcon index={params.row.id} />
                </div>
            ),
        },

    ];

    // ==============================|| Get members  ||============================== //
    const getMembers = () => {
        const token = Cookies.get('accessToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        axios
            .get(`https://dodeep-api.mecallapi.com/users`, config)
            .then((response) => setRows(response.data.users));
    }

    useEffect(() => {
        getMembers();
    }, [])
    return (
        <MainCard title="Member list">
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    id="userId"
                    getRowId={(row) => row.userId}
                />
            </div>
        </MainCard>
    );
}

export default SamplePage
