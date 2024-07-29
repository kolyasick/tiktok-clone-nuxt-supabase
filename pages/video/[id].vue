<script setup>
import {COLLECTION_VIDEOS, DB_ID, COLLECTION_COMMENTS} from "~/app.constants";
import { DB } from "~~/utils/appwrite";
import dayjs from "dayjs";
import {useAuthStore} from "~/stores/auth.store";

const { $generalStore, $userStore } = useNuxtApp()

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore();


let videoElement = ref(null);
let isLoaded = ref(false);
let comment = ref(null);
let inputFocused = ref(false);

let comments = ref([])

const renderComments = async () => {
  $generalStore.selectedPost = null;
  try {
    const videoData = await DB.getDocument(DB_ID, COLLECTION_VIDEOS, route.params.id);
    $generalStore.selectedPost = videoData;
    comments.value = videoData.comments

    if (videoElement.value) {
      videoElement.value.src = videoData.src;
    }
  } catch (error) {
    if (error && error.response.status === 400) {
      await router.push('/');
    }
  }
}

onMounted(async () => {
  await renderComments();
});

// Следите за изменениями в videoElement и добавляйте обработчик события, когда он инициализирован
watch(videoElement, (newVal) => {
  if (newVal) {
    newVal.addEventListener('loadeddata', (e) => {
      if (e.target) {
        setTimeout(() => {
          isLoaded.value = true;
          newVal.play(); // Воспроизвести видео
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
  if ($generalStore.selectedPost && $generalStore.selectedPost.$createdAt) {
    return dayjs($generalStore.selectedPost.$createdAt).format('YYYY-MM-DD HH:mm');
  }
  return '';
});
//
// onBeforeUnmount(() => {
//     video.value.pause()
//     video.value.currentTime = 0
//     video.value.src = ''
// })
//
// watch(() => isLoaded.value, () => {
//     if (isLoaded.value) {
//         setTimeout(() => video.value.play(), 500)
//     }
// })
//
// const loopThroughPostsDown = () => {
//     setTimeout(() => {
//         let idArrayReversed = $generalStore.ids.reverse()
//         let isBreak = false
//
//         for (let i = 0; i < idArrayReversed.length; i++) {
//             const id = idArrayReversed[i];
//             if (id < route.params.id) {
//                 router.push(`/video/${id}`)
//                 isBreak = true
//                 return
//             }
//         }
//
//         if (!isBreak) {
//             router.push(`/video/${idArrayReversed[0]}`)
//         }
//     }, 300)
// }
//
//
// const loopThroughPostsUp = () => {
//     setTimeout(() => {
//         let isBreak = false
//
//         for (let i = 0; i < $generalStore.ids.length; i++) {
//             const id = $generalStore.ids[i];
//             if (id > route.params.id) {
//                 router.push(`/video/${id}`)
//                 isBreak = true
//                 return
//             }
//         }
//
//         if (!isBreak) {
//             router.push(`/video/${$generalStore.ids[0]}`)
//         }
//     }, 300)
// }
//
// const isLiked = computed(() => {
//     let res = $generalStore.selectedPost.likes.find(like => like.user_id === $userStore.id)
//     if (res) {
//         return true
//     }
//     return false
// })
//
// const likePost = async () => {
//     try {
//         await $userStore.likePost($generalStore.selectedPost, true)
//     } catch (error) {
//         console.log(error)
//     }
// }
//
// const unlikePost = async () => {
//     try {
//         await $userStore.unlikePost($generalStore.selectedPost, true)
//     } catch (error) {
//         console.log(error)
//     }
// }
//
// const deletePost = async () => {
//     let res = confirm('Are you sure you want to delete this video?')
//     try {
//         if (res) {
//             await $userStore.deletePost($generalStore.selectedPost)
//             await $profileStore.getProfile($userStore.id)
//             router.push(`/profile/${$userStore.id}`)
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }
//
const addComment = async () => {
  comments.value.push({
    video: $generalStore.selectedPost.$id,
    text: comment.value,
    user: {
      $id: authStore.user.$id,
      name: authStore.user.name,
      avatar_url: authStore.user.avatar_url
    }
  })
    try {
        await DB.createDocument(DB_ID, COLLECTION_COMMENTS, ID.unique(), {
          video: $generalStore.selectedPost.$id,
          text: comment.value,
          user: authStore.user.$id
        })
        // await renderComments()
        comment.value = null
        document.getElementById('Comments').scroll({ top:0, behavior:'smooth' });
    } catch (error) {
        console.log(error)
    }
}

// const deleteComment = async (video, commentId) => {
//     let res = confirm('Are you sure you want to delete this comment?')
//     try {
//         if (res) {
//             await $userStore.deleteComment(video, commentId)
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }
const isLiked = computed(() => {
    let res = $generalStore.selectedPost.users_like.find(like => like.$id === authStore.user.$id)
    if (res) {
        return true
    }
    return false
})

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
          v-if="$generalStore.selectedPost"
          ref="videoElement"
          loop
          muted
          class="h-screen mx-auto w-full"
          :src="$generalStore.selectedPost.src"
        />
      </div>
    </div>

    <div
      id="InfoSection"
      v-if="$generalStore.selectedPost"
      class="lg:max-w-[550px] relative w-full h-full bg-white"
    >

            <div class="py-7" />

            <div class="flex items-center justify-between px-8">
                <div class="flex items-center">
                    <NuxtLink :href="`/profile/${$generalStore.selectedPost.user.id}`">
                        <img
                            class="rounded-full lg:mx-0 mx-auto"
                            width="40"
                            :src="$generalStore.selectedPost.user.avatar_url"
                        >
                    </NuxtLink>
                    <div class="ml-3 pt-0.5">
                        <div class="text-[17px] font-semibold">
                            {{ $generalStore.allLowerCaseNoCaps($generalStore.selectedPost.user.name) }}
                        </div>
                        <div class="text-[13px] -mt-5 font-light">
                            {{ $generalStore.selectedPost.user.name }}
                            <span class="relative -top-[2px] text-[30px] pr-0.5 ">.</span>
                            <span class="font-medium">{{formattedDate }}</span>
                        </div>
                    </div>
                </div>

                <Icon
                    v-if="$userStore.id === $generalStore.selectedPost.user.id"
                    @click="deletePost()"
                    class="cursor-pointer"
                    name="material-symbols:delete-outline-sharp"
                    size="25"
                />
            </div>

            <div class="px-8 mt-4 text-sm">{{ $generalStore.selectedPost.title }}</div>

            <div class="px-8 mt-4 text-sm font-bold">
                <Icon name="mdi:music" size="17"/>
                original sound - {{ $generalStore.allLowerCaseNoCaps($generalStore.selectedPost.user.name) }}
            </div>

            <div class="flex items-center px-8 mt-8">
                <div class="pb-4 text-center flex items-center">
                    <button
                        @click="isLiked ? unlikePost() : likePost()"
                        class="rounded-full bg-gray-200 p-2 cursor-pointer"
                    >
                        <Icon
                            name="mdi:heart"
                            size="25"
                            :color="isLiked ? '#F02C56' : '#161724'"
                        />
                    </button>
                    <span class="text-xs pl-2 pr-4 text-gray-800 font-semibold">
                        {{ $generalStore.selectedPost.users_like.length }}
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
                    v-if="($generalStore.selectedPost.comments.length < 1)"
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
                        <NuxtLink :to="`/profile/${comment.user.$id}`">
                            <img
                                class="absolute top-0 rounded-full lg:mx-0 mx-auto"
                                width="40"
                                :src="comment.user.avatar_url"
                            >
                        </NuxtLink>
                        <div class="ml-14 pt-0.5 w-full">
                            <div class="text-[16px] font-semibold flex items-center justify-between">
                                {{ comment.user.name }}
                                <Icon
                                    v-if="authStore.user.$id === comment.user.$id"
                                    @click="deleteComment(comment.$id)"
                                    class="cursor-pointer"
                                    name="material-symbols:delete-outline-sharp"
                                    size="25"
                                />
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
                    :class="comment ? 'text-[#F02C56] cursor-pointer' : 'text-gray-400'"
                    class="font-semibold text-sm ml-5 pr-1"
                >
                    Post
                </button>
            </div>
        </div>
    </div>
</template>

