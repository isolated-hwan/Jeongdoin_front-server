<template>
    <div>
        <div v-for="msg in messages" :key="msg.id">
            <strong>{{ msg.sender }}:</strong> {{ msg.message }}
        </div>
    </div>
</template>
    
<script setup>
    defineProps({
        messages: {
        type: Array,
        default: () => []
        }
    });
</script>
