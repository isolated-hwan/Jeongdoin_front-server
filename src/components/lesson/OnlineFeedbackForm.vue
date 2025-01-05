<template>
    <div class="feedback-response-container">
        <div class="content-wrapper">
            <!-- 왼쪽: 요청자 및 운동 정보, 동영상 -->
            <div class="left-section">
                <!-- 요청자 정보 카드 -->
                <div class="info-card">
                    <p>
                        <strong>{{ requesterName }}</strong>
                    </p>
                    <p>{{ requestTitle }}</p>
                    <p>{{ requestContent }}</p>
                    <p class="expiry-date">{{ feedbackExpiryDate }}</p>
                </div>

                <!-- 운동 동영상 표시 (크기 확대) -->
                <div class="video-section" v-if="videoUrl">
                    <video :src="videoUrl" controls></video>
                </div>
            </div>

            <!-- 오른쪽: 피드백 작성 섹션 -->
            <div class="right-section">
                <!-- 피드백 입력란 -->
                <textarea v-model="feedbackText" placeholder="피드백을 입력하세요..." rows="6"></textarea>

                <!-- AI 초안 작성 버튼 -->
                <button class="ai-button" @click="generateAIFeedback">AI 초안 작성</button>

                <!-- 피드백 제출 버튼 -->
                <button class="submit-button" @click="submitFeedback">피드백 제출</button>
            </div>
        </div>

        <!-- 피드백 제출 완료 메시지 -->
        <div v-if="isFeedbackSubmitted" class="confirmation-message">
            <p>피드백이 성공적으로 제출되었습니다!</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// 요청받은 피드백 관련 정보
const requesterName = ref('홍길동'); // 요청자의 이름
const requestTitle = ref('운동 피드백 요청 제목'); // 요청 제목
const requestContent = ref('운동에 대한 구체적인 요청 내용'); // 요청 내용
const feedbackExpiryDate = ref('2024-10-15'); // 피드백 만료 일자
const videoUrl = ref('https://www.example.com/sample-video.mp4'); // 운동 동영상 URL

// 피드백 작성 및 제출 상태
const feedbackText = ref('');
const isFeedbackSubmitted = ref(false);

// 피드백 제출 함수
const submitFeedback = () => {
    if (!feedbackText.value.trim()) {
        alert('피드백을 입력해주세요.');
        return;
    }
    isFeedbackSubmitted.value = true;
    feedbackText.value = ''; // 입력란 초기화
};

// AI 초안 작성 함수
const generateAIFeedback = () => {
    feedbackText.value = 'AI가 자동으로 작성한 피드백입니다.';
};
</script>

<style scoped>
/* 전체 레이아웃 */
.feedback-response-container {
    max-width: 1000px;
    margin: 50px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
    display: flex;
    flex-direction: row; /* 왼쪽과 오른쪽으로 구분 */
    gap: 30px;
}

/* 왼쪽 섹션 (요청자 및 동영상) */
.left-section {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.info-card {
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.info-card p {
    font-size: 16px;
    color: #333;
    margin: 8px 0;
}

.video-section {
    margin-bottom: 20px;
}

.video-section video {
    width: 100%;
    max-width: 100%;
    height: 400px; /* 동영상 높이 고정 */
    border-radius: 10px;
    border: 1px solid #ddd;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* 오른쪽 섹션 (피드백 입력) */
.right-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.right-section textarea {
    width: 100%;
    padding: 15px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    resize: none;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
}

.right-section textarea:focus {
    border-color: #4a90e2;
}

/* AI 초안 작성 버튼 */
.ai-button {
    padding: 12px 20px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    width: 100%;
    transition: background-color 0.3s ease;
    margin-bottom: 10px;
}

.ai-button:hover {
    background-color: #357ab7;
}

/* 피드백 제출 버튼 */
.submit-button {
    padding: 12px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    width: 100%;
    transition: background-color 0.3s ease;
}

.submit-button:hover {
    background-color: #218838;
}

/* 피드백 제출 완료 메시지 */
.confirmation-message {
    text-align: center;
    font-size: 18px;
    color: #4a90e2;
    margin-top: 30px;
}

/* 피드백 만료일 스타일 */
.expiry-date {
    font-size: 14px;
    color: #888;
}
</style>
