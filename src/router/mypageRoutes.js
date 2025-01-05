import MyPage from '../pages/MyPage.vue';
import MyPageUserInfo from '../components/regular/MyPageUserInfo.vue';
import MyPageUserDiary from '../components/regular/MyPageUserDiary.vue';
import MemberDashboard from '../components/regular/MemberDashboard.vue';
import MyLesson from '../components/regular/MyLesson.vue';

export default [
    {
        path: '/mypage',
        component: MyPage,
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: MemberDashboard,
            },
            {
                path: 'userinfo',
                name: 'MyPageUserInfo',
                component: MyPageUserInfo,
            },
            {
                path: 'userdiary',
                name: 'MyPageUserDiary',
                component: MyPageUserDiary,
            },
            {
                path: 'mylesson',
                name: 'MyLesson',
                component: MyLesson,
            },
        ],
    },
];
