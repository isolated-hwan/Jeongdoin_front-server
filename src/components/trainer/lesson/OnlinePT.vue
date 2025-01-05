<template>
    <div class="online-pt">
        <div class="header">
            <h2>온라인 PT</h2>
            <button @click="$emit('open-popup')" class="register-lesson-btn">레슨 등록하기</button>
        </div>
        <div class="lesson-card-list">
            <div
                v-for="lesson in onlinePTLessons"
                :key="lesson.id"
                class="lesson-card"
                @click="openLessonDetail(lesson)"
            >
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
import { ref } from 'vue';
import LessonDetailPopup from './LessonDetailPopup.vue';

const selectedType = ref('온라인 PT');
const selectedLesson = ref(null);

const onlinePTLessons = ref([
    {
        id: 1,
        title: '체중 감량 프로그램',
        trainer: '강철희',
        category: '헬스',
        description: '초보자에게 적합한 전신 강화 트레이닝.',
        price: 60000,
        image: 'https://kosa-final-project-team-3.github.io/cdn/lesson_image1.jpg',
    },
    {
        id: 2,
        title: '근력 강화 트레이닝',
        trainer: '박정환',
        category: '헬스',
        description: '근력 향상을 위한 온라인 PT 프로그램',
        price: 65000,
        image: 'https://kosa-final-project-team-3.github.io/cdn/lesson_image1.jpg',
    },
    {
        id: 3,
        title: '유연성 향상 요가',
        trainer: '김지연',
        category: '요가',
        description: '유연성과 균형 감각을 향상시키는 온라인 요가 클래스',
        price: 55000,
        image: 'https://kosa-final-project-team-3.github.io/cdn/lesson_image1.jpg',
    },
    {
        id: 4,
        title: '홈 트레이닝 기초',
        trainer: '이민수',
        category: '홈트레이닝',
        description: '집에서 할 수 있는 기초 운동 프로그램',
        price: 50000,
        image: 'https://kosa-final-project-team-3.github.io/cdn/lesson_image1.jpg',
    },
]);

function openLessonDetail(lesson) {
    selectedLesson.value = lesson;
}

function closeLessonDetail() {
    selectedLesson.value = null;
}

const handleRegisterLesson = async (lessonData) => {
    try {
        // TODO: API를 통해 새 레슨 등록
        console.log('Registering new lesson:', lessonData);
        // 성공 시 팝업 닫기
        closeRegisterPopup();
    } catch (error) {
        console.error('Failed to register lesson:', error);
    }
};
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
