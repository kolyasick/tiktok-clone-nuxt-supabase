import { defineStore } from "pinia"
import type { IVideo } from "~/types/user.type"

interface IGeneralState {
    isLoginOpen: boolean
    isEditProfileOpen: boolean
    selectedPost: IVideo | null
    isBackUrl: string
    posts: any
} 

export const useGeneralStore = defineStore("general", {
	state: () => ({
		isLoginOpen: false,
		isEditProfileOpen: false,
		selectedPost: {} as IVideo,
		isBackUrl: "/",
		posts: null,
	}) as IGeneralState,
	actions: {
		bodySwitch(val: boolean) {
			if (val) {
				document.body.style.overflow = "hidden"
				return
			}
			document.body.style.overflow = "visible"
		},

		allLowerCaseNoCaps(str: string) {
			return str.split(" ").join("").toLowerCase()
		},

		setBackUrl(url: string) {
			this.isBackUrl = url
		},
	},
})
