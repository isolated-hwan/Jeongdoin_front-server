<template>
    <div class="online-pt">
        <div class="header">
            <h2>온라인 PT</h2>
            <button @click="$emit('open-popup')" class="register-lesson-btn">레슨 등록하기</button>
        </div>
        <div class="lesson-card-list">
            <div v-for="(lesson, index) in lessons" :key="index" class="lesson-card" @click="openLessonDetail(lesson)">
                <div class="lesson-info">
                    <h4 class="lesson-title">{{ lesson.title }}</h4>
                    <p class="lesson-category">{{ lesson.category }}</p>
                </div>
            </div>
        </div>
        <LessonDetailPopup
            v-if="selectedLesson"
            :lesson="selectedLesson"
            :selectedType="selectedType"
            @close="closeLessonDetail"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LessonDetailPopup from './LessonDetailPopup.vue';
import jwtAxios, { API_SERVER_HOST } from '../../../util/jwtUtil';
import { useAuthStore } from '../../../stores/authStore';

const host = API_SERVER_HOST;
const authStore = useAuthStore();
const selectedType = ref('온라인 PT');
const selectedLesson = ref(null);
const lessons = ref([]);

const fetchLessons = async () => {
    try {
        const trainerId = authStore.id;
        const response = await jwtAxios.get(`http://${host}/api/online-lesson/trainer/${trainerId}`);
        lessons.value = response.data.map((lesson) => ({
            lessonId: lesson.lessonId,
            title: lesson.title,
            trainer: lesson.trainerId,
            category: lesson.category,
            description: lesson.content,
            price: lesson.price,
            image: '',
            type: '02',
        }));
    } catch (error) {
        console.error('레슨 목록 조회 실패:', error);
    }
};

onMounted(() => {
    fetchLessons();
});

function openLessonDetail(lesson) {
    selectedLesson.value = lesson;
}

function closeLessonDetail() {
    selectedLesson.value = null;
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.header h2 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
}

.register-lesson-btn {
    padding: 0.7rem 1.4rem;
    background-color: #f13223;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 10px;
    font-size: 1.1em;
}

.register-lesson-btn:hover {
    background-color: #d32f2f;
}

.lesson-card-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.lesson-card {
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.3s ease;
    display: flex;
    padding: 20px;
    margin: 10px;
    justify-content: space-between;
}

.lesson-card:hover {
    transform: translateY(-5px);
}

.lesson-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.lesson-title {
    width: 50%;
    font-size: 2rem;
    margin: 10px;
}

.lesson-category {
    font-size: 1.4rem;
    margin: 10px;
    color: #888;
    width: 10%;
}
</style>
