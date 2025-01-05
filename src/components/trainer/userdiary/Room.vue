<template>
    <div>
        <div
            class="video-container"
            :class="{ 'two-users': peerConnected && !expandedVideo, expanded: expandedVideo !== null }"
        >
            <video
                ref="myVideo"
                autoplay
                playsinline
                muted
                :class="{
                    'expanded-video': expandedVideo === 'myVideo',
                    'hidden-video': expandedVideo && expandedVideo !== 'myVideo',
                }"
                @click="expandVideo('myVideo')"
            ></video>
            <video
                ref="peerVideo"
                v-show="peerConnected"
                autoplay
                playsinline
                :class="{
                    'expanded-video': expandedVideo === 'peerVideo',
                    'hidden-video': expandedVideo && expandedVideo !== 'peerVideo',
                }"
                @click="expandVideo('peerVideo')"
            ></video>
        </div>

        <!-- 버튼 UI -->
        <div class="controls" id="controls">
            <button @click="toggleVideo">{{ videoEnabled ? '화면 끄기' : '화면 켜기' }}</button>
            <button @click="toggleAudio">{{ audioEnabled ? '음소거' : '마이크 켜기' }}</button>
            <button @click="leaveRoom">나가기</button>
        </div>

        <!-- 채팅 UI -->
        <div class="chat-section">
            <div class="chat-box">
                <p v-for="(msg, index) in messages" :key="index">
                    <strong>{{ msg.user }}:</strong> {{ msg.message }}
                </p>
            </div>

            <input type="text" v-model="chatMessage" placeholder="메시지를 입력해주세요" @keyup.enter="sendMessage" />
            <button @click="sendMessage" class="send-button">Send</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps(['roomId']);
const expandedVideo = ref(null);
const validRoom = ref(false); // 방의 유효성 상태

const myVideo = ref(null);
const peerVideo = ref(null);
const localStream = ref(null);
const peerConnection = ref(null);
const socket = ref(null);
const chatMessage = ref('');
const messages = ref([]);
const user = ref('상대방');
const videoEnabled = ref(true);
const audioEnabled = ref(true);
const peerConnected = ref(false); // 상대방 연결 여부

const config = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302',
        },
    ],
};

const toggleVideo = () => {
    videoEnabled.value = !videoEnabled.value;
    localStream.value.getVideoTracks().forEach((track) => {
        track.enabled = videoEnabled.value;
    });
};

const toggleAudio = () => {
    audioEnabled.value = !audioEnabled.value;
    localStream.value.getAudioTracks().forEach((track) => {
        track.enabled = audioEnabled.value;
    });
};

const leaveRoom = () => {
    if (peerConnection.value) peerConnection.value.close();
    if (socket.value) socket.value.close();
    if (localStream.value) localStream.value.getTracks().forEach((track) => track.stop());
    window.close();
};

const expandVideo = (video) => {
    // 이미 확장된 비디오를 다시 클릭하면 축소
    if (expandedVideo.value === video) {
        expandedVideo.value = null;
    } else {
        expandedVideo.value = video;
    }
};

const sendMessage = () => {
    if (chatMessage.value.trim() !== '') {
        // 먼저 내 메시지를 채팅 창에 추가
        messages.value.push({
            user: '나', // 본인이 작성한 메시지임을 표시
            message: chatMessage.value,
        });
        // WebSocket을 통해 다른 사용자에게 메시지 전송
        socket.value.send(
            JSON.stringify({
                type: 'chat',
                roomId: props.roomId,
                message: chatMessage.value,
                user: user.value,
            }),
        );
        chatMessage.value = '';
    }
};

const handleSignal = async (message) => {
    const data = JSON.parse(message);

    if (data.type === 'offer') {
        await peerConnection.value.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await peerConnection.value.createAnswer();
        await peerConnection.value.setLocalDescription(answer);
        socket.value.send(
            JSON.stringify({
                type: 'answer',
                roomId: props.roomId,
                sdp: answer,
            }),
        );
    } else if (data.type === 'answer') {
        await peerConnection.value.setRemoteDescription(new RTCSessionDescription(data.sdp));
    } else if (data.type === 'ice-candidate') {
        await peerConnection.value.addIceCandidate(new RTCIceCandidate(data.candidate));
    } else if (data.type === 'chat') {
        messages.value.push({ user: data.user, message: data.message });
    } else if (data.type === 'user-left') {
        alert(data.message); // 상대방이 나갔을 때 alert 띄우기
        peerConnected.value = false; // 상대방 연결 상태 변경
        peerVideo.value.srcObject = null; // 상대방 비디오 화면 제거
    }
};

onMounted(async () => {
    // 방 유효성 검사
    // const response = await axios.get(`http://192.168.210.182:8083/check-room/${props.roomId}`);
    const response = await axios.get(`http://localhost:8083/check-room/${props.roomId}`);
    if (!response.data.valid) {
        validRoom.value = false;
        alert('존재하지 않는 방입니다.');
        return;
    }

    validRoom.value = true;

    // WebSocket 및 WebRTC 설정
    socket.value = new WebSocket('ws://localhost:8083');
    // socket.value = new WebSocket('ws://192.168.210.182:8083');  // 외부 컴퓨터에서 연결하려면 서버의 IP로 변경

    socket.value.onopen = () => {
        socket.value.send(JSON.stringify({ type: 'join-room', roomId: props.roomId }));
    };

    socket.value.onmessage = async (event) => {
        if (event.data instanceof Blob) {
            const text = await event.data.text();
            handleSignal(text);
        } else {
            handleSignal(event.data);
        }
    };

    localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    myVideo.value.srcObject = localStream.value; // 로컬 비디오 스트림 설정

    peerConnection.value = new RTCPeerConnection(config);
    localStream.value.getTracks().forEach((track) => {
        peerConnection.value.addTrack(track, localStream.value);
    });

    peerConnection.value.onicecandidate = (event) => {
        if (event.candidate) {
            socket.value.send(
                JSON.stringify({
                    type: 'ice-candidate',
                    roomId: props.roomId,
                    candidate: event.candidate,
                }),
            );
        }
    };

    peerConnection.value.ontrack = (event) => {
        if (peerVideo.value) {
            peerVideo.value.srcObject = event.streams[0]; // 상대방 비디오 스트림 설정
            peerConnected.value = true; // 상대방 연결 상태 설정
        }
    };

    const offer = await peerConnection.value.createOffer();
    await peerConnection.value.setLocalDescription(offer);
    socket.value.send(
        JSON.stringify({
            type: 'offer',
            roomId: props.roomId,
            sdp: offer,
        }),
    );
});
</script>

<style scoped>
.controls {
    margin-top: 10px;
    display: flex;
    gap: 10px;
}

#controls button {
    padding: 10px 15px;
    margin-left: 50px;
    background-color: #f13223;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
}

button:hover {
    background-color: #f13223;
}

.chat-section {
    margin-top: 20px;
    margin-left: 50px;
}

.chat-box {
    border: 1px solid #ccc;
    width: 90vw;
    padding: 10px;
    height: 200px;
    overflow-y: scroll;
    background: #f9f9f9;
}

.chat-box p {
    margin: 5px 0;
}

input[type='text'] {
    width: 85vw;
    padding: 8px;
    margin-bottom: 10px;
}

.send-button {
    padding: 10px 15px;
    background-color: #f13223;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
}

/* 비디오 컨테이너 */
.video-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    transition: all 0.5s ease; /* 애니메이션 */
}

/* 두 명일 때 좌우 정렬 */
.video-container.two-users {
    justify-content: space-between;
}

/* 확장된 비디오만 중앙 정렬 */
.video-container.expanded {
    justify-content: center;
}

/* 비디오 스타일 */
video {
    width: 45%;
    height: auto;
    border-radius: 10px;
    transition: all 0.5s ease; /* 비디오 위치 변경 애니메이션 */
}

/* 비디오 숨김 스타일 */
.hidden-video {
    display: none;
}

/* 비디오 확장 스타일 */
.expanded-video {
    width: 90% !important;
    height: auto;
    z-index: 10;
}
</style>
