<template>
    <div class="login-popup-content">
        <img class="logo" src="https://kosa-final-project-team-3.github.io/cdn/logo.png" alt="정도인 로고" />
        <p>
            정도인이란, '올바른 길로 이끌어 인도한다'는 뜻으로,<br />'바를 정 正, 인도할 도 導, 끌 인 引' 한자를
            사용합니다.
        </p>
        <form ref="kakaoLoginForm" class="kakaoLoginForm" action="" method="get">
            <button class="btn btn_primary color_kakao" @click="handleKakaoLogin()">
                <span class="btn_ico_kakao"></span>
                <span>카카오 로그인</span>
            </button>
        </form>
    </div>
</template>

<script setup>
import { useTemplateRef } from 'vue';
import { API_SERVER_HOST } from '../../util/jwtUtil';

const host = API_SERVER_HOST;
const kakaoLoginForm = useTemplateRef('kakaoLoginForm');

const handleKakaoLogin = () => {
    kakaoLoginForm.value.action = `http://${host}/oauth2/authorization/kakao`;
    kakaoLoginForm.value.submit();
};
defineEmits(['close']);
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.logo {
    width: 111px;
    margin-bottom: 20px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.kakaoLoginForm {
    display: flex;
    justify-content: center;
}

.btn {
    display: flex;
    justify-content: center;
    align-items: center;
}

.btn.color_kakao {
    background-color: #fae100 !important;
    border-color: #fae100 !important;
    color: #3c1e1e !important;
    width: 20vw;
    max-width: 300px;
    height: 50px;
    border-radius: 8px;
}

.btn > span.btn_ico_kakao:before {
    content: '';
    display: inline-block;
    width: 22px;
    height: 20px;
    margin: 0 6px 0 0;
    background: url('https://kosa-final-project-team-3.github.io/cdn/ico_kakao.svg') no-repeat;
    background-size: contain;
    vertical-align: middle;
}

.login-popup-content {
    padding: 40px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.login-popup-content p {
    margin-bottom: 20px;
}
</style>
