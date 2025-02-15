<template>
    <div class="popup-overlay" @click="$emit('close')">
        <div class="popup-content" @click.stop>
            <button class="close-button" @click="$emit('close')">닫기</button>
            <div v-if="lesson.status === '승인됨'">
                <h4>레슨 정보</h4>
                <p>시작 날짜: {{ lesson.startDate }}</p>
                <p>종료 날짜: {{ lesson.endDate }}</p>
                <p>횟수: {{ lesson.count }}</p>
            </div>
            <div v-else-if="lesson.status === '처리 대기중'">
                <h4>트레이너가 확인중입니다.</h4>
            </div>
            <div v-else-if="lesson.status === '거절됨'">
                <h4>거절 사유</h4>
                <p>트레이너 내용: {{ lesson.trainerContent }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    lesson: Object,
});
</script>

<style scoped>
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 300px;
}

.close-button {
    background: none;
    border: none;
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 10px;
}
</style>
