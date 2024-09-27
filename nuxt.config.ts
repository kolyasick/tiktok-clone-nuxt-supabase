// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: { enabled: false },
	modules: ["@nuxtjs/supabase", "@pinia/nuxt", "@nuxtjs/tailwindcss", "@nuxt/icon", "@nuxt/image"],
	image: {
		dir: "assets/images"
	},
	supabase: {
		redirect: false,
	},
	pages: true,
})
