<template>
    <div class="dialog-overlay" @click.self="$emit('close')">
        <div class="dialog-content">
            <h3>레슨 신청 거절</h3>
            <div class="form-group">
                <label for="rejectReason">거절 사유</label>
                <textarea
                    id="rejectReason"
                    v-model="rejectReason"
                    class="form-textarea"
                    placeholder="거절 사유를 입력해주세요"
                    rows="4"
                ></textarea>
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
});

const emit = defineEmits(['close', 'submit']);
const rejectReason = ref('');

const handleSubmit = () => {
    if (!rejectReason.value.trim()) {
        alert('거절 사유를 입력해주세요.');
        return;
    }
    emit('submit', rejectReason.value);
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

.form-textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
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
    background-color: #f13223;
    color: white;
}

.cancel-btn {
    background-color: #ababa4;
    color: white;
}
</style>
