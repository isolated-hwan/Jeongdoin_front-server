<template>
    <div class="mbti-test">
        <h2>운BTI</h2>
        <p>나의 운동 스타일을 알아보는 재미있는 테스트입니다!</p>
        <div class="progress-bar">
            <div class="progress" :style="{ width: (currentQuestion / questions.length) * 100 + '%' }"></div>
        </div>
        <div v-if="currentQuestion < questions.length" class="question">
            <h3>질문 {{ currentQuestion + 1 }}: {{ questions[currentQuestion].text }}</h3>
            <div class="answers">
                <button
                    v-for="(answer, index) in questions[currentQuestion].answers"
                    :key="index"
                    @click="answerQuestion(answer.type)"
                    class="answer-button"
                >
                    {{ answer.text }}
                </button>
            </div>
        </div>

        <div v-else-if="!showResult" class="show-result">
            <p class="instruction">모든 질문에 답변하셨습니다! 결과를 확인하려면 아래 버튼을 눌러주세요.</p>
            <button @click="calculateResult" class="result-button">검사 결과 보기</button>
        </div>

        <div v-else class="result">
            <h3>검사 결과</h3>
            <p>{{ resultMessage }}</p>
            <button @click="resetTest" class="reset-button">다시 하기</button>
            <button @click="shareResult" class="share-button">결과 공유하기</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const questions = ref([
    {
        text: '운동할 때 어떤 방식을 선호하시나요?',
        answers: [
            { text: '혼자서 집중하여 운동하고 싶어요.', type: 'I' },
            { text: '다른 사람과 함께 운동하면 더 재미있어요.', type: 'E' },
        ],
    },
    {
        text: '운동을 할 때 당신의 스타일은?',
        answers: [
            { text: '정해진 시간에 맞춰 정확하게 운동을 해요.', type: 'J' },
            { text: '그때그때 기분에 따라 운동을 유연하게 조정해요.', type: 'P' },
        ],
    },
    {
        text: '운동 중 피드백을 받을 때, 어떤 것이 더 도움이 되나요?',
        answers: [
            { text: '객관적이고 분석적인 피드백이 더 도움이 돼요.', type: 'T' },
            { text: '격려와 긍정적인 말이 더 동기부여가 돼요.', type: 'F' },
        ],
    },
    {
        text: '어떤 유형의 운동을 더 좋아하시나요?',
        answers: [
            { text: '규칙적이고 익숙한 운동 루틴을 선호해요.', type: 'S' },
            { text: '새롭고 도전적인 운동을 자주 시도해보고 싶어요.', type: 'N' },
        ],
    },
    {
        text: '새로운 운동 모임에 참여한다면, 당신은?',
        answers: [
            { text: '처음에는 천천히 분위기를 파악하며 적응해요.', type: 'I' },
            { text: '곧바로 사람들과 어울리며 분위기를 즐겨요.', type: 'E' },
        ],
    },
    {
        text: '운동을 평가할 때, 더 중요하다고 느끼는 것은?',
        answers: [
            { text: '운동의 결과와 성과를 분석하는 것이 중요해요.', type: 'T' },
            { text: '운동을 하며 느꼈던 감정과 즐거움이 더 중요해요.', type: 'F' },
        ],
    },
    {
        text: '운동 루틴이 반복될 때, 당신은?',
        answers: [
            { text: '안정감을 느끼고 꾸준히 계속해요.', type: 'S' },
            { text: '지루해지면 새로운 방식으로 바꾸고 싶어요.', type: 'N' },
        ],
    },
    {
        text: '운동 후, 성취감을 느낄 때 당신의 행동은?',
        answers: [
            { text: '스스로 만족하며 결과를 되새겨요.', type: 'I' },
            { text: '주변 사람들과 성취를 나누고 싶어요.', type: 'E' },
        ],
    },
    {
        text: '스트레스를 받을 때, 운동으로 어떻게 해결하나요?',
        answers: [
            { text: '논리적으로 문제를 분석하고 운동으로 해결하려 해요.', type: 'T' },
            { text: '운동을 통해 감정을 풀고 몸으로 스트레스를 해소해요.', type: 'F' },
        ],
    },
    {
        text: '갑작스러운 계획 변경이 있을 때, 당신은?',
        answers: [
            { text: '가능하면 원래 계획을 지키려고 해요.', type: 'J' },
            { text: '변화를 빠르게 받아들이고 적응해요.', type: 'P' },
        ],
    },
    {
        text: '운동할 때, 새로운 기술이나 방식을 배울 기회가 생긴다면?',
        answers: [
            { text: '익숙한 방법을 유지하면서 안정적으로 운동해요.', type: 'S' },
            { text: '새로운 것을 배워보는 게 흥미롭고 도전하고 싶어요.', type: 'N' },
        ],
    },
    {
        text: '운동 목표를 달성했을 때, 당신은 주로 어떻게 반응하나요?',
        answers: [
            { text: '다음 목표를 설정하고 더 발전하려고 해요.', type: 'J' },
            { text: '잠시 즐기고 나서 다음 계획은 천천히 생각해요.', type: 'P' },
        ],
    },
]);

const currentQuestion = ref(0);
const mbtiResult = ref({
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
});

const resultMessage = ref('');
const showResult = ref(false);

function answerQuestion(type) {
    mbtiResult.value[type]++;
    currentQuestion.value++;
}

function calculateResult() {
    const result = [
        mbtiResult.value.E >= mbtiResult.value.I ? 'E' : 'I',
        mbtiResult.value.S >= mbtiResult.value.N ? 'S' : 'N',
        mbtiResult.value.T >= mbtiResult.value.F ? 'T' : 'F',
        mbtiResult.value.J >= mbtiResult.value.P ? 'J' : 'P',
    ].join('');

    resultMessage.value = getMbtiAnalysis(result);
    showResult.value = true;
}

function getMbtiAnalysis(result) {
    const mbtiAnalysis = {
        ESTJ: '당신은 매우 체계적이고 계획적인 운동을 선호하는 유형입니다. 규칙적이고 목표 지향적인 운동을 좋아하며, 강한 리더십을 발휘해 그룹 운동에서도 앞장서기 좋습니다. 체력 향상을 위한 주기적인 훈련이 적합하며, 헬스, 크로스핏, 마라톤 같은 목표 지향적인 운동이 잘 맞습니다.',
        ESTP: '당신은 운동에서 즉흥적이고 활동적인 성격을 보여줍니다. 새로운 도전을 즐기며, 변화하는 환경에서 빠르게 적응합니다. 다양한 스포츠나 팀 운동, 특히 야외에서 하는 액티브 스포츠에 뛰어난 재능을 발휘할 수 있습니다.',
        ESFJ: '사교적이고 친절한 당신은 사람들과 함께하는 운동을 즐깁니다. 다른 사람을 돕거나 격려하는 것을 좋아하며, 파트너 운동이나 단체 운동에서 두각을 나타냅니다. 요가, 필라테스, 그룹 피트니스 클래스가 적합할 수 있습니다.',
        ESFP: '당신은 긍정적이고 열정적인 에너지를 운동에 쏟는 타입입니다. 창의적이고 즐거운 운동을 선호하며, 감각적인 운동을 즐깁니다. 춤, 에어로빅, 그리고 단체 스포츠 활동이 잘 맞습니다.',
        ENTJ: '목표 지향적이고 계획적인 당신은 운동에서도 리더의 역할을 자주 맡습니다. 도전적이고 성과 중심적인 운동에 관심이 많으며, 체력 증진뿐 아니라 정신적 강인함을 키우는 훈련을 좋아합니다. 크로스핏, 고강도 인터벌 트레이닝(HIIT) 같은 경쟁적이고 힘든 운동이 적합합니다.',
        ENTP: '당신은 창의적이고 모험적인 성향을 가진 운동가입니다. 새로운 스포츠나 훈련 방식에 도전하는 것을 즐기며, 변화를 좋아합니다. 클라이밍, 수상 스포츠, 익스트림 스포츠 같은 창의적이고 도전적인 운동이 잘 맞습니다.',
        ENFJ: '당신은 다른 사람과의 관계에서 에너지를 얻으며, 파트너와 함께 성장하는 운동을 즐깁니다. 팀 운동에서 협력적인 역할을 자주 맡으며, 다른 사람들을 돕고 격려하는 데 뛰어납니다. 그룹 운동, 팀 스포츠, 또는 피트니스 트레이너 역할이 잘 어울립니다.',
        ENFP: '당신은 활기차고 창의적인 성격으로 운동을 놀이처럼 즐깁니다. 규칙에 얽매이지 않고 자유로운 분위기에서 운동을 선호하며, 자기 표현이 중요한 운동에 관심이 많습니다. 댄스, 요가, 트램펄린 피트니스 같은 활동적인 운동이 적합합니다.',
        ISTJ: '당신은 계획적이고 성실한 운동가입니다. 꾸준한 운동 루틴을 통해 성취감을 느끼며, 정해진 목표를 이루기 위해 규칙적으로 훈련하는 것을 선호합니다. 웨이트 트레이닝, 마라톤 등 명확한 목표가 있는 운동이 잘 맞습니다.',
        ISTP: '실용적이고 분석적인 성격을 가진 당신은 운동에서 효율성을 중시합니다. 기술적인 운동이나 장비를 활용하는 스포츠에서 뛰어난 능력을 발휘하며, 개인 운동을 선호할 수 있습니다. 헬스, 사이클링, 골프 같은 운동이 적합합니다.',
        ISFJ: '섬세하고 배려심이 많은 당신은 운동에서도 다른 사람과의 관계를 중시합니다. 체계적이고 꾸준한 운동을 선호하며, 파트너 운동이나 단체 운동에서도 좋은 팀원이 될 수 있습니다. 요가, 필라테스 같은 차분한 운동이 잘 맞습니다.',
        ISFP: '당신은 자유롭고 감성적인 성격을 운동에 반영합니다. 자기 표현이 중요한 운동을 즐기며, 창의적인 활동에 관심이 많습니다. 춤, 스트레칭 운동, 자연 속에서의 산책이나 하이킹 등이 적합할 수 있습니다.',
        INTJ: '분석적이고 계획적인 당신은 운동에서도 장기적인 전략을 세우는 것을 좋아합니다. 체계적인 운동 계획을 세워 자신의 목표를 이루는 데 집중합니다. 고강도 훈련, 철인 3종 경기 같은 전략적인 운동이 잘 맞습니다.',
        INTP: '지적 호기심이 강한 당신은 운동에서도 효율성과 논리적 접근을 중요시합니다. 자기 주도적인 운동을 선호하며, 분석적인 사고를 바탕으로 운동 방식을 개선하는 것을 즐깁니다. 체계적인 운동 계획이 중요한 헬스, 사이클링 등이 적합할 수 있습니다.',
        INFJ: '당신은 깊이 있는 생각과 사람들과의 연결을 중시하는 성향을 가지고 있습니다. 운동을 통해 신체적, 정신적 균형을 찾으며, 요가나 명상 같은 내면을 집중하는 활동을 즐깁니다. 꾸준한 노력으로 장기적인 성장을 목표로 하는 운동이 잘 맞습니다.',
        INFP: '이상적이고 창의적인 당신은 운동을 통해 자신만의 방식으로 자신을 표현하는 것을 좋아합니다. 정해진 규칙에 얽매이지 않고 자유롭게 운동하며, 감정적인 해소를 위한 운동을 선호합니다. 춤, 요가, 자연 속에서의 운동이 잘 맞습니다.',
    };

    return mbtiAnalysis[result] || `당신의 운동 MBTI는 ${result}입니다!`;
}

function resetTest() {
    currentQuestion.value = 0;
    mbtiResult.value = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    resultMessage.value = '';
    showResult.value = false;
}

function shareResult() {
    const shareText = `내 운동 MBTI는 ${resultMessage.value}입니다! #운BTI`;
    navigator.share({
        title: '운BTI 결과',
        text: shareText,
        url: window.location.href,
    });
}
</script>

<style scoped>
.mbti-test {
    max-width: 600px;
    margin: 120px auto;
    text-align: center;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
}

h2 {
    font-size: 24px;
    margin-bottom: 20px;
}

.progress-bar {
    width: 100%;
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 30px;
    margin-bottom: 50px;
}

.progress {
    height: 100%;
    background-color: #f13223; /* 진행 색상 */
    transition: width 0.3s ease; /* 부드러운 애니메이션 효과 */
}

.question h3 {
    margin-bottom: 50px;
}

.answers {
    display: flex;
    flex-direction: column;
    gap: 40px;
    margin-bottom: 30px;
}

.answer-button {
    padding: 10px 15px;
    background-color: #f13223;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
}

.answer-button:hover {
    background-color: #d32f2f;
}

.result-button {
    padding: 15px 25px;
    background-color: #f13223;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 20px;
}

.result-button:hover {
    background-color: #d32f2f;
    transform: scale(1.05);
}

.instruction {
    font-size: 16px;
    margin-bottom: 10px;
    color: #333;
}

.result {
    margin-top: 30px;
}

.reset-button {
    padding: 10px 15px;
    background-color: #ababa4;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.1em;
}

.reset-button:hover {
    background-color: #8e8e8e;
}

.share-button {
    padding: 10px 15px;
    background-color: #f13223; /* 밝은 노란색 배경 */
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin: 20px;
    font-size: 1.1em;
}

.share-button:hover {
    background-color: #d32f2f;
}
</style>
