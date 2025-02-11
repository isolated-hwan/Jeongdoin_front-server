<template>
    <div>
        <h2>Chat Room: {{ roomId }}</h2>
        <ChatMessageList :messages="messages" />
        <input v-model="newMessage" @keyup.enter="send" placeholder="메시지 입력" />
        <button @click="send">전송</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { database } from '../../config/firebaseConfig'
import { ref as dbRef, push, onValue } from 'firebase/database';
import ChatMessageList from './OnlineFeedbackMessage.vue'
import { useRoute } from 'vue-router';

const route = useRoute();
const roomId = route.params.roomId;
const newMessage = ref('');
const messages = ref([]);

const messagesRef = dbRef(database, `chatRooms/${roomId}/messages`);

const send = () => {
    if (newMessage.value.trim()) {
        push(messagesRef, {
            sender: 'User1', // 실제 사용자 정보 적용
            message: newMessage.value,
            timestamp: Date.now(),
        });
        newMessage.value = '';
    }
};

onMounted(() => {
    onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        messages.value = data ? Object.entries(data).map(([id, msg]) => ({ id, ...msg })) : [];
    });
});
</script>
