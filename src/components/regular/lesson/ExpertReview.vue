<template>
    <div class="expert-review">
        <h3>트레이너 리뷰</h3>
        <table class="review-table">
            <thead>
                <tr>
                    <th>트레이너</th>
                    <th>작성일</th>
                    <th>만족도</th>
                    <th>전문성</th>
                    <th>친절도</th>
                    <th>시간 준수</th>
                    <th>열정</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="review in reviews" :key="review.trainerReviewSeq" @click="openReviewDetail(review)">
                    <td>{{ review.trainer.name }}</td>
                    <td>{{ formatDate(review.createdAt) }}</td>
                    <td>{{ review.satisfaction }}</td>
                    <td>{{ review.expertise }}</td>
                    <td>{{ review.kindness }}</td>
                    <td>{{ review.punctuality }}</td>
                    <td>{{ review.passion }}</td>
                </tr>
            </tbody>
        </table>

        <div v-if="selectedReview && !isEditing" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeReviewDetail">&times;</span>
                <h4>{{ selectedReview.trainer.name }} 트레이너 리뷰 상세</h4>
                <p><strong>작성일:</strong> {{ formatDate(selectedReview.createdAt) }}</p>
                <p><strong>만족도:</strong> {{ selectedReview.satisfaction }}</p>
                <p><strong>전문성:</strong> {{ selectedReview.expertise }}</p>
                <p><strong>친절도:</strong> {{ selectedReview.kindness }}</p>
                <p><strong>시간 준수:</strong> {{ selectedReview.punctuality }}</p>
                <p><strong>열정:</strong> {{ selectedReview.passion }}</p>
                <p><strong>코멘트:</strong></p>
                <p>{{ selectedReview.comment }}</p>
                <div class="button-container">
                    <button @click="startEditing">수정</button>
                </div>
            </div>
        </div>

        <div v-if="isEditing" class="modal">
            <div class="modal-content">
                <span class="close" @click="cancelEditing">&times;</span>
                <h4>{{ selectedReview.trainer.name }} 트레이너 리뷰 수정</h4>
                <label v-for="field in ratingFields" :key="field.key">
                    {{ field.label }}:
                    <input v-model.number="editingReview[field.key]" type="number" min="1" max="5" step="0.1" />
                </label>
                <label>
                    코멘트:
                    <textarea v-model="editingReview.comment" rows="5"></textarea>
                </label>
                <div class="button-container">
                    <button @click="saveReview">완료</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const ratingFields = [
    { key: 'satisfaction', label: '만족도' },
    { key: 'expertise', label: '전문성' },
    { key: 'kindness', label: '친절도' },
    { key: 'punctuality', label: '시간 준수' },
    { key: 'passion', label: '열정' },
];

const reviews = ref([
    {
        trainerReviewSeq: 1,
        trainer: { name: '김트레이너' },
        createdAt: '2024-09-27',
        satisfaction: 4.5,
        expertise: 4.8,
        kindness: 4.7,
        punctuality: 5.0,
        passion: 4.9,
        comment: '트레이너님의 전문성이 돋보이는 수업이었습니다. 운동 자세에 대한 꼼꼼한 피드백이 특히 좋았습니다.',
    },
    // 더 많은 리뷰 데이터를 추가할 수 있습니다.
]);

const selectedReview = ref(null);
const isEditing = ref(false);
const editingReview = reactive({});

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
};

const openReviewDetail = (review) => {
    selectedReview.value = review;
};

const closeReviewDetail = () => {
    selectedReview.value = null;
    isEditing.value = false;
};

const startEditing = () => {
    ratingFields.forEach((field) => {
        editingReview[field.key] = selectedReview.value[field.key];
    });
    editingReview.comment = selectedReview.value.comment;
    isEditing.value = true;
};

const cancelEditing = () => {
    isEditing.value = false;
};

const saveReview = () => {
    if (confirm('저장하시겠습니까?')) {
        ratingFields.forEach((field) => {
            selectedReview.value[field.key] = editingReview[field.key];
        });
        selectedReview.value.comment = editingReview.comment;
        isEditing.value = false;
        // 여기에 API 호출 로직을 추가하여 서버에 변경사항을 저장할 수 있습니다.
    }
};
</script>

<style scoped>
.expert-review {
    padding: 1rem;
}

.expert-review h3 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
    margin-bottom: 1.2rem;
}

.review-table {
    width: 100%;
    border-collapse: collapse;
}

.review-table th,
.review-table td {
    border: 1px solid #ddd;
    padding: 0.8rem;
    text-align: left;
}

.review-table th {
    background-color: #f2f2f2;
    font-weight: bold;
}

.review-table tbody tr {
    cursor: pointer;
}

.review-table tbody tr:hover {
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
    margin: 10% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
    border-radius: 10px;
}

.modal-content h4 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
    margin-bottom: 2rem;
    text-align: center;
}

.modal-content p:last-child {
    margin-bottom: 2rem;
}

.button-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

label {
    display: block;
    margin-top: 10px;
}

input,
textarea {
    width: 100%;
    padding: 5px;
    margin-top: 5px;
}

button {
    background-color: #f13223;
    color: white;
    border: none;
    padding: 0.7rem 1.4rem;
    cursor: pointer;
    border-radius: 10px;
    font-size: 1.1em;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #d32f2f;
}
</style>
