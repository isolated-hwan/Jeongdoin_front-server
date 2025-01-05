<template>
    <div class="my-page-user-info" v-if="isAuthenticated">
        <h2>나의 정보</h2>
        <form @submit.prevent="saveUserInfo">
            <div class="form-group" v-for="(value, key) in displayUserInfo" :key="key">
                <label :for="key">{{ getLabel(key) }}:</label>
                <template v-if="key === 'gender' && !isEditing">
                    <input :id="key" :value="getGenderDisplay(value)" disabled />
                </template>
                <template v-else-if="key === 'gender' && isEditing">
                    <select :id="key" v-model="userInfo[key]" required>
                        <option value="m">남자</option>
                        <option value="f">여자</option>
                    </select>
                </template>
                <template v-else>
                    <input
                        :id="key"
                        v-model="userInfo[key]"
                        :type="getInputType(key)"
                        :disabled="!isEditing"
                        required
                    />
                </template>
            </div>

            <button v-if="role !== 'TRAINER'" type="button" @click="showExpertPopup" class="btn-become-expert">
                전문가로 전환하기
            </button>

            <div class="form-actions">
                <button v-if="isEditing" type="button" @click="cancelEdit" class="btn-cancel">취소</button>
                <button v-if="!isEditing" type="button" @click="startEditing" class="btn-edit">수정하기</button>
                <button v-else type="submit" class="btn-save">저장하기</button>
            </div>
        </form>
    </div>
    <ExpertPopup :is-visible="isExpertPopupVisible" @close="closeExpertPopup" @submit="submitExpertApplication" />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import ExpertPopup from './ExpertPopup.vue';
import { useAuthStore } from '../../stores/authStore';
import jwtAxios, { API_SERVER_HOST } from '../../util/jwtUtil';
import axios from 'axios';

const host = API_SERVER_HOST;
const apply = () => {
    jwtAxios
        .post(`http://${host}/api/trainer/save`, [
            {
                trainerId: 1,
                categoryCode: '001',
                title: 'Personal Trainer',
                startDate: '2023-01-01',
                endDate: '2023-12-31',
                detail: 'Experienced in weight training and nutrition.',
            },
            {
                trainerId: 1,
                categoryCode: '001',
                title: 'Yoga Instructor',
                startDate: '2023-02-01',
                endDate: '2023-11-30',
                detail: 'Certified yoga instructor with 5 years of experience.',
            },
        ])
        .then((res) => {
            const data = res.data;
            jwtAxios.post(`http://${host}/api/member/trainer-application`, {
                applicationId: 1,
                memberId: 1,
                profileIdList: data,
            });
        });
};

const approve = () => {
    const applicationId = 1;
    jwtAxios
        .patch(`http://${host}/api/admin/trainer-applications/${applicationId}/approve`, null, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.error(err);
        });
};

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const memberId = computed(() => authStore.id);
const role = computed(() => authStore.role);

const userInfo = reactive({
    username: '',
    birth: '',
    gender: '',
    phone: '',
    address: '',
    tall: '',
    bodyWeight: '',
});

const originalUserInfo = ref(null);
const isExpertPopupVisible = ref(false);
const isEditing = ref(false);

onMounted(async () => {
    await authStore.checkAuthStatus();
    if (isAuthenticated.value) {
        await fetchUserInfo();
    }
});

const fetchUserInfo = async () => {
    try {
        const username = authStore.username;
        const res = await jwtAxios.get(`http://${host}/api/member/info`, {
            params: { username },
        });
        Object.assign(userInfo, res.data);
        originalUserInfo.value = { ...userInfo };
    } catch (error) {
        console.error('Failed to fetch user info:', error);
    }
};

const saveUserInfo = async () => {
    try {
        const updatedUserInfo = {
            ...userInfo,
            memberId: memberId.value,
        };

        const response = await jwtAxios.put(`http://${host}/api/member/update`, updatedUserInfo);
        Object.assign(userInfo, response.data);
        originalUserInfo.value = { ...userInfo };
        alert('사용자 정보가 성공적으로 저장되었습니다.');
        isEditing.value = false;
    } catch (error) {
        console.error('Failed to save user info:', error);
        alert('사용자 정보 저장에 실패했습니다.');
    }
};

const startEditing = () => {
    isEditing.value = true;
};

const cancelEdit = () => {
    if (originalUserInfo.value) {
        Object.assign(userInfo, originalUserInfo.value);
    }
    isEditing.value = false;
};

const showExpertPopup = () => {
    isExpertPopupVisible.value = true;
};

const closeExpertPopup = () => {
    isExpertPopupVisible.value = false;
};

const submitExpertApplication = ({ certificationCategories, attachedFiles }) => {
    console.log('Submitting expert application:', certificationCategories);
    console.log('Attached files:', attachedFiles);
    isExpertPopupVisible.value = false;
};

const getGenderDisplay = (gender) => {
    return gender === 'm' ? '남자' : gender === 'f' ? '여자' : '';
};

const getLabel = (key) => {
    const labels = {
        username: '이름',
        birth: '생년월일',
        gender: '성별',
        phone: '핸드폰 번호',
        address: '주소',
        tall: '신장 (cm)',
        bodyWeight: '체중 (kg)',
    };
    return labels[key] || key;
};

const getInputType = (key) => {
    const types = {
        birth: 'date',
        phone: 'tel',
        tall: 'number',
        bodyWeight: 'number',
    };
    return types[key] || 'text';
};

const displayUserInfo = computed(() => {
    const { username, birth, gender, phone, address, tall, bodyWeight } = userInfo;
    return { username, birth, gender, phone, address, tall, bodyWeight };
});
</script>

<style scoped>
.my-page-user-info {
    max-width: 650px;
    margin: 40px;
    font-size: 1em;
}

.my-page-user-info h2 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
    margin-bottom: 1.2rem;
}

.my-page-user-info form {
    padding: 20px;
}

.form-group {
    display: flex;
    align-items: center;
    margin-bottom: 1.2rem;
}

label {
    flex: 0 0 140px;
    margin-right: 1rem;
    font-size: 1.1em;
    font-weight: bold;
}

input,
select {
    flex: 1;
    padding: 0.6rem;
    font-size: 1.1em;
}

.btn-become-expert {
    background-color: #f13223;
    color: white;
    border: none;
    padding: 0.7rem 1.4rem;
    cursor: pointer;
    border-radius: 10px;
    font-size: 1.1em;
    transition: background-color 0.3s ease;
    margin-top: 20px;
}

.btn-become-expert:hover {
    background-color: #d32f2f;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
}

.btn-cancel,
.btn-save,
.btn-edit {
    padding: 0.7rem 1.4rem;
    margin-left: 0.7rem;
    cursor: pointer;
    font-size: 1.1em;
    border-radius: 10px;
}

.btn-save,
.btn-edit {
    background-color: #f13223;
    color: white;
    border: none;
    transition: background-color 0.3s ease;
}

.btn-edit {
    margin-bottom: 50px;
}

.btn-cancel {
    background-color: #ababa4;
    color: white;
    border: none;
}

.btn-cancel:hover {
    background-color: #9a9a94;
}

.btn-save:hover,
.btn-edit:hover {
    background-color: #d32f2f;
}

.expert-info {
    margin-top: 2.5rem;
    border-top: 1px solid #e0e0e0;
    padding-top: 1.5rem;
}

.expert-category {
    margin-bottom: 1.2rem;
}

.expert-category h4 {
    margin-bottom: 0.7rem;
    font-size: 1.2em;
}

.expert-category ul {
    list-style-type: none;
    padding-left: 1.2rem;
}

.expert-category li {
    margin-bottom: 0.4rem;
    font-size: 1.1em;
}
</style>
