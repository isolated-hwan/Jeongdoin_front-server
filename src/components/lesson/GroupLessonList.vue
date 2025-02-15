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
            <div v-if="sortedLessons.length === 0" class="no-lessons-message">레슨이 없습니다.</div>
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
                            <p>
                                <strong>모집 기간:</strong> {{ lesson.recruitmentStart }} ~ {{ lesson.recruitmentEnd }}
                            </p>
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
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import LessonDetail from './LessonDetail.vue';
import InquiryForm from './InquiryForm.vue';
import SearchCompo from '../search/SearchCompo.vue';
import jwtAxios, { API_SERVER_HOST } from '../../util/jwtUtil';

const host = API_SERVER_HOST;
const categories = ref(['헬스', '요가', '필라테스', '수영', '댄스', '기타']);

const selectedType = ref('그룹 레슨');
const selectedLesson = ref(null); // 선택된 레슨
const selectedCategory = ref('');
const showInquiryForm = ref(false); // 문의하기 폼 상태
const inquiryLesson = ref(null);
const lessons = ref([]);

const searchType = ref('total');
const searchKeyword = ref(''); // 검색
const sortType = ref('popular'); // 정렬

// 레슨 목록 조회
const fetchLessons = async () => {
    try {
        // 1. 레슨 목록 불러오기
        const response = await jwtAxios.get(`http://${host}/api/group-lesson`);
        const lessonsData = response.data;

        // 2. 각 레슨의 이미지를 병렬로 요청
        const lessonsWithImages = await Promise.all(
            lessonsData.map(async (lesson) => {
                try {
                    // 각 레슨 ID로 이미지 요청
                    const mediaResponse = await jwtAxios.get(`http://${host}/api/file/search`, {
                        params: {
                            mediaTypeCode: '01',
                            resourceId: lesson.lessonId, // 레슨 ID
                        },
                    });

                    // 이미지 데이터 가져오기
                    const image = mediaResponse.data.length > 0 ? mediaResponse.data[0].url : '';

                    // 레슨 데이터에 이미지 추가
                    return {
                        lessonId: lesson.lessonId,
                        title: lesson.title,
                        trainer: lesson.trainerName,
                        category: lesson.category,
                        description: lesson.content,
                        price: lesson.price,
                        location: lesson.location,
                        lat: lesson.lat,
                        lng: lesson.lng,
                        recruitmentStart: lesson.startDate,
                        recruitmentEnd: lesson.startEnd,
                        maxParticipants: lesson.maxCnt,
                        done: lesson.done,
                        process: lesson.process,
                        type: '01',
                        image, // 이미지 URL 추가
                        reviews: [], // 리뷰 기능 추가 전까지 빈 배열
                        ratings: {
                            전문성: 0,
                            친절: 0,
                            설명: 0,
                            시간엄수: 0,
                            열정: 0,
                        },
                    };
                } catch (error) {
                    console.error(`레슨 ID ${lesson.lessonId}의 이미지 로드 실패:`, error);
                    return {
                        ...lesson,
                        image: '',
                    };
                }
            }),
        );
        lessons.value = lessonsWithImages;
    } catch (error) {
        console.error('레슨 목록 조회 실패:', error);
    }
};

onMounted(() => {
    fetchLessons();
});

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
    height: 220px;
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
    height: 220px;
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

.no-lessons-message {
    text-align: center;
    font-size: 1.2rem;
    color: #888;
    margin-top: 20px;
}
</style>
