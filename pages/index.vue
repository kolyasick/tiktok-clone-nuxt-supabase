<template>
    <MainLayout>
        <div class="pt-[80px] w-[calc(100%-20px)] max-w-[890px] overflow-hidden" ref="scrollContainer">
            <div v-if="videoStore.videos.length">
                <PostMain 
                    v-for="video in videoStore.videos" 
                    :key="video.$id" 
                    :video="video" 
                    :loadMore="loadMore"
                />
            </div>
            <div v-else>
                Loading...
            </div>
        </div>
    </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import MainLayout from '~/layouts/MainLayout.vue'
import { useVideoStore } from '~/stores/videos.store.ts'

const videoStore = useVideoStore()
const scrollContainer = ref(null)

const loadMore = () => {
    videoStore.getVideos()
}
</script>

<style scoped>
.load-more-button {
    margin-top: 20px;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
}
</style>
