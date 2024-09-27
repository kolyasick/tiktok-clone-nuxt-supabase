<template>
	<NuxtPage />

	<AuthOverlay v-if="$generalStore.isLoginOpen" />
	<!-- <EditProfileOverlay v-if="true" /> -->
</template>

<script setup lang="ts">
const { $generalStore, $authStore, $videosStore } = useNuxtApp()

$authStore.getUser()
$videosStore.getVideos()
</script>

<style>
body {
	@apply bg-[#121212];
	@apply text-[#ffffff]
}
</style>