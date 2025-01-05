<template>
    <div class="container" @keydown="handleKeydown" tabindex="0" ref="container">
        <aside class="sidebar">
            <h3>AI 피드백</h3>
            <!-- 새로운 요소 추가 -->
            <div class="sidebar-content">
                <p>자세를 분석하고 개선하는 데 도움을 드립니다.</p>
                <ul class="feature-list">
                    <li>실시간 포즈 감지</li>
                    <li>맞춤형 피드백</li>
                    <li>음성 안내</li>
                </ul>
            </div>
        </aside>
        <main class="main-content">
            <div class="video-container" ref="videoContainer">
                <div class="video-wrapper">
                    <video ref="video" width="960" height="540" autoplay playsinline></video>
                    <canvas ref="canvas" width="960" height="540" style="position: absolute; top: 0; left: 0"></canvas>

                    <div v-if="isRunning" class="countdown-overlay">
                        <svg class="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="20" fill="none" stroke="#e6e6e6" stroke-width="5" />
                            <circle
                                cx="50"
                                cy="50"
                                r="20"
                                fill="none"
                                stroke="#4a5568"
                                stroke-width="5"
                                :stroke-dasharray="circumference"
                                :stroke-dashoffset="dashOffset"
                                transform="rotate(-90 50 50)"
                            />
                            <text
                                x="50"
                                y="52"
                                text-anchor="middle"
                                dominant-baseline="central"
                                font-size="24"
                                font-weight="bold"
                                fill="#e6e6e6"
                            >
                                {{ count }}
                            </text>
                        </svg>
                    </div>
                </div>

                <div class="controls">
                    <div class="timer-control">
                        <span class="timer-label">타이머: {{ duration }}초</span>
                        <input
                            type="range"
                            v-model="duration"
                            min="5"
                            max="30"
                            :disabled="isRunning || !isWebcamEnabled"
                            class="timer-slider"
                        />
                    </div>
                    <button @click="startCountdown" :disabled="isRunning || !isWebcamEnabled" class="start-button">
                        Start (S)
                    </button>
                    <button @click="toggleFullscreen" class="fullscreen-button">
                        {{ isFullscreen ? '전체화면 종료 (F)' : '전체화면 (F)' }}
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted, computed } from 'vue';
import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import axios from 'axios';
import { onBeforeRouteLeave } from 'vue-router';

const video = ref(null);
const canvas = ref(null);
let poseLandmarker = null;
let canvasCtx = null;
let lastVideoTime = -1;
let stream = null;

const count = ref(7);
const isRunning = ref(false);
const duration = ref(5);
const circumference = 2 * Math.PI * 20;
const shouldProcessResults = ref(false);
const isWebcamEnabled = ref(false);

const videoContainer = ref(null);
const isFullscreen = ref(false);

const container = ref(null);

const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        if (videoContainer.value.requestFullscreen) {
            videoContainer.value.requestFullscreen();
        } else if (videoContainer.value.mozRequestFullScreen) {
            // Firefox
            videoContainer.value.mozRequestFullScreen();
        } else if (videoContainer.value.webkitRequestFullscreen) {
            // Chrome, Safari and Opera
            videoContainer.value.webkitRequestFullscreen();
        } else if (videoContainer.value.msRequestFullscreen) {
            // IE/Edge
            videoContainer.value.msRequestFullscreen();
        }
        isFullscreen.value = true;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            // IE/Edge
            document.msExitFullscreen();
        }
        isFullscreen.value = false;
    }
};

// 전체 화면 변경 이벤트 리스너
const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement;
};

// 카운트다운 애니메이션
const dashOffset = computed(() => {
    const progress = (duration.value - count.value) / duration.value;
    return circumference * (1 - progress);
});

const startCountdown = () => {
    count.value = duration.value;
    isRunning.value = true;
    shouldProcessResults.value = false;
    textToSpeech(count.value + '초 안에 자세를 맞춰주세요');
    setTimeout(() => {
        countdown();
        textToSpeech(count.value);
    }, 3000);
};

const countdown = () => {
    if (count.value > 0) {
        setTimeout(() => {
            count.value--;
            countdown();
            textToSpeech(count.value);
        }, 1000);
    } else {
        isRunning.value = false;

        setTimeout(() => {
            shouldProcessResults.value = true;
        }, 1000);
    }
};

// 컴포넌트가 마운트되면 poseLandmarker 모델을 불러옴
onMounted(async () => {
    const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm',
    );

    // 포즈 감지를 위한 poseLandmarker 인스턴스 생성
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
            delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 2,
    });

    canvasCtx = canvas.value.getContext('2d');

    await enableWebcam();

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    container.value.focus(); // 컨테이너에 포커스를 줍니다.
});

// 웹캠을 활성화하는 함수
const enableWebcam = async () => {
    if (!poseLandmarker) {
        console.log('poseLandmarker가 아직 로드되지 않았습니다.');
        return;
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === 'videoinput');

    // 노트북 카메라
    const selectedDeviceId = videoDevices[0]?.deviceId;

    // USB 웹캠
    // const selectedDeviceId = videoDevices[1]?.deviceId;

    if (!selectedDeviceId) {
        alert('사용 가능한 비디오 장치가 없습니다.');
        isWebcamEnabled.value = false;
        return;
    }

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: selectedDeviceId, width: 960, height: 540 },
        });

        video.value.srcObject = stream;
        video.value.addEventListener('loadeddata', renderLoop);
        isWebcamEnabled.value = true;
    } catch (error) {
        console.error('웹캠 활성화 중 오류 발생:', error);
        alert('웹캠을 활성화할 수 없습니다. 권한을 확인해 주세요.');
        isWebcamEnabled.value = false;
    }
};

// 웹캠을 비활성화하는 함수
const disableWebcam = () => {
    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
    }
    if (video.value) {
        video.value.srcObject = null;
    }
    isWebcamEnabled.value = false;
};

// 실시간 포즈 감지 및 결과 처리 루프
const renderLoop = async () => {
    const videoElement = video.value;

    // 현재 프레임의 비디오 시간이 마지막 처리된 시간과 다른지 확인
    if (videoElement.currentTime !== lastVideoTime) {
        const poseLandmarkerResult = await poseLandmarker.detectForVideo(videoElement, performance.now());

        canvasCtx.clearRect(0, 0, canvas.value.width, canvas.value.height);

        // 랜드마크 그리기
        if (poseLandmarkerResult.landmarks) {
            const drawingUtils = new DrawingUtils(canvasCtx);
            poseLandmarkerResult.landmarks.forEach((landmark) => {
                drawingUtils.drawLandmarks(landmark, {
                    radius: (data) => (data.from ? DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1) : 1),
                });
                drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
            });
        }

        // 포즈 감지 결과 처리
        if (shouldProcessResults.value) {
            processResults(poseLandmarkerResult);
            shouldProcessResults.value = false; // 한 번만 처리하도록 설정
        }

        lastVideoTime = videoElement.currentTime;
    }

    requestAnimationFrame(renderLoop);
};

// 포즈 감지 결과를 처리하는 함수
const processResults = (results) => {
    let feedback = '';
    if (results.worldLandmarks && results.worldLandmarks.length > 0) {
        const worldLandmarkList = results.worldLandmarks[0];
        const rightShoulder = worldLandmarkList[12];
        const rightHip = worldLandmarkList[24];
        const leftKnee = worldLandmarkList[25];
        const rightKnee = worldLandmarkList[26];
        const rightAnkle = worldLandmarkList[28];
        const leftFoot = worldLandmarkList[31];
        const rightFoot = worldLandmarkList[32];
        const middleFoot = {
            x: (leftFoot.x + rightFoot.x) / 2,
            y: (leftFoot.y + rightFoot.y) / 2,
            z: (leftFoot.z + rightFoot.z) / 2,
        };

        const isReliable = [rightShoulder, rightHip, leftKnee, rightKnee, rightAnkle, leftFoot, rightFoot].every(
            (landmark) => landmark.visibility >= 0.5,
        );

        if (isReliable) {
            const angleWaist = calculateAngle(rightShoulder, rightHip, rightKnee);
            const angleHip = calculateAngle(rightHip, rightKnee, rightAnkle);
            const angleKnee = calculateAngle(leftKnee, middleFoot, rightKnee);

            if (angleWaist < 60) {
                feedback += '엉덩이가 너무 뒤에 있습니다. 상체를 더 세워주세요. \n';
            }
            if (angleHip > 90) {
                feedback += '가동범위가 짧습니다. 더 깊이 앉아주세요. \n';
            }
            if (angleKnee < 50) {
                feedback += '무릎의 간격이 너무 가까이 있습니다. 무릎 사이의 간격을 멀리 떨어트려주세요. \n';
            }

            if (feedback === '') {
                feedback = '올바른 자세입니다.';
            }
        } else {
            feedback = '자세를 정확히 감지할 수 없습니다. 다시 시도해주세요.';
        }
    } else {
        feedback = '포즈를 감지할 수 없습니다. 다시 시도해주세요.';
    }

    // 안내 -> tts 이식
    textToSpeech(feedback);
    setTimeout(() => {
        alert(feedback);
    }, 5000);
};

// 두 점 사이의 각도를 계산하는 함수
const calculateAngle = (pointA, pointB, pointC) => {
    const vectorAB = { x: pointB.x - pointA.x, y: pointB.y - pointA.y };
    const vectorBC = { x: pointC.x - pointB.x, y: pointC.y - pointB.y };

    const dotProduct = vectorAB.x * vectorBC.x + vectorAB.y * vectorBC.y;
    const magnitudeAB = Math.sqrt(vectorAB.x ** 2 + vectorAB.y ** 2);
    const magnitudeBC = Math.sqrt(vectorBC.x ** 2 + vectorBC.y ** 2);

    const angle = Math.acos(dotProduct / (magnitudeAB * magnitudeBC));
    return (angle * 180) / Math.PI; // 라디안을 각도로 변환
};

// 라우트를 떠나기 전에 웹캠 비활성화
onBeforeRouteLeave((to, from, next) => {
    disableWebcam();
    next();
});

// 컴포넌트가 언마운트될 때 웹캠 종료
onUnmounted(() => {
    disableWebcam();
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
});

const audio = new Audio();

// TTS 함수 추가
const textToSpeech = async (text) => {
    try {
        const response = await axios.post(
            'http://localhost:8083/api/tts',
            {
                text: text,
            },
            {
                responseType: 'arraybuffer',
            },
        );

        const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);

        audio.src = audioUrl;
        await audio.play();
    } catch (error) {
        console.error('Error with TTS API:', error);
    }
};

const handleKeydown = (event) => {
    if (event.key === 's' || event.key === 'S') {
        if (!isRunning.value && isWebcamEnabled.value) {
            startCountdown();
        }
    } else if (event.key === 'f' || event.key === 'F') {
        toggleFullscreen();
    }
};
</script>

<style scoped>
.container {
    display: flex;
    font-family: 'Do Hyeon', sans-serif;
    height: 100vh;
    background-color: #f0f4f8; /* 배경색 추가 */
    outline: none; /* 포커스 시 외곽선을 제거합니다 */
}

.sidebar {
    width: 410px;
    padding: 3rem 2rem;
    background-color: #ffffff; /* 사이드바 배경색 */
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}

.sidebar h3 {
    font-size: 1.8em;
    padding: 0.5rem;
    margin: 0 0 1.5rem 0;
    color: #f13223; /* 제목 색상 변경 */
    border-bottom: 2px solid #f13223; /* 밑줄 추가 */
}

.sidebar-content {
    margin-top: 2rem;
    font-size: 25px;
}

.feature-list {
    list-style-type: none;
    padding: 0;
}

.feature-list li {
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;
}

.feature-list li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #f13223;
}

.main-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.video-container {
    width: 960px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 2rem;
}

.video-wrapper {
    position: relative;
    width: 960px;
    height: 540px;
}
.video-wrapper video,
.video-wrapper canvas {
    position: absolute;
    top: 0;
    left: 0;
}

.countdown-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
}

.controls {
    display: flex;
    align-items: center;
    justify-content: center; /* 추가 */
    margin-top: 30px;
    /* font-family: 'Do Hyeon', sans-serif; */
    font-size: 1.5em;
}

.start-button {
    margin-left: 30px;
    padding: 10px 30px;
    background-color: #f13223;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Do Hyeon', sans-serif;
    font-size: 0.8em;
    transition: background-color 0.3s ease;
}

.start-button:hover {
    background-color: #d62c1f;
}

.timer-label {
    margin-right: 10px;
}

.timer-slider {
    appearance: none;
    -webkit-appearance: none;
    width: 200px;
    height: 10px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    transition: opacity 0.2s;
    min-width: 200px; /* 슬라이더의 최소 너비 설정 */
}
.timer-slider:hover {
    opacity: 1;
}

.timer-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #f13223;
    cursor: pointer;
}

.timer-slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #f13223;
    cursor: pointer;
}

.fullscreen-button {
    margin-left: 10px;
    padding: 10px 20px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Do Hyeon', sans-serif;
    font-size: 0.8em;
    transition: background-color 0.3s ease;
}

.fullscreen-button:hover {
    background-color: #357abd;
}

/* 전체 화면 모드일 때 비디오 컨테이너 스타일 */
:fullscreen .video-container {
    width: 100%;
    height: 100%;
    padding: 0;
}

:fullscreen .video-wrapper {
    width: 100%;
    height: 100%;
}

:fullscreen video,
:fullscreen canvas {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* 다른 브라우저를 위한 전체 화면 스타일 */
:-webkit-full-screen .video-container {
    width: 100%;
    height: 100%;
    padding: 0;
}
:-moz-full-screen .video-container {
    width: 100%;
    height: 100%;
    padding: 0;
}
:-ms-fullscreen .video-container {
    width: 100%;
    height: 100%;
    padding: 0;
}

:-webkit-full-screen .video-wrapper {
    width: 100%;
    height: 100%;
}
:-moz-full-screen .video-wrapper {
    width: 100%;
    height: 100%;
}
:-ms-fullscreen .video-wrapper {
    width: 100%;
    height: 100%;
}

:-webkit-full-screen video,
:-webkit-full-screen canvas {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
:-moz-full-screen video,
:-moz-full-screen canvas {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
:-ms-fullscreen video,
:-ms-fullscreen canvas {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* 전체 화면 모드일 때 컨트롤 스타일 */
:fullscreen .controls {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 8px;
}

:fullscreen .start-button,
:fullscreen .fullscreen-button {
    font-size: 1em;
    padding: 12px 24px;
}

/* 다른 브라우저를 위한 전체 화면 컨트롤 스타일 */
:-webkit-full-screen .controls {
    /* ... */
}
:-moz-full-screen .controls {
    /* ... */
}
:-ms-fullscreen .controls {
    /* ... */
}

:-webkit-full-screen .start-button,
:-webkit-full-screen .fullscreen-button {
    /* ... */
}
:-moz-full-screen .start-button,
:-moz-full-screen .fullscreen-button {
    /* ... */
}
:-ms-fullscreen .start-button,
:-ms-fullscreen .fullscreen-button {
    /* ... */
}
</style>
