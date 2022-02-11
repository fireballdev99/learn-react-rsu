import { useRoutes, useNavigate } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import config from 'config';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { verify } from 'services/users';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const navigate = useNavigate();
    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            verify(accessToken)
                .then((response) => {
                    if (response.data.status === 'ok') {
                        console.log('Authorized');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    navigate('/pages/login/login3');
                });
        } else {
            navigate('/pages/login/login3');
        }
    }, [navigate]);
    return useRoutes([MainRoutes, AuthenticationRoutes], config.basename);
}
