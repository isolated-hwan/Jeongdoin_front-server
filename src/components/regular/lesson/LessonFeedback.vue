<template>
    <div class="lesson-feedback">
        <h3>피드백</h3>
        <table class="feedback-table">
            <thead>
                <tr>
                    <th>레슨 이름</th>
                    <th>트레이너</th>
                    <th>피드백 신청일</th>
                    <th>상태</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="feedback in feedbacks" :key="feedback.id" @click="openFeedbackDetail(feedback)">
                    <td>{{ feedback.lessonTitle }}</td>
                    <td>{{ feedback.trainer }}</td>
                    <td>{{ formatDate(feedback.requestDate) }}</td>
                    <td>{{ feedback.status }}</td>
                </tr>
            </tbody>
        </table>

        <div v-if="selectedFeedback" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeFeedbackDetail">&times;</span>
                <h4>{{ selectedFeedback.lessonTitle }} 피드백 내역</h4>
                <div class="feedback-messages" ref="messagesContainer">
                    <div v-for="message in feedbackMessages" :key="message.id" class="message">
                        <p>
                            <strong>{{ message.sender }}:</strong> {{ message.content }}
                        </p>
                        <small>{{ formatDate(message.date) }}</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const feedbacks = ref([
    { id: 1, lessonTitle: '1:1 PT', trainer: '김트레이너', requestDate: '2023-06-01', status: '완료' },
    { id: 2, lessonTitle: '요가 클래스', trainer: '이요가', requestDate: '2023-06-02', status: '진행중' },
    { id: 3, lessonTitle: '홈트레이닝', trainer: '박홈트', requestDate: '2023-06-03', status: '대기중' },
]);

const selectedFeedback = ref(null);
const feedbackMessages = ref([]);
const messagesContainer = ref(null);
let page = 1;
const pageSize = 20;

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
};

const openFeedbackDetail = async (feedback) => {
    selectedFeedback.value = feedback;
    page = 1;
    feedbackMessages.value = [];
    await loadMoreMessages();
};

const closeFeedbackDetail = () => {
    selectedFeedback.value = null;
    feedbackMessages.value = [];
};

const loadMoreMessages = async () => {
    // 실제 구현에서는 API를 호출하여 메시지를 가져와야 합니다.
    const newMessages = Array.from({ length: pageSize }, (_, i) => ({
        id: feedbackMessages.value.length + i + 1,
        sender: i % 2 === 0 ? '트레이너' : '사용자',
        content: `피드백 메시지 ${feedbackMessages.value.length + i + 1}`,
        date: new Date(Date.now() - i * 86400000).toISOString(),
    }));

    feedbackMessages.value = [...newMessages.reverse(), ...feedbackMessages.value];
    page++;

    await nextTick();
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = 0;
    }
};

const handleScroll = async (e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0) {
        await loadMoreMessages();
    }
};

onMounted(() => {
    if (messagesContainer.value) {
        messagesContainer.value.addEventListener('scroll', handleScroll);
    }
});
</script>

<style scoped>
.lesson-feedback {
    padding: 1rem;
}

.lesson-feedback h3 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
    margin-bottom: 1.2rem;
}

.feedback-table {
    width: 100%;
    border-collapse: collapse;
}

.feedback-table th,
.feedback-table td {
    border: 1px solid #ddd;
    padding: 0.8rem;
    text-align: left;
}

.feedback-table th {
    background-color: #f2f2f2;
    font-weight: bold;
}

.feedback-table tbody tr {
    cursor: pointer;
}

.feedback-table tbody tr:hover {
    background-color: #f5f5f5;
}

.modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 30px;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    border-radius: 10px;
}

.modal-content h4 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
    margin-bottom: 1.2rem;
    text-align: center;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.feedback-messages {
    height: 300px;
    overflow-y: auto;
}

.message {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 10px;
}

.message small {
    display: block;
    color: #888;
    font-size: 0.8em;
}
</style>
