<template>
    <div class="container">
        <div class="main-content">
            <div class="search-sort-container">
                <div class="search-container">
                    <form @submit.prevent="search">
                        <select v-model="searchType">
                            <option value="total">전체</option>
                            <option value="title">레슨명</option>
                            <option value="trainer">강사명</option>
                        </select>
                        <input type="text" v-model="searchKeyword" placeholder="검색어를 입력하세요" />
                        <button type="submit">검색</button>
                    </form>
                </div>

                <div class="sort-container">
                    <select v-model="sortType" @change="sort">
                        <option value="popular">인기순</option>
                        <option value="latest">최신순</option>
                        <option value="latest">만족도순</option>
                        <option value="oldest">가격순</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const searchType = ref('total');
const searchKeyword = ref('');
const sortType = ref('popular');

const emit = defineEmits(['search', 'sort']);

function search() {
    emit('search', { type: searchType.value, keyword: searchKeyword.value });
}

function sort() {
    emit('sort', sortType.value);
}
</script>

<style scoped>
.container {
    display: flex;
}

.main-content {
    flex: 1;
    padding: 20px;
}

.search-sort-container {
    display: flex;
    justify-content: space-between;
    margin: 20px;
}

.search-container {
    display: flex;
}
.search-container form {
    display: flex;
    gap: 10px;
}

.search-container button {
    background-color: #f13223;
    color: white;
    cursor: pointer;
    border: none;
}

.search-container button:hover {
    background-color: #d32f2f;
}

.sort-container select {
    margin-right: 20px;
}

.search-container input {
    width: 200px;
}

select,
input,
button {
    padding: 5px 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
}
</style>
