<template>
    <div class="dialog-overlay" @click.self="$emit('close')">
        <div class="dialog-content">
            <h3>레슨 정보 입력</h3>
            <div class="form-group">
                <label for="count">레슨 횟수</label>
                <input type="number" id="count" v-model="formData.count" class="form-input" min="1" />
            </div>
            <div class="form-group">
                <label for="startDate">시작 일자</label>
                <input type="date" id="startDate" v-model="formData.startDate" class="form-input" />
            </div>
            <div class="form-group">
                <label for="endDate">종료 일자</label>
                <input type="date" id="endDate" v-model="formData.endDate" class="form-input" />
            </div>
            <div class="dialog-buttons">
                <button @click="handleSubmit" class="submit-btn">확인</button>
                <button @click="$emit('close')" class="cancel-btn">취소</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    request: Object,
    lessonType: String,
    trainerId: Number,
});

const emit = defineEmits(['close', 'submit']);

const formData = ref({
    count: '',
    startDate: '',
    endDate: '',
});

const handleSubmit = () => {
    if (!formData.value.count || !formData.value.startDate || !formData.value.endDate) {
        alert('모든 필드를 입력해주세요.');
        return;
    }

    if (new Date(formData.value.endDate) <= new Date(formData.value.startDate)) {
        alert('종료 일자는 시작 일자보다 이후여야 합니다.');
        return;
    }

    emit('submit', {
        ...formData.value,
    });
};
</script>

<style scoped>
.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.dialog-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

.form-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.dialog-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
}

.submit-btn,
.cancel-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.submit-btn {
    background-color: #4caf50;
    color: white;
}

.cancel-btn {
    background-color: #f44336;
    color: white;
}
</style>
