<template>
    <div class="app">
        <div v-if="useLayout">
            <header-compo />
            <main class="main-content">
                <router-view />
            </main>
            <footer-compo />
        </div>
        <div v-else>
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import HeaderCompo from './components/layouts/HeaderCompo.vue';
import FooterCompo from './components/layouts/FooterCompo.vue';

const route = useRoute();

const useLayout = computed(() => {
    return route.meta.useLayout !== false;
});
</script>

<style scoped>
.app {
    min-height: 100vh;
    margin: -8px;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-content {
    flex: 1;
    overflow-y: auto;
}
</style>
