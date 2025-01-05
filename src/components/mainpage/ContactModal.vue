<template>
    <div class="contact-container">
        <h2>Contact Us</h2>
        <form @submit.prevent="submitForm">
            <label for="title">제목:</label>
            <input type="text" id="title" v-model="title" required />

            <label for="email">이메일:</label>
            <input type="email" id="email" v-model="email" required />

            <label for="message">메시지:</label>
            <textarea id="message" v-model="message" required></textarea>

            <button class="submit-btn" type="submit">전송</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close']);

const title = ref('');
const email = ref('');
const message = ref('');

const submitForm = () => {
    console.log('폼 데이터:', {
        title: title.value,
        email: email.value,
        message: message.value,
    });
    // 여기에 폼 데이터를 서버로 전송하는 로직 추가
    emit('close');
};
</script>

<style scoped>
html,
body {
    background-color: #f9f9f9;
}

.contact-container {
    padding: 30px;
    max-width: 500px;
    margin: auto;
    margin-top: 50px;
}

form {
    display: flex;
    flex-direction: column;
}

form label {
    margin-top: 20px;
    font-weight: bold;
}

form input {
    padding: 10px;
    margin-top: 5px;
    border: none;
    outline: none;
    border-bottom: 2px solid #ccc;
    transition: border-color 0.3s;
}

form textarea {
    padding: 10px;
    margin-top: 5px;
    border: 2px solid #ccc;
    height: 100px;
    transition: border-color 0.3s;
}

form input:focus,
form textarea:focus {
    border-color: black;
}

.submit-btn {
    margin-top: 20px;
    padding: 10px;
    background-color: #f13223;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.submit-btn:hover {
    background-color: #4f4f4f;
}
</style>
