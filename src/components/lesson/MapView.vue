<template>
    <div ref="mapContainer" class="map-container"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';

const props = defineProps({
    location: String,
});

const mapContainer = ref(null);

onMounted(async () => {
    const location = props.location;
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`,
    );
    const data = await response.json();

    if (data.length > 0) {
        const { lat, lon } = data[0];
        const map = L.map(mapContainer.value).setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        L.marker([lat, lon]).addTo(map).bindPopup(`<b>${location}</b>`).openPopup();
    } else {
        console.error('주소를 찾을 수 없습니다.');
    }
});
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 300px;
    position: relative;
    z-index: 1; /* 명시적으로 낮은 z-index 설정 */
}
</style>
