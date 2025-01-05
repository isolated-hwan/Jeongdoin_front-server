<template>
    <div class="admin-container">
        <aside class="sidebar">
            <h3>문의 내역 관리</h3>
            <button class="sidebar-item" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
                전체 문의
            </button>
            <button class="sidebar-item" :class="{ active: activeTab === 'resolved' }" @click="activeTab = 'resolved'">
                해결된 문의
            </button>
            <button class="sidebar-item" :class="{ active: activeTab === 'pending' }" @click="activeTab = 'pending'">
                미해결 문의
            </button>
        </aside>

        <div class="main-content">
            <h2 v-if="activeTab === 'all'">전체 문의 내역</h2>
            <h2 v-if="activeTab === 'resolved'">해결된 문의</h2>
            <h2 v-if="activeTab === 'pending'">미해결 문의</h2>

            <div class="card-container">
                <div v-for="(contact, index) in filteredContacts" :key="index" class="contact-card">
                    <h4 class="contact-name">{{ contact.name }}</h4>
                    <p class="contact">연락처: {{ contact.contact }}</p>
                    <p class="contact">날짜: {{ contact.date }}</p>
                    <p class="contact">{{ contact.description }}</p>
                    <p class="contact">상태: {{ contact.status }}</p>
                    <button class="resolve-button" v-if="contact.status === 'pending'" @click="resolveContact(index)">
                        해결
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeTab = ref('all');
const contacts = ref([
    {
        name: '홍길동',
        contact: '010-1234-5678',
        description: '서비스가 제대로 작동하지 않습니다.',
        date: '2024-10-01',
        status: 'pending',
    },
    {
        name: '김영희',
        contact: '010-9876-5432',
        description: '최근 구매한 상품의 환불을 요청합니다.',
        date: '2024-10-02',
        status: 'resolved',
    },
    {
        name: '이철수',
        contact: '010-1111-2222',
        description: '기술적인 문제에 대한 지원을 요청합니다.',
        date: '2024-10-03',
        status: 'pending',
    },
]);

const filteredContacts = computed(() => {
    if (activeTab.value === 'all') {
        return contacts.value;
    }
    return contacts.value.filter((contact) => contact.status === activeTab.value);
});

const resolveContact = (index) => {
    contacts.value[index].status = 'resolved';
    alert(`${contacts.value[index].name}님의 문의가 해결되었습니다.`);
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
    display: block;
    color: #333;
    padding: 0.5rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
    margin: 1rem;
    transition: color 0.3s ease;
}

.sidebar-item:hover {
    color: #f13223;
}

.main-content {
    padding: 20px;
    flex-grow: 1;
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.contact-card {
    width: 300px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
}

.contact-name {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
}

.contact {
    font-size: 14px;
    color: #888;
}

.resolve-button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 5px 0;
    background-color: #f13223;
    color: white;
}
</style>
