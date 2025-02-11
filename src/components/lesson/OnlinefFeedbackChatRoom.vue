<template>
    <div class="chat-rooms">
    <h2>Available Chat Rooms</h2>
    <ul>
        <li v-for="room in chatRooms" :key="room.chatRoomId">
        <!-- 채팅방을 클릭하면 해당 채팅방의 상세 페이지로 이동 -->
        <router-link :to="`/chat/${room.chatRoomId}`">
            {{ room.roomName }}
        </router-link>
        </li>
    </ul>
    <!-- 새 채팅방 생성 버튼 -->
    <button @click="createChatRoom">Create New Chat Room</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const chatRooms = ref([]);
const router = useRouter();

/**
 * API를 통해 채팅방 목록을 가져오는 함수
 */
const fetchChatRooms = async () => {
    try {
    // 예시 엔드포인트: 전체 채팅방 목록 조회
    const response = await axios.get('/api/chat/rooms');
    chatRooms.value = response.data;
    } catch (error) {
    console.error('Error fetching chat rooms:', error);
    }
};

/**
 * 새 채팅방을 생성하고 생성된 채팅방으로 이동하는 함수
 */
const createChatRoom = async () => {
    try {
    const roomName = prompt("Enter chat room name:");
    if (!roomName) return;
    // 예시 엔드포인트: 채팅방 생성
    const newRoomData = { roomName };
    const response = await axios.post('/api/chat/create', newRoomData);
    const createdRoom = response.data;
    // 목록에 새 채팅방을 추가하거나, 바로 해당 채팅방으로 이동
    chatRooms.value.push(createdRoom);
    router.push(`/chat/${createdRoom.chatRoomId}`);
    } catch (error) {
    console.error('Error creating chat room:', error);
    }
};

onMounted(() => {
    fetchChatRooms();
});
</script>

<style scoped>
.chat-rooms {
    margin: 20px;
}

.chat-rooms ul {
    list-style: none;
    padding: 0;
}

.chat-rooms li {
    margin: 8px 0;
}

.chat-rooms button {
    margin-top: 16px;
    padding: 8px 12px;
    font-size: 1rem;
}
</style>
