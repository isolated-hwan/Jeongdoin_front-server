<template>
    <router-view></router-view>
    <Modal v-if="showLoginModal" @close="showLoginModal = false">
        <KakaoLoginCompo />
    </Modal>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import Modal from '../common/Modal.vue';
import KakaoLoginCompo from '../login/KakaoLoginCompo.vue';

const authStore = useAuthStore();
const showLoginModal = ref(false);
const openLogin = () => {
    showLoginModal.value = true;
};

authStore.openLogin = openLogin;
</script>
<style scoped></style>
