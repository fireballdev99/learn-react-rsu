import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

// ==============================|| SAMPLE PAGE ||============================== //

const EditPage = ({ ...others }) => {
    const { id } = useParams();
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = useState(false);
    const [items, setItems] = useState();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const edit = (usernames, passwords, fnames, lnames) => {
        const token = Cookies.get('accessToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        axios
            .patch(
                `https://dodeep-api.mecallapi.com/users/${id}`,
                {
                    username: usernames,
                    password: passwords,
                    fname: fnames,
                    lname: lnames
                },
                config
            )
            .then((response) => {
                navigate('/member-list');
                Swal.fire({
                    title: response.data.message,
                    text: `Status : ${response.data.status}`,
                    icon: 'success',
                    confirmButtonText: 'Close'
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        const token = Cookies.get('accessToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        axios.get(`https://dodeep-api.mecallapi.com/users/${id}`, config).then((res) => {
            setItems(res.data.user);
        });
    }, []);
    if (!items) {
        return <div>Loading</div>;
    }
    if (items) {
        return (
            <MainCard title="Edit Infomation">
                <Grid container direction="column" justifyContent="center" spacing={2}>
                    <Grid item xs={12} container alignItems="center" justifyContent="center">
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">
                                Edit User : {items.fname} {items.lname}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Formik
                    initialValues={{
                        username: items.username,
                        password: '',
                        fname: items.fname,
                        lname: items.lname,
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        username: Yup.string().required('Username is required'),
                        password: Yup.string().max(255).required('Password is required')
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        console.log(values);
                        try {
                            if (scriptedRef.current) {
                                edit(values.username, values.password, values.fname, values.lname);
                                setStatus({ success: true });
                                setSubmitting(false);
                            }
                        } catch (err) {
                            console.error(err);
                            if (scriptedRef.current) {
                                setStatus({ success: false });
                                setErrors({ submit: err.message });
                                setSubmitting(false);
                            }
                        }
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit} {...others}>
                            <Grid container spacing={matchDownSM ? 0 : 2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        value={values.fname}
                                        margin="normal"
                                        name="fname"
                                        onChange={handleChange}
                                        type="text"
                                        inputProps={{}}
                                        sx={{ ...theme.typography.customInput }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        value={values.lname}
                                        margin="normal"
                                        name="lname"
                                        onChange={handleChange}
                                        type="text"
                                        inputProps={{}}
                                        sx={{ ...theme.typography.customInput }}
                                    />
                                </Grid>
                            </Grid>
                            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                                <InputLabel htmlFor="outlined-adornment-username-edit">Username</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-username-edit"
                                    type="username"
                                    value={values.username}
                                    name="username"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    inputProps={{}}
                                />
                            </FormControl>

                            <FormControl
                                fullWidth
                                error={Boolean(touched.password && errors.password)}
                                sx={{ ...theme.typography.customInput }}
                            >
                                <InputLabel htmlFor="outlined-adornment-password-edit">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password-edit"
                                    type={showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    name="password"
                                    label="Password"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                size="large"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    inputProps={{}}
                                />
                                {touched.password && errors.password && (
                                    <FormHelperText error id="standard-weight-helper-text-password-edit">
                                        {errors.password}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Box sx={{ mt: 2 }}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Sign up
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </form>
                    )}
                </Formik>
            </MainCard>
        );
    }
    return <div>Error</div>;
};

export default EditPage;
