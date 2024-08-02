<template>
    <MainLayout>
        <div class="pt-[80px] w-[calc(100%-20px)] max-w-[890px] overflow-hidden" ref="scrollContainer">
            <div v-if="videoStore.videos.length">
                <PostMain 
                    v-for="video in videos" 
                    :key="video.id" 
                    :video="video" 
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
import { useAuthStore } from '~~/stores/auth.store'
import { useVideoStore } from '~~/stores/videos.store'


const authStore = useAuthStore()
const videoStore = useVideoStore()
const scrollContainer = ref(null)
const videos = ref([])

watchEffect(() => {
    videos.value = videoStore.videos.map((video) => ({
        ...video,
        liked: video.likes.includes(authStore.user.id),
    }))
})

// const loadMore = () => {
//     videoStore.getVideos()
// }
</script>

<style scoped>
.load-more-button {
    margin-top: 20px;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
}
</style>
