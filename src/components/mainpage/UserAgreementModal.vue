<template>
    <div class="terms-of-service">
        <h1>이용약관</h1>
        <div class="terms-container">
            <div class="term-card">
                <h2><span class="icon">📜</span>제 1조 (목적)</h2>
                <p>
                    본 약관은 신박한이팀 (이하 "회사")가 제공하는 서비스의 이용조건 및 절차, 사용자와 회사 간의 권리,
                    의무 및 책임사항 등을 규정하는 것을 목적으로 합니다.
                </p>
            </div>

            <div class="term-card">
                <h2><span class="icon">📖</span>제 2조 (정의)</h2>
                <ol>
                    <li>"서비스"란 회사가 제공하는 모든 온라인 서비스 및 콘텐츠를 의미합니다.</li>
                    <li>"사용자"란 서비스를 이용하는 모든 개인 및 법인을 의미합니다.</li>
                </ol>
            </div>

            <div class="term-card">
                <h2><span class="icon">🔄</span>제 3조 (약관의 효력 및 변경)</h2>
                <ol>
                    <li>본 약관은 서비스 화면에 게시함으로써 효력을 발생합니다.</li>
                    <li>
                        회사는 필요에 따라 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 화면에 게시함으로써 효력을
                        발생합니다.
                    </li>
                </ol>
            </div>

            <div class="term-card">
                <h2><span class="icon">✍️</span>제 4조 (이용 계약의 체결)</h2>
                <ol>
                    <li>이용 계약은 사용자가 본 약관에 동의하고, 회사가 정한 절차에 따라 신청함으로써 체결됩니다.</li>
                    <li>
                        회사는 다음 각 호의 사유가 있을 경우 이용 계약의 체결을 거부할 수 있습니다.
                        <ul>
                            <li>신청 내용에 허위, 기재누락이 있는 경우</li>
                            <li>기타 회사의 정책상 필요하다고 판단되는 경우</li>
                        </ul>
                    </li>
                </ol>
            </div>

            <div class="term-card">
                <h2><span class="icon">⚙️</span>제 5조 (서비스의 이용)</h2>
                <ol>
                    <li>회사는 서비스 이용에 대한 상세한 내용을 제공하며, 사용자는 이를 숙지하고 따라야 합니다.</li>
                    <li>회사는 서비스의 안전한 운영을 위해 필요한 경우 사전 통지 없이 서비스를 중단할 수 있습니다.</li>
                </ol>
            </div>

            <div class="term-card">
                <h2><span class="icon">🛡️</span>제 6조 (권리와 의무)</h2>
                <ol>
                    <li>
                        사용자는 서비스 이용 시 법령 및 본 약관을 준수하여야 하며, 타인의 권리를 침해해서는 안 됩니다.
                    </li>
                    <li>회사는 서비스 제공과 관련하여 사용자의 개인정보를 보호하기 위해 최선을 다합니다.</li>
                </ol>
            </div>

            <div class="term-card">
                <h2><span class="icon">⚠️</span>제 7조 (면책 조항)</h2>
                <p>
                    회사는 천재지변, 불가항력적인 사유로 인해 서비스를 제공할 수 없는 경우에 대해 책임을 지지 않습니다.
                </p>
            </div>

            <div class="term-card">
                <h2><span class="icon">🏛️</span>제 8조 (준거법 및 분쟁 해결)</h2>
                <ol>
                    <li>본 약관의 해석 및 적용에 관하여는 대한민국 법을 적용합니다.</li>
                    <li>서비스 이용과 관련하여 발생하는 분쟁은 회사의 본사 소재지를 관할하는 법원에서 해결합니다.</li>
                </ol>
            </div>
        </div>
    </div>
</template>

<script setup></script>

<style scoped>
html,
body {
    background-color: #f9f9f9;
}

h1 {
    margin-bottom: 20px;
    text-align: center;
}

.terms-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.term-card {
    background-color: #fff;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h2 {
    margin-top: 10px;
    display: flex;
    align-items: center;
}

.icon {
    margin-right: 10px;
}

p,
li {
    font-size: 16px;
    margin-bottom: 10px;
}

ol,
ul {
    margin: 10px 0;
    padding-left: 20px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
}

button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #f13223;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>
