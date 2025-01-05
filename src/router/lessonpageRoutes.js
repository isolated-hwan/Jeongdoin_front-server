import OfflineLessonPage from '../pages/OfflineLessonPage.vue';
import PersonalLessonList from '../components/lesson/PersonalLessonList.vue';
import GroupLessonList from '../components/lesson/GroupLessonList.vue';
import OnlineLessonPage from '../pages/OnlineLessonPage.vue';
import OnlineLesson from '../components/lesson/OnlineLesson.vue';
import OnlineFeedback from '../components/lesson/OnlineFeedback.vue';

export default [
    {
        path: '/lesson/offline',
        name: 'OfflineLessonPage',
        component: OfflineLessonPage,
        children: [
            { path: '', name: 'PersonalLessonList', component: PersonalLessonList },
            { path: 'group', name: 'GroupLessonList', component: GroupLessonList },
        ],
    },
    {
        path: '/lesson/online',
        name: 'OnlineLessonPage',
        component: OnlineLessonPage,
        children: [
            { path: '', name: 'OnlineLesson', component: OnlineLesson },
            { path: 'feedback', name: 'OnlineFeedback', component: OnlineFeedback },
        ],
    },
];
