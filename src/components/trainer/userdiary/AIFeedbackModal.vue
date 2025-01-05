<template>
    <div class="ai-feedback-modal">
        <div class="modal-content">
            <h3>AI 피드백 설정</h3>
            <div v-for="member in members" :key="member.id" class="member-feedback">
                <h4>{{ member.name }}</h4>
                <div class="feedback-options">
                    <div class="option">
                        <label>운동 참여도:</label>
                        <div class="radio-group">
                            <div class="radio-button">
                                <input
                                    type="radio"
                                    :id="`participation-good-${member.id}`"
                                    :name="`participation-${member.id}`"
                                    value="good"
                                    v-model="member.participation"
                                />
                                <label :for="`participation-good-${member.id}`">잘 참여합니다</label>
                            </div>
                            <div class="radio-button">
                                <input
                                    type="radio"
                                    :id="`participation-bad-${member.id}`"
                                    :name="`participation-${member.id}`"
                                    value="bad"
                                    v-model="member.participation"
                                />
                                <label :for="`participation-bad-${member.id}`">잘 참여하지 않습니다</label>
                            </div>
                        </div>
                    </div>
                    <div class="option">
                        <label>자세:</label>
                        <div class="radio-group">
                            <div class="radio-button">
                                <input
                                    type="radio"
                                    :id="`posture-good-${member.id}`"
                                    :name="`posture-${member.id}`"
                                    value="good"
                                    v-model="member.posture"
                                />
                                <label :for="`posture-good-${member.id}`">자세가 좋습니다</label>
                            </div>
                            <div class="radio-button">
                                <input
                                    type="radio"
                                    :id="`posture-bad-${member.id}`"
                                    :name="`posture-${member.id}`"
                                    value="bad"
                                    v-model="member.posture"
                                />
                                <label :for="`posture-bad-${member.id}`">자세가 좋지 않습니다</label>
                            </div>
                        </div>
                    </div>
                    <div class="option">
                        <label>식단:</label>
                        <div class="radio-group">
                            <div class="radio-button">
                                <input
                                    type="radio"
                                    :id="`diet-good-${member.id}`"
                                    :name="`diet-${member.id}`"
                                    value="good"
                                    v-model="member.diet"
                                />
                                <label :for="`diet-good-${member.id}`">식단을 잘 지킵니다</label>
                            </div>
                            <div class="radio-button">
                                <input
                                    type="radio"
                                    :id="`diet-bad-${member.id}`"
                                    :name="`diet-${member.id}`"
                                    value="bad"
                                    v-model="member.diet"
                                />
                                <label :for="`diet-bad-${member.id}`">식단을 잘 지키지 않습니다</label>
                            </div>
                        </div>
                    </div>
                    <div class="option">
                        <label for="other">기타:</label>
                        <textarea
                            :id="`other-${member.id}`"
                            v-model="member.other"
                            placeholder="예: 골반 경사가 있습니다."
                        ></textarea>
                    </div>
                </div>
            </div>
            <div v-if="isLoading" class="loading">피드백 생성 중...</div>
            <div v-if="error" class="error-message">{{ error }}</div>
            <div class="button-group">
                <button @click="generateFeedback" :disabled="isLoading">피드백 생성</button>
                <button class="close-button" @click="$emit('close')">닫기</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
    selectedMembers: {
        type: Array,
        required: true,
    },
    diaryContent: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['close', 'feedbackGenerated']);

const members = ref([]);
const isLoading = ref(false);
const error = ref(null);

onMounted(() => {
    members.value = props.selectedMembers.map((member) => ({
        ...member,
        participation: '',
        posture: '',
        diet: '',
        other: '',
    }));
});

const generateKeywords = () => {
    const keywords = [];
    members.value.forEach((member) => {
        keywords.push(`회원 이름: ${member.name}`);
        if (member.participation === 'good') keywords.push('잘 참여합니다');
        if (member.participation === 'bad') keywords.push('참여도가 낮습니다');
        if (member.posture === 'good') keywords.push('자세가 좋습니다');
        if (member.posture === 'bad') keywords.push('자세가 좋지 않습니다');
        if (member.diet === 'good') keywords.push('식단을 잘 지킵니다');
        if (member.diet === 'bad') keywords.push('식단을 잘 지키지 않습니다');
        if (member.other) keywords.push(member.other);
    });
    console.log(keywords);
    return keywords;
};

const generateFeedback = async () => {
    isLoading.value = true;
    error.value = null;
    const keywords = generateKeywords();

    try {
        const response = await axios.post('http://localhost:3000/generate-feedback', {
            keywords: keywords,
        });

        const generatedFeedback = response.data.generated_feedback;
        emit('feedbackGenerated', generatedFeedback);
        emit('close');
    } catch (err) {
        console.error('피드백 생성 중 오류 발생:', err);
        error.value = '피드백 생성 중 오류가 발생했습니다. 다시 시도해 주세요.';
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.ai-feedback-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 60vw;
    height: 70vh;
    overflow-y: auto;
}

h3 {
    font-family: 'Do Hyeon', sans-serif;
    text-align: center;
    font-size: 1.5em;
}

h4 {
    font-family: 'Do Hyeon', sans-serif;
    text-align: right;
    margin-right: 10%;
}

.member-feedback {
    margin-bottom: 20px;
}

.feedback-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.option {
    display: flex;
    align-items: center;
    gap: 10px;
}

.option:last-child {
    margin-bottom: 10%;
}

.option > label {
    min-width: 100px;
    font-weight: bold;
}

.radio-group {
    display: flex;
    gap: 20px;
}

.radio-button {
    position: relative;
    display: inline-block;
}

.radio-button input[type='radio'] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.radio-button label {
    display: inline-block;
    padding: 8px 15px;
    border: 2px solid #f13223;
    border-radius: 20px;
    color: #f13223;
    cursor: pointer;
    transition: all 0.3s ease;
}

.radio-button input[type='radio']:checked + label {
    background-color: #f13223;
    color: white;
}

.radio-button label:hover {
    background-color: rgba(241, 50, 35, 0.1);
}

textarea {
    width: calc(100% - 80px);
    height: 60px;
    resize: vertical;
}

.button-group {
    display: flex;
    margin-top: 20px;
    justify-content: center;
    gap: 5px;
}

.close-button {
    background-color: #ababa4;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.1em;
}

button {
    margin-top: 20px;
    padding: 5px 10px;
    background-color: #f13223;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.1em;
}

.error-message {
    margin-top: 10px;
    color: #f44336;
}

.loading {
    margin-top: 10px;
    color: #f44336;
}
</style>
