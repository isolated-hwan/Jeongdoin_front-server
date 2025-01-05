<template>
    <div class="write-diary-popup">
        <div class="popup-content">
            <h3>{{ isViewMode ? '일지 보기' : '일지 작성' }}</h3>
            <div class="lesson-info">
                <p><strong>날짜:</strong> {{ formattedDate }}</p>
                <p><strong>레슨 유형:</strong> {{ getLessonTypeText(selectedDiary.type) }}</p>
                <p><strong>회원:</strong> {{ memberNames }}</p>
                <p><strong>시간:</strong> {{ selectedDiary.startTime }} - {{ selectedDiary.endTime }}</p>
            </div>
            <form @submit.prevent="saveDiary">
                <div class="form-group">
                    <div class="label-diary-container">
                        <label for="diaryContent" class="label-diary">일지 내용:</label>
                        <div v-if="!isViewMode" class="toggle-container">
                            <span class="toggle-label">AI 피드백 활성화</span>
                            <label class="switch">
                                <input type="checkbox" v-model="isAIEnabled" />
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <textarea
                        id="diaryContent"
                        v-model="diaryContent"
                        rows="10"
                        placeholder="일지 내용을 입력하세요"
                        required
                        :readonly="isViewMode"
                    ></textarea>
                </div>
                <div class="button-group" v-if="!isViewMode">
                    <button type="submit">저장</button>
                    <button type="button" @click="tempSaveDiary">임시 저장</button>
                    <button type="button" @click="$emit('close')">취소</button>
                </div>
                <div class="button-group" v-else>
                    <button type="button" @click="$emit('close')">닫기</button>
                </div>
            </form>
        </div>
        <AIFeedbackModal
            v-if="showAIFeedbackModal && !isViewMode"
            :selectedMembers="selectedDiary.selectedMembers"
            :diaryContent="diaryContent"
            @close="closeAIFeedbackModal"
            @feedbackGenerated="handleFeedbackGenerated"
        />
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import AIFeedbackModal from './AIFeedbackModal.vue';

const props = defineProps({
    selectedDiary: {
        type: Object,
        required: true,
    },
    isViewMode: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close', 'save', 'temp-save']);

const diaryContent = ref(props.selectedDiary.content || '');

const formattedDate = computed(() => {
    return new Date(props.selectedDiary.date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});

const memberNames = computed(() => {
    return props.selectedDiary.selectedMembers.map((member) => member.name).join(', ');
});

const getLessonTypeText = (type) => {
    const types = {
        personal: '개인',
        group: '그룹',
        online: '온라인',
    };
    return types[type] || type;
};

const saveDiary = () => {
    if (confirm('한 번 저장하면 수정 및 삭제할 수 없습니다. 정말 저장하시겠습니까?')) {
        emit('save', {
            ...props.selectedDiary,
            content: diaryContent.value,
            status: props.selectedDiary.status,
        });
    }
};

const tempSaveDiary = () => {
    emit('temp-save', {
        ...props.selectedDiary,
        content: diaryContent.value,
        status: 'in-progress',
    });
};

const isAIEnabled = ref(false);
const showAIFeedbackModal = ref(false);

const onAIToggle = () => {
    if (isAIEnabled.value && !props.isViewMode) {
        showAIFeedbackModal.value = true;
    } else {
        showAIFeedbackModal.value = false;
    }
};

watch(isAIEnabled, onAIToggle);

const closeAIFeedbackModal = () => {
    showAIFeedbackModal.value = false;
    isAIEnabled.value = false;
};

const handleFeedbackGenerated = (feedback) => {
    if (!props.isViewMode) {
        diaryContent.value += '\n\n--- AI 피드백 ---\n' + feedback;
    }
    closeAIFeedbackModal();
};
</script>

<style scoped>
.write-diary-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 60vw;
    height: 70vh;
    overflow-y: auto;
}

.label-diary {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.2em;
}

h3 {
    margin-top: 0;
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
    margin-bottom: 1.2rem;
}

.lesson-info {
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 15px;
}

.lesson-info p {
    margin: 5px 0;
    font-family: 'Do Hyeon', sans-serif;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
}

textarea {
    width: 100%;
    height: 50vh;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 1.2em;
    resize: none;
}

.button-group {
    display: flex;
    justify-content: space-between;
}

button {
    padding: 5px 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

button[type='submit'] {
    background-color: #f13223;
    border-radius: 5%;
    color: white;
    font-size: 1em;
}

button[type='button']:nth-child(2) {
    background-color: #2196f3;
    border-radius: 5px;
    color: white;
    font-size: 1em;
}

button[type='button']:last-child {
    background-color: #ababa4;
    border-radius: 5px;
    color: white;
    font-size: 1em;
}

.label-diary-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.toggle-container {
    display: flex;
    align-items: center;
}

.toggle-label {
    margin-right: 10px;
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1em;
}

.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
}

.slider:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
}

input:checked + .slider {
    background-color: #f13223;
}

input:checked + .slider:before {
    transform: translateX(26px);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>
