<script setup>
import { updateItem } from '~~/services/database';
import { useAuthStore } from '~~/stores/auth.store';
import { useVideoStore } from '~~/stores/videos.store';
const { $generalStore } = useNuxtApp();

const authStore = useAuthStore();
const router = useRouter();

const props = defineProps({
    video: Object,
});

let videoplay = ref(null);
let videoContainer = ref(null);
let isMuted = ref(true);
let volume = ref(5);
let isLiking = ref(false);

const loadMoreTrigger = ref(null);
const isModalVisible = ref(false);

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
        return;
    }

    const userId = authStore.user.id;
    const hasLiked = video.likes.includes(userId);
    let updatedLikes;

    if (!hasLiked) {
        video.liked = true;
        updatedLikes = [...video.likes, userId];
    } else {
        video.liked = false;
        updatedLikes = video.likes.filter(like => like !== userId);
    }

    try {
        await updateItem('videos', video.id, { likes: updatedLikes });
        video.likes = updatedLikes;
    } catch (error) {
        console.log('Error updating video likes:', error);
    }
};

const displayPost = (video) => {
    $generalStore.setBackUrl('/');
    $generalStore.selectedPost = null;
    setTimeout(() => router.push(`/video/${video.id}`), 200);
};

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

const shareVideo = async (video) => {
    const videoUrl = `${window.location.origin}/video/${video.id}`;
    try {
        await navigator.clipboard.writeText(videoUrl);
        isModalVisible.value = true;
        setTimeout(() => {
            isModalVisible.value = false;
        }, 2000);
    } catch (error) {
        console.error('Error copying video link:', error);
        alert('Failed to copy video link');
    }
};

onMounted(() => {
    videoplay.value.volume = volume.value / 100;
    const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        threshold: 0.5,
    });
    observer.observe(videoContainer.value);
});
</script>


<template>
    <div :id="`PostMain-${video.id}`" ref="videoContainer" class="postmain flex border-b py-6">
        <div class="pl-3 w-full px-4 ">
            <div class="flex items-center justify-between pb-0.5">
                <button>
                    <span class="font-bold hover:underline cursor-pointer flex items-center gap-2">
                        <NuxtLink :to="`/profile/${video.user_id}`">
                            <img 
                                    class="rounded-full border" 
                                    width="33" 
                                    :src="video.user.avatar"
                                >
                            {{ video.user.name }}
                        </NuxtLink>
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
                    class="video-wrapper relative w-[600px] max-h-[730px] flex items-center bg-black rounded-xl cursor-pointer"
                >
                    <video 
                        ref="videoplay"
                        preload="auto"
                        loop
                        muted
                        playsinline
                        class="rounded-xl object-cover mx-auto h-full w-full"
                    >
                         <source :src="video.video">
                    </video>
                    
                </div>
                <div class="relative mr-[50px]">
                    <div class="absolute bottom-0 pl-2">
                        <div class="pb-4 text-center">
                            <button :disabled="isLiking" @click="toggleLike(video)" class="rounded-full bg-gray-200 p-2 cursor-pointer disabled:bg-gray-300">
                                <Icon name="mdi:heart" size="25" :color="video.liked ? '#F02C56' : '#161724'"/>
                            </button>
                            <span class="text-xs text-gray-800 font-semibold">{{ video.likes.length }}</span>
                        </div>

                        <div class="pb-4 text-center">
                            <div class="rounded-full bg-gray-200 p-2 cursor-pointer">
                                <Icon @click="displayPost(video)" name="bx:bxs-message-rounded-dots" size="25"/>
                            </div>
                            <span class="text-xs text-gray-800 font-semibold">{{ video.comments.length }}</span>
                        </div>

                        <div class="pb-4 text-center">
                            <div @click="shareVideo(video)" class="rounded-full bg-gray-200 p-2 cursor-pointer">
                                <Icon name="ri:share-forward-fill" size="25"/>
                            </div>
                            <span class="text-xs text-gray-800 font-semibold">0</span>
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

    <transition name="modal">
        <div v-if="isModalVisible" class="modal fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white p-4 rounded shadow-lg">
                <p>Video link copied to clipboard!</p>
            </div>
        </div>
    </transition>
</template>



<style scoped>
    @media (max-width: 600px) {
        .video-wrapper {
            width: 100%;
            height: 500px;
        }
    }
    @media (min-width: 1200px) {
        .video-wrapper {
            min-height: 700px;
        }
    }

    .modal-enter-active, .modal-leave-active {
        transition: opacity 0.5s;
    }
    .modal-enter, .modal-leave-to {
        opacity: 0;
    }

    .modal {
        z-index: 1000;
    }
</style>
