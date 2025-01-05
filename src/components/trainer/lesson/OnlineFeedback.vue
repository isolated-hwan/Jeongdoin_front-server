<template>
    <div class="online-feedback">
        <div class="header">
            <h2>온라인 피드백</h2>
            <button @click="$emit('open-popup')" class="register-lesson-btn">레슨 등록하기</button>
        </div>
        <RegisterLessonPopup
            :is-visible="isRegisterPopupVisible"
            @close="closeRegisterPopup"
            @register="handleRegisterLesson"
        />

        <div class="lesson-card-list">
            <div
                v-for="lesson in onlineFeedbackLessons"
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
import RegisterLessonPopup from './RegisterLessonPopup.vue';

const selectedType = ref('온라인 피드백');
const selectedLesson = ref(null);
const isRegisterPopupVisible = ref(false);

const onlineFeedbackLessons = ref([
    {
        id: 1,
        title: '운동 자세 피드백',
        trainer: '김지훈',
        category: '헬스',
        description: '운동 자세에 대한 전문적인 피드백을 제공합니다.',
        price: 30000,
        image: 'https://kosa-final-project-team-3.github.io/cdn/lesson_image1.jpg',
    },
    {
        id: 2,
        title: '식단 분석 및 조언',
        trainer: '이영희',
        category: '영양',
        description: '개인 맞춤 식단 분석과 조언을 제공합니다.',
        price: 35000,
        image: 'https://www.example.com/online-feedback-posture.jpg',
    },
    // 더 많은 온라인 피드백 레슨 데이터...
]);

function openLessonDetail(lesson) {
    selectedLesson.value = lesson;
}

function closeLessonDetail() {
    selectedLesson.value = null;
}

function closeRegisterPopup() {
    isRegisterPopupVisible.value = false;
}

const handleRegisterLesson = async (lessonData) => {
    try {
        // TODO: API를 통해 새 레슨 등록
        console.log('Registering new online feedback lesson:', lessonData);
        // 성공 시 팝업 닫기
        closeRegisterPopup();
    } catch (error) {
        console.error('Failed to register online feedback lesson:', error);
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
