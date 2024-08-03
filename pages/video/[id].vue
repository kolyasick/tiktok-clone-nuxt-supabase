<script setup>
import dayjs from "dayjs";
import {useAuthStore} from "~/stores/auth.store";
import { getItemById, updateItem } from "~~/services/database";
import { useVideoStore } from "~~/stores/videos.store";
const { $generalStore, $userStore } = useNuxtApp()

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore();
const videoStore = useVideoStore();

let videoElement = ref(null);
let isLoaded = ref(false);
let comment = ref(null);
let inputFocused = ref(false);

let comments = ref([])

const renderComments = async () => {
  $generalStore.selectedPost = null;
  try {
    const videoData = await getItemById('videos', route.params.id);
    $generalStore.selectedPost = {...videoData[0], liked: videoData[0].likes.includes(authStore.user.id)}
    
    comments.value = videoData[0].comments
    
    if (videoElement.value) {
      videoElement.value.src = videoData[0].video;
    }
  } catch (error) {
    if (error && error.response.status === 400) {
      await router.push('/');
    }
  }
}

onMounted(async () => {
    await renderComments();
    setTimeout(() => {
        videoElement.value.muted = false;
    }, 500);
});



watch(videoElement, (newVal) => {
  if (newVal) {
    newVal.addEventListener('loadeddata', (e) => {
      if (e.target) {
        setTimeout(() => {
          isLoaded.value = true;
          newVal.play();
        }, 500);
      }
    });
  }
});

const toggleVideo = () => {
    if (videoElement.value.paused) {
        videoElement.value.play();
    } else {
        videoElement.value.pause();
    }
}

const formattedDate = computed(() => {
  if ($generalStore.selectedPost && $generalStore.selectedPost.created_at) {
    return dayjs($generalStore.selectedPost.created_at).format('YYYY-MM-DD HH:mm');
  }
  return '';
});

const toggleLike = async (video) => {
    
    if (!authStore.user.status) {
        $generalStore.isLoginOpen = true;
        return;
    }

    const userId = authStore.user.id;
    const hasLiked = video.likes.includes(userId);
    let updatedLikes;

    if (!hasLiked) {
        video.liked = true
        updatedLikes = [...video.likes, userId];
        
        
    } else {
        video.liked = false
        updatedLikes = video.likes.filter(like => like !== userId);
    }

    try {
        await updateItem('videos', video.id, { likes: updatedLikes });
        video.likes = updatedLikes; 
    } catch (error) {
        console.log('Error updating video likes:', error);
    }
};

onBeforeUnmount(async () => {
    const index = videoStore.videos.findIndex(video => video.id === $generalStore.selectedPost.id);
    
    if($generalStore.selectedPost.liked) {
        videoStore.videos.splice(index, 1)
        videoStore.videos.push({...$generalStore.selectedPost, liked: true})
    } else {
        videoStore.videos.splice(index, 1)
        videoStore.videos.push({...$generalStore.selectedPost, liked: false})
    }
    
})

const isLiked = computed(() => {
    let res = $generalStore.selectedPost.likes.find(like => like === authStore.user.id)
    if (res) {
        return true
    }
    return false
})

const addComment = async () => {
    if (!authStore.user.status) {
        $generalStore.isLoginOpen = true;
        return;
    } else if (!comment.value) {
        return
    }
    await updateItem('videos', route.params.id, {
        comments: [...$generalStore.selectedPost.comments, {
            user_id: authStore.user.id,
            user_name: authStore.user.name,
            user_avatar: authStore.user.avatar_url,
            text: comment.value
        }]
    })
    comment.value = null;
    await renderComments();
}

</script>


<template>
    <div
    id="PostPage"
    class="fixed lg:flex justify-between z-50 top-0 left-0 w-full h-full bg-black lg:overflow-hidden overflow-auto"
  >
    <div class="lg:w-[calc(100%-540px)] h-full relative">
      <NuxtLink
        :href="$generalStore.isBackUrl"
        class="absolute z-20 m-5 rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
      >
        <Icon name="material-symbols:close" color="#FFFFFF" size="27"/>
      </NuxtLink>

      <div>
        <button
          class="absolute z-20 right-4 top-4 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
        >
          <Icon name="mdi:chevron-up" size="30" color="#FFFFFF"/>
        </button>

        <button
          :disabled="!isLoaded"
          @click="loopThroughPostsDown()"
          class="absolute z-20 right-4 top-20 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
        >
          <Icon name="mdi:chevron-down" size="30" color="#FFFFFF"/>
        </button>
      </div>

      <img
        class="absolute top-[18px] left-[70px] rounded-full lg:mx-0 mx-auto"
        width="45"
        src="~/assets/images/tiktok-logo-small.png"
      >

      <div
        class="bg-black bg-opacity-70 lg:min-w-[480px]"
      >
        <video
        @click="toggleVideo()"
            autoplay
             muted
          ref="videoElement"
          loop
          class="h-screen mx-auto w-full"
        />
      </div>
    </div>

    <div
      id="InfoSection"
      v-if="$generalStore.selectedPost && $generalStore.selectedPost.user"
      class="lg:max-w-[550px] relative w-full h-full bg-white"
    >

            <div class="py-7" />

            <div class="flex items-center justify-between px-8">
                <div class="flex items-center">
                    <NuxtLink :href="`/profile/${$generalStore.selectedPost.user_id}`">
                        <img
                            class="rounded-full lg:mx-0 mx-auto"
                            width="40"
                            :src="$generalStore.selectedPost.user.avatar"
                        >
                    </NuxtLink>
                    <div class="ml-3 pt-0.5">
                        <div class="text-[17px] font-semibold">
                            {{ $generalStore.selectedPost.user.name }}
                        </div>
                        <div class="text-[13px] -mt-5 font-light">
                            {{ $generalStore.selectedPost.user.name }}
                            <span class="relative -top-[2px] text-[30px] pr-0.5 ">.</span>
                            <span class="font-medium">{{formattedDate }}</span>
                        </div>
                    </div>
                </div>

                <!-- <Icon
                    v-if="authStore.user.id === $generalStore.selectedPost.user_id"
                    @click="deletePost()"
                    class="cursor-pointer"
                    name="material-symbols:delete-outline-sharp"
                    size="25"
                /> -->
            </div>

            <div class="px-8 mt-4 text-sm">{{ $generalStore.selectedPost.title }}</div>

            <div class="px-8 mt-4 text-sm font-bold">
                <Icon name="mdi:music" size="17"/>
                original sound - {{ $generalStore.selectedPost.user.name }}
            </div>

            <div class="flex items-center px-8 mt-8">
                <div class="pb-4 text-center flex items-center">
                    <button
                        @click="toggleLike($generalStore.selectedPost)"
                        class="rounded-full bg-gray-200 p-2 cursor-pointer"
                    >
                        <Icon
                            name="mdi:heart"
                            size="25"
                            :color="isLiked ? '#F02C56' : '#161724'"
                        />
                    </button>
                    <span class="text-xs pl-2 pr-4 text-gray-800 font-semibold">
                        {{ $generalStore.selectedPost.likes.length }}
                    </span>
                </div>

                <div class="pb-4 text-center flex items-center">
                    <div class="rounded-full bg-gray-200 p-2 cursor-pointer">
                        <Icon name="bx:bxs-message-rounded-dots" size="25"/>
                    </div>
                    <span class="text-xs pl-2 text-gray-800 font-semibold">{{ $generalStore.selectedPost.comments.length }}</span>
                </div>
            </div>

            <div
                id="Comments"
                class="bg-[#F8F8F8] z-0 w-full h-[calc(100%-273px)] border-t-2 overflow-auto"
            >

                <div class="pt-2"/>

                <div
                    v-if="comments.length === 0"
                    class="text-center mt-6 text-xl text-gray-500"
                >
                    No comments...
                </div>

                <div
                    v-else
                     v-for="comment in comments"
                    :key="comment"
                    class="flex items-center justify-between px-8 mt-4"
                >
                    <div class="flex items-center relative w-full">
                        <NuxtLink :to="`/profile/${comment.user_id}`">
                            <img
                                class="absolute top-0 rounded-full lg:mx-0 mx-auto"
                                width="40"
                                :src="comment.user_avatar"
                            >
                        </NuxtLink>
                        <div class="ml-14 pt-0.5 w-full">
                            <div class="text-[17px] font-semibold flex items-center gap-1">
                                {{ comment.user_name === authStore.user.name ? 'you' : comment.user_name }}
                                <p class="text-[10px] font-normal">{{ comment.user_name === $generalStore.selectedPost.user.name && comment.user_name !== authStore.user.name ? '~author' : '' }}</p>
                                <!-- <Icon
                                    v-if="authStore.user.id === comment.user_id"
                                    @click="deleteComment(comment.id)"
                                    class="cursor-pointer"
                                    name="material-symbols:delete-outline-sharp"
                                    size="25"
                                /> -->
                            </div>
                            <div class="text-[13px] font-light">
                                {{ comment.text }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-28" />

            </div>

            <div
                id="CreateComment"
                v-if="authStore.user.status"
                class="absolute flex items-center justify-between bottom-0 bg-white h-[85px] lg:max-w-[550px] w-full py-5 px-8 border-t-2"
            >
                <div
                    :class="inputFocused ? 'border-2 border-gray-400' : 'border-2 border-[#F1F1F2]'"
                    class="bg-[#F1F1F2] flex items-center rounded-lg w-full lg:max-w-[420px]"
                >
                    <input
                        v-model="comment"
                        @focus="inputFocused = true"
                        @blur="inputFocused = false"
                        class="bg-[#F1F1F2] text-[14px] focus:outline-none w-full lg:max-w-[420px] p-2 rounded-lg"
                        type="text"
                        placeholder="Add comment..."
                    >
                </div>
                <button
                    :disabled="!comment"
                    @click="addComment()"
                    :class="comment ? 'text-[#F02C56] cursor-pointer hover:bg-[#ffeef2] hover:text-[#F02C56] border-[#F02C56]' : 'text-gray-400'"
                    class="font-semibold text-sm ml-5 border  rounded-lg px-3 py-1.5 "
                >
                    Post
                </button>
            </div>
            <div v-else>
                <div class="absolute flex items-center justify-center bottom-0 bg-white h-[85px] lg:max-w-[550px] w-full py-5 px-8 border-t-2">
                    <p>
                        <span @click="$generalStore.isLoginOpen = true" class="cursor-pointer text-[#F02C56]">Login </span>to comment
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

