<template>
    <div 
        @click="displayPost(post)"
        @mouseenter="isHover(true)" 
        @mouseleave="isHover(false)"
        class=" relative brightness-90 hover:brightness-[1.1] cursor-pointer"
    >
        <div 
            v-if="!isLoaded" 
            class="absolute flex items-center justify-center top-0 left-0 aspect-[3/4] w-full object-cover rounded-md bg-black"
        >
            <Icon class="animate-spin ml-1" name="mingcute:loading-line" size="100" color="#FFFFFF"/>
        </div>
        <div>
            <video 
                ref="videoRef" 
                muted
                loop
                class="aspect-[3/4] object-cover rounded-md" 
                :src="video.video"
            />
        </div>
        <div class="px-1">
            <div class="text-gray-700 text-[15px] pt-1 break-words">
                {{ video.title }}
            </div>
            <div class="flex items-center -ml-1 text-gray-600 font-bold text-xs">
                <Icon name="gg:loadbar-sound" size="20"/>
                3%
                <Icon class="ml-1" name="tabler:alert-circle" size="16"/>
            </div>
        </div>
    </div>
</template>

<script setup>
const { $generalStore } = useNuxtApp()
defineProps({
    video: Object
})

const route = useRoute()
const router = useRouter()

let videoRef = ref(null)
let isLoaded = ref(false)

onMounted(() => {
    if (videoRef.value) {
        videoRef.value.addEventListener('loadeddata', (e) => {
            if (e.target) {
                setTimeout(() => {
                    isLoaded.value = true
                }, 200)
            }
        });
    }
})

onBeforeUnmount(() => {
    videoRef.value.pause()
    videoRef.value.currentTime = 0
    videoRef.value.src = ''
})


const isHover = (bool) => {
    if (bool) {
        videoRef.value.play()
    } else {
        videoRef.value.pause()
    }
}
</script>