import { useRoutes, useNavigate } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import config from 'config';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const navigate = useNavigate();
    useEffect(() => {
        const getToken = Cookies.get('accessToken');
        if (getToken) {
            console.log('Authorized');
        } else {
            navigate('/pages/login/login3');
        }
    });
    return useRoutes([MainRoutes, AuthenticationRoutes], config.basename);
}
