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
                            <p><strong>모집 기간:</strong> {{ lesson.recruitmentPeriod }}</p>
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
import { ref, computed } from 'vue';
import LessonDetail from './LessonDetail.vue';
import InquiryForm from './InquiryForm.vue';
import SearchCompo from '../search/SearchCompo.vue';

const lessons = ref([
    {
        title: '그룹 전신 운동 PT',
        trainer: '강철희',
        category: '헬스',
        description:
            '초보자부터 중급자까지 참여 가능한 그룹 전신 운동 PT입니다. 체계적인 프로그램을 통해 근력 향상, 체지방 감소, 심폐 지구력 증진을 목표로 합니다. 각자의 체력 수준에 맞춰 운동 강도를 조절하며, 올바른 자세와 효과적인 운동 방법을 배울 수 있습니다.',
        price: 60000,
        recruitmentPeriod: '2024-09-30 ~ 2024-12-21',
        trainerProfile: ['국가대표 출신 강사', '스포츠지도사 자격증 보유'],
        location: '서울 종로구 혜화로 20',
        image: 'https://kosa-final-project-team-3.github.io/cdn/gp1.jpeg',
        maxParticipants: 10,
        reviews: [
            '친절하고 설명이 명확합니다.',
            '운동 동작을 세심하게 지도해줘서 좋았어요.',
            '그룹 수업임에도 개인별 피드백을 잘 해주십니다.',
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
        title: '체중 감량을 위한 그룹 PT',
        trainer: '김지훈',
        category: '헬스',
        description:
            '체중 감량에 특화된 그룹 PT 프로그램입니다. 유산소 운동과 근력 운동을 적절히 병행하여 효과적인 체지방 감소를 돕습니다. 또한 올바른 식습관 교육을 통해 지속 가능한 다이어트를 지원합니다. 함께 운동하는 동기부여와 즐거움을 느낄 수 있는 수업입니다.',
        price: 70000,
        recruitmentPeriod: '2024-08-25 ~ 2024-11-31',
        trainerProfile: ['체육학 박사', '다이어트 전문 트레이너'],
        location: '서울 강남구 테헤란로 152',
        image: 'https://kosa-final-project-team-3.github.io/cdn/gp2.jpeg',
        maxParticipants: 8,
        reviews: [
            '3개월 만에 10kg 감량에 성공했어요!',
            '식단 관리 팁이 정말 유용해요.',
            '재미있게 운동할 수 있어 좋아요.',
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
        title: '친구와 함께 배우는 요가',
        trainer: '서진이',
        category: '요가',
        description:
            '친구나 연인과 함께 참여할 수 있는 2인 1조 요가 클래스입니다. 기본적인 요가 동작부터 파트너와 함께하는 특별한 포즈까지 다양하게 배웁니다. 유연성 향상은 물론 서로 간의 신뢰와 협력을 통해 더욱 즐겁게 요가를 익힐 수 있습니다. 요가를 처음 접하는 분들도 부담 없이 참여할 수 있습니다.',
        price: 50000,
        recruitmentPeriod: '2024-10-01 ~ 2024-10-29',
        trainerProfile: ['요가 전문 자격증 보유', '커플 요가 10년 경력'],
        location: '서울 마포구 와우산로 21',
        image: 'https://kosa-final-project-team-3.github.io/cdn/gp3.jpg',
        maxParticipants: 12,
        reviews: [
            '연인과 함께해서 더 재미있어요!',
            '서로 도와가며 하니 더 열심히 하게 되네요.',
            '강사님의 설명이 쉽고 자세해요.',
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
        title: '아침을 여는 활력 요가',
        trainer: '박수진',
        category: '요가',
        description:
            '하루를 활기차게 시작하고 싶은 분들을 위한 아침 요가 클래스입니다. 간단한 스트레칭으로 몸을 깨우고, 활력을 불어넣는 동작들로 구성되어 있습니다. 호흡법 훈련을 통해 정신을 맑게 하고, 긍정적인 마인드로 하루를 시작할 수 있도록 도와드립니다. 바쁜 현대인들의 건강한 라이프스타일을 위한 최적의 선택입니다.',
        price: 55000,
        recruitmentPeriod: '2024-09-01 ~ 2024-10-31',
        trainerProfile: ['요가 지도자 자격증 보유', '명상 전문가'],
        location: '서울 서초구 서초대로 389',
        image: 'https://kosa-final-project-team-3.github.io/cdn/gp4.webp',
        maxParticipants: 15,
        reviews: [
            '아침부터 상쾌한 기분으로 하루를 시작해요.',
            '스트레스 해소에 정말 좋아요.',
            '점점 몸이 유연해지는 게 느껴져요.',
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
        title: '코어 강화 그룹 필라테스',
        trainer: '이은정',
        category: '필라테스',
        description:
            '코어 근육 강화에 중점을 둔 그룹 필라테스 수업입니다. 복부, 등, 골반 주변의 근육을 집중적으로 단련하여 전신의 균형과 안정성을 향상시킵니다. 체형 교정, 자세 개선, 허리 통증 완화 등의 효과를 기대할 수 있으며, 일상생활에서의 바른 자세 유지에도 큰 도움이 됩니다. 모든 동작은 참가자의 수준에 맞게 난이도를 조절할 수 있습니다.',
        price: 65000,
        recruitmentPeriod: '2024-10-01 ~ 2024-11-30',
        trainerProfile: ['필라테스 마스터 트레이너', '물리치료사 자격증 보유'],
        location: '서울 강남구 도산대로 14',
        image: 'https://kosa-final-project-team-3.github.io/cdn/gp5.jpg',
        maxParticipants: 8,
        reviews: [
            '허리 통증이 많이 완화되었어요.',
            '코어 근육이 눈에 띄게 강화된 것 같아요.',
            '소수정예라 꼼꼼한 지도를 받을 수 있어 좋아요.',
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
        title: '임산부를 위한 필라테스',
        trainer: '김미래',
        category: '필라테스',
        description:
            '임신 중인 여성들을 위한 특별한 필라테스 프로그램입니다. 임신 중 변화하는 신체에 맞춰 안전하고 효과적인 운동을 제공합니다. 골반 주변 근육 강화, 복부 및 등 근육의 이완, 전신 순환 개선 등을 통해 건강한 임신과 출산을 돕습니다. 또한 호흡법 훈련을 통해 출산 시 도움이 되는 복식호흡을 익힐 수 있습니다. 임신 주수에 따라 맞춤형 운동을 제공합니다.',
        price: 75000,
        recruitmentPeriod: '2024-11-01 ~ 2024-12-31',
        trainerProfile: ['산전 필라테스 전문가', '조산사 자격증 보유'],
        location: '서울 서초구 서초중앙로 18',
        image: 'https://kosa-final-project-team-3.github.io/cdn/gp6.jpeg',
        maxParticipants: 6,
        reviews: [
            '임신 중 허리 통증이 많이 완화되었어요.',
            '다른 임산부들과 정보를 나눌 수 있어 좋아요.',
            '출산 후 회복에도 큰 도움이 되었습니다.',
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
        title: '아쿠아 피트니스',
        trainer: '정태우',
        category: '수영',
        description:
            '물속에서 진행되는 전신 운동 프로그램입니다. 수중에서의 저항을 이용해 근력을 강화하고, 유산소 운동 효과도 얻을 수 있습니다. 관절에 무리가 가지 않아 노인이나 관절이 약한 분들에게도 적합합니다. 수영을 못해도 참여 가능하며, 재미있는 음악과 함께 즐겁게 운동할 수 있습니다. 체중 감량, 근력 강화, 심폐 기능 향상 등 다양한 효과를 기대할 수 있습니다.',
        price: 70000,
        recruitmentPeriod: '2024-09-01 ~ 2024-11-21',
        trainerProfile: ['수상안전요원 자격증 보유', '아쿠아 피트니스 전문 트레이너'],
        location: '서울 송파구 올림픽로 424',
        image: 'https://kosa-final-project-team-3.github.io/cdn/gp7.jpg',
        maxParticipants: 15,
        reviews: [
            '무릎 관절이 안 좋아서 걱정했는데 물속에서 하니 괜찮아요.',
            '더운 여름에 시원하게 운동할 수 있어 좋아요.',
            '생각보다 운동 강도가 높아서 놀랐어요. 정말 효과적입니다.',
        ],
        ratings: {
            전문성: 5,
            친절: 5,
            설명: 4,
            시간엄수: 4,
            열정: 5,
        },
    },
    {
        title: 'K-pop 댄스 클래스',
        trainer: '이지민',
        category: '댄스',
        description:
            '최신 K-pop 안무를 배우는 즐거운 댄스 클래스입니다. 초보자부터 중급자까지 참여 가능하며, 기본적인 스트레칭과 춤 동작부터 시작해 단계별로 완성된 안무를 익힙니다. 댄스를 통한 유산소 운동 효과와 함께 리듬감, 협응력 향상은 물론, 자신감 향상과 스트레스 해소에도 큰 도움이 됩니다. 매 수업마다 다른 곡의 안무를 배워 지루하지 않게 즐길 수 있습니다.',
        price: 55000,
        recruitmentPeriod: '2024-09-01 ~ 2024-10-31',
        trainerProfile: ['실용무용학과 졸업', 'K-pop 안무가 경력 5년'],
        location: '서울 강남구 도산대로 8',
        image: 'https://kosa-final-project-team-3.github.io/cdn/gp8.webp',
        maxParticipants: 20,
        reviews: [
            '스트레스가 확 풀려요!',
            '춤을 못춰도 친절하게 가르쳐주셔서 좋아요.',
            '땀을 흘리면서 운동도 되고 재미도 있어요.',
        ],
        ratings: {
            전문성: 5,
            친절: 5,
            설명: 4,
            시간엄수: 4,
            열정: 5,
        },
    },
    {
        title: '힙합 댄스 기초반',
        trainer: '김재현',
        category: '댄스',
        description:
            '힙합 댄스의 기본기를 배우는 클래스입니다. 힙합의 역사와 문화에 대한 이해를 바탕으로, 기본적인 스텝과 그루브, 바운스 등을 익힙니다. 점진적으로 난이도를 높여가며 다양한 힙합 스타일의 동작들을 배우게 됩니다. 자유로운 표현과 즉흥성을 중요시하는 힙합의 특성을 살려, 각자의 개성을 살린 춤을 출 수 있도록 지도합니다. 음악을 느끼고 자신만의 스타일을 찾아가는 여정을 함께 합니다.',
        price: 60000,
        recruitmentPeriod: '2024-11-01 ~ 2024-12-31',
        trainerProfile: ['스트릿 댄스 대회 수상 경력', '힙합 댄스 강사 경력 7년'],
        location: '서울 마포구 와우산로 21',
        image: 'https://kosa-final-project-team-3.github.io/cdn/gp9.webp',
        maxParticipants: 15,
        reviews: [
            '처음 접해보는 힙합인데 너무 재미있어요!',
            '음악을 느끼면서 춤추는 법을 배우고 있어요.',
            '강사님의 열정이 대단해요. 덩달아 저도 열심히 하게 됩니다.',
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

const categories = ref(['헬스', '요가', '필라테스', '수영', '댄스', '기타']);

const selectedType = ref('그룹 레슨');
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
</style>
