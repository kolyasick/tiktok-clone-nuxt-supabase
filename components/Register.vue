<template>
    <div class="text-center text-[28px] mb-4 font-bold">Sign up</div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Full name"
            v-model:input="name"
            inputType="text"
            :autoFocus="true"
            :error="errors && errors.name ? errors.name[0] : ''"
        />
    </div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Email address"
            v-model:input="email"
            inputType="email"
            :error="errors && errors.email ? errors.email[0] : ''"
        />
    </div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Password"
            v-model:input="password"
            inputType="password"
            :error="errors && errors.password ? errors.password[0] : ''"
        />
    </div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Confirm password"
            v-model:input="confirmPassword"
            inputType="password"
            :error="errors && errors.confirmPassword ? errors.confirmPassword[0] : ''"
        />
    </div>
    <div class="px-6 text-[12px] text-gray-600">Forgot password?</div>

    <div class="px-6 pb-2 mt-6">
        <button 
            :disabled="(!name || !email || !password || !confirmPassword)"
            :class="(!name || !email || !password || !confirmPassword) ? 'bg-gray-200' : 'bg-[#F02C56]'"
            @click="register()" 
            class="w-full text-[17px] font-semibold text-white bg-[#F02C56] py-3 rounded-sm"
        >
            Sign up
        </button>
    </div>
    <span class="px-6 text-[12px] text-gray-600" v-if="errors || successMessage">
        {{ errors || successMessage }}
    </span>
</template>

<script setup>
const { $generalStore } = useNuxtApp()
import { useVideoStore } from '~~/stores/videos.store';
import { useAuthStore, useIsLoadingStore } from '@/stores/auth.store'
import { createItem, getItemById } from '~~/services/database';
import { supabase } from '~~/services/supabase';

const videoStore = useVideoStore()
let name = ref(null)    
let email = ref(null)
let password = ref(null)
let confirmPassword = ref(null)
let errors = ref(null)
let successMessage = ref(null)

const authStore = useAuthStore()
const isLoadingStore = useIsLoadingStore()

const getUser = async () => {
   try {
      
      const response = await getItemById('users', authStore.user.id)
      if (response && response.length > 0) {
        authStore.user.name = response[0].name
        authStore.user.avatar_url = response[0].avatar
        authStore.user.videos = response[0].videos
      } else {
        console.warn('No user found with the specified id')
      }
   } catch (error) {
      console.error('Error in getUser function:', error)
   }
}

const register = async () => {
    errors.value = null;

    if (password.value !== confirmPassword.value) {
        errors.value = 'Пароли не совпадают';
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value
        });

        if (error) {
            if (error.message.includes('Email rate limit exceeded')) {
                errors.value = 'Превышен лимит попыток регистрации. Попробуйте позже.';
            } else {
                errors.value = error.message;
            }
        } else {
            await createItem('users', {
                id: data.user.id,
                name: name.value,
                email: data.user.email,
                avatar: 'https://insvrfswdpcvqeihnbup.supabase.co/storage/v1/object/public/video-storage/avatars/podv.jpg0.508262450967655',
                videos: [],
                bio: 'no bio yet'
            })
            successMessage.value = 'Registration successful';
            await getUser()
            await videoStore.getVideos()
            $generalStore.isLoginOpen = false
        }
    } catch (error) {
        console.log(error);
        errors.value = 'Произошла ошибка при регистрации. Попробуйте снова.';
    }
}


</script>