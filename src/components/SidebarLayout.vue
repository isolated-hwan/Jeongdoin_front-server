<template>
    <div class="sidebar-layout">
        <div class="content-wrapper">
            <aside class="sidebar">
                <h3>{{ title }}</h3>
                <router-link v-for="link in links" :key="link.name" :to="{ name: link.name }" class="sidebar-item">
                    {{ link.label }}
                </router-link>
            </aside>
        </div>

        <main class="main-content">
            <slot></slot>
        </main>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    links: Array,
});
</script>

<style scoped>
.sidebar-layout {
    display: flex;
    height: 100vh;
    gap: 45px;
}

.content-wrapper {
    font-family: 'Do Hyeon', sans-serif;
    border-right: 1px solid #e0e0e0;
}

.sidebar {
    width: 250px;
    padding: 1rem;
}

.sidebar h3 {
    font-size: 1.7em;
    padding: 0.5rem;
    margin: 1rem 1rem 2rem 1rem;
}

.sidebar-item {
    font-size: 1.45em;
    display: block;
    color: #333;
    padding: 0.3rem;
    text-decoration: none;
    margin: 1rem;
    transition: color 0.3s ease;
}

.sidebar-item:hover {
    color: #f13223;
}

.router-link-exact-active {
    color: #f13223;
}
</style>
