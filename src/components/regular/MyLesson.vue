<template>
    <div class="my-lessons">
        <h2>나의 레슨</h2>
        <div class="lesson-tabs">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="currentTab = tab.id"
                :class="{ active: currentTab === tab.id }"
                class="tab-button"
            >
                {{ tab.name }}
            </button>
        </div>
        <div class="tab-content">
            <component :is="currentTabComponent"></component>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import LessonHistory from './lesson/LessonHistory.vue';
import LessonDiary from './lesson/LessonDiary.vue';
import LessonFeedback from './lesson/LessonFeedback.vue';
import ExpertReview from './lesson/ExpertReview.vue';

const tabs = [
    { id: 'history', name: '레슨 내역', component: LessonHistory },
    { id: 'diary', name: '레슨 일지', component: LessonDiary },
    { id: 'feedback', name: '피드백', component: LessonFeedback },
    { id: 'review', name: '전문가 리뷰', component: ExpertReview },
];

const currentTab = ref('history');

const currentTabComponent = computed(() => {
    const tab = tabs.find((tab) => tab.id === currentTab.value);
    return tab ? tab.component : null;
});
</script>

<style scoped>
.my-lessons {
    margin: 40px;
    font-size: 1em;
}

.my-lessons h2 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
    margin-bottom: 1.2rem;
    text-align: left; /* 이 부분을 추가하여 왼쪽 정렬 */
}

.lesson-tabs {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-button {
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

.tab-button:hover {
    background-color: #e0e0e0;
}

.tab-button.active {
    background-color: #f13223;
    color: white;
}

.tab-content {
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
    .my-lessons h2 {
        font-size: 1.8rem;
    }

    .lesson-tabs {
        flex-direction: column;
    }

    .tab-button {
        padding: 0.6rem 0;
        font-size: 0.9rem;
    }
}
</style>
