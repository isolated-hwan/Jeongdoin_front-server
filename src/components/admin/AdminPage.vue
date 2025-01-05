<template>
    <div class="admin-page">
        <div class="header">
            <div class="logo-container">
                <div class="logo-container-inner">
                    <router-link to="/admin">
                        <img class="logo" src="https://kosa-final-project-team-3.github.io/cdn/logo.png" alt="정도인" />
                    </router-link>
                </div>

                <div class="navbar-container">
                    <h3>관리자 페이지</h3>
                    <div class="navbar-inner">
                        <router-link to="/admin">트레이너 관리</router-link>
                        <router-link to="/admin/contact">문의내역 관리</router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-content">
            <router-view />
        </div>
    </div>
</template>

<script setup></script>

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
.logo-container-inner > a {
    display: flex;
    justify-content: center; /* 수평 중앙 정렬 */
    align-items: center; /* 수직 중앙 정렬 */
}
.logo {
    width: 120px;
    height: 60px;
    justify-content: center;
}

.navbar-container {
    display: flex;
    flex: 1;
    align-items: center;
    text-align: center;
}

.navbar-container h3 {
    margin-left: 50px;
    font-family: 'Do Hyeon', sans-serif;
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
    font-size: 1.4em;
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
</style>
