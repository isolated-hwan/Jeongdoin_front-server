<template>
    <header class="header">
        <div class="logo-container">
            <div class="logo-container-inner">
                <router-link to="/" class="logo-link">
                    <img class="logo" src="https://kosa-final-project-team-3.github.io/cdn/logo.png" alt="정도인" />
                </router-link>
            </div>

            <div class="navbar-container">
                <div class="navbar-inner">
                    <router-link to="/lesson/offline" active-class="active">오프라인 레슨</router-link>
                    <router-link to="/lesson/online" active-class="active">온라인 레슨</router-link>
                    <router-link to="/feedback/ai" active-class="active">AI 피드백</router-link>
                </div>
                <div class="navbar-login">
                    <div class="dynamic-link">
                        <router-link v-if="isTrainer" to="/trainer/info" active-class="active"
                            >트레이너페이지</router-link
                        >
                        <router-link v-if="isAuthenticated" to="/mypage" active-class="active">마이페이지</router-link>
                    </div>
                    <div class="auth-links">
                        <a v-if="!isAuthenticated" @click.prevent="openLogin">로그인</a>
                        <a v-if="isAuthenticated" @click="handleLogout">로그아웃</a>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isTrainer = computed(() => authStore.role === 'TRAINER');
authStore.checkAuthStatus();

const handleLogout = () => {
    authStore.logout();
};

const openLogin = () => {
    authStore.openLogin();
};
</script>
<style scoped>
.header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.header a {
    width: 100vw;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.logo-container {
    width: 100vw;
    display: flex;
    height: 100%;
    flex-direction: column;
    margin-top: 20px;
}

.logo-container-inner {
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo-container-inner > a {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: auto;
}
.logo-container-inner {
    display: flex;
    justify-content: center;
}

.logo-link {
    display: inline-block;
    line-height: 0;
}

.logo {
    width: 180px;
    height: 100px;
    justify-content: center;
}

.navbar-container {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0px;
    background-color: #f7edec;
}

.navbar-inner {
    width: 60%;
    left: 5%;
    gap: 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.navbar-inner a {
    color: black;
    padding-top: 15px;
    text-decoration: none;
    font-family: 'Do Hyeon', sans-serif;
    font-size: 2em;
    position: relative;
    text-align: center;
    white-space: nowrap;
}

.navbar-inner a:hover::after {
    content: '';
    width: 70%;
    height: 2px;
    display: block;
    position: absolute;
    left: 15%;
    margin-top: 10px;
    border-bottom: 3px solid #f13223;
    justify-content: center;
}

.router-link-exact-active {
    font-weight: bold;
    color: #f13223 !important;
}

.navbar-inner a.active::after {
    content: '';
    width: 70%;
    height: 2px;
    display: block;
    position: absolute;
    left: 15%;
    margin-top: 10px;
    border-bottom: 3px solid #f13223;
    justify-content: center;
}

.navbar-login {
    width: 40%;
    display: flex;
    justify-content: flex-end; /* 오른쪽 정렬 */
}

.navbar-login a {
    color: #545454;
    padding-top: 15px;
    text-decoration: none;
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
    position: relative;
    flex-grow: 1;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
}

.navbar-login a:hover::after {
    content: '';
    width: 70%;
    height: 2px;
    display: block;
    position: absolute;
    left: 15%;
    margin-top: 10px;
    border-bottom: 3px solid #f13223;
    justify-content: right;
}

.dynamic-link,
.auth-links {
    display: flex;
}

.dynamic-link a,
.auth-links a {
    width: 13vw;
}

.active {
    font-weight: bold;
    color: #f13223 !important;
}

.navbar-inner a.active,
.navbar-login a.active {
    font-weight: bold;
    color: #f13223 !important;
}

.navbar-inner a.active::after,
.navbar-login a.active::after {
    content: '';
    width: 70%;
    height: 2px;
    display: block;
    position: absolute;
    left: 15%;
    margin-top: 10px;
    border-bottom: 3px solid #f13223;
    justify-content: center;
}
</style>
