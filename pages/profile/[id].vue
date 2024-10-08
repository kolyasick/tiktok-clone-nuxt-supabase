<template>
	<NuxtLayout>
		<div
			class="pt-[90px] 2xl:pl-[185px] lg:pl-[160px] lg:pr-0 pr-2 w-[calc(100%-90px)] max-w-[1800px] 2xl:mx-auto">
			<div class="flex w-full items-center">
				<NuxtImg
					format="webp"
					class="rounded-full w-[150px] max-[450px]:w-[90px] max-[450px]:h-[90px]"
					:src="user?.avatar" />
				<div class="ml-5 w-full">
					<div class="text-[30px] font-bold truncate">
						{{ user?.name }}
					</div>
					<div class="text-[18px] truncate">{{ user?.name }}</div>
					<button
						v-if="route.params.id == $authStore.user?.id"
						@click="$generalStore.isEditProfileOpen = true"
						class="flex item-center rounded-sm py-1.5 px-3.5 mt-3 text-[15px] font-semibold bg-[#3a3a3a] hover:bg-[#303030]">
						<Icon class="mt-0.5 mr-1" name="mdi:pencil" size="18" />
						<div>Edit profile</div>
					</button>

					<button
						v-else
						class="flex item-center rounded-md py-1.5 px-8 mt-3 text-[15px] text-white font-semibold bg-[#F02C56]">
						Follow
					</button>
				</div>
			</div>

			<div class="flex items-center pt-4">
				<div class="mr-4">
					<span class="font-bold">10K</span>
					<span class="text-gray-500 font-light text-[15px] pl-1.5">Following</span>
				</div>
				<div class="mr-4">
					<span class="font-bold">44K</span>
					<span class="text-gray-500 font-light text-[15px] pl-1.5">Followers</span>
				</div>
				<div class="mr-4">
					<span class="font-bold">111k</span>
					<span class="text-gray-500 font-light text-[15px] pl-1.5">Likes</span>
				</div>
			</div>

			<div class="w-full flex items-center pt-4 border-b">
				<div
					class="w-60 text-center py-2 text-[17px] font-semibold border-b-2 border-b-black">
					Videos
				</div>
				<div class="w-60 text-gray-500 text-center py-2 text-[17px] font-semibold">
					<Icon name="material-symbols:lock-open" class="mb-0.5" /> Liked
				</div>
			</div>

			<div
				v-if="true"
				class="mt-4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
				<PostUser v-for="video in user?.videos" :key="video.id" :video="video" />
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup lang="ts">
import type { IUser } from "~/types/user.type"

const { $authStore, $generalStore } = useNuxtApp()
const route = useRoute()
const nuxt = useNuxtApp()
const user = ref<IUser | null>(null)
definePageMeta({
	layout: "main-layout",
})

if ($authStore.user?.id == route.params.id) {
	user.value = $authStore.user
} else {
	const { data, error } = await useFetch<IUser>(`/api/get-user/${route.params.id}`, {
		key: `profile-${route.params.id}`,
		getCachedData: (key) => {
			const data = nuxt.payload.data[key] || nuxt.static.data[key]
			return data
		},
	})
	if (error.value) {
		throw createError({
			statusCode: error.value.statusCode,
			statusMessage: error.value.statusMessage,
		})
	}

	user.value = data.value
}

useSeoMeta({
	title: `Podvodni-Tok - ${user.value?.name}'s profile`,
	ogTitle: `Podvodni-Tok - ${user.value?.name}'s profile`,
	description: `Podvodni-Tok - ${user.value?.name}'s profile`,
	ogDescription: `Podvodni-Tok - ${user.value?.name}'s profile`,
	ogImage: user.value?.avatar,
	ogImageHeight: 300,
	ogUrl: `https://podvodni-tok.com/profile/${user.value?.id}`,
})
</script>
