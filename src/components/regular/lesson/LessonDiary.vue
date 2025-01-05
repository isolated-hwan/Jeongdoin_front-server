<template>
    <div class="lesson-diary">
        <h3>레슨 일지</h3>
        <div class="category-selector">
            <button
                v-for="category in categories"
                :key="category"
                @click="selectCategory(category)"
                :class="{ active: selectedCategory === category }"
            >
                {{ category }}
            </button>
        </div>
        <table class="lesson-table" v-if="filteredLessons.length > 0">
            <thead>
                <tr>
                    <th>레슨 이름</th>
                    <th>트레이너</th>
                    <th>날짜</th>
                    <th>일지 상태</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="lesson in filteredLessons" :key="lesson.id" @click="openDiaryDetail(lesson)">
                    <td>{{ lesson.title }}</td>
                    <td>{{ lesson.trainer }}</td>
                    <td>{{ formatDate(lesson.date) }}</td>
                    <td>{{ lesson.diaryStatus }}</td>
                </tr>
            </tbody>
        </table>
        <div v-else class="no-lessons">선택한 카테고리의 레슨이 없습니다.</div>

        <div v-if="selectedDiary" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeDiaryDetail">&times;</span>
                <h3>{{ selectedDiary.title }} 레슨 일지</h3>
                <p><strong>트레이너:</strong> {{ selectedDiary.trainer }}</p>
                <p><strong>날짜:</strong> {{ formatDate(selectedDiary.date) }}</p>
                <p><strong>내용:</strong></p>
                <p>{{ selectedDiary.content }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const categories = ['개인', '그룹', '온라인'];
const selectedCategory = ref('개인');
const selectedDiary = ref(null);

// 더미 데이터
const lessons = ref([
    {
        id: 1,
        type: '개인',
        title: '1:1 PT',
        trainer: '김트레이너',
        date: '2024-06-01',
        diaryStatus: '작성완료',
        content:
            '오늘은 상체 운동을 집중적으로 진행했습니다. 벤치프레스 3세트, 덤벨 프레스 3세트를 수행했고, 자세가 많이 개선되었습니다.',
    },
    {
        id: 2,
        type: '그룹',
        title: '요가 클래스',
        trainer: '이요가',
        date: '2024-06-02',
        diaryStatus: '작성완료',
        content:
            '오늘은 균형 잡기 동작을 중심으로 수업을 진행했습니다. 학생들의 균형 감각이 전반적으로 향상되고 있습니다.',
    },
    {
        id: 3,
        type: '온라인',
        title: '홈트레이닝',
        trainer: '박홈트',
        date: '2024-06-03',
        diaryStatus: '미작성',
        content: '',
    },
    // 더 많은 더미 데이터를 추가할 수 있습니다.
]);

const filteredLessons = computed(() => {
    return lessons.value.filter((lesson) => lesson.type === selectedCategory.value);
});

const selectCategory = (category) => {
    selectedCategory.value = category;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
};

const openDiaryDetail = (lesson) => {
    selectedDiary.value = lesson;
};

const closeDiaryDetail = () => {
    selectedDiary.value = null;
};
</script>

<style scoped>
.lesson-diary {
    padding: 1rem;
}

.lesson-diary h3 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
    margin-bottom: 1.2rem;
}

.category-selector {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
}

.category-selector button {
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    border: none;
    background-color: #f0f0f0;
    cursor: pointer;
    border-radius: 10px;
}

.category-selector button:hover {
    background-color: #ababa4; /* 호버 시 배경색 변경 */
    color: white; /* 호버 시 텍스트 색상 변경 (선택사항) */
}
.category-selector button.active {
    background-color: #f13223;
    color: white;
}

.lesson-table {
    width: 100%;
    border-collapse: collapse;
}

.lesson-table th,
.lesson-table td {
    border: 1px solid #ddd;
    padding: 0.8rem;
    text-align: left;
}

.lesson-table th {
    background-color: #f2f2f2;
    font-weight: bold;
}

.lesson-table tbody tr {
    cursor: pointer;
}

.lesson-table tbody tr:hover {
    background-color: #f5f5f5;
}

.no-lessons {
    text-align: center;
    padding: 2rem;
    color: #666;
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
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
    border-radius: 10px;
}

.modal-content h3 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
    margin: 1.2rem 0;
    text-align: center;
}

.modal-content p:last-child {
    margin-bottom: 30px;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}
</style>
