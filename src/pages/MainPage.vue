<template>
    <div>
        <div v-if="!isAuthenticated"><button type="button" @click="showLoginModal = true">로그인</button><br /></div>

        <div v-if="isAuthenticated">
            {{ username }}님 반갑습니다. <button type="button" @click="handleLogout()">로그아웃</button><br />
            <button type="button" @click="$router.push('/feedback/ai')">AI 피드백</button><br />
            <div v-if="role === 'TRAINER'">
                <button type="button" @click="$router.push('/trainerpage')">트레이너 페이지</button><br />
            </div>
            <div v-if="role === 'REGULAR'">
                <button type="button" @click="$router.push('/mypage')">마이페이지</button><br />
            </div>
            <button type="button" @click="$router.push('/member/dashboard')">멤버 대시보드</button><br />
        </div>
        <Modal v-if="showLoginModal" @close="showLoginModal = false">
            <KakaoLoginCompo />
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import Modal from '../components/common/Modal.vue';
import KakaoLoginCompo from '../components/login/KakaoLoginCompo.vue';

const authStore = useAuthStore();
const username = computed(() => authStore.username);
const role = computed(() => authStore.role);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const userId = computed(() => authStore.id);
const showLoginModal = ref(false);

onMounted(() => {
    authStore.checkAuthStatus();
    console.log('user id is: ', userId.value);
});

const handleLogout = () => {
    authStore.logout();
};
</script>

<style scoped>
.base-container {
    margin: -8px;
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.main {
    display: flex;
    flex: 1;
    flex-direction: column;
}

.router-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
