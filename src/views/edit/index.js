// material-ui
import { Typography, TextField } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useLocation } from 'react-router-dom';

// ==============================|| SAMPLE PAGE ||============================== //

const EditPage = () => {
    const { state } = useLocation();
    return (
        <MainCard title="Sample Card">
            <Typography variant="body2">
                <TextField fullWidth label="Last Name" margin="normal" name="lname" type="text" inputProps={{}} />
                {state.user.fname} {state.user.lname}
            </Typography>
        </MainCard>
    );
};

export default EditPage;
