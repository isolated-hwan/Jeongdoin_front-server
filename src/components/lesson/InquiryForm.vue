<template>
    <div class="inquiry-container">
        <div class="modal-content">
            <h2>문의하기</h2>
            <p><strong>카테고리:</strong> {{ lesson.lesson.category }}</p>
            <p><strong>강좌명:</strong> {{ lesson.lesson.title }}</p>
            <p><strong>강사명:</strong> {{ lesson.lesson.trainer }}</p>

            <hr />

            <div class="inquiry-form">
                <strong class="inquiry-label">신청인 이름</strong>
                <input type="text" v-model="applicantName" />

                <strong class="inquiry-label">신청인 연락처</strong>
                <input type="tel" v-model="applicantContact" placeholder="010-1234-5678" />

                <strong class="inquiry-label">문의 내용</strong>
                <textarea v-model="inquiryMessage">레슨 신청합니다.</textarea>
            </div>
            <div class="button-container">
                <button type="button" class="submit-button" @click="inquirySubmit">등록하기</button>
                <button type="button" class="close-button" @click="$emit('close')">닫기</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import jwtAxios, { API_SERVER_HOST } from '../../util/jwtUtil';
import { useAuthStore } from '../../stores/authStore';

const props = defineProps({
    lesson: Object,
});

const host = API_SERVER_HOST;
const authStore = useAuthStore();
const emit = defineEmits(['close']);
const memberId = computed(() => authStore.id);
const memberName = computed(() => authStore.username);
const applicantName = ref('');
const applicantContact = ref('');
const inquiryMessage = ref('레슨 신청합니다.');

const inquirySubmit = async () => {
    if (!inquiryMessage.value) {
        alert('문의 내용을 입력해주세요.');
        return;
    }

    try {
        const response = await jwtAxios.post(`http://${host}/api/apply-lesson`, {
            lessonId: props.lesson.lesson.lessonId,
            lessonCategoryCode: props.lesson.lesson.type,
            memberId: memberId.value,
            memberContent: inquiryMessage.value,
        });
        alert('레슨 신청이 완료되었습니다.');
        emit('close');
    } catch (error) {
        console.error('레슨 신청 실패:', error);
        alert('레슨 신청에 실패했습니다. 다시 시도해주세요.');
    }
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
</style>
