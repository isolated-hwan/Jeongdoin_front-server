<template>
    <div v-if="isVisible" class="expert-popup-overlay">
        <div class="expert-popup">
            <h3>전문가 전환 신청</h3>
            <div class="expert-popup-info">
                <p>✔️ 하나 이상의 인증을 등록해야 전문가로 전환됩니다.</p>
                <p>✔️ 인증 소요기간은 2일~3일 입니다.</p>
            </div>

            <div class="form-group">
                <div class="category-select-wrapper">
                    <label for="exerciseCategory">운동 카테고리 : </label>
                    <select id="exerciseCategory" v-model="selectedCategory" required>
                        <option value="">카테고리 선택</option>
                        <option
                            v-for="category in exerciseCategories"
                            :key="category.exerciseCategoryCode"
                            :value="category.exerciseCategoryCode"
                        >
                            {{ category.exerciseCategoryName }}
                        </option>
                    </select>
                </div>
            </div>

            <div v-for="(category, index) in certificationCategories" :key="index" class="certification-category">
                <h4>{{ category.name }}</h4>
                <div v-for="(cert, certIndex) in category.certifications" :key="certIndex" class="certification-item">
                    <input v-model="cert.name" :placeholder="category.namePlaceholder" />
                    <template v-if="category.type === 'period'">
                        <input v-model="cert.startDate" type="date" placeholder="시작일" />
                        <input v-model="cert.endDate" type="date" placeholder="종료일" />
                    </template>
                    <template v-else>
                        <input v-model="cert.date" type="date" />
                    </template>
                    <textarea v-model="cert.detail" placeholder="상세 정보"></textarea>
                    <button @click="removeCertification(category, certIndex)" class="remove-btn">-</button>
                </div>
                <button @click="addCertification(category)" class="add-btn">+</button>
            </div>

            <div class="certification-category document-submission">
                <h4>증빙서류 제출</h4>
                ✔️ 파일명을 인증 이름으로 제출해주세요 (ex. 생활스포츠지도사 2급.jpg)
                <div v-for="(file, index) in attachedFiles" :key="index" class="file-item">
                    <span>{{ file.name }}</span>
                    <button @click="removeFile(index)" class="remove-btn">-</button>
                </div>
                <div class="file-upload">
                    <input
                        type="file"
                        @change="handleFileUpload"
                        ref="fileInput"
                        accept="image/*"
                        style="display: none"
                    />
                    <button @click="triggerFileUpload" class="btn-file-upload">파일 찾아보기</button>
                </div>
            </div>

            <div class="popup-actions">
                <button
                    @click="submitApplication"
                    class="btn-submit"
                    :disabled="!hasAnyCertification || !selectedCategory"
                >
                    신청하기
                </button>
                <button @click="close" class="btn-cancel">취소</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import jwtAxios, { API_SERVER_HOST } from '../../util/jwtUtil';

const props = defineProps({
    isVisible: Boolean,
});

const emit = defineEmits(['close', 'submit']);

const host = API_SERVER_HOST;
const authStore = useAuthStore();

const exerciseCategories = ref([]);
const selectedCategory = ref('');

const certificationCategories = reactive([
    { name: '교육사항', namePlaceholder: '교육 기관명', type: 'period', certifications: [] },
    { name: '수상이력', namePlaceholder: '수상명', type: 'date', certifications: [] },
    { name: '자격증', namePlaceholder: '자격증명', certifications: [] },
    { name: '경력', namePlaceholder: '회사명', type: 'period', certifications: [] },
]);

const addCertification = (category) => {
    if (category.type === 'period') {
        category.certifications.push({ name: '', startDate: '', endDate: '', detail: '' });
    } else {
        category.certifications.push({ name: '', date: '', detail: '' });
    }
};

const removeCertification = (category, index) => {
    category.certifications.splice(index, 1);
};

const attachedFiles = ref([]);
const fileInput = ref(null);

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        attachedFiles.value.push(file);
    }
};

const triggerFileUpload = () => {
    fileInput.value.click();
};

const removeFile = (index) => {
    attachedFiles.value.splice(index, 1);
};

const hasAnyCertification = computed(() => {
    return certificationCategories.some((category) => category.certifications.length > 0);
});

onMounted(async () => {
    await fetchExerciseCategories();
});

const fetchExerciseCategories = async () => {
    try {
        const response = await jwtAxios.get(`http://${host}/api/trainer/exercise-categories`);
        exerciseCategories.value = response.data;
    } catch (error) {
        console.error('Failed to fetch exercise categories:', error);
    }
};

const uploadFiles = async () => {
    const uploadedFiles = [];
    for (const file of attachedFiles.value) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mediaTypeCode', '1');
        formData.append('resourceId', authStore.id);

        try {
            const response = await jwtAxios.post(`http://${API_SERVER_HOST}/api/file`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            uploadedFiles.push(response.data);
        } catch (error) {
            console.error('Failed to upload file:', error);
            alert(`파일 업로드 중 오류가 발생했습니다: ${file.name}`);
        }
    }
    return uploadedFiles;
};

const submitApplication = async () => {
    if (hasAnyCertification.value && selectedCategory.value) {
        try {
            // 파일 업로드
            const uploadedFiles = await uploadFiles();

            const profiles = certificationCategories.flatMap((category) =>
                category.certifications.map((cert) => ({
                    memberId: authStore.id,
                    categoryCode: getCategoryCode(category.name),
                    categoryName: category.name,
                    title: cert.name,
                    startDate: cert.startDate || cert.date,
                    endDate: cert.endDate || cert.date,
                    detail: cert.detail,
                })),
            );

            // 프로필 정보 저장
            const response = await jwtAxios.post(`http://${API_SERVER_HOST}/api/trainer/save`, profiles);

            const { profileIdList, memberId } = response.data;

            const applyData = {
                applicationId: null,
                memberId: memberId,
                exerciseCategoryCode: selectedCategory.value,
                profileIdList: profileIdList,
            };

            // 운동 카테고리 업데이트
            jwtAxios
                .post(`http://${API_SERVER_HOST}/api/member/trainer-application`, applyData)
                .then((res) => {
                    const data = res.data;
                    // 바로 승인 절차 진행. admin 페이지 생성 후 리팩토링
                    jwtAxios.patch(`http://${API_SERVER_HOST}/api/admin/trainer-applications/${data.id}/approve`);
                })
                .catch((e) => {
                    throw e;
                });

            alert('전문가 전환 신청이 완료되었습니다.');
            emit('close');
        } catch (error) {
            console.error('Failed to submit application:', error);
            alert('전문가 전환 신청 중 오류가 발생했습니다.');
        }
    }
};

const getCategoryCode = (categoryName) => {
    // 카테고리 이름에 따른 코드 매핑
    const codeMap = {
        교육사항: 'EDU',
        수상이력: 'AWARD',
        자격증: 'CERT',
        경력: 'EXP',
    };
    return codeMap[categoryName] || '';
};

const close = () => {
    emit('close');
};
</script>

<style scoped>
.expert-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.expert-popup {
    background-color: white;
    padding: 2rem;
    border-radius: 10px;
    max-width: 600px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.expert-popup-info {
    margin-bottom: 1.5rem;
    font-size: 1em;
    color: #555;
}

.expert-popup h3 {
    font-family: 'Do Hyeon', sans-serif;
    font-size: 1.8em;
    margin-bottom: 1rem;
    text-align: center;
    color: #333;
}

.certification-category {
    margin-bottom: 1.5rem;
}

.certification-category h4 {
    font-size: 1.2em;
    margin-bottom: 0.8rem;
    color: #333;
}

.certification-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    background-color: #f9f9f9;
    padding: 0.8rem;
    border-radius: 8px;
}

.certification-item input,
.certification-item textarea {
    margin-bottom: 0.6rem;
    padding: 0.6rem;
    font-size: 1em;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.certification-item textarea {
    height: 60px;
    resize: vertical;
}

.add-btn,
.remove-btn {
    padding: 0.4rem 0.8rem;
    cursor: pointer;
    border-radius: 10px;
    border: none;
    font-size: 1.1em;
    margin-left: 0.5rem;
    transition: background-color 0.3s ease;
}

.add-btn {
    background-color: #f13223;
    color: white;
}

.remove-btn {
    background-color: #ababa4;
    color: white;
}

.add-btn:hover,
.remove-btn:hover {
    opacity: 0.9;
}

.popup-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
}

.btn-submit,
.btn-cancel {
    padding: 0.6rem 1.2rem;
    font-size: 1.1em;
    cursor: pointer;
    border-radius: 10px;
    border: none;
    transition: background-color 0.3s ease;
}

.btn-submit {
    background-color: #f13223;
    color: white;
}

.btn-submit:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.btn-cancel {
    background-color: #ababa4;
    color: white;
    margin-left: 1rem;
}

.btn-submit:hover,
.btn-cancel:hover {
    opacity: 0.9;
}

.document-submission {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1.5rem;
    padding: 1.2rem;
    border-top: 1px solid #e0e0e0;
    font-size: 1em;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.6rem;
    width: 100%;
    max-width: 400px;
    background-color: #f9f9f9;
    padding: 0.6rem;
    border-radius: 4px;
}

.file-upload {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    width: 100%;
    max-width: 400px;
    justify-content: center;
}

.btn-file-upload {
    background-color: #f13223;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    cursor: pointer;
    border-radius: 5px;
    font-size: 1em;
    transition: background-color 0.3s ease;
}

.btn-file-upload:hover {
    background-color: #d32f2f;
}

.form-group {
    margin-bottom: 2rem;
}

.category-select-wrapper {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 1em;
}

.category-select-wrapper label {
    margin-right: 1rem;
    white-space: nowrap;
}

.category-select-wrapper select {
    flex-grow: 1;
    padding: 0.6rem;
    font-size: 1em;
    border: 1px solid #ddd;
    border-radius: 4px;
}
</style>
