<template>
    <div class="inquiry-container">
        <div class="modal-content">
            <h2>문의하기</h2>
            <p><strong>카테고리:</strong> {{ lesson.category }}</p>
            <p><strong>강사명:</strong> {{ lesson.trainer }}</p>

            <hr />

            <div class="inquiry-form">
                <strong class="inquiry-label">신청인 이름</strong>
                <input type="text" v-model="applicantName" />

                <strong class="inquiry-label">신청인 연락처</strong>
                <input type="tel" v-model="applicantContact" placeholder="010-1234-5678" />

                <strong class="inquiry-label">이미지 및 동영상 업로드</strong>
                <input type="file" @change="fileUpload" multiple />

                <strong class="inquiry-label">문의 내용</strong>
                <textarea v-model="inquiryMessage"></textarea>
            </div>

            <div class="button-container">
                <button type="button" class="submit-button" @click="inquirySubmit">등록하기</button>
                <button type="button" class="close-button" @click="$emit('close')">닫기</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    lesson: Object,
});

const emit = defineEmits(['close']);

const applicantName = ref('');
const applicantContact = ref('');
const inquiryMessage = ref('');
const uploadFiles = ref([]);

const fileUpload = (event) => {
    const files = Array.from(event.target.files);
    uploadFiles.value = [...uploadFiles.value, ...files];
};

const inquirySubmit = async () => {
    if (!applicantName.value || !applicantContact.value || !inquiryMessage.value.trim()) {
        alert('이름, 연락처, 문의 내용을 입력해 주세요.');
        return;
    }

    //서버 전송
    alert(`${applicantName.value}님, 문의가 접수되었습니다.`);
    emit('close');
};
</script>

<style scoped>
.inquiry-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
}

.modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    width: 500px;
}

.modal-content h2 {
    font-family: 'Do Hyeon', sans-serif;
    text-align: center;
}

.inquiry-form {
    display: flex;
    flex-direction: column;
}

.inquiry-label {
    margin-top: 10px;
    margin-bottom: 5px;
}

.inquiry-form input,
.inquiry-form textarea {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.submit-button {
    background-color: #f13223;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    border-radius: 10px;
    transition: background-color 0.3s ease;
}

.submit-button:hover {
    background-color: #d32f2f;
}

.close-button {
    padding: 10px;
    background-color: #ababa4;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: 10px;
}

.close-button:hover {
    background-color: #999;
}
/* 
.inquiry-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    width: 500px;
}

.inquiry-form {
    display: flex;
    flex-direction: column;
}

.inquiry-form input,
.inquiry-form textarea {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.submit-button {
    padding: 10px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 20px;
}

.submit-button:hover {
    background-color: #4f4f4f;
}

.close-button {
    padding: 10px;
    background-color: #a6a6a6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: 10px;
}

.close-button:hover {
    background-color: #999;
} */
</style>
