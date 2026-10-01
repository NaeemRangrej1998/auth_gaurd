import { FiHome, FiSettings, FiShield, FiUsers } from "react-icons/fi";

export const pageNames = {
    "dashboard": 1,
    "users": 2,
    "roles": 3,
    "areas": 5,
    "virtualtable": 6,
} as const

export const menuItems = [
    { path: '/', name: 'Dashboard', icon: <FiHome />, pageName: pageNames.dashboard },

    { path: '/users', name: 'Users', icon: <FiUsers />, pageName: pageNames.users },
    { path: '/roles', name: 'Roles', icon: <FiShield />, pageName: pageNames.roles },
    {
        name: 'Settings',
        icon: <FiSettings />,
        children: [
            { path: '/settings/area', name: 'Manage Area', pageName: pageNames.areas }
        ]
    },
    { path: '/virtualtable', name: 'VirtualTable', icon: <FiShield />, pageName: pageNames.virtualtable },
];
