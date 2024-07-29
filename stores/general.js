import { defineStore } from 'pinia'
import { useUserStore } from './user'
import axios from 'axios'



export const useGeneralStore = defineStore('general', {
  state: () => ({
    isLoginOpen: false,
    isEditProfileOpen: false,
    selectedPost: null,
    ids: null,
    isBackUrl: "/",
    posts: null,
    suggested: null,
    following: null,
  }),
  actions: {
    bodySwitch(val) {
      if (val) {
        document.body.style.overflow = 'hidden'
        return
      }
      document.body.style.overflow = 'visible'
    },

    allLowerCaseNoCaps(str) {
      return str.split(' ').join('').toLowerCase()
    },

    setBackUrl(url) {
        this.isBackUrl = url
    },

  },
  persist: true,
})