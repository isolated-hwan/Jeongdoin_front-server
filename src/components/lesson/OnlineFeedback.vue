<template>
    <div class="lesson-container">
        <search-compo @search="handleSearch" @sort="handleSort" />
        <div class="lesson-category">
            <button
                @click="selectCategory('')"
                :class="{ active: selectedCategory === '' }"
                class="lesson-category-button"
            >
                전체
            </button>
            <button
                v-for="category in categories"
                :key="category"
                @click="selectCategory(category)"
                :class="{ active: selectedCategory === category }"
                class="lesson-category-button"
            >
                {{ category }}
            </button>
        </div>

        <div class="lesson-card-list">
            <div
                v-for="(lesson, index) in sortedLessons"
                :key="index"
                class="lesson-card"
                @click="openLessonDetail(lesson)"
            >
                <div class="lesson-image-container">
                    <img :src="lesson.image" alt="레슨 이미지" class="lesson-image" />
                    <div class="lesson-content">
                        <div class="lesson-info">
                            <div class="lesson-title">{{ lesson.title }}</div>
                            <p><strong>강사:</strong> {{ lesson.trainer }}</p>
                            <p><strong>카테고리:</strong> {{ lesson.category }}</p>
                            <p><strong>가격:</strong> {{ lesson.price }}원</p>
                        </div>
                        <div class="button-container">
                            <button class="join-button">문의하기</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <lesson-detail
            v-if="selectedLesson"
            :lesson="selectedLesson"
            :selectedType="selectedType"
            @close="closeLessonDetail"
            @openInquiry="openInquiryForm"
        />

        <feedback-request v-if="showInquiryForm" :lesson="inquiryLesson" @close="closeInquiryForm" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import LessonDetail from './LessonDetail.vue';
import FeedbackRequest from './FeedbackRequest.vue';
import SearchCompo from '../search/SearchCompo.vue';

const lessons = ref([
    {
        type: '온라인 피드백',
        trainer: '이효리',
        category: '요가',
        title: '이효리와 함께하는 요가 중급 레슨',
        description:
            '마음과 몸의 수양을 통해 평정심을 찾아보세요. 15년 경력의 요가 전문가 이효리와 함께 기초부터 중급 요가 동작을 배웁니다. 호흡법, 아사나, 명상을 통해 몸과 마음의 균형을 찾고 스트레스를 해소할 수 있습니다.',
        price: 30000,
        image: 'https://kosa-final-project-team-3.github.io/cdn/of7.jpeg',
        reviews: ['친절하고 설명이 명확합니다.', '몸이 한 층 더 유연해졌어요.', '강의 준비가 철저해요.'],
        ratings: {
            전문성: 4,
            친절: 4,
            설명: 4,
            시간엄수: 5,
            열정: 5,
        },
    },
    {
        type: '온라인 레슨',
        title: '국가대표 출신과 함께하는 수영 교실',
        trainer: '박태환',
        category: '수영',
        description:
            '바른 자세로 영법을 배웁니다. 국가를 대표하는 전문성을 기반으로 수업을 진행합니다. 올림픽 금메달리스트 박태환 선수의 노하우를 직접 전수받을 수 있는 기회! 자유형, 평영, 접영, 배영의 기본 자세부터 고급 기술까지 체계적으로 학습합니다. 수영의 효율성을 높이고 속도를 향상시키는 비밀을 배워보세요.',
        price: 50000,
        image: 'https://kosa-final-project-team-3.github.io/cdn/of2.jpg',
        reviews: ['자세를 잘 잡아줍니다!', '전문적이여서 좋아요.'],
        ratings: {
            전문성: 5,
            친절: 4,
            설명: 5,
            시간엄수: 4,
            열정: 5,
        },
    },
    {
        type: '온라인 레슨',
        title: '원더걸스 혜림의 필라테스 교실',
        trainer: '혜림',
        category: '필라테스',
        description:
            '즐겁게 운동하며 올바른 자세로 필라테스를 배웁니다. 아이돌 출신 혜림의 10년 필라테스 경험을 바탕으로 한 맞춤형 레슨! 코어 강화, 자세 교정, 유연성 향상에 중점을 둔 운동 프로그램을 제공합니다. 음악과 함께하는 즐거운 필라테스로 건강하고 아름다운 몸매를 만들어보세요.',
        price: 40000,
        image: 'https://kosa-final-project-team-3.github.io/cdn/of10.jpeg',
        reviews: ['수업 분위기가 너무 좋아요.', '자세를 잘 잡아줍니다!', '즐겁게 운동할 수 있어요.'],
        ratings: {
            전문성: 4,
            친절: 4,
            설명: 5,
            시간엄수: 4,
            열정: 5,
        },
    },
    {
        type: '온라인 레슨',
        title: '제주도에서 이상순과 함께하는 힐링 요가 교실',
        trainer: '이상순',
        category: '요가',
        description:
            '제주도의 아름다운 자연과 함께 힐링 요가를 즐겨보세요. 20년 경력의 요가 마스터 이상순과 함께하는 특별한 온라인 클래스! 하타 요가, 빈야사 요가, 인요가 등 다양한 요가 스타일을 경험할 수 있습니다. 스트레스 해소, 근육 이완, 심신 안정에 효과적인 요가 동작들을 배워봅니다.',
        price: 30000,
        image: 'https://kosa-final-project-team-3.github.io/cdn/of8.jpeg',
        reviews: ['수업 분위기가 너무 좋아요.', '자세를 잘 잡아줍니다!', '즐겁게 운동할 수 있어요.'],
        ratings: {
            전문성: 4,
            친절: 4,
            설명: 5,
            시간엄수: 4,
            열정: 5,
        },
    },
    {
        type: '온라인 레슨',
        title: '수준높은 헬스는 이승철 피트니스 감독과 함께',
        trainer: '이승철',
        category: '헬스',
        description:
            '중급자부터 숙련자까지 수준 높은 웨이트 트레이닝을 배울 수 있습니다. 대한민국 최고의 보디빌더 이승철 감독의 30년 노하우를 전수받는 프리미엄 클래스! 과학적인 운동 방법과 영양학을 바탕으로 한 체계적인 근육 증가 프로그램을 제공합니다. 개인의 체형과 목표에 맞는 맞춤형 운동 루틴으로 최상의 결과를 얻을 수 있습니다.',
        price: 60000,
        image: 'https://kosa-final-project-team-3.github.io/cdn/of11.jpeg',
        reviews: ['전문적이에요.', '자세를 잘 잡아줍니다!', '선생님께 많이 배워가고 있어요.'],
        ratings: {
            전문성: 5,
            친절: 4,
            설명: 5,
            시간엄수: 3.5,
            열정: 4,
        },
    },
]);

const categories = ref(['헬스', '요가', '필라테스', '수영', '댄스', '기타']);

const selectedType = ref('온라인 피드백');
const selectedLesson = ref(null); // 선택된 레슨
const selectedCategory = ref('');
const showInquiryForm = ref(false); // 문의하기 폼 상태
const inquiryLesson = ref(null);
const searchType = ref('total');
const searchKeyword = ref(''); // 검색
const sortType = ref('popular'); // 정렬

const filteredLessons = computed(() => {
    return lessons.value.filter((lesson) => {
        let matchesSearch = true;

        if (searchKeyword.value) {
            const keyword = searchKeyword.value.toLowerCase();
            if (searchType.value === 'total') {
                matchesSearch =
                    lesson.title.toLowerCase().includes(keyword) || lesson.trainer.toLowerCase().includes(keyword);
            } else if (searchType.value === 'title') {
                matchesSearch = lesson.title.toLowerCase().includes(keyword);
            } else if (searchType.value === 'trainer') {
                matchesSearch = lesson.trainer.toLowerCase().includes(keyword);
            }
        }

        const matchesCategory = !selectedCategory.value || lesson.category === selectedCategory.value;

        return matchesSearch && matchesCategory;
    });
});

const sortedLessons = computed(() => {
    const sorted = [...filteredLessons.value];

    if (sortType.value === 'popular') {
        sorted.sort((a, b) => b.reviews.length - a.reviews.length);
    } else if (sortType.value === 'rating') {
        sorted.sort((a, b) => {
            const aRatingSum = Object.values(a.ratings).reduce((acc, rating) => acc + rating, 0);
            const bRatingSum = Object.values(b.ratings).reduce((acc, rating) => acc + rating, 0);
            return bRatingSum - aRatingSum;
        });
    } else if (sortType.value === 'price') {
        sorted.sort((a, b) => a.price - b.price);
    }

    return sorted;
});

function handleSearch(searchData) {
    searchType.value = searchData.type;
    searchKeyword.value = searchData.keyword;
}

function handleSort(newSortType) {
    sortType.value = newSortType;
}

function selectCategory(category) {
    selectedCategory.value = category;
}

function openLessonDetail(lesson) {
    selectedLesson.value = lesson;
}

function closeLessonDetail() {
    selectedLesson.value = null;
}

function openInquiryForm(lesson) {
    inquiryLesson.value = lesson;
    showInquiryForm.value = true;
    selectedLesson.value = null;
}

function closeInquiryForm() {
    showInquiryForm.value = false;
    inquiryLesson.value = null;
}
</script>

<style scoped>
.lesson-container {
    width: 60vw;
}

.lesson-category {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.lesson-category-button {
    flex: 1;
    padding: 0.8rem 0;
    font-size: 1rem;
    background-color: #f0f0f0;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
    color: #555;
}

.lesson-category-button:hover {
    background-color: #e0e0e0;
}

.lesson-category-button.active {
    background-color: #f13223;
    color: white;
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
    margin-bottom: 20px;
    height: 200px;
}

.lesson-card:last-child {
    margin-bottom: 300px;
}

.lesson-card:hover {
    transform: translateY(-5px);
}

.lesson-image-container {
    display: flex;
    justify-content: space-between;
    max-height: 100%;
    height: 200px;
}

.lesson-image {
    width: 40%;
    height: 100%;
    overflow: hidden;
    object-fit: cover;
    border-radius: 10px 0 0 10px;
}

.lesson-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 60%;
    padding: 20px;
    flex-direction: row;
}

.lesson-info {
    flex-grow: 1;
    width: 70%;
}

.lesson-title {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.4rem;
    margin-bottom: 20px;
}

.button-container {
    position: relative;
    transform: translateY(70%);
}

.join-button {
    background-color: #f13223;
    color: white;
    border: none;
    padding: 0.7rem 1.4rem;
    cursor: pointer;
    border-radius: 5px;
    font-size: 1.1em;
    transition: background-color 0.3s ease;
}

.join-button:hover {
    background-color: #d32f2f;
}
</style>
