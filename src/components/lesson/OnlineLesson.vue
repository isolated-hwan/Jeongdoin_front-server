<template>
    <div class="lesson-container">
        <search-compo @search="handleSearch" @sort="handleSort" />

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

        <inquiry-form v-if="showInquiryForm" :lesson="inquiryLesson" @close="closeInquiryForm" />
        <inquiry-form v-if="showInquiryForm" :lesson="inquiryLesson" @close="closeInquiryForm" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import LessonDetail from './LessonDetail.vue';
import InquiryForm from './InquiryForm.vue';
import SearchCompo from '../search/SearchCompo.vue';

const lessons = ref([
    {
        type: '온라인 레슨',
        title: '전신 운동 PT',
        trainer: '박정환',
        category: '헬스',
        description: '초보자에게 적합한 전신 강화 트레이닝.',
        price: 60000,
        trainerProfile: ['국가대표 출신 강사', '스포츠지도사 자격증 보유'],
        image: 'https://kosa-final-project-team-3.github.io/cdn/lesson_image4.jpeg',
        reviews: [
            '자세를 잘 잡아줍니다!',
            '운동 중간중간 자세 교정이 꼼꼼해서 좋습니다.',
            '선생님 열정이 넘치고 친절해요!',
        ],
        ratings: {
            전문성: 5,
            친절: 5,
            설명: 5,
            시간엄수: 5,
            열정: 5,
            열정: 5,
        },
    },
    {
        type: '온라인 레슨',
        title: '스우파 리더와 함께하는 댄스 기본 레슨',
        trainer: '모니카',
        category: '댄스',
        description: '뚝딱이도 할 수 있는 댄스 기본 레슨. 모니카의 친절한 설명으로 댄스를 배워보세요!',
        price: 40000,
        image: 'https://kosa-final-project-team-3.github.io/cdn/of3.webp',
        reviews: [
            '선생님이 친절하고 쉽게 설명해줘서 좋아요.',
            '전문적이여서 좋아요.',
            '선생님 열정이 넘치고 친절해요!',
        ],
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
        title: '세계 1위와 함께하는 왁킹 레슨',
        trainer: '립제이',
        category: '댄스',
        description: '왁킹 중급자를 위한 레슨. 립제이와 함께 왁킹을 배워보세요!',
        price: 40000,
        image: 'https://kosa-final-project-team-3.github.io/cdn/of4.webp',
        reviews: [
            '선생님이 전문적이고 꼼꼼히 설명해줘서 좋아요.',
            '선생님 멋있어요.',
            '선생님 열정이 넘치고 친절해요!',
        ],
        ratings: {
            전문성: 5,
            친절: 4,
            설명: 5,
            시간엄수: 5,
            열정: 5,
        },
    },
    {
        type: '온라인 레슨',
        title: '피지컬 100의 심으뜸과 함께하는 운동 레슨',
        trainer: '심으뜸',
        category: '헬스',
        description: '헬스가 처음이신 분들, 심으뜸과 함께하세요!',
        price: 40000,
        image: 'https://kosa-final-project-team-3.github.io/cdn/of6.jpeg',
        reviews: [
            '선생님이 전문적이고 꼼꼼히 설명해줘서 좋아요.',
            '선생님 너무 친절해요.',
            '선생님 열정이 넘치고 꼼꼼해요!',
        ],
        ratings: {
            전문성: 5,
            친절: 5,
            설명: 5,
            시간엄수: 5,
            열정: 5,
        },
    },
]);

const categories = ref(['헬스', '요가', '필라테스', '수영', '댄스', '기타']);

const selectedType = ref('온라인 레슨');
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
