<template>    

    <UploadError :errorType="errors"/>

    <div 
        v-if="loading"
        class="fixed flex items-center justify-center top-0 left-0 w-full h-screen bg-black z-50 bg-opacity-50"
    >
        <Icon class="animate-spin ml-1" name="mingcute:loading-line" size="100" color="#FFFFFF"/>
    </div>

    <UploadLayout>
        <div class="w-full mt-[80px] mb-[40px] bg-white shadow-lg rounded-md py-6 md:px-10 px-4">
            <div>
                <div class="text-[23px] font-semibold">Upload video</div>
                <div class="text-gray-400 mt-1">Post a video to your account</div>
            </div>

            <div class="mt-8 md:flex gap-6">

                <label 
                    v-if="!fileDisplay"
                    for="fileInput"
                    @drop.prevent="onDrop" 
                    @dragover.prevent=""
                    class="
                        md:mx-0
                        mx-auto
                        mt-4
                        mb-6
                        flex 
                        flex-col 
                        items-center 
                        justify-center 
                        w-full 
                        max-w-[260px] 
                        h-[470px] 
                        text-center 
                        p-3 
                        border-2 
                        border-dashed 
                        border-gray-300 
                        rounded-lg 
                        hover:bg-gray-100 
                        cursor-pointer
                    "
                >
                    <Icon name="majesticons:cloud-upload" size="40" color="#b3b3b1"/>
                    <div class="mt-4 text-[17px]">Select video to upload</div>
                    <div class="mt-1.5 text-gray-500 text-[13px]">Or drag and drop a file</div>
                    <div class="mt-12 text-gray-400 text-sm">MP4</div>
                    <div class="mt-2 text-gray-400 text-[13px]">Up to 1 minute</div>
                    <div class="mt-2 text-gray-400 text-[13px]">Less than 50 MB</div>
                    <div class="px-2 py-1.5 mt-8 text-white text-[15px] w-[80%] bg-[#F02C56] rounded-sm">
                        Select file
                    </div>
                    <input 
                        ref="file" 
                        type="file" 
                        id="fileInput"
                        @input="onChange" 
                        hidden 
                        accept=".mp4" 
                    />
                </label>

                <div
                    v-else
                    class="
                        md:mx-0
                        mx-auto
                        mt-4
                        md:mb-12
                        mb-16
                        flex 
                        items-center 
                        justify-center 
                        w-full 
                        max-w-[260px] 
                        h-[540px] 
                        p-3 
                        rounded-2xl
                        cursor-pointer
                        relative
                    "
                >
                    <div class="bg-black h-full w-full" />
                    <img 
                        class="absolute z-20 pointer-events-none" 
                        src="~/assets/images/mobile-case.png"
                    >
                    <img 
                        class="absolute right-4 bottom-6 z-20" 
                        width="90" 
                        src="~/assets/images/tiktok-logo-white.png"
                    >
                    <video 
                        autoplay
                        loop
                        muted
                        class="absolute rounded-xl object-cover z-10 p-[13px] w-full h-full" 
                        :src="fileDisplay" 
                    />

                    <div class="absolute -bottom-12 flex items-center justify-between z-50 rounded-xl border w-full p-2 border-gray-300">
                        <div class="flex items-center truncate">
                            <Icon name="clarity:success-standard-line" size="16" class="min-w-[16px]"/>
                            <div class="text-[11px] pl-1 truncate text-ellipsis">{{fileName}}</div>
                        </div>
                        <button @click="clearVideo" class="text-[11px] ml-2 font-semibold">
                            Change
                        </button>
                    </div>
                </div>

                <div class="mt-4 mb-6">
                    <div class="flex bg-[#F8F8F8] py-4 px-6">
                        <div>
                            <Icon class="mr-4" size="20" name="mdi:box-cutter-off"/>
                        </div>
                        <div>
                            <div class="text-semibold text-[15px] mb-1.5">Divide videos and edit</div>
                            <div class="text-semibold text-[13px] text-gray-400">
                                You can quickly divide videos into multiple parts, remove redundant parts and turn landscape videos into portrait videos
                            </div>
                        </div>
                        <div class="flex justify-end max-w-[130px] w-full h-full text-center my-auto">
                            <button class="px-8 py-1.5 text-white text-[15px] bg-[#F02C56] rounded-sm">
                                Edit
                            </button>
                        </div>
                    </div>

                    <div class="mt-5">
                        <div class="flex items-center justify-between">
                            <div class="mb-1 text-[15px]">Title</div>
                            <div class="text-gray-400 text-[12px]">{{ caption.length }}/150</div>
                        </div>
                        <input 
                            v-model="caption"
                            maxlength="150"
                            type="text"
                            class="
                                w-full
                                border
                                p-2.5
                                rounded-md
                                focus:outline-none
                            "
                        >
                    </div>

                    <div class="flex gap-3">
                        <button 
                            @click="discard()"
                            class="px-10 py-2.5 mt-8 border text-[16px] hover:bg-gray-100 rounded-sm"
                        >
                            Discard
                        </button>
                        <button 
                            @click="createPost()"
                            class="px-10 py-2.5 mt-8 border text-[16px] text-white bg-[#F02C56] rounded-sm"
                        >
                            Post
                        </button>
                    </div>

                    <div v-if="errors" class="mt-4">
                        <div class="text-red-600" v-if="errors && errors.video">
                            {{ errors.video }}
                        </div>
                        <div class="text-red-600" v-if="errors && errors.text">
                            {{ errors.text }}
                        </div>
                    </div>
                    <div v-if="succes" class="mt-4">
                        <div class="text-green-600" >
                            {{ succes }}
                        </div>
                    </div>
                    <div v-if="loading" class="mt-4">
                        <div >
                            loading...
                        </div>
                    </div>

                </div>

            </div>
        </div>
        <div>
    </div>
    </UploadLayout>
   
</template>

<script setup>
import UploadLayout from '~/layouts/UploadLayout.vue';
import { createItem, updateItem, uploadVideo } from '~~/services/database';

import { useAuthStore } from '~~/stores/auth.store';
import { useVideoStore } from '~~/stores/videos.store';


const caption = ref('')
const fileDisplay = ref('')
const errors = ref(null)
const succes = ref(null)
const fileName = ref(null)
const fileToUpload = ref(null)
const loading = ref(false)
const authStore = useAuthStore()
const videoStore = useVideoStore()

const formatDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

const onChange = async (event) => {
    fileToUpload.value = event.target.files[0]

    if(fileToUpload.value.size > 50 * 1024 * 1024) {
        errors.value = {
            video: 'File size should be less than 50MB'
        }
        return
    }
    const file = event.target.files[0]
    fileName.value = file.name
    fileDisplay.value = URL.createObjectURL(file)
}

const clearVideo = () => {
    fileDisplay.value = null
    fileName.value = null
}

const createPost = async () => {
    errors.value = null
    succes.value = null
    if (!fileToUpload.value) {
        errors.value = {
            video: 'Please upload a video'
        }
        return
    }
    if (!caption.value) {
        errors.value = {
            text: 'Please add a caption'
        }
        return
    }

    try {
        loading.value = true
        const response = await uploadVideo(fileToUpload.value)
        const videoUrl = `https://insvrfswdpcvqeihnbup.supabase.co/storage/v1/object/public/${response.fullPath}`

        let videoToUpload = {
            title: caption.value,
            descr: formatDate(),
            video: videoUrl,
            likes: [],
            comments: [],
            user_id: authStore.user.id,
            user: {
                name: authStore.user.name,
                avatar: authStore.user.avatar_url
            }
        }

        await createItem('videos', {
            ...videoToUpload
        })
        fileDisplay.value = null
        caption.value = ''
        fileName.value = null

        if(response) {
            succes.value = 'Post created successfully'

            authStore.user.videos.push(videoToUpload)
            await updateItem('users', authStore.user.id, {
                videos: [
                    ...authStore.user.videos
                ]
            })

            await videoStore.getVideos()
        } else {
            errors.value = 'Something went wrong'
        }

        
    } catch(e) {
        console.log(e);
    } finally {
        loading.value = false
    }

}

const discard = () => {
    fileDisplay.value = null
    caption.value = ''
    fileName.value = null
}

    
</script>
