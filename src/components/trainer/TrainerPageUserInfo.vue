<template>
    <div v-if="isTrainer" class="trainer-page-user-info">
        <h2>나의 정보</h2>
        <div class="tabs">
            <button @click="activeTab = 'myInfo'" :class="{ active: activeTab === 'myInfo' }">나의 정보</button>
            <button @click="activeTab = 'timeTable'" :class="{ active: activeTab === 'timeTable' }">타임테이블</button>
        </div>
        <div v-if="activeTab === 'myInfo'" class="my-info">
            <p>현재 나의 운동 카테고리: {{ currentCategory }}</p>
            <hr class="full-line" />

            <div class="trainer-profiles">
                <div class="profile-header">
                    <p>전문가 이력 정보</p>
                    <button v-if="!isAddingProfile" @click="startAddingProfile" class="btn-add">이력 추가하기</button>
                </div>
                <div v-if="isAddingProfile" class="add-profile-form">
                    <select v-model="newProfile.categoryName">
                        <option value="" disabled selected>카테고리를 선택해주세요.</option>
                        <option v-for="category in profileCategories" :key="category" :value="category">
                            {{ category }}
                        </option>
                    </select>
                    <input v-model="newProfile.title" placeholder="제목" />
                    <input v-model="newProfile.startDate" type="date" placeholder="시작일" />
                    <input v-model="newProfile.endDate" type="date" placeholder="종료일" />
                    <textarea v-model="newProfile.detail" placeholder="상세 정보"></textarea>
                    <div class="form-actions">
                        <button @click="cancelAddingProfile" class="btn-cancel">취소</button>
                        <button @click="saveNewProfile" class="btn-save">저장하기</button>
                    </div>
                </div>
                <div v-for="category in profileCategories" :key="category" class="profile-category">
                    <p>{{ category }}</p>
                    <ul>
                        <li v-for="profile in getProfilesByCategory(category)" :key="profile.trainerProfileId">
                            {{ profile.title }}
                            ({{ formatDate(profile.startDate) }} ~ {{ formatDate(profile.endDate) }})
                            <p>{{ profile.detail }}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-if="activeTab === 'timeTable'" class="time-table">
            <div class="time-table-header">
                <p>타임테이블</p>
                <button @click="toggleEditMode">{{ isEditMode ? '저장' : '수정' }}</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th v-for="day in days" :key="day">{{ day }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="hour in 25" :key="hour">
                        <th>{{ hour - 1 }}:00</th>
                        <td
                            v-for="day in days"
                            :key="day"
                            @click="toggleCell(hour - 1, day)"
                            :class="{ selected: isSelected(hour - 1, day) }"
                            :style="{ cursor: isEditMode ? 'pointer' : 'default' }"
                        ></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else>
        <h2>접근 권한이 없습니다.</h2>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import jwtAxios, { API_SERVER_HOST } from '../../util/jwtUtil';

const host = API_SERVER_HOST;
const authStore = useAuthStore();
const isTrainer = computed(() => authStore.role === 'TRAINER');
const memberId = computed(() => authStore.id);

const activeTab = ref('myInfo');
const days = ['월', '화', '수', '목', '금', '토', '일'];
const isEditMode = ref(false);
const selectedCells = ref({});
const isAuthenticated = computed(() => authStore.isAuthenticated);
const trainerProfiles = ref([]);
const profileCategories = ['교육사항', '수상이력', '자격증', '경력'];
const currentCategory = ref('');
const isAddingProfile = ref(false);
const newProfile = reactive({
    categoryName: '',
    title: '',
    startDate: '',
    endDate: '',
    detail: '',
});

onMounted(async () => {
    await authStore.checkAuthStatus();
    console.log(memberId.value);
    if (isAuthenticated.value && memberId.value && isTrainer.value) {
        await fetchTrainerProfiles();
        await fetchCurrentCategory();
        await fetchTimeTable();
    }
});

const categoryMap = {
    교육사항: 'EDU',
    수상이력: 'AWARD',
    자격증: 'CERT',
    경력: 'EXP',
};

const fetchTrainerProfiles = async () => {
    try {
        const response = await jwtAxios.get(`http://${host}/api/trainer/profile`, {
            params: { memberId: memberId.value },
        });
        trainerProfiles.value = response.data;
    } catch (error) {
        console.error('Failed to fetch trainer profiles:', error);
    }
};

const fetchCurrentCategory = async () => {
    try {
        const response = await jwtAxios.get(`http://${host}/api/trainer/${memberId.value}`);
        currentCategory.value = response.data.exerciseCategoryName;
        console.log(currentCategory.value);
    } catch (error) {
        console.error('Failed to fetch current category:', error);
    }
};

const getProfilesByCategory = (category) => {
    return trainerProfiles.value.filter((profile) => profile.categoryName === category);
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(
        2,
        '0',
    )}`;
};

const toggleEditMode = async () => {
    if (isEditMode.value) {
        // 저장 모드에서 수정 모드로 전환
        await saveTimeTable();
        isEditMode.value = false;
    } else {
        // 수정 모드로 전환
        isEditMode.value = true;
    }
};

const toggleCell = (hour, day) => {
    if (!isEditMode.value) return;

    const key = `${hour}-${day}`;
    selectedCells.value[key] = !selectedCells.value[key];
    if (!selectedCells.value[key]) {
        delete selectedCells.value[key];
    }
};

const isSelected = (hour, day) => {
    return selectedCells.value[`${hour}-${day}`];
};

const saveTimeTable = async () => {
    try {
        const timeTableUpdates = Object.entries(selectedCells.value).map(([key, isSelected]) => {
            const [hour, day] = key.split('-');
            return {
                trainerId: memberId.value,
                day: day,
                startHour: parseInt(hour),
                isSelected: isSelected,
            };
        });

        // 모든 시간대를 포함하도록 수정
        for (let hour = 0; hour < 24; hour++) {
            for (const day of days) {
                const key = `${hour}-${day}`;
                if (!selectedCells.value.hasOwnProperty(key)) {
                    timeTableUpdates.push({
                        trainerId: memberId.value,
                        day: day,
                        startHour: hour,
                        isSelected: false,
                    });
                }
            }
        }

        if (timeTableUpdates.length === 0) {
            alert('변경된 시간이 없습니다.');
            return;
        }

        await jwtAxios.put(`http://${host}/api/trainer/timetable/${memberId.value}`, timeTableUpdates);

        alert('타임테이블이 성공적으로 업데이트되었습니다.');
        await fetchTimeTable();
        isEditMode.value = false; // 저장 후 수정 모드 종료
    } catch (error) {
        console.error('Failed to update time table:', error);
        alert('타임테이블 업데이트에 실패했습니다.');
    }
};

const fetchTimeTable = async () => {
    try {
        const response = await jwtAxios.get(`http://${host}/api/trainer/timetable/${memberId.value}`);
        const timeTables = response.data;
        selectedCells.value = {};
        timeTables.forEach((timeTable) => {
            const hour = new Date(timeTable.startTime).getHours();
            const day = timeTable.day;
            selectedCells.value[`${hour}-${day}`] = true;
        });
    } catch (error) {
        console.error('Failed to fetch time table:', error);
    }
};

const startAddingProfile = () => {
    isAddingProfile.value = true;
};

const cancelAddingProfile = () => {
    isAddingProfile.value = false;
    resetNewProfile();
};

const resetNewProfile = () => {
    Object.assign(newProfile, {
        categoryName: '',
        title: '',
        startDate: '',
        endDate: '',
        detail: '',
    });
};

const saveNewProfile = async () => {
    try {
        const profileData = [
            {
                trainerId: memberId.value,
                categoryCode: categoryMap[newProfile.categoryName],
                title: newProfile.title,
                startDate: newProfile.startDate,
                endDate: newProfile.endDate,
                detail: newProfile.detail,
            },
        ];

        await jwtAxios.post(`http://${host}/api/trainer/save`, profileData);
        await fetchTrainerProfiles();
        isAddingProfile.value = false;
        resetNewProfile();
        alert('새로운 이력이 성공적으로 추가되었습니다.');
    } catch (error) {
        console.error('Failed to save new profile:', error);
        alert('이력 추가에 실패했습니다.');
    }
};
</script>

<style scoped>
.trainer-page-user-info {
    padding: 20px;
}

.trainer-page-user-info h2 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
    margin-bottom: 1.2rem;
    text-align: left;
}

.tabs {
    display: flex;
    margin-bottom: 50px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    justify-content: space-between;
}

.tabs button {
    flex: 1;
    padding: 0.8rem 0;
    font-size: 1rem;
    background-color: #f0f0f0;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
    color: #555;
}

.tabs button:hover {
    background-color: #e0e0e0;
}

.tabs button.active {
    background-color: #f13223;
    color: white;
}

.my-info p {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5rem;
    margin-bottom: 50px;
}

.full-line {
    width: 70vw;
    border: none;
    height: 1px;
    background-color: #000; /* 선의 색상 */
}

.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.profile-header p {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5rem;
    margin: 0; /* 기본 마진 제거 */
}

.profile-category {
    font-family: 'Do Hyeon', sans-serif;
    margin-bottom: 1rem;
}

.profile-category p {
    font-size: 1.3rem;
    margin-bottom: 1rem;
}

.profile-category ul {
    list-style-type: none;
    padding-left: 0;
}

.profile-category li {
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 10px;
}

.time-table {
    overflow-x: auto;
}

.time-table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.time-table p {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5rem;
    margin: 0 0 0 1rem;
}

.time-table table {
    width: 70vw;
    border-collapse: collapse;
    margin-bottom: 5rem;
}

.time-table th,
.time-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}

.time-table td.selected {
    background-color: #f13223;
}

.time-table button {
    margin: 1rem 1rem 1rem 0;
    padding: 0.7rem 1.4rem;
    background-color: #f13223;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 10px;
    font-size: 1.1em;
}

.time-table button:hover {
    background-color: #d32f2f;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
}

.form-group select {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
}

.form-actions {
    margin-top: 1rem;
}

.trainer-profiles {
    margin-top: 2rem;
}

.btn-add {
    margin: 1rem 5rem 1rem 0;
    padding: 0.7rem 1.4rem;
    background-color: #f13223;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 10px;
    font-size: 1.1em;
}

.btn-add:hover {
    background-color: #d32f2f;
}

.add-profile-form {
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 10px;
}

.add-profile-form select,
.add-profile-form input,
.add-profile-form textarea {
    width: 100%;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    box-sizing: border-box;
    font-size: 0.8rem;
}

.add-profile-form textarea {
    height: 100px;
    resize: vertical;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
}

.btn-cancel,
.btn-save {
    margin-left: 0.5rem;
    padding: 0.5rem 1rem;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 10px;
}

.btn-cancel {
    background-color: #ababa4;
}

.btn-cancel:hover {
    background-color: #8e8e8e;
}

.btn-save {
    background-color: #f13223;
}

.btn-save:hover {
    background-color: #d32f2f;
}
</style>
