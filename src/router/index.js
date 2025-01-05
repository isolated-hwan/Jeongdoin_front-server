import { createWebHistory, createRouter } from 'vue-router';
import loginRoutes from './loginRoutes';
import mypageRoutes from './mypageRoutes';
import trainerpageRoutes from './trainerpageRoutes';
import HomePage from '../pages/HomePage.vue';
import lessonpageRoutes from './lessonpageRoutes';
import MiddleCompo from '../components/layouts/MiddleCompo.vue';
import modalRoutes from './modalRoutes';
import AIFeedback from '../components/lesson/AIFeedback.vue';
import MBTIPage from '../components/mainpage/MBTIPage.vue';
import adminRoutes from './adminRoutes';
const routes = [
    {
        path: '/',
        component: MiddleCompo,
        meta: { useLayout: true },
        children: [
            {
                path: '',
                name: 'HomePage',
                component: HomePage,
            },
            {
                path: 'feedback/ai',
                name: 'AIFeedback',
                component: AIFeedback,
            },
            {
                path: '/mbti',
                name: 'MBTIPage',
                component: MBTIPage,
            },
            ...lessonpageRoutes,
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: [...routes, ...loginRoutes, ...mypageRoutes, ...trainerpageRoutes, ...modalRoutes, ...adminRoutes],
});

// 전역 네비게이션 가드 추가
router.beforeEach((to, from, next) => {
    // AI 피드백 페이지에서 다른 페이지로 이동할 때
    if (from.name === 'AIFeedback' && to.name !== 'AIFeedback') {
        const aiFeedbackComponent = from.matched[0].instances.default;
        if (aiFeedbackComponent && typeof aiFeedbackComponent.disableWebcam === 'function') {
            aiFeedbackComponent.disableWebcam();
        }
    }
    next();
});

export default router;
