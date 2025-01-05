<template>
    <div class="register-lesson-popup">
        <div class="popup-content">
            <h3>회원 일지 등록</h3>
            <p>선택된 날짜: {{ formattedDate }}</p>
            <form @submit.prevent="registerLesson">
                <div class="form-group">
                    <label for="lessonType">레슨 유형:</label>
                    <select id="lessonType" v-model="lessonData.type" required>
                        <option value="personal">개인</option>
                        <option value="group">그룹</option>
                        <option value="online">온라인</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="memberSearch">회원 검색:</label>
                    <input id="memberSearch" v-model="memberSearch" type="text" placeholder="회원 이름을 입력하세요" />
                </div>
                <div class="form-group">
                    <label>회원 선택:</label>
                    <div class="member-list">
                        <div v-for="member in filteredMembers" :key="member.id" class="member-item">
                            <label :for="'member-' + member.id" class="member-label">
                                <input
                                    type="checkbox"
                                    :id="'member-' + member.id"
                                    :value="member"
                                    v-model="lessonData.selectedMembers"
                                />
                                <span>{{ member.name }}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="startTime">시작 시간:</label>
                    <input id="startTime" v-model="lessonData.startTime" type="time" required />
                </div>
                <div class="form-group">
                    <label for="endTime">종료 시간:</label>
                    <input id="endTime" v-model="lessonData.endTime" type="time" required />
                </div>
                <div class="button-group">
                    <button type="submit">등록하기</button>
                    <button type="button" @click="$emit('close')">취소</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    selectedDate: {
        type: Date,
        required: true,
    },
});

const emit = defineEmits(['close', 'register']);

const lessonData = ref({
    type: 'personal',
    selectedMembers: [],
    startTime: '',
    endTime: '',
});

const memberSearch = ref('');

// 더미 회원 데이터
const members = [
    { id: 1, name: '이다영' },
    { id: 2, name: '이영희' },
    { id: 3, name: '박민수' },
    { id: 4, name: '정지원' },
    { id: 5, name: '홍길동' },
];

const filteredMembers = computed(() => {
    return members.filter((member) => member.name.toLowerCase().includes(memberSearch.value.toLowerCase()));
});

const formattedDate = computed(() => {
    return props.selectedDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});

const registerLesson = () => {
    emit('register', {
        id: Date.now(),
        date: props.selectedDate,
        ...lessonData.value,
        status: 'writing',
    });
    resetForm();
};

const resetForm = () => {
    lessonData.value = {
        type: 'personal',
        selectedMembers: [],
        startTime: '',
        endTime: '',
    };
    memberSearch.value = '';
};
</script>

<style scoped>
.register-lesson-popup h3 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
    margin-bottom: 1.2rem;
    text-align: center;
}
.register-lesson-popup {
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
    width: 400px;
    max-height: 80vh;
    overflow-y: auto;
}

h3 {
    margin-top: 0;
}
p {
    font-family: 'Do Hyeon', sans-serif;
}

.form-group {
    margin-bottom: 15px;
    font-family: 'Do Hyeon', sans-serif;
    display: flex;
    flex-direction: column;
}

label {
    display: inline-block;
    margin-bottom: 5px;
    width: 100%;
}

input,
select {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
}

.member-list {
    max-height: 150px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 5px;
}

.member-item {
    margin-bottom: 5px;
}

.member-label {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.member-label input[type='checkbox'] {
    margin-right: 10px;
    width: auto;
}

.member-label span {
    flex-grow: 1;
}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

button {
    padding: 5px 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

button[type='submit'] {
    background-color: #f44336;
    color: white;
    border-radius: 5px;
}

button[type='button'] {
    background-color: #ababa4;
    color: white;
    border-radius: 5px;
}

/* 시간 입력 필드에 대한 특별한 스타일 */
input[type='time'] {
    width: 100%;
}

/* 회원 검색 입력 필드에 대한 특별한 스타일 */
#memberSearch {
    width: 100%;
}
</style>
