<template>
    <NuxtPage />

    <AuthOverlay v-if="isLoginOpen" />
    <EditProfileOverlay v-if="isEditProfileOpen" />
</template>

<script setup>
import { storeToRefs } from 'pinia';
const { $userStore, $generalStore } = useNuxtApp()
const { isLoginOpen, isEditProfileOpen } = storeToRefs($generalStore)
import { DB } from '@/utils/appwrite.ts'
import { COLLECTION_USERS, DB_ID } from '~~/app.constants';

onMounted(async () => {
    $generalStore.bodySwitch(false) 
    isLoginOpen.value = false
    isEditProfileOpen.value = false
})

watch(() => isLoginOpen.value, (val) => $generalStore.bodySwitch(val) )
watch(() => isEditProfileOpen.value, (val) => $generalStore.bodySwitch(val) )

import {useAuthStore, useIsLoadingStore} from '~/stores/auth.store.ts'
import { useVideoStore } from './stores/videos.store';

const authStore = useAuthStore()
const isLoadingStore = useIsLoadingStore()
const videoStore = useVideoStore()

onMounted(async () => {
   

   try {
     const user = await account.get()
    
     if (user) {
        const response = await DB.getDocument(DB_ID, COLLECTION_USERS, user.$id)
        
        authStore.set(response)
        authStore.user.status = true
     } else {
        authStore.user.status = false
     }
   } catch(error) {
        console.log(error);
   } finally {
        isLoadingStore.set(false)
   }
   
   await videoStore.getVideos()
})
</script>
