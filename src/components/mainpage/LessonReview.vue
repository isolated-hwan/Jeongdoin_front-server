<template>
    <div class="review-container" v-if="showPopup">
        <div class="modal-content">
            <h2>만족도 평가</h2>
            <p><strong>레슨명:</strong> {{ lesson.title }}</p>
            <p><strong>트레이너:</strong> {{ lesson.trainer }}</p>

            <div class="rating-section">
                <label>만족도:</label>
                <div class="star-rating">
                    <span
                        v-for="star in 5"
                        :key="star"
                        class="star"
                        :class="{ filled: star <= satisfaction }"
                        @click="satisfaction = star"
                    >
                        ★
                    </span>
                </div>
            </div>

            <div class="rating-section">
                <label>전문성:</label>
                <div class="star-rating">
                    <span
                        v-for="star in 5"
                        :key="star"
                        class="star"
                        :class="{ filled: star <= expertise }"
                        @click="expertise = star"
                    >
                        ★
                    </span>
                </div>
            </div>

            <div class="rating-section">
                <label>친절도:</label>
                <div class="star-rating">
                    <span
                        v-for="star in 5"
                        :key="star"
                        class="star"
                        :class="{ filled: star <= kindness }"
                        @click="kindness = star"
                    >
                        ★
                    </span>
                </div>
            </div>

            <div class="rating-section">
                <label>시간엄수:</label>
                <div class="star-rating">
                    <span
                        v-for="star in 5"
                        :key="star"
                        class="star"
                        :class="{ filled: star <= punctuality }"
                        @click="punctuality = star"
                    >
                        ★
                    </span>
                </div>
            </div>

            <div class="rating-section">
                <label>열정:</label>
                <div class="star-rating">
                    <span
                        v-for="star in 5"
                        :key="star"
                        class="star"
                        :class="{ filled: star <= passion }"
                        @click="passion = star"
                    >
                        ★
                    </span>
                </div>
            </div>

            <div class="one-line-review">
                <label>한줄평:</label>
                <textarea v-model="oneLineReview" placeholder="10자 이상 입력해주세요." />
                <p v-if="oneLineReview.length < 10" class="error-message">한줄평은 10자 이상 입력해야 합니다.</p>
            </div>

            <button class="submit-button" :disabled="oneLineReview.length < 10" @click="submitReview">등록하기</button>
            <button class="cancel-button" @click="closePopup">취소</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    showPopup: Boolean,
    lesson: Object,
});

const emit = defineEmits(['close']);

const satisfaction = ref(5);
const expertise = ref(5);
const kindness = ref(5);
const punctuality = ref(5);
const passion = ref(5);
const oneLineReview = ref('');

const submitReview = () => {
    const totalRating = {
        satisfaction: satisfaction.value,
        expertise: expertise.value,
        kindness: kindness.value,
        punctuality: punctuality.value,
        passion: passion.value,
        oneLineReview: oneLineReview.value,
    };
    const points = oneLineReview.value.length > 100 ? 500 : 300;

    alert('리뷰가 등록되었습니다.');
    emit('close');
};

const closePopup = () => {
    emit('close');
};
</script>

<style scoped>
.review-container {
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
    width: 400px;
}

.rating-section {
    margin-bottom: 20px;
}

.star-rating {
    display: flex;
}

.star {
    font-size: 30px;
    cursor: pointer;
    color: #ccc;
}

.star.filled {
    color: gold;
}

.one-line-review textarea {
    width: 100%;
    height: 50px;
}

.error-message {
    color: red;
    font-size: 12px;
}

.submit-button {
    padding: 10px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
}

.submit-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.cancel-button {
    padding: 10px;
    background-color: #a6a6a6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
}
</style>
