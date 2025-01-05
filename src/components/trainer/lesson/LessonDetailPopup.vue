<template>
    <div class="lesson-detail-container">
        <div class="modal-content">
            <button class="close-button" @click="$emit('close')">×</button>

            <div class="lesson-header">
                <div class="lesson-title">{{ lesson.title }}</div>
                <div class="lesson-header-container">
                    <div class="lesson-image-container">
                        <img v-if="lesson.image" :src="lesson.image" alt="레슨 이미지" class="lesson-image" />
                        <div v-else class="lesson-image-placeholder">이미지 없음</div>
                    </div>
                    <div class="lesson-details">
                        <p><strong>종목:</strong> {{ lesson.category }}</p>
                        <p><strong>강사:</strong> {{ lesson.trainer }}</p>
                        <p><strong>가격:</strong> {{ lesson.price }}원</p>
                    </div>
                </div>
            </div>

            <div class="lesson-description">
                <p><strong>레슨 상세 내역:</strong></p>
                <p>{{ lesson.description }}</p>
            </div>
            <!-- 그룹 레슨 특정 정보 -->
            <div v-if="selectedType === '그룹 레슨'">
                <p><strong>모집 시작일:</strong> {{ lesson.recruitmentStart }}</p>
                <p><strong>모집 종료일:</strong> {{ lesson.recruitmentEnd }}</p>
                <p><strong>모집 인원:</strong> {{ lesson.currentParticipants }}/{{ lesson.maxParticipants }}명</p>
            </div>

            <!-- 개인 레슨과 그룹 레슨에만 표시되는 위치 정보 -->
            <div class="lesson-location" v-if="selectedType === '개인 레슨' || selectedType === '그룹 레슨'">
                <p><strong>수업 장소:</strong> {{ lesson.location }}</p>
            </div>

            <!-- 요청 리스트 -->
            <div class="request-list">
                <hr class="hr-line" />
                <h3>요청 리스트</h3>
                <ul>
                    <li v-for="request in requests" :key="request.id" class="request-item">
                        <span class="requester-name">{{ request.name }}</span>
                        <div class="request-actions">
                            <button @click="acceptRequest(request)" class="accept-btn">수락</button>
                            <button @click="rejectRequest(request.id)" class="reject-btn">거절</button>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- 참여 리스트 -->
            <div class="participants-list">
                <hr class="hr-line" />
                <h3>참여 리스트</h3>
                <ul>
                    <li v-for="participant in participants" :key="participant.id" class="participant-item">
                        <span class="participant-name">{{ participant.name }}</span>
                        <template v-if="selectedType === '온라인 PT'">
                            <span v-if="participant.roomUrl" class="room-url">
                                <a :href="participant.roomUrl" target="_blank">{{ participant.roomUrl }}</a>
                            </span>
                            <button
                                v-if="!participant.roomUrl"
                                @click="createRoom(participant)"
                                class="create-room-btn"
                            >
                                방 생성
                            </button>
                        </template>
                    </li>
                </ul>
            </div>

            <!-- 그룹 레슨 마감 버튼 -->
            <div v-if="selectedType === '그룹 레슨'" class="close-lesson-container">
                <button @click="closeLesson" class="close-lesson-btn">마감하기</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import axios from 'axios';

const props = defineProps({
    lesson: Object,
    selectedType: String,
});

const emit = defineEmits(['close', 'openInquiry', 'updateParticipants', 'closeLesson']);

// 임시 데이터 (실제로는 API에서 가져와야 함)
const requests = ref([
    { id: 1, name: '김철수' },
    { id: 2, name: '이영희' },
    { id: 3, name: '박지성' },
    { id: 4, name: '이다영' },
]);

const participants = ref([
    { id: 1, name: '홍길동', roomUrl: null },
    { id: 2, name: '장보고', roomUrl: null },
]);

const acceptRequest = (request) => {
    alert(`${request.name} 님의 요청 수락됨`);
    participants.value.push(request);
    requests.value = requests.value.filter((r) => r.id !== request.id);
    if (props.selectedType === '그룹 레슨') {
        emit('updateParticipants', props.lesson.id, 1);
    }
};

const rejectRequest = (requestId) => {
    alert(`${requestId} 님의 요청이 거절됨`);
    requests.value = requests.value.filter((request) => request.id !== requestId);
};

const closeLesson = () => {
    if (confirm('정말로 이 그룹 레슨을 마감하시겠습니까?')) {
        alert('그룹 레슨이 마감되었습니다.');
        emit('closeLesson', props.lesson.id);
    }
};

const createRoom = async (participant) => {
    if (props.selectedType !== '온라인 PT') return;

    try {
        const response = await axios.post('http://localhost:8083/create-room');
        participant.roomUrl = response.data.roomUrl;
        alert(`${participant.name}님의 온라인 PT 방이 생성되었습니다. 링크: ${participant.roomUrl}`);
    } catch (error) {
        console.error('Failed to create room:', error);
        alert('방 생성에 실패했습니다.');
    }
};
</script>

<style scoped>
.lesson-detail-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    width: 700px;
    height: 800px;
    max-height: 75vh;
    overflow-y: auto;
    position: relative;
    margin: 10vh auto;
}

.modal-content::-webkit-scrollbar {
    display: none;
}

.lesson-header {
    display: flex;
    margin-top: 30px;
    margin-bottom: 20px;
    flex-direction: column;
}

.lesson-title {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
    text-align: center;
}

.lesson-header-container {
    display: flex;
    flex-direction: row;
    margin-top: 20px;
}

.lesson-image-container {
    width: 200px;
    height: 200px;
    margin-right: 20px;
}

.lesson-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
}

.lesson-image-placeholder {
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #666;
}

.lesson-details {
    flex: 1;
}

.lesson-description {
    margin-top: 30px;
}

.close-button {
    position: fixed;
    top: calc(10vh + 10px);
    right: calc(25%);
    background-color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #333;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1001;
}

.request-list {
    margin-top: 20px;
}

.request-list h3 {
    font-size: 18px;
    margin-bottom: 10px;
}

.request-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
}

.requester-name {
    font-size: 16px;
}

.request-actions {
    display: flex;
    gap: 10px;
}

.accept-btn,
.reject-btn {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
}

.accept-btn {
    background-color: #f13223;
    color: white;
}

.accept-btn:hover {
    background-color: #d32f2f;
}

.reject-btn {
    background-color: #ababa4;
    color: white;
}

.reject-btn:hover {
    background-color: #9a9a94;
}

.participants-list {
    margin-top: 20px;
}

.participants-list h3 {
    font-size: 18px;
    margin-bottom: 10px;
}

.participant-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
}

.participant-name {
    font-size: 16px;
    flex: 1;
}

.room-url {
    font-size: 14px;
    color: black;
    margin: 0 10px;
    word-break: break-all;
    max-width: 200px;
}

.create-room-btn {
    padding: 5px 10px;
    background-color: #f13223;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
}

.create-room-btn:hover {
    background-color: #f13223;
}

.close-lesson-container {
    margin-top: 20px;
    text-align: center;
}

.close-lesson-btn {
    padding: 10px 20px;
    background-color: #f13223;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
    transition: background-color 0.3s;
}

.close-lesson-btn:hover {
    background-color: #d32f2f;
}

.hr-line {
    margin: 30px 0;
    border: 1px solid #eee;
}
</style>
