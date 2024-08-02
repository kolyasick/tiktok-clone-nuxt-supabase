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
    <span class="px-6 text-[14px] text-red-600" v-if="errors">
        {{ errors }}
    </span>
</template>

<script setup>

const {$generalStore } = useNuxtApp()
import {useAuthStore, useIsLoadingStore} from '~/stores/auth.store'
import { supabase } from '~~/services/supabase';
import { getItemById } from '~~/services/database';

let email = ref(null)
let password = ref(null)
let errors = ref(null)

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

const login = async () => {
    errors.value = null
    isLoadingStore.set(true)

    const {data, error} = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
    })

    if (error) {
        isLoadingStore.set(false)
        errors.value = error.message
    } else {
        await getUser()
        authStore.user.status = true
        isLoadingStore.set(false)
        $generalStore.isLoginOpen = false
    }

}


</script>