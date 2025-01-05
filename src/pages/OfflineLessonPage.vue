<template>
    <LessonPage :title="'오프라인 레슨'" :links="links" />
</template>

<script setup>
import LessonPage from './LessonPage.vue';

const links = [
    { name: 'PersonalLessonList', label: '개인 레슨' },
    { name: 'GroupLessonList', label: '그룹 레슨' },
];
</script>

<style scoped></style>
