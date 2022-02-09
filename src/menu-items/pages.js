// assets
import { IconKey } from '@tabler/icons';
import PersonIcon from '@mui/icons-material/Person';

// constant
const icons = {
    IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    title: 'Pages',
    caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'member',
            title: 'Member',
            type: 'collapse',
            icon: PersonIcon,

            children: [
                {
                    id: 'memberlist',
                    title: 'Member List',
                    type: 'item',
                    url: '/member-list',
                    target: false
                }
            ]
        },
        {
            id: 'authentication',
            title: 'Something',
            type: 'collapse',
            icon: icons.IconKey,

            children: [
                {
                    id: 'login3',
                    title: 'Something if you want',
                    type: 'item',
                    url: '/',
                    target: false
                },
                {
                    id: 'register3',
                    title: 'Something if you want',
                    type: 'item',
                    url: '/',
                    target: false
                }
            ]
        }
    ]
};

export default pages;
