<template>
    <div v-if="isVisible" class="mbti-content" ref="mbtiContent">
        <button class="close-button" @click="$emit('close')">×</button>
        <router-link to="/mbti">
            <img class="mbti-image" src="https://kosa-final-project-team-3.github.io/cdn/mbti.png" alt="운BTI" />
        </router-link>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const mbtiContent = ref(null);
const initialTop = 250;
const isVisible = ref(true);

defineEmits(['close']);

const handleScroll = () => {
    if (mbtiContent.value) {
        const scrollY = window.scrollY;
        if (scrollY === 0) {
            // 스크롤이 최상단에 도달했을 때
            mbtiContent.value.style.top = `${initialTop}px`;
        } else {
            const newTop = initialTop + scrollY * 1.0; // 스크롤 속도 조절
            mbtiContent.value.style.top = `${newTop}px`;
        }
    }
};

const handleResize = () => {
    isVisible.value = window.innerWidth > 1300;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 로드 시 가시성 설정
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.main-content {
    flex: 1;
    padding: 20px;
}

.mbti-content {
    position: absolute;
    top: 250px;
    right: 50px;
    z-index: 1;
    transition: top 0.3s ease;
}

.mbti-image {
    width: 200px;
    height: 200px;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
    background: none;
    border: none;
}

@media (max-width: 1300px) {
    .mbti-content {
        display: none;
    }
}
</style>
