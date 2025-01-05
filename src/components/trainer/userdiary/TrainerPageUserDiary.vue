<template>
    <div v-if="isTrainer" class="trainer-page-user-diary">
        <h2>회원 일지 관리</h2>
        <h4>🔴 : 작성 전 🔵 : 작성 중 🟢 : 작성 완료</h4>
        <div class="calendar-container">
            <v-calendar
                :attributes="attributes"
                :selected-date="selectedDate"
                @dayclick="onDayClick"
                @update:from-page="onUpdateFromPage"
                :first-day-of-week="2"
                :expanded="true"
            >
                <template #day-content="{ day }">
                    <div
                        class="day-content"
                        @mouseover="showAddButton(day)"
                        @mouseleave="hideAddButton"
                        @click="selectDate(day.date)"
                    >
                        {{ day.day }}
                        <button
                            v-if="isAddButtonVisible && hoveredDate === day.date"
                            @click.stop="showRegisterLessonPopup(day.date)"
                            class="add-lesson"
                        >
                            +
                        </button>
                        <div class="status-indicators">
                            <span v-if="hasWritingDiary(day.date)" class="status-dot writing"></span>
                            <span v-if="hasInProgressDiary(day.date)" class="status-dot in-progress"></span>
                            <span v-if="hasCompletedDiary(day.date)" class="status-dot completed"></span>
                        </div>
                    </div>
                </template>
            </v-calendar>
        </div>

        <!-- 선택된 날짜의 리스트 표시 -->
        <div v-if="selectedDate" class="selected-date-list">
            <h3>{{ formatDate(selectedDate) }} 일정</h3>

            <div class="diary-lists">
                <div class="diary-list">
                    <h4>작성 전</h4>
                    <ul>
                        <li v-for="diary in selectedDateWritingList" :key="diary.id">
                            {{ getLessonTypeText(diary.type) }}
                            <span v-for="member in diary.selectedMembers" :key="member.id">{{ member.name }} </span>
                            ({{ diary.startTime }} - {{ diary.endTime }})
                            <button @click="showWriteDiaryPopup(diary)" class="btn-write">작성</button>
                            <button @click="deleteDiary(diary.id)" class="btn-delete">삭제</button>
                        </li>
                    </ul>
                </div>

                <div class="diary-list">
                    <h4>작성 중</h4>
                    <ul>
                        <li v-for="diary in selectedDateInProgressList" :key="diary.id">
                            {{ getLessonTypeText(diary.type) }}
                            <span v-for="member in diary.selectedMembers" :key="member.id">{{ member.name }} </span>
                            ({{ diary.startTime }} - {{ diary.endTime }})
                            <button @click="showWriteDiaryPopup(diary)">계속 작성</button>
                        </li>
                    </ul>
                </div>

                <div class="diary-list">
                    <h4>작성 완료</h4>
                    <ul>
                        <li v-for="diary in selectedDateCompletedList" :key="diary.id">
                            {{ getLessonTypeText(diary.type) }}
                            <span v-for="member in diary.selectedMembers" :key="member.id">{{ member.name }} </span>
                            ({{ diary.startTime }} - {{ diary.endTime }})
                            <button @click="viewDiary(diary)">보기</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div v-if="isAnyPopupVisible" class="popup-overlay"></div>

        <!-- 팝업 컴포넌트들 -->
        <RegisterLessonPopup
            v-if="isRegisterLessonPopupVisible"
            :selectedDate="selectedPopupDate"
            @close="closeRegisterLessonPopup"
            @register="registerLesson"
        />
        <WriteDiaryPopup
            v-if="isWriteDiaryPopupVisible"
            :selectedDiary="selectedDiary"
            :isViewMode="isViewMode"
            @close="closeWriteDiaryPopup"
            @save="saveDiary"
            @temp-save="tempSaveDiary"
        />
    </div>
    <div v-else>
        <h2>접근 권한이 없습니다.</h2>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Calendar } from 'v-calendar';
import 'v-calendar/dist/style.css';
import RegisterLessonPopup from './RegisterLessonDiaryPopup.vue';
import WriteDiaryPopup from './WriteDiaryPopup.vue';
import { useAuthStore } from '../../../stores/authStore';

const authStore = useAuthStore();
const selectedDate = ref(null);
const selectedPopupDate = ref(null);
const isRegisterLessonPopupVisible = ref(false);
const isWriteDiaryPopupVisible = ref(false);
const selectedDiary = ref(null);
const isViewMode = ref(false);
const isAddButtonVisible = ref(false);
const hoveredDate = ref(null);
const isTrainer = computed(() => authStore.role === 'TRAINER');

const writingList = ref([]);
const inProgressList = ref([]);
const completedList = ref([]);

const attributes = computed(() => [
    // 오늘 날짜 강조
    {
        key: 'today',
        dates: new Date(),
        highlight: {
            fillMode: 'solid',
            color: '#7367f0',
        },
        contentStyle: {
            color: 'white',
            fontWeight: 'bold',
        },
    },
    // 선택된 날짜 강조
    {
        key: 'selected',
        dates: selectedDate.value,
        highlight: {
            fillMode: 'outline',
            color: '#ff9f43',
        },
        contentStyle: {
            fontWeight: 'bold',
        },
    },
]);

const onDayClick = (day) => {
    selectedDate.value = day.date;
    selectDate(day.date);
};

const selectDate = (date) => {
    selectedDate.value = date;
};

const selectedDateWritingList = computed(() => {
    return writingList.value.filter((diary) => {
        const diaryDate = new Date(diary.date);
        return diaryDate.toDateString() === selectedDate.value.toDateString();
    });
});

const selectedDateInProgressList = computed(() => {
    return inProgressList.value.filter((diary) => {
        const diaryDate = new Date(diary.date);
        return diaryDate.toDateString() === selectedDate.value.toDateString();
    });
});

const selectedDateCompletedList = computed(() => {
    return completedList.value.filter((diary) => {
        const diaryDate = new Date(diary.date);
        return diaryDate.toDateString() === selectedDate.value.toDateString();
    });
});

const showAddButton = (day) => {
    isAddButtonVisible.value = true;
    hoveredDate.value = day.date;
};
const getLessonTypeText = (type) => {
    const types = {
        personal: '개인',
        group: '그룹',
        online: '온라인',
    };
    return types[type] || type;
};
const hideAddButton = () => {
    isAddButtonVisible.value = false;
    hoveredDate.value = null;
};

const onUpdateFromPage = (page) => {
    console.log('Calendar page changed:', page);
};

const showRegisterLessonPopup = (date) => {
    selectedPopupDate.value = date;
    isRegisterLessonPopupVisible.value = true;
};

const closeRegisterLessonPopup = () => {
    isRegisterLessonPopupVisible.value = false;
};

const registerLesson = (lessonData) => {
    writingList.value.push(lessonData);
    closeRegisterLessonPopup();
};

const showWriteDiaryPopup = (diary) => {
    selectedDiary.value = diary;
    isWriteDiaryPopupVisible.value = true;
    isViewMode.value = false;
};

const closeWriteDiaryPopup = () => {
    isWriteDiaryPopupVisible.value = false;
    selectedDiary.value = null;
    isViewMode.value = false;
};

const saveDiary = (diaryData) => {
    let sourceList;
    if (diaryData.status === 'writing') {
        sourceList = writingList;
    } else if (diaryData.status === 'in-progress') {
        sourceList = inProgressList;
    }

    if (sourceList) {
        const index = sourceList.value.findIndex((d) => d.id === diaryData.id);
        if (index !== -1) {
            sourceList.value.splice(index, 1);
        }
    }

    completedList.value.push({ ...diaryData, status: 'completed' });
    closeWriteDiaryPopup();
};

const tempSaveDiary = (diaryData) => {
    // 먼저 writingList에서 해당 다이어리를 찾아 제거
    const writingIndex = writingList.value.findIndex((d) => d.id === diaryData.id);
    if (writingIndex !== -1) {
        writingList.value.splice(writingIndex, 1);
    }

    // 그 다음 inProgressList에서 해당 다이어리를 찾음
    const inProgressIndex = inProgressList.value.findIndex((d) => d.id === diaryData.id);

    if (inProgressIndex !== -1) {
        // 이미 작성 중 리스트에 있다면 해당 항목을 업데이트
        inProgressList.value[inProgressIndex] = { ...diaryData, status: 'in-progress' };
    } else {
        // 작성 중 리스트에 없다면 새로 추가
        inProgressList.value.push({ ...diaryData, status: 'in-progress' });
    }

    closeWriteDiaryPopup();
};

const deleteDiary = (diaryId) => {
    writingList.value = writingList.value.filter((d) => d.id !== diaryId);
};

const viewDiary = (diary) => {
    selectedDiary.value = diary;
    isWriteDiaryPopupVisible.value = true;
    isViewMode.value = true;
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const isAnyPopupVisible = computed(() => {
    return isRegisterLessonPopupVisible.value || isWriteDiaryPopupVisible.value;
});

const hasWritingDiary = (date) => {
    return writingList.value.some((diary) => isSameDay(new Date(diary.date), date));
};

const hasInProgressDiary = (date) => {
    return inProgressList.value.some((diary) => isSameDay(new Date(diary.date), date));
};

const hasCompletedDiary = (date) => {
    return completedList.value.some((diary) => isSameDay(new Date(diary.date), date));
};

const isSameDay = (date1, date2) => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};
</script>

<style scoped>
.trainer-page-user-diary {
    padding: 20px;
    width: 70vw;
}

.calendar-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto 20px;
}

.day-content {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.add-lesson {
    position: absolute;
    bottom: 5px;
    right: 5px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
}

.diary-lists {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.diary-list {
    width: 30%;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
}

.diary-list h3 {
    margin-top: 0;
    margin-bottom: 10px;
    text-align: center;
}

.diary-list ul {
    list-style-type: none;
    padding: 0;
}

.diary-list li {
    margin-bottom: 10px;
    padding: 5px;
    background-color: #f8f8f8;
    border-radius: 4px;
}

.diary-list button {
    margin-left: 5px;
    padding: 2px 5px;
    background-color: #f13223;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

:deep(.vc-container) {
    --day-border: 1px solid #ddd;
    --day-border-highlight: 1px solid #333;
    --day-width: 100px;
    --day-height: 100px;
    --weekday-bg: #f8f8f8;
    --weekday-border: 1px solid #e0e0e0;

    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-family: sans-serif;
}

:deep(.vc-header) {
    margin-top: 0px;
}

:deep(.vc-weeks) {
    padding: 0;
}

:deep(.vc-day) {
    padding: 5px 0;
    text-align: center;
    font-weight: bold;
}

:deep(.vc-day-content) {
    width: var(--day-width);
    height: var(--day-height);
    font-size: 1.4em;
}

:deep(.vc-weekday) {
    background-color: var(--weekday-bg);
    border-bottom: var(--weekday-border);
    border-top: var(--weekday-border);
    padding: 5px 0;
}

:deep(.vc-highlight) {
    background-color: #e6f3ff !important;
}
:deep(.register-lesson-popup),
:deep(.write-diary-popup) {
    z-index: 1001;
}
.day-content {
    position: relative;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2em;
}

.add-lesson {
    position: absolute;
    bottom: 5px;
    right: 5px;
    background-color: #f13223;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
}

.add-lesson:hover {
    background-color: #f13223;
}

.selected-date-list {
    margin-top: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
}

.selected-date-list h3 {
    margin-top: 0;
    margin-bottom: 20px;
}

.selected-date-list .diary-lists {
    display: flex;
    justify-content: space-between;
}

.selected-date-list .diary-list {
    width: 30%;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
}

.selected-date-list .diary-list h4 {
    margin-top: 0;
    margin-bottom: 10px;
    text-align: center;
}

.selected-date-list ul {
    list-style-type: none;
    padding: 0;
}

.selected-date-list li {
    margin-bottom: 10px;
    padding: 5px;
    background-color: #f8f8f8;
    border-radius: 4px;
}

.selected-date-list .btn-write {
    margin-left: 5px;
    padding: 2px 5px;
    background-color: #f13223;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}
.selected-date-list .btn-delete {
    margin-left: 5px;
    padding: 2px 5px;
    background-color: #ababa4;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

.status-indicators {
    display: flex;
    justify-content: center;
    margin-top: 2px;
}

.status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin: 0 1px;
}

.status-dot.writing {
    background-color: red;
}

.status-dot.in-progress {
    background-color: blue;
}

.status-dot.completed {
    background-color: green;
}

/* 선택된 날짜의 동그라미 색상 조정 */
.vc-highlight.vc-highlight-solid-fill {
    background-color: #ff9f43 !important;
}

/* 오늘 날짜 스타일 */
.vc-day.is-today .vc-highlight {
    background-color: #7367f0 !important;
}

/* 선택된 날짜 스타일 */
.vc-day.is-selected .vc-highlight {
    border: 2px solid #ff9f43 !important;
    background-color: transparent !important;
}

.vc-day.is-selected .vc-day-content {
    color: #ff9f43 !important;
}

/* 오늘이면서 선택된 날짜 스타일 */
.vc-day.is-today.is-selected .vc-highlight {
    background-color: #7367f0 !important;
    border: 2px solid #ff9f43 !important;
}

.vc-day.is-today.is-selected .vc-day-content {
    color: white !important;
}

/* 캘린더 날짜 셀에 대한 스타일 */
:deep(.vc-day) {
    cursor: pointer;
}

/* 선택 불가능한 날짜(과거 날짜 등)에 대한 스타일 */
:deep(.vc-day-not-in-month),
:deep(.vc-day-disabled) {
    cursor: default;
}

/* vc-header를 투명하게 만들�� 항상 표시 */
:deep(.vc-header) {
    background-color: transparent !important;
    opacity: 1 !important;
    visibility: visible !important;
}

/* 제목 스타일 조정 */
:deep(.vc-title) {
    color: #333;
    font-weight: bold;
    font-size: 1.2em;
}

/* 월 표시를 굵게 만들기 */
:deep(.vc-title .vc-month) {
    font-weight: 700;
}

/* 이전/다음 월 버튼 스타일 조정 */
:deep(.vc-arrow) {
    opacity: 1 !important;
    visibility: visible !important;
    color: #333;
}

/* 호버 시 스타일 */
:deep(.vc-title:hover),
:deep(.vc-arrow:hover) {
    background-color: rgba(243, 50, 35, 0.1);
}

:deep(.vc-weeks-header) {
    padding-top: 10px;
}

:deep(.vc-day-content) {
    color: #333;
}
</style>
