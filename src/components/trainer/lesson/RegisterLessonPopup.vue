<template>
    <div v-if="isVisible" class="popup-overlay">
        <div class="popup">
            <h3 class="popup-title">{{ lessonTypeTitle }} 등록</h3>
            <div class="popup-content">
                <div class="form-group">
                    <label for="image">이미지:</label>
                    <div class="image-upload-container">
                        <div class="image-preview" v-if="imagePreview">
                            <img :src="imagePreview" alt="Preview" />
                        </div>
                        <div class="image-upload-button" @click="handleImageButton">
                            <span>{{ imagePreview ? '-' : '+' }}</span>
                        </div>
                        <input
                            type="file"
                            id="image"
                            ref="fileInput"
                            @change="handleFileUpload"
                            accept="image/*"
                            style="display: none"
                        />
                    </div>
                </div>
                <form @submit.prevent="registerLesson">
                    <div class="form-group">
                        <label for="title">레슨명:</label>
                        <input id="title" v-model="lessonData.title" type="text" required />
                    </div>
                    <div class="form-group">
                        <label for="instructor">강사:</label>
                        <label>{{ memberId }}</label>
                    </div>
                    <div class="form-group">
                        <label for="price">가격:</label>
                        <input
                            id="price"
                            v-model="lessonData.price"
                            type="number"
                            min="0"
                            step="100"
                            @input="validatePrice"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label for="details">레슨 내용:</label>
                        <textarea id="details" v-model="lessonData.details" required></textarea>
                    </div>
                    <div v-if="isOfflineLesson" class="form-group">
                        <label for="address">주소:</label>
                        <div class="address-input">
                            <input id="address" v-model="lessonData.address" type="text" readonly required />
                            <button type="button" @click="openAddressSearch">주소 검색</button>
                        </div>
                    </div>
                    <template v-if="isGroupLesson">
                        <div class="form-group">
                            <label for="recruitmentStart">모집 시작일:</label>
                            <input id="recruitmentStart" v-model="lessonData.recruitmentStart" type="date" required />
                        </div>
                        <div class="form-group">
                            <label for="recruitmentEnd">모집 종료일:</label>
                            <input id="recruitmentEnd" v-model="lessonData.recruitmentEnd" type="date" required />
                        </div>
                        <div class="form-group">
                            <label for="capacity">모집 인원:</label>
                            <input id="capacity" v-model="lessonData.capacity" type="number" min="1" required />
                        </div>
                    </template>
                </form>
            </div>
            <div class="form-actions">
                <button type="button" @click="close" class="btn-cancel">취소</button>
                <button type="submit" class="btn-register" @click="registerLesson">등록하기</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';

import { useAuthStore } from '../../../stores/authStore';

const authStore = useAuthStore();
const memberId = computed(() => authStore.username);

const props = defineProps({
    isVisible: Boolean,
    lessonType: {
        type: String,
        default: 'personal',
    },
});

const isGroupLesson = computed(() => props.lessonType === 'group');
const isOfflineLesson = computed(() => ['personal', 'group'].includes(props.lessonType));
const isOnlineLesson = computed(() => ['online', 'feedback'].includes(props.lessonType));
const lessonTypeTitle = computed(() => {
    switch (props.lessonType) {
        case 'personal':
            return '개인 레슨';
        case 'group':
            return '그룹 레슨';
        case 'online':
            return '온라인 PT';
        case 'feedback':
            return '온라인 피드백';
        default:
            return '레슨';
    }
});

const emit = defineEmits(['close', 'register']);

const lessonData = reactive({
    category: '',
    title: '',
    instructor: '',
    price: '',
    details: '',
    address: '',
    image: '',
    recruitmentStart: '',
    recruitmentEnd: '',
    capacity: 1,
});

const close = () => {
    emit('close');
};

const registerLesson = () => {
    const formData = new FormData();
    for (const key in lessonData) {
        if (isOnlineLesson.value) {
            if (!['address', 'recruitmentStart', 'recruitmentEnd', 'capacity'].includes(key)) {
                formData.append(key, lessonData[key]);
            }
        } else if (isGroupLesson.value) {
            formData.append(key, lessonData[key]);
        } else {
            // 개인 레슨
            if (!['recruitmentStart', 'recruitmentEnd', 'capacity'].includes(key)) {
                formData.append(key, lessonData[key]);
            }
        }
    }
    emit('register', formData);
    close(); // 등록 후 팝업 닫기
    Object.keys(lessonData).forEach((key) => {
        if (typeof lessonData[key] === 'string') {
            lessonData[key] = '';
        } else if (typeof lessonData[key] === 'number') {
            lessonData[key] = key === 'capacity' ? 1 : 0;
        }
    });
    imagePreview.value = null;
};

const openAddressSearch = () => {
    new window.daum.Postcode({
        oncomplete: function (data) {
            let addr = '';
            let extraAddr = '';

            if (data.userSelectedType === 'R') {
                addr = data.roadAddress;
            } else {
                addr = data.jibunAddress;
            }

            if (data.userSelectedType === 'R') {
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
                }
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
            }

            lessonData.address = addr + extraAddr;
        },
    }).open();
};

const fileInput = ref(null);
const imagePreview = ref(null);

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        lessonData.image = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const validatePrice = (event) => {
    const value = event.target.value;
    if (value < 0) {
        lessonData.price = 0;
    } else {
        lessonData.price = Math.floor(value);
    }
};

const handleImageButton = () => {
    if (imagePreview.value) {
        imagePreview.value = null;
        lessonData.image = null;
        if (fileInput.value) {
            fileInput.value.value = '';
        }
    } else {
        triggerFileInput();
    }
};

onMounted(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    document.head.appendChild(script);
});
</script>

<style scoped>
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    width: 80%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.popup-content {
    flex-grow: 1;
    overflow-y: auto;
    padding-right: 1rem;
}

.popup h2 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.5em;
    margin-bottom: 2rem;
    text-align: center;
}

.form-group {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

.form-group label {
    flex: 0 0 120px;
    margin-right: 1rem;
    display: block;
    font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group .address-input {
    flex: 1;
}

.form-group textarea {
    height: 200px;
    resize: none;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
}

.btn-cancel,
.btn-register {
    padding: 0.7rem 1.4rem;
    margin-left: 1rem;
    cursor: pointer;
    border-radius: 10px;
    font-size: 1.1em;
}

.btn-register {
    background-color: #f13223;
    border: none;
    color: white;
    margin-top: 5px;
    border-radius: 10px;
}

.btn-cancel {
    background-color: #ababa4;
    margin-top: 5px;
    border-radius: 10px;
    color: white;
    border: none;
}

.address-input {
    display: flex;
    gap: 10px;
}

.address-input input {
    flex-grow: 1;
}

.address-input button {
    background-color: #f13223;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    white-space: nowrap;
}

.popup-title {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.5em;
    font-family: 'Do Hyeon', sans-serif;
}

.image-upload-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.image-preview {
    width: 100px;
    height: 100px;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
}

.image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-upload-button {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #f13223;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 20px;
    position: relative;
    transition: background-color 0.3s;
}

.image-upload-button:hover {
    background-color: #d62d1f;
}

select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}
</style>
