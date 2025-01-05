<template>
    <div v-if="isTrainer" class="trainer-page-my-lessons">
        <div class="my-lessons">
            <h2>나의 레슨 관리</h2>
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
                <component :is="currentTabComponent" @open-popup="openPopup"></component>
            </div>
        </div>
        <RegisterLessonPopup
            :isVisible="showPopup"
            :lessonType="currentTab"
            @close="closePopup"
            @register="registerLesson"
        />
    </div>
    <div v-else>
        <h2>접근 권한이 없습니다.</h2>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import PersonalLessons from './lesson/PersonalLessons.vue';
import GroupLessons from './lesson/GroupLessons.vue';
import OnlinePT from './lesson/OnlinePT.vue';
import OnlineFeedback from './lesson/OnlineFeedback.vue';
import RegisterLessonPopup from './lesson/RegisterLessonPopup.vue';

const tabs = [
    { id: 'personal', name: '개인 레슨', component: PersonalLessons },
    { id: 'group', name: '그룹 레슨', component: GroupLessons },
    { id: 'online', name: '온라인 PT', component: OnlinePT },
    { id: 'feedback', name: '온라인 피드백', component: OnlineFeedback },
];
const authStore = useAuthStore();
const currentTab = ref('personal');
const showPopup = ref(false);

const isTrainer = computed(() => authStore.role === 'TRAINER');

const currentTabComponent = computed(() => {
    const tab = tabs.find((tab) => tab.id === currentTab.value);
    return tab ? tab.component : null;
});

const openPopup = () => {
    showPopup.value = true;
};

const closePopup = () => {
    showPopup.value = false;
};

const registerLesson = (lessonData) => {
    console.log('Registering lesson:', lessonData);
    closePopup();
};
</script>

<style scoped>
.my-lessons {
    width: 70vw;
    margin: 40px auto;
}

.my-lessons h2 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
    margin-bottom: 1.2rem;
    text-align: left;
}

.lesson-tabs {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    border-radius: 8px;
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
    border-radius: 8px;
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
