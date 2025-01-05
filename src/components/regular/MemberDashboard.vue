<template>
    <div class="weight-dashboard">
        <h2>체중 변화 대시보드</h2>
        <div class="chart-container">
            <Line v-if="chartData" :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// 샘플 데이터 (실제 사용 시 API나 저장소에서 데이터를 가져와야 합니다)
const weightData = ref([
    { date: '2023-01-01', weight: 70 },
    { date: '2023-02-01', weight: 69 },
    { date: '2023-03-01', weight: 68 },
    { date: '2023-04-01', weight: 67.5 },
    { date: '2023-05-01', weight: 67 },
    { date: '2023-06-01', weight: 66 },
]);

const chartData = computed(() => {
    if (weightData.value.length === 0) return null;

    return {
        labels: weightData.value.map((item) => item.date),
        datasets: [
            {
                label: '체중 (kg)',
                data: weightData.value.map((item) => item.weight),
                borderColor: '#f13223',
                tension: 0.1,
                fill: false,
            },
        ],
    };
});

const chartOptions = {
    responsive: true,
    animation: {
        duration: 2000,
    },
    scales: {
        y: {
            beginAtZero: false,
            title: {
                display: true,
                text: '체중 (kg)',
            },
        },
        x: {
            title: {
                display: true,
                text: '날짜',
            },
        },
    },
};

onMounted(() => {});
</script>

<style scoped>
.weight-dashboard {
    max-width: 800px;
    margin: 0 auto;
}

.weight-dashboard h2 {
    font-family: 'Do Hyeon', sans-serif;
    text-align: center;
}

.chart-container {
    margin-top: 50px;
}
</style>
