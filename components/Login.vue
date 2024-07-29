<template>
    <div class="text-center text-[28px] mb-4 font-bold">Log in</div>

    <div class="px-6 pb-1.5 text-[15px]">Email address</div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Email address"
            v-model:input="email"
            inputType="email"
            :autoFocus="true"
            :error="errors && errors.email ? errors.email[0] : ''"
        />
    </div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Password"
            v-model:input="password"
            inputType="password"
        />
    </div>
    <div class="px-6 text-[12px] text-gray-600">Forgot password?</div>

    <div class="px-6 pb-2 mt-6">
        <button 
            :disabled="(!email || !password)"
            :class="(!email || !password) ? 'bg-gray-200' : 'bg-[#F02C56]'"
            @click="login()" 
            class="w-full text-[17px] font-semibold text-white py-3 rounded-sm"
        >
            Log in
        </button>
    </div>
    <span class="px-6 text-[12px] text-gray-600" v-if="errors">
        {{ errors }}
    </span>
</template>

<script setup>
const { $userStore, $generalStore } = useNuxtApp()
import {account} from '../utils/appwrite'
import {useAuthStore, useIsLoadingStore} from '~/stores/auth.store.ts'
import { DB } from '@/utils/appwrite.ts'
import { COLLECTION_USERS, DB_ID } from '~~/app.constants';
import { useVideoStore } from '~~/stores/videos.store';

let email = ref(null)
let password = ref(null)
let errors = ref(null)

const authStore = useAuthStore()
const isLoadingStore = useIsLoadingStore()
const videoStore = useVideoStore()
const login = async () => {
    errors.value = null

    try {
        await account.createEmailPasswordSession(email.value, password.value)
        const response = await account.get()

        if (response) {
        const checkUser = await DB.getDocument(DB_ID, COLLECTION_USERS, response.$id)
        console.log(checkUser);

        if(checkUser) {
            authStore.set({
                $id: response.$id,
                name: checkUser.name,
                status: true,
                bio: checkUser.bio,
                avatar_url: checkUser.avatar_url,
                videos: checkUser.videos
            })
        }

        isLoadingStore.set(true)
        $generalStore.isLoginOpen = false
        await videoStore.getVideos()
        
        email.value = ''
        password.value = ''
        }
    } catch (error) {
        console.log(error);
        errors.value = error
    }
}


</script>