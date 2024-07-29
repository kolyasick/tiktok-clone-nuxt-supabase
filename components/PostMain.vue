<script setup>
import { COLLECTION_VIDEOS, DB_ID } from '~~/app.constants';
import { useAuthStore } from '~~/stores/auth.store';
import { useVideoStore } from '~~/stores/videos.store';
const { $generalStore } = useNuxtApp()

const authStore = useAuthStore();
const videoStore = useVideoStore();
const router = useRouter();

const props = defineProps({
    video: Object,
    loadMore: Function
});

let videoplay = ref(null);
let videoContainer = ref(null);
let isMuted = ref(true);
let volume = ref(5); 
let isLiking = ref(false);
const likes = ref(0);

// Element to trigger loadMore
const loadMoreTrigger = ref(null);

const togglePlayPause = async () => {
    if (videoplay.value.paused) {
        try {
            await videoplay.value.play();
        } catch (error) {
            console.error('Error playing video:', error);
        }
    } else {
        videoplay.value.pause();
    }
};

const toggleMute = () => {
    isMuted.value = !isMuted.value;
    videoplay.value.muted = isMuted.value;
};

const updateVolume = (event) => {
    volume.value = event.target.value;
    videoplay.value.volume = volume.value / 100;
};

const toggleLike = async (video) => {
    if (!authStore.user.status) {
        $generalStore.isLoginOpen = true;
    } else if (video.users_like.find((like) => like.$id === authStore.user.$id)) {
        video.is_liked = false;
        video.likes--;
        video.users_like = video.users_like.filter((like) => like.$id !== authStore.user.$id);
        try {
            isLiking.value = true;
            await DB.updateDocument(DB_ID, COLLECTION_VIDEOS, video.$id, {
                likes: video.likes,
                users_like: video.users_like
            });
            await videoStore.getVideos();
        } catch (error) {
            console.log(error);
            video.is_liked = true;
            video.likes++;
            video.users_like.push(authStore.user.$id);
        } finally {
            isLiking.value = false;
        }
    } else {
        video.is_liked = true;
        video.likes++;
        video.users_like.push(authStore.user.$id);
        try {
            isLiking.value = true;
            await DB.updateDocument(DB_ID, COLLECTION_VIDEOS, video.$id, {
                likes: video.likes,
                users_like: video.users_like
            });
            await videoStore.getVideos();
        } catch (error) {
            console.log(error);
            video.is_liked = false;
            video.likes--;
            video.users_like = video.users_like.filter((like) => like.$id !== authStore.user.$id);
        } finally {
            isLiking.value = false;
        }
    }
};

const displayPost = (video) => {
    if (!authStore.user.status) {
        $generalStore.isLoginOpen = true;
        return;
    }
    $generalStore.setBackUrl('/');
    $generalStore.selectedPost = null;
    setTimeout(() => router.push(`/video/${video.$id}`), 200);
};

// Intersection Observer to play video when in view
const handleIntersection = (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            videoplay.value.play();
        } else {
            videoplay.value.pause();
            videoplay.value.currentTime = 0;
        }
    });
};

// Intersection Observer to load more videos
const handleLoadMoreIntersection = (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            props.loadMore();
        }
    });
};

onMounted(() => {
    // Observe video container for play/pause
    const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        threshold: 0.5 // Adjust this threshold as needed
    });
    observer.observe(videoContainer.value);

    // Observe load more trigger
    const loadMoreObserver = new IntersectionObserver(handleLoadMoreIntersection, {
        root: null,
        threshold: 1.0 // Adjust this threshold as needed
    });
    if (loadMoreTrigger.value) {
        loadMoreObserver.observe(loadMoreTrigger.value);
    }
});
</script>

<template>
    <div :id="`PostMain-${video.$id}`" ref="videoContainer" class="postmain flex border-b py-6">
        <div class="pl-3 w-full px-4 ">
            <div class="flex items-center justify-between pb-0.5">
                <button>
                    <span class="font-bold hover:underline cursor-pointer">
                        {{ video.user.name }}
                    </span>
                    <span class="text-[13px] text-light text-gray-500 pl-1 cursor-pointer">
                    </span>
                </button>

                <button class="border text-[15px] px-[21px] py-0.5 border-[#F02C56] text-[#F02C56] hover:bg-[#ffeef2] font-semibold rounded-md">
                    Follow
                </button>
            </div>
            <div class="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px]">{{ video.title }}</div>
            <div class="text-[14px] text-gray-500 pb-0.5">#fun #cool #SuperAwesome</div>
            <div class="text-[14px] pb-0.5 flex items-center font-semibold">
                <Icon name="mdi:music" size="17"/>
                <div class="px-1">original sound - AWESOME</div>
                <Icon name="mdi:heart" size="20"/>
            </div>

            <div class="mt-2.5 flex">
                <div
                    @click="displayPost(video)"
                    class="video-wrapper relative min-h-[600px] max-h-[880px] w-[600px] flex items-center bg-black rounded-xl cursor-pointer"
                >
                    <video 
                        ref="videoplay"
                        preload="auto"
                        loop
                        muted
                        playsinline
                        class="rounded-xl object-cover mx-auto h-full w-full"
                    >
                         <source :src="video.src">
                    </video>
                    
                </div>
                <div class="relative mr-[50px]">
                    <div class="absolute bottom-0 pl-2">
                        <div class="pb-4 text-center">
                            <button :disabled="isLiking" @click="toggleLike(video)" class="rounded-full bg-gray-200 p-2 cursor-pointer disabled:bg-gray-300">
                                <Icon name="mdi:heart" size="25" :color="video.is_liked ? '#F02C56' : '#161724'"/>
                            </button>
                            <span class="text-xs text-gray-800 font-semibold">{{ video.users_like.length }}</span>
                        </div>

                        <div class="pb-4 text-center">
                            <div class="rounded-full bg-gray-200 p-2 cursor-pointer">
                                <Icon @click="displayPost(video)" name="bx:bxs-message-rounded-dots" size="25"/>
                            </div>
                            <span class="text-xs text-gray-800 font-semibold">{{ video.comments.length }}</span>
                        </div>

                        <div class="text-center">
                            <div class="rounded-full bg-gray-200 p-2 cursor-pointer">
                                <Icon name="ri:share-forward-fill" size="25"/>
                            </div>
                            <span class="text-xs text-gray-800 font-semibold">55</span>
                        </div>

                       
                        <div class="text-center mb-2">
                            <button class="rounded-full bg-gray-200 p-2 cursor-pointer" @click="toggleMute">
                                <Icon :name="isMuted ? 'mdi:volume-off' : 'mdi:volume-high'" size="25"/>
                            </button>
                            <span class="text-xs text-gray-800 font-semibold">{{ isMuted ? 'Unmute' : 'Mute' }}</span>
                        </div>

                        
                        <div class="text-center">
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                v-model="volume" 
                                @input="updateVolume" 
                                class="w-full"
                            />
                            <span class="text-xs text-gray-800 font-semibold">{{ volume }}%</span>
                        </div>
                        
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    <div>
        <div ref="loadMoreTrigger" class="h-10 "></div>
    </div>
</template>

<style scoped>
    @media (max-width: 600px) {
        .video-wrapper {
            width: 100%;
            height: 500px;
            
        }
        
    }
</style>