import { defineStore } from 'pinia'



export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: {
            id: null,
            status: false,
            name: '',
            email: '',
            avatar_url: '',
            videos: []
        }
    }),
    getters: {
        isAuth: state => state.user.status,

    },
    actions: {
        clear() {
            this.$patch(defaultValue)
        },
        set(input) {
            this.$patch({user: input})
        }
    },

})

export const useIsLoadingStore = defineStore('isLoading', {
    state: () => ({
        isLoading: true
    }),
    actions: {
        set(data) {
            this.$patch({isLoading: data})
        }
    }
})
