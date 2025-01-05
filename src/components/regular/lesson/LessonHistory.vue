<template>
    <div class="lesson-history">
        <div class="header">
            <h3>레슨 내역</h3>
            <div class="search-container">
                <input type="text" v-model="searchKeyword" placeholder="트레이너 검색" @input="filterLessons" />
            </div>
        </div>
        <table class="lesson-table">
            <thead>
                <tr>
                    <th>레슨 종류</th>
                    <th>운동 종류</th>
                    <th>레슨 이름</th>
                    <th>트레이너</th>
                    <th>시작 날짜</th>
                    <th>종료 날짜</th>
                    <th>횟수</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="lesson in filteredLessons" :key="lesson.id" @click="openLessonDetail(lesson)">
                    <td>{{ lesson.type }}</td>
                    <td>{{ lesson.category }}</td>
                    <td>{{ lesson.title }}</td>
                    <td>{{ lesson.trainer }}</td>
                    <td>{{ formatDate(lesson.startDate) }}</td>
                    <td>{{ formatDate(lesson.endDate) }}</td>
                    <td>{{ lesson.count }}</td>
                </tr>
            </tbody>
        </table>
        <div v-if="filteredLessons.length === 0" class="no-lessons">검색 결과가 없습니다.</div>

        <lesson-detail
            v-if="selectedLesson"
            :lesson="selectedLesson"
            :selectedType="selectedLesson.type"
            @close="closeLessonDetail"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../../../stores/authStore';
import jwtAxios, { API_SERVER_HOST } from '../../../util/jwtUtil';
import LessonDetail from '../../lesson/LessonDetail.vue';

const authStore = useAuthStore();
const lessons = ref([]);
const selectedLesson = ref(null);
const searchKeyword = ref('');

const filteredLessons = computed(() => {
    if (!searchKeyword.value) return lessons.value;
    return lessons.value.filter((lesson) => lesson.trainer.toLowerCase().includes(searchKeyword.value.toLowerCase()));
});

onMounted(async () => {
    await fetchLessons();
});

const fetchLessons = async () => {
    // 실제 API 호출 대신 더미 데이터를 사용합니다.
    lessons.value = [
        {
            id: 1,
            type: '개인 레슨',
            category: '헬스',
            title: '전신 운동 PT',
            trainer: '강철희',
            startDate: '2023-05-01',
            endDate: '2023-07-31',
            status: 'ongoing',
            description: '초보자에게 적합한 전신 강화 트레이닝.',
            price: 60000,
            trainerProfile: ['국가대표 출신 강사', '스포츠지도사 자격증 보유'],
            location: '서울 종로구 혜화로 20',
            image: 'https://kosa-final-project-team-3.github.io/cdn/lesson_image1.jpg',
            reviews: [
                '친절하고 설명이 명확합니다.',
                '운동 동작을 세심하게 지도해줘서 좋았어요.',
                '시간 약속을 잘 지킵니다.',
                '강의 준비가 철저해요.',
            ],
            ratings: {
                전문성: 4,
                친절: 5,
                설명: 4,
                시간엄수: 5,
                열정: 4,
            },
            count: 10,
        },
        {
            id: 2,
            type: '그룹 레슨',
            category: '요가',
            title: '중급반 요가',
            trainer: '서진이',
            startDate: '2023-06-01',
            endDate: '2023-08-31',
            status: 'ongoing',
            description: '유연성 향상과 근력 강화에 도움을 주는 중급자 요가.',
            price: 50000,
            trainerProfile: ['요가 전문 자격증 보유'],
            location: '서울 마포구',
            image: 'https://kosa-final-project-team-3.github.io/cdn/lesson_image1.jpg',
            maxParticipants: 12,
            reviews: ['유연성이 많이 향상되었어요!', '운동 중간중간 자세 교정이 꼼꼼��서 좋습니다.'],
            ratings: {
                전문성: 5,
                친절: 4,
                설명: 5,
                시간엄수: 4,
                열정: 5,
            },
            count: 20,
        },
        {
            id: 3,
            type: '온라인 레슨',
            category: '필라테스',
            title: '온라인 필라테스 집중 코어',
            trainer: '이은정',
            startDate: '2023-04-01',
            endDate: '2023-06-30',
            status: 'completed',
            description: '코어 강화에 특화된 고급 필라테스 수업입니다.',
            price: 70000,
            trainerProfile: ['필라테스 마스터 트레이너'],
            image: 'https://kosa-final-project-team-3.github.io/cdn/lesson_image1.jpg',
            reviews: ['수업이 아주 체계적이고 좋아요.', '상세한 피드백을 받을 수 있어요.'],
            ratings: {
                전문성: 5,
                친절: 4,
                설명: 5,
                시간엄수: 5,
                열정: 5,
            },
            count: 30,
        },
    ];
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
};

const openLessonDetail = (lesson) => {
    selectedLesson.value = lesson;
};

const closeLessonDetail = () => {
    selectedLesson.value = null;
};

const filterLessons = () => {
    // 이 함수는 computed 속성으로 인해 자동으로 처리됩니다.
};
</script>

<style scoped>
.lesson-history {
    padding: 1rem;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.header h3 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
}

.search-container {
    display: flex;
    align-items: center;
}

.search-container input {
    width: 200px;
    padding: 0.5rem;
    font-size: 0.9rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.lesson-table {
    width: 100%;
    border-collapse: collapse;
}

.lesson-table th,
.lesson-table td {
    border: 1px solid #ddd;
    padding: 0.8rem;
    text-align: left;
}

.lesson-table th {
    background-color: #f2f2f2;
    font-weight: bold;
}

.lesson-table tr:nth-child(even) {
    background-color: #f9f9f9;
}

.lesson-table tr:hover {
    background-color: #f5f5f5;
}

.status {
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-size: 0.9rem;
}

.status.ongoing {
    background-color: #e7f5ff;
    color: #1c7ed6;
}

.status.completed {
    background-color: #e6fcf5;
    color: #0ca678;
}

.status.upcoming {
    background-color: #fff9db;
    color: #f59f00;
}

.no-lessons {
    text-align: center;
    padding: 2rem;
    color: #666;
}

.lesson-table tbody tr {
    cursor: pointer;
}

.lesson-table tbody tr:hover {
    background-color: #f0f0f0;
}
</style>
