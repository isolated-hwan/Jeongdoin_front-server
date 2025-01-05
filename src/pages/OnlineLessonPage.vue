<template>
    <LessonPage :title="'온라인 레슨'" :links="links" />
</template>

<script setup>
import LessonPage from './LessonPage.vue';

const links = [
    { name: 'OnlineLesson', label: '온라인 PT' },
    { name: 'OnlineFeedback', label: '온라인 피드백' },
];
</script>

<style scoped></style>
