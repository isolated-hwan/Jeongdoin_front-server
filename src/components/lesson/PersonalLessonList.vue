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
        title: '전신 운동 PT',
        trainer: '설기관',
        category: '헬스',
        description:
            '초보자에게 적합한 전신 강화 트레이닝. 체계적인 운동 프로그램을 통해 근력 향상, 체지방 감소, 자세 교정 등 전반적인 신체 컨디션을 개선합니다. 개인의 체력 수준과 목표에 맞춘 맞춤형 트레이닝을 제공합니다.',
        price: 80000,
        trainerProfile: ['국가대표 출신 강사', '스포츠지도사 자격증 보유'],
        location: '서울 종로구 혜화로 20',
        image: 'https://kosa-final-project-team-3.github.io/cdn/pt1.webp',
        reviews: [
            '친절하고 설명이 명확합니다.',
            '운동 동작을 세심하게 지도해줘서 좋았어요.',
            '시간 약속을 잘 지킵니다.',
            '강의 준비가 철저해요.',
        ],
        ratings: {
            전문성: 5,
            친절: 4,
            설명: 4,
            시간엄수: 5,
            열정: 4,
        },
    },
    {
        title: '대회 준비 PT',
        trainer: '송기흔',
        category: '헬스',
        description:
            '보디빌딩 또는 피트니스 대회를 준비하는 분들을 위한 전문 PT 프로그램. 체계적인 근육 발달 계획, 포징 연습, 영양 관리, 컨디셔닝 등 대회에서 최고의 모습을 보여줄 수 있도록 전방위적인 지원을 제공합니다.',
        price: 100000,
        trainerProfile: ['보디빌딩 대회 수상 경력', '개인 트레이닝 10년 경력'],
        location: '서울 강남구 테헤란로 152',
        image: 'https://kosa-final-project-team-3.github.io/cdn/pt2.webp',
        reviews: [
            '대회 준비에 정말 도움이 많이 됐어요.',
            '전문적인 조언과 꼼꼼한 자세 교정이 좋습니다.',
            '식단 관리도 체계적으로 해주셔서 좋아요.',
        ],
        ratings: {
            전문성: 5,
            친절: 4,
            설명: 5,
            시간엄수: 4,
            열정: 3,
        },
    },
    {
        title: '중급반 요가',
        trainer: '윤서희',
        category: '요가',
        description:
            '요가 기초를 넘어 더 깊이 있는 수련을 원하는 분들을 위한 중급 과정입니다. 다양한 요가 동작과 호흡법을 통해 유연성과 근력을 향상시키고, 마음의 안정과 집중력 강화를 도모합니다. 명상 기법도 함께 배워 심신의 균형을 찾아갑니다.',
        price: 50000,
        trainerProfile: ['요가 전문 자격증 보유', '명상 지도사 자격증'],
        location: '서울 마포구 와우산로 94',
        image: 'https://kosa-final-project-team-3.github.io/cdn/pt3.jpeg',
        reviews: [
            '유연성이 많이 향상되었어요!',
            '운동 중간중간 자세 교정이 꼼꼼해서 좋습니다.',
            '정신 건강에도 많은 도움이 됩니다.',
        ],
        ratings: {
            전문성: 4,
            친절: 5,
            설명: 3,
            시간엄수: 4,
            열정: 3,
        },
    },
    {
        title: '아쉬탕가 요가',
        trainer: '김유진',
        category: '요가',
        description:
            '전통적인 아쉬탕가 요가 수련법을 배우는 클래스입니다. 호흡과 동작을 연결하는 빈야사 흐름, 다양한 아사나(자세), 그리고 깊이 있는 호흡법을 통해 신체의 유연성과 근력을 향상시키고 내면의 평화를 찾아갑니다. 초보자부터 고급자까지 수준별로 지도합니다.',
        price: 60000,
        trainerProfile: ['아쉬탕가 요가 전문가', '인도 리시케시 수련 경험'],
        location: '서울 서초구 서초대로 389',
        image: 'https://kosa-final-project-team-3.github.io/cdn/pt4.jpg',
        reviews: [
            '호흡법을 자세히 알려주셔서 좋았어요.',
            '난이도 있는 동작도 차근차근 설명해주십니다.',
            '수업 후 몸이 가벼워지는 느낌이에요.',
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
        title: '필라테스 집중 코어',
        trainer: '이은정',
        category: '필라테스',
        description:
            '코어 근육 강화에 중점을 둔 필라테스 수업입니다. 복부, 등, 골반 주변의 근육을 집중적으로 단련하여 전신의 균형과 안정성을 향상시킵니다. 잘못된 자세로 인한 통증 완화와 일상생활에서의 바른 자세 유지에 도움을 줍니다.',
        price: 70000,
        trainerProfile: ['필라테스 마스터 트레이너', '물리치료사 자격증 보유'],
        location: '서울 강북구 도봉로 76',
        image: 'https://kosa-final-project-team-3.github.io/cdn/pt5.webp',
        reviews: [
            '수업이 아주 체계적이고 좋아요.',
            '상세한 피드백을 받을 수 있어요.',
            '코어 근력이 눈에 띄게 좋아졌어요.',
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
        title: '리포머 필라테스',
        trainer: '박지원',
        category: '필라테스',
        description:
            '리포머 기구를 이용한 고급 필라테스 수업입니다. 리포머의 저항을 활용하여 더욱 효과적으로 근력을 강화하고 유연성을 향상시킵니다. 전신 운동은 물론 특정 부위 집중 훈련, 재활 운동 등 개인의 목표에 맞는 다양한 운동을 수행할 수 있습니다.',
        price: 75000,
        trainerProfile: ['리포머 필라테스 전문가', '재활 운동 전문가'],
        location: '서울 송파구 올림픽로 300',
        image: 'https://kosa-final-project-team-3.github.io/cdn/pt6.jpg',
        reviews: [
            '리포머로 운동하니 효과가 배가 되는 것 같아요.',
            '자세 교정에 많은 도움이 됩니다.',
            '선생님의 꼼꼼한 지도가 인상적이에요.',
        ],
        ratings: {
            전문성: 5,
            친절: 5,
            설명: 4,
            시간엄수: 5,
            열정: 5,
        },
    },
    {
        title: '수영 초보 강습',
        trainer: '박지환',
        category: '수영',
        description:
            '물에 대한 두려움 극복부터 4가지 영법(자유형, 배영, 평영, 접영)의 기초까지 체계적으로 배우는 초보자 대상 수영 강습입니다. 수중 안전 교육, 호흡법, 발차기, 팔 동작 등을 단계별로 학습하며, 개인의 진도에 맞춰 맞춤형 지도를 제공합니다.',
        price: 80000,
        trainerProfile: ['전직 국가대표 수영선수', '수상안전요원 자격증 보유'],
        location: '서울 송파구 올림픽로 424',
        image: 'https://kosa-final-project-team-3.github.io/cdn/pt7.jpg',
        reviews: [
            '물을 무서워했는데 이제는 즐겁게 수영해요.',
            '기초부터 차근차근 가르쳐주셔서 좋았어요.',
            '안전에 대한 설명도 꼼꼼히 해주십니다.',
        ],
        ratings: {
            전문성: 5,
            친절: 5,
            설명: 5,
            시간엄수: 4,
            열정: 5,
        },
    },
    {
        title: '방송 댄스 초보 강습',
        trainer: '이유정',
        category: '댄스',
        description:
            '최신 K-pop 안무를 배우는 즐거운 댄스 클래스입니다. 기본적인 리듬 감각과 동작부터 시작해 단계별로 완성된 안무를 익힙니다. 댄스를 통한 유산소 운동 효과와 함께 자신감 향상, 스트레스 해소 등 심리적 건강에도 도움을 줍니다. 초보자도 쉽게 따라할 수 있도록 상세히 지도합니다.',
        price: 55000,
        trainerProfile: ['현직 아이돌 안무가', '방송 댄스 10년 경력'],
        location: '서울 강남구 역삼로 123',
        image: 'https://kosa-final-project-team-3.github.io/cdn/pt8.jpg',
        reviews: [
            '처음 배우는데도 쉽게 따라할 수 있었어요.',
            '운동도 되고 스트레스도 풀리고 일석이조예요!',
            '선생님이 친절하고 열정적이세요.',
        ],
        ratings: {
            전문성: 5,
            친절: 5,
            설명: 4,
            시간엄수: 4,
            열정: 5,
        },
    },
]);

const categories = ref(['헬스', '요가', '필라테스', '수영', '댄스', '기타']);

const selectedType = ref('개인 레슨');
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
