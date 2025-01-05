<template>
    <div>
        <canvas ref="radarCanvas" width="300" height="300"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, defineProps } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
    ratings: Object,
});

const radarCanvas = ref(null);

const renderRadarChart = () => {
    if (radarCanvas.value) {
        const ctx = radarCanvas.value.getContext('2d');
        if (ctx && props.ratings) {
            const { ratings } = props;

            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['전문성', '친절', '설명', '시간엄수', '열정'], // 평가 항목
                    datasets: [
                        {
                            label: '강사 평가',
                            data: [ratings.전문성, ratings.친절, ratings.설명, ratings.시간엄수, ratings.열정], // 전달받은 평가 데이터
                            backgroundColor: 'rgba(75, 192, 192, 0.2)', // 배경색
                            borderColor: 'rgba(75, 192, 192, 1)', // 테두리 색
                            borderWidth: 2,
                        },
                    ],
                },
                options: {
                    scales: {
                        r: {
                            beginAtZero: true,
                            ticks: { max: 5, stepSize: 1 },
                        },
                    },
                },
            });
        }
    } else {
        console.error('Canvas element not found!');
    }
};

onMounted(() => {
    nextTick(() => {
        renderRadarChart();
    });
});
</script>

<style scoped>
.radar-chart-container {
    width: 300px;
    height: 300px;
    margin: 20px auto;
}
</style>
