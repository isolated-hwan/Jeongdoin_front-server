<template>
    <div class="admin-container">
        <aside class="sidebar">
            <h3>트레이너 관리</h3>
            <button class="sidebar-item" :class="{ active: activeTab === 'pending' }" @click="activeTab = 'pending'">
                승인 대기 목록
            </button>
            <button class="sidebar-item" :class="{ active: activeTab === 'approved' }" @click="activeTab = 'approved'">
                트레이너 목록
            </button>
        </aside>

        <div class="main-content">
            <h2 v-if="activeTab === 'pending'">승인 대기 목록</h2>
            <h2 v-if="activeTab === 'approved'">트레이너 목록</h2>

            <div class="card-container">
                <div v-for="(trainer, index) in filteredTrainers" :key="index" class="trainer-card">
                    <h4 class="trainer-name">{{ trainer.name }}</h4>
                    <p class="trainer-phone">전화번호: {{ trainer.phone }}</p>
                    <p class="trainer-email">이메일: {{ trainer.email }}</p>
                    <p><strong>운동 카테고리:</strong> {{ trainer.category }}</p>
                    <p><strong>자격 이름:</strong> {{ trainer.certificationName }}</p>
                    <p><strong>자격 상세 날짜:</strong> {{ trainer.certificationDate }}</p>
                    <p><strong>자격 상세:</strong> {{ trainer.certificationDetail }}</p>
                    <button class="detail-button" @click="openTrainerDetail(trainer)">자세히 보기</button>
                </div>
            </div>
        </div>

        <div v-if="selectedTrainer" class="modal">
            <div class="modal-content">
                <button class="close-button" @click="closeModal">X</button>
                <h4>{{ selectedTrainer.name }}님의 정보</h4>
                <p class="trainer-phone">전화번호: {{ selectedTrainer.phone }}</p>
                <p class="trainer-email">이메일: {{ selectedTrainer.email }}</p>
                <p><strong>운동 카테고리:</strong> {{ selectedTrainer.category }}</p>
                <p><strong>자격 이름:</strong> {{ selectedTrainer.certificationName }}</p>
                <p><strong>자격 상세 날짜:</strong> {{ selectedTrainer.certificationDate }}</p>
                <p><strong>자격 상세:</strong> {{ selectedTrainer.certificationDetail }}</p>
                <p><strong>증빙 서류:</strong></p>
                <img :src="selectedTrainer.certificationFile" alt="증빙 서류" class="certification-file" />
                <div class="buttons">
                    <button class="revoke-button" @click="revokeTrainer" v-if="activeTab === 'approved'">
                        자격 박탈
                    </button>
                    <button class="approve-button" @click="approveTrainer" v-if="activeTab === 'pending'">승인</button>
                    <button class="reject-button" @click="rejectTrainer" v-if="activeTab === 'pending'">거절</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeTab = ref('pending');
const pendingTrainers = ref([
    {
        name: '홍길동',
        phone: '010-1234-5678',
        email: 'hong@example.com',
        category: '태권도',
        certificationName: '자격증',
        certificationDetail: '생활 스포츠 지도사 2급',
        certificationDate: '2021-12-03',
        certificationFile: 'https://kosa-final-project-team-3.github.io/cdn/생활스포츠지도사2급.jpg',
    },
    {
        name: '김영희',
        phone: '010-9876-5432',
        email: 'kim@example.com',
        category: '요가',
        certificationName: '자격증',
        certificationDetail: '요가 지도사 1급',
        certificationDate: '2022-07-15',
        certificationFile: '요가지도사1급.pdf',
    },
    {
        name: '이철수',
        phone: '010-1111-2222',
        email: 'lee@example.com',
        category: '필라테스',
        certificationName: '경력',
        certificationDetail: '필라테스 3년 경력',
        certificationDate: '2019-06-01~2022-06-01',
        certificationFile: '필라테스경력증명서.pdf',
    },
    {
        name: '박지민',
        phone: '010-3333-4444',
        email: 'park@example.com',
        category: '크로스핏',
        certificationName: '수상',
        certificationDetail: '2022년 크로스핏 대회 1위',
        certificationDate: '2022-09-01',
        certificationFile: '크로스핏대회1위.jpg',
    },
]);

const approvedTrainers = ref([]);
const selectedTrainer = ref(null);

const filteredTrainers = computed(() => {
    return activeTab.value === 'pending' ? pendingTrainers.value : approvedTrainers.value;
});

const openTrainerDetail = (trainer) => {
    selectedTrainer.value = trainer;
};

const approveTrainer = () => {
    approvedTrainers.value.push(selectedTrainer.value);
    pendingTrainers.value = pendingTrainers.value.filter((trainer) => trainer !== selectedTrainer.value);
    alert(`${selectedTrainer.value.name}님이 트레이너로 승인되었습니다.`);
    closeModal();
};

const rejectTrainer = () => {
    pendingTrainers.value = pendingTrainers.value.filter((trainer) => trainer !== selectedTrainer.value);
    alert(`${selectedTrainer.value.name}님의 신청이 거절되었습니다.`);
    closeModal();
};

const revokeTrainer = () => {
    approvedTrainers.value = approvedTrainers.value.filter((trainer) => trainer !== selectedTrainer.value);
    alert(`${selectedTrainer.value.name}님의 트레이너 자격이 박탈되었습니다.`);
    closeModal();
};

const closeModal = () => {
    selectedTrainer.value = null;
};
</script>

<style scoped>
.admin-container {
    display: flex;
    font-family: 'Do Hyeon', sans-serif;
}

.sidebar {
    width: 250px;
    padding: 1rem;
}

.sidebar h3 {
    font-size: 1.5em;
    padding: 0.5rem;
    margin: 1rem 1rem 2rem 1rem;
}

.sidebar-item {
    font-size: 1.3em;
    font-family: 'Do Hyeon', sans-serif;
    display: block;
    color: #333;
    padding: 0.5rem;
    text-decoration: none;
    border: none;
    background-color: transparent;
    cursor: pointer;
    margin: 1rem;
    transition: color 0.3s ease;
}

.sidebar-item:hover {
    color: #f13223;
}

.main-content {
    padding: 20px;
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.trainer-card {
    width: 300px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.trainer-name {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
}

.trainer-phone,
.trainer-email {
    font-size: 14px;
    color: #888;
}

.detail-button {
    padding: 10px 15px;
    border: none;
    background-color: #f13223;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    padding: 20px;
    width: 90%;
    max-width: 600px;
    max-height: 80%;
    overflow-y: auto;
}

.modal-content {
    padding: 20px;
}

.modal h4 {
    margin-top: 0;
}

.certification-file {
    max-width: 100%;
    height: auto;
}

.approve-button {
    padding: 10px 15px;
    border: none;
    background-color: #4caf50;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    margin: 10px;
}

.approve-button:hover {
    background-color: #45a049;
}

.reject-button {
    padding: 10px 15px;
    border: none;
    background-color: #dc3545;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}

.reject-button:hover {
    background-color: #c82333;
}

.revoke-button {
    padding: 10px 15px;
    border: none;
    background-color: #f13223;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}

.close-button {
    border: none;
    font-size: 20px;
    background-color: transparent;
    cursor: pointer;
    margin: 10px;
}
</style>
