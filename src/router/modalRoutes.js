import ContactModal from '../components/mainpage/ContactModal.vue';
import UserAgreementModal from '../components/mainpage/UserAgreementModal.vue';

export default [
    {
        path: '/contact',
        name: 'ContactModal',
        component: ContactModal,
        meta: { useLayout: false },
    },
    {
        path: '/terms',
        name: 'UserAgreementModal',
        component: UserAgreementModal,
        meta: { useLayout: false },
    },
];
