<template>
   
    <NuxtPage />

    <AuthOverlay v-if="isLoginOpen" />
    <EditProfileOverlay v-if="isEditProfileOpen" />
</template>

<script setup>
import { storeToRefs } from 'pinia';
const { $generalStore } = useNuxtApp()
const { isLoginOpen, isEditProfileOpen } = storeToRefs($generalStore)


onMounted(async () => {
    $generalStore.bodySwitch(false) 
    isLoginOpen.value = false
    isEditProfileOpen.value = false
})

watch(() => isLoginOpen.value, (val) => $generalStore.bodySwitch(val) )
watch(() => isEditProfileOpen.value, (val) => $generalStore.bodySwitch(val) )

import {useAuthStore, useIsLoadingStore} from '~/stores/auth.store'
import { useVideoStore } from './stores/videos.store';
import { supabase } from './services/supabase';
import { getItemById, getItems } from './services/database';

const authStore = useAuthStore()
const isLoadingStore = useIsLoadingStore()
const videoStore = useVideoStore()


const getSession = async () => {
   try {
      isLoadingStore.set(true)

      supabase.auth.onAuthStateChange((_, session) => {
      
      if(session && session.user) {
         authStore.set(session.user)
         authStore.user.status = true
         getUser()
      } else {
         console.log('user not found');
      }
   })
   } catch (error) {
      throw error
   }
}
const getUser = async () => {
   try {
      const response = await getItemById('users', authStore.user.id)
      if (response && response.length > 0) {
        authStore.user.name = response[0].name
        authStore.user.bio = response[0].bio
        authStore.user.avatar_url = response[0].avatar
        authStore.user.videos = response[0].videos
      } else {
        console.warn('No user found with the specified id')
      }
   } catch (error) {
      console.error('Error in getUser function:', error)
   }
}

onMounted(async () => {
   await getSession()
   await videoStore.getVideos()
})

</script>
