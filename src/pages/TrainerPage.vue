<template>
    <SidebarLayout :title="'트레이너 페이지'" :links="links">
        <router-view></router-view>
    </SidebarLayout>
</template>

<script setup>
import SidebarLayout from '../components/SidebarLayout.vue';

const links = [
    { name: 'TrainerPageUserInfo', label: '나의 정보' },
    { name: 'TrainerPageLessons', label: '나의 레슨 관리' },
    { name: 'TrainerPageUserDiary', label: '회원 일지 관리' },
];
</script>

<style scoped>
.trainer-page {
    display: flex;
    height: 100vh;
}

.content-wrapper {
    font-family: 'Do Hyeon', sans-serif;
}

.sidebar {
    width: 250px;
    padding: 1rem;
}

.sidebar h3 {
    font-size: 1.7em;
    padding: 0.5rem;
    margin: 1rem 1rem 2rem 1rem;
}

.sidebar-item {
    font-size: 1.3em;
    display: block;
    color: #333;
    padding: 0.5rem;
    text-decoration: none;
    margin: 1rem;
    transition: color 0.3s ease;
}

.sidebar-item:hover {
    color: #f13223;
}

.router-link-exact-active {
    color: #f13223;
}
</style>
