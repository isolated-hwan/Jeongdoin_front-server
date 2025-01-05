<template>
    <div class="personal-lessons">
        <div class="header">
            <h2>개인 레슨</h2>
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

        <inquiry-form v-if="showInquiryForm" :lesson="selectedLesson" @close="closeInquiryForm" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import LessonDetailPopup from './LessonDetailPopup.vue';

const selectedType = ref('개인 레슨');
const selectedLesson = ref(null); // 선택된 레슨

const lessons = ref([
    {
        title: '전신 운동 PT',
        trainer: '박정환',
        category: '헬스',
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
    },
    {
        title: '가슴 운동 PT',
        trainer: '강철희',
        category: '헬스',
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
    },
    {
        title: '어깨 운동 PT',
        trainer: '강철희',
        category: '헬스',
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
    },
    {
        title: '등 운동 PT',
        trainer: '강철희',
        category: '헬스',
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
    },
    {
        title: '하체 운동 PT',
        trainer: '강철희',
        category: '헬스',
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
