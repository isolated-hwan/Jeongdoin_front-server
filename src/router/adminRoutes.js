import AdminPage from '../components/admin/AdminPage.vue';
import TrainerManagement from '../components/admin/TrainerManagement.vue';
import ContactManagement from '../components/admin/ContactManagement.vue';
export default [
    {
        path: '/admin',
        name: 'AdminPage',
        component: AdminPage,
        meta: { useLayout: false },
        children: [
            {
                path: '',
                name: 'TrainerManagement',
                component: TrainerManagement,
            },
            {
                path: 'contact',
                name: 'ContactManagement',
                component: ContactManagement,
            },
        ],
    },
];
