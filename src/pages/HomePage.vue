<template>
    <div class="home-container">
        <div class="banner">
            <swiper
                :modules="modules"
                :slides-per-view="1"
                :space-between="30"
                :loop="true"
                :pagination="{ clickable: true }"
                :navigation="true"
                :autoplay="{
                    delay: 5000,
                    disableOnInteraction: false,
                }"
                class="mySwiper"
            >
                <swiper-slide v-for="(image, index) in bannerImages" :key="index">
                    <img :src="image.src" :alt="image.alt" class="banner-image" />
                </swiper-slide>
            </swiper>
        </div>

        <div class="lesson-container">
            <router-link
                v-for="(lesson, index) in lessonTypes"
                :key="index"
                :to="lesson.route"
                custom
                v-slot="{ navigate }"
            >
                <div
                    class="lesson-type"
                    :class="{ active: lesson.isActive }"
                    @mouseenter="setActive(index, true)"
                    @mouseleave="setActive(index, false)"
                    @click="navigate"
                >
                    <img :src="lesson.icon" :alt="lesson.alt" class="lesson-icon" />
                    {{ lesson.text }}
                </div>
            </router-link>
        </div>

        <div class="popular-lesson">
            <h2>지금 가장 인기 있는 레슨</h2>
            <div class="lesson-list">
                <div v-for="lesson in popularLessons" :key="lesson.id" class="lesson-item">
                    <img :src="lesson.image" :alt="lesson.title" class="lesson-image" />
                    <div class="lesson-info">
                        <h3 class="lesson-title">{{ lesson.title }}</h3>
                        <p class="lesson-trainer">{{ lesson.trainer }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const modules = [Autoplay, Pagination, Navigation];

const bannerImages = ref([
    { src: 'https://kosa-final-project-team-3.github.io/cdn/banner_1.png', alt: 'Banner 1' },
    { src: 'https://kosa-final-project-team-3.github.io/cdn/banner_2.png', alt: 'Banner 2' },
    { src: 'https://kosa-final-project-team-3.github.io/cdn/banner_3.png', alt: 'Banner 3' },
    { src: 'https://kosa-final-project-team-3.github.io/cdn/banner_4.png', alt: 'Banner 4' },
]);

const lessonTypes = ref([
    {
        icon: 'https://kosa-final-project-team-3.github.io/cdn/icon_personal.png',
        alt: '개인 레슨 아이콘',
        text: '개인 레슨',
        isActive: false,
        route: '/lesson/offline', // personal
    },
    {
        icon: 'https://kosa-final-project-team-3.github.io/cdn/icon_group.png',
        alt: '그룹 레슨 아이콘',
        text: '그룹 레슨',
        isActive: false,
        route: '/lesson/offline/group', // group
    },
    {
        icon: 'https://kosa-final-project-team-3.github.io/cdn/icon_online.png',
        alt: '온라인 레슨 아이콘',
        text: '온라인 레슨',
        isActive: false,
        route: '/lesson/online',
    },
    {
        icon: 'https://kosa-final-project-team-3.github.io/cdn/icon_ai.png',
        alt: 'AI 피드백 아이콘',
        text: 'AI 피드백',
        isActive: false,
        route: '/feedback/ai',
    },
]);

const setActive = (index, isActive) => {
    lessonTypes.value[index].isActive = isActive;
};

const popularLessons = ref([
    {
        id: 1,
        title: '올라잇 정신으로 운동하기',
        trainer: '박재훈',
        image: 'https://kosa-final-project-team-3.github.io/cdn/popular4.webp',
    },
    {
        id: 2,
        title: '중급반 요가',
        trainer: '윤서희',
        image: 'https://kosa-final-project-team-3.github.io/cdn/pt3.jpeg',
    },
    {
        id: 3,
        title: '필라테스 집중 코어',
        trainer: '심으뜸',
        image: 'https://kosa-final-project-team-3.github.io/cdn/popular2.webp',
    },
]);
</script>
<style scoped>
.login-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.lesson-container {
    display: flex;
    margin: 50px 50px 100px 50px;
    justify-content: center;
    height: 120px;
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.2em;
}

.lesson-type {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
    border-radius: 10px;
    margin: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
}

.lesson-type.active {
    background-color: #f13223;
    color: white;
}
.lesson-type.active img {
    filter: brightness(0) invert(1);
}

.lesson-type a {
    text-decoration: none;
    color: black;
}

.lesson-type img {
    width: 50px;
    height: 50px;
}

.lesson-icon {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
}

.lesson-list {
    display: flex;
    margin: 20px;
    gap: 20px;
    justify-content: center;
}

.lesson-item {
    width: 400px;
    height: 400px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin-bottom: 100px;
}

.lesson-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
}

.lesson-info {
    padding: 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.lesson-title {
    font-size: 1.2em;
    margin-bottom: 10px;
}

.lesson-trainer {
    font-size: 1em;
    color: #666;
}

.popular-lesson {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.4em;
    width: 80vw;
    margin: 0 auto;
}

.banner {
    display: flex;
    justify-content: center;
}
.swiper-slide {
    display: flex;
    justify-content: center;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
    color: #f13223;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
}
:deep(.swiper-button-next) {
    right: 7%;
}
:deep(.swiper-button-prev) {
    left: 7%;
}
:deep(.swiper-pagination-bullet) {
    width: 10px;
    height: 10px;
    background: rgba(241, 50, 35, 0.5); /* #f13223 with 50% opacity */
    opacity: 1;
}

:deep(.swiper-pagination-bullet-active) {
    background: #f13223; /* Active dot color */
}
.banner-image {
    width: 70%;
    height: 100%;
    object-fit: cover;
    border-radius: 30px;
}
</style>
