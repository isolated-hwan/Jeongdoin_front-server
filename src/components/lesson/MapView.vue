<template>
    <div id="map" class="map-container"></div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';

const props = defineProps({
    lat: {
        type: Number,
        required: true,
    },
    lng: {
        type: Number,
        required: true,
    },
});

const isScriptLoaded = ref(false);
const KAKAO_MAP_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

const loadKaKaoPostcodeScript = () => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&libraries=services,clusterer&autoload=false`;

    document.head.appendChild(script);
    script.onload = () => {
        isScriptLoaded.value = true;
        // 카카오맵 SDK가 로드되면 지도 초기화
        window.kakao.maps.load(() => {
            initMap();
        });
    };
};

const initMap = () => {
    if (isScriptLoaded.value) {
        // 카카오맵 객체가 로드된 후 지도 생성
        const { lat, lng } = props;
        const mapContainer = document.getElementById('map');
        const mapOption = {
            center: new window.kakao.maps.LatLng(lat, lng), // 전달받은 위도, 경도
            level: 3, // 지도 확대 레벨
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(lat, lng),
        });
        marker.setMap(map);
    }
};

onMounted(() => {
    loadKaKaoPostcodeScript();
});
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 300px;
}
</style>
