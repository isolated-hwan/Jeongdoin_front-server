<template>
    <div class="lesson-detail-container">
        <div class="modal-content">
            <button class="close-button" @click="$emit('close')">×</button>
            <button class="close-button" @click="$emit('close')">×</button>

            <div class="lesson-header">
                <h2>{{ lesson.title }}</h2>
                <div class="lesson-header-container">
                    <div class="lesson-image-container">
                        <img v-if="lesson.image" :src="lesson.image" alt="레슨 이미지" class="lesson-image" />
                        <div v-else class="lesson-image-placeholder">이미지 없음</div>
                    </div>
                    <div class="lesson-details">
                        <p><strong>종목:</strong> {{ lesson.category }}</p>
                        <p><strong>강사:</strong> {{ lesson.trainer }}</p>
                        <p><strong>가격:</strong> {{ lesson.price }}원</p>
                        <div class="lesson-description">
                            <strong>레슨 상세 내역:</strong>
                            <div class="description-content">
                                {{ lesson.description }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lesson-info" v-if="selectedType === '그룹 레슨'">
                <p><strong>모집 기간</strong>: {{ lesson.recruitmentStart }} ~ {{ lesson.recruitmentEnd }}</p>
                <p><strong>최대 인원</strong>: {{ lesson.maxParticipants }}명</p>
            </div>

            <div class="lesson-location" v-if="selectedType === '개인 레슨' || selectedType === '그룹 레슨'">
                <p><strong>수업 장소:</strong> {{ lesson.location }}</p>
                <map-view :lat="lesson.lat" :lng="lesson.lng" />
            </div>

            <div class="trainer-evaluation">
                <div class="evaluation-container">
                    <div class="evaluation-title">
                        <strong>트레이너 평가</strong>
                    </div>
                    <div class="radar-chart-container">
                        <radar-chart v-if="lesson.ratings" :ratings="lesson.ratings" />
                    </div>
                </div>
                <div class="review-list">
                    <div class="review-title"><strong>한줄평</strong></div>
                    <ul>
                        <li v-for="(review, index) in lesson.reviews" :key="index">
                            {{ review }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <button class="inquiry-button floating" @click="handleInquiry">문의하기</button>
    </div>
</template>

<script setup>
import RadarChart from './RadarChart.vue';
import MapView from './MapView.vue';

const props = defineProps({
    lesson: Object,
    selectedType: String,
});

const emit = defineEmits(['close', 'openInquiry']);

const handleInquiry = () => {
    emit('openInquiry', props.lesson);
    emit('close');
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
    border-radius: 10px;
    width: 70%;
    height: 80%;
    overflow-y: auto;
    position: relative;
}

.modal-content::-webkit-scrollbar {
    display: none;
}

.lesson-header {
    display: flex;
    margin-top: 30px;
    margin-bottom: 20px;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
}

.lesson-header h2 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 2rem;
    margin-bottom: 20px;
}

.lesson-header-container {
    display: flex;
    flex-direction: row;
}

.lesson-image-container {
    float: left;
    width: 50%;
    margin-right: 20px;
    max-height: 300px;
}

.lesson-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    max-height: 200px;
    margin-right: 20px;
    overflow: hidden;
}

.description-content {
    margin-top: 10px;
    max-height: 150px;
    overflow-y: auto;
}

.description-content::-webkit-scrollbar {
    width: 5px;
}

.description-content::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.description-content::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
}

.description-content::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.lesson-info {
    margin: 40px;
}

.lesson-location {
    margin: 40px;
}

.trainer-evaluation {
    margin: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.evaluation-container {
    width: 50%;
    float: left;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-direction: column;
    margin-bottom: 30px;
}

.evaluation-title {
    margin-bottom: 20px;
}

#radarChart {
    width: 100%;
    height: 100%;
}

.review-list {
    width: 50%;
    float: left;
}

.review-title {
    margin-bottom: 20px;
    text-align: center;
}

.review-list ul {
    list-style-type: none;
    padding-left: 20px;
}

.review-list li {
    margin-bottom: 10px;
}

.close-button {
    position: fixed;
    top: calc(10vh + 30px);
    right: calc(20%);
    background-color: white;
    border: none;
    font-size: 2rem;
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

.inquiry-button {
    background-color: #f13223;
    color: white;
    border: none;
    padding: 0.7rem 1.4rem;
    cursor: pointer;
    border-radius: 10px;
    font-size: 1.1em;
    transition: background-color 0.3s ease;
    float: right;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.inquiry-button:hover {
    background-color: #d32f2f;
    transform: translateY(-2px);
}

.inquiry-button.floating {
    position: fixed;
    bottom: calc(10vh + 20px);
    right: calc(20%);
    z-index: 1002;
}

.map-view {
    position: relative;
    z-index: 1;
}
</style>
