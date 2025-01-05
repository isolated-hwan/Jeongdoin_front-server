<template>
    <div class="group-lessons">
        <div class="header">
            <h2>그룹 레슨</h2>
            <button @click="$emit('open-popup')" class="register-lesson-btn">레슨 등록하기</button>
        </div>
        <RegisterLessonPopup
            :is-visible="isRegisterPopupVisible"
            @close="closeRegisterPopup"
            @register="handleRegisterLesson"
        />

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
            @updateParticipants="updateParticipants"
        />
    </div>
</template>

<script setup>
import RegisterLessonPopup from './RegisterLessonPopup.vue';
import { ref } from 'vue';
import LessonDetailPopup from './LessonDetailPopup.vue';

const isRegisterPopupVisible = ref(false);
const selectedType = ref('그룹 레슨');
const selectedLesson = ref(null);

const lessons = ref([
    {
        id: 1,
        title: '그룹 전신 운동 PT',
        trainer: '박정환',
        category: '헬스',
        description: '초보자에게 적합한 전신 강화 그룹 트레이닝.',
        price: 40000,
        trainerProfile: ['국가대표 출신 강사', '스포츠지도사 자격증 보유'],
        location: '서울 종로구 혜화로 20',
        image: 'https://kosa-final-project-team-3.github.io/cdn/lesson_image1.jpg',
        recruitmentStart: '2023-05-01',
        recruitmentEnd: '2023-05-31',
        currentParticipants: 3,
        maxParticipants: 10,
        reviews: [
            '그룹 수업이라 부담 없이 참여할 수 있어요.',
            '다른 참여자들과 함께 운동하니 더 열심히 하게 됩니다.',
            '강사님의 설명이 명확해요.',
        ],
        ratings: {
            전문성: 4,
            친절: 5,
            설명: 4,
            시간엄수: 5,
            열정: 4,
        },
    },
    {
        id: 2,
        title: '그룹 요가 클래스',
        trainer: '김지연',
        category: '요가',
        description: '모든 레벨에 적합한 그룹 요가 수업입니다.',
        price: 35000,
        trainerProfile: ['요가 강사 10년 경력', '국제 요가 자격증 보유'],
        location: '서울 마포구 와우산로 29',
        image: 'https://kosa-final-project-team-3.github.io/cdn/lesson_image1.jpg',
        recruitmentStart: '2023-05-15',
        recruitmentEnd: '2023-06-15',
        currentParticipants: 5,
        maxParticipants: 15,
        reviews: [
            '요가 초보자도 쉽게 따라할 수 있어요.',
            '그룹 수업이라 즐거운 분위기에서 요가를 배울 수 있습니다.',
            '강사님이 자세를 꼼꼼히 봐주셔서 좋아요.',
        ],
        ratings: {
            전문성: 5,
            친절: 4,
            설명: 5,
            시간엄수: 4,
            열정: 5,
        },
    },
]);

const closeRegisterPopup = () => {
    isRegisterPopupVisible.value = false;
};
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

function openLessonDetail(lesson) {
    selectedLesson.value = lesson;
}

function closeLessonDetail() {
    selectedLesson.value = null;
}

function updateParticipants(lessonId, change) {
    const lesson = lessons.value.find((l) => l.id === lessonId);
    if (lesson) {
        lesson.currentParticipants += change;
    }
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
