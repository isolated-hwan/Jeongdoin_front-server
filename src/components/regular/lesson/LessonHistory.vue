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
                    <th>상태</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="lesson in filteredLessons" :key="lesson.id" @click="openLessonDetail(lesson)">
                    <td>{{ lesson.type }}</td>
                    <td>{{ lesson.category }}</td>
                    <td>{{ lesson.title }}</td>
                    <td>{{ lesson.trainer }}</td>
                    <td @click.stop="openStatusPopup(lesson)">{{ lesson.status }}</td>
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

        <status-popup v-if="showStatusPopup" :lesson="selectedStatusLesson" @close="showStatusPopup = false" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../../../stores/authStore';
import jwtAxios, { API_SERVER_HOST } from '../../../util/jwtUtil';
import LessonDetail from '../../lesson/LessonDetail.vue';
import StatusPopup from './StatusPopup.vue';

const host = API_SERVER_HOST;
const authStore = useAuthStore();
const memberId = computed(() => authStore.id);
const lessons = ref([]);
const selectedLesson = ref(null);
const selectedStatusLesson = ref(null);
const showStatusPopup = ref(false);
const searchKeyword = ref('');

const filteredLessons = computed(() => {
    if (!searchKeyword.value) return lessons.value;
    return lessons.value.filter((lesson) => lesson.trainer.toLowerCase().includes(searchKeyword.value.toLowerCase()));
});

onMounted(async () => {
    await fetchLessons();
    console.log(lessons);
});

const fetchLessons = async () => {
    try {
        const response = await jwtAxios.get(`http://${host}/api/apply-lesson/member/${memberId.value}`);

        lessons.value = response.data.map((lesson) => ({
            id: lesson.lessonId,
            type: lesson.lessonType,
            category: lesson.exerciseCategory,
            title: lesson.title,
            trainer: lesson.trainerName,
            status: lesson.status,
            // 상세 정보
            description: lesson.content,
            price: lesson.price,
            location: lesson.location,
            lat: lesson.lat,
            lng: lesson.lng,
            maxCnt: lesson.maxCnt,
            recruitmentStart: lesson.recruitmentStart,
            recruitmentEnd: lesson.recruitmentEnd,
            // 문의 정보
            memberContent: lesson.memberContent,
            trainerContent: lesson.trainerContent,
            startDate: lesson.startDate,
            endDate: lesson.endDate,
            count: lesson.count,
        }));
    } catch (error) {
        console.error('레슨 내역 조회 실패:', error);
    }
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

const openStatusPopup = (lesson) => {
    selectedStatusLesson.value = lesson;
    showStatusPopup.value = true;
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
