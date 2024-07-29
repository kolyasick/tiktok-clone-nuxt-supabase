import { defineStore } from 'pinia'

interface IAuthStore {
    $id: string,
    name: string,
    status: boolean,
    bio: string,
    avatar_url: string,
    videos: IVideo[]
}

interface IVideo {
    $id: string,
    title: string,
    description: string,
    src: string,
    $createdAt: string,
    user: IAuthStore
}

const defaultValue: {user: IAuthStore } = {
    user: {
        $id: '',
        name: '',
        status: false,
        bio: '',
        avatar_url: '',
        videos: []
    }
}

export const useAuthStore = defineStore('auth', {
    state: () => defaultValue,
    getters: {
        isAuth: state => state.user.status,

    },
    actions: {
        clear() {
            this.$patch(defaultValue)
        },
        set(input: IAuthStore) {
            this.$patch({user: input})
        }
    },

})

export const useIsLoadingStore = defineStore('isLoading', {
    state: () => ({
        isLoading: true
    }),
    actions: {
        set(data: boolean) {
            this.$patch({isLoading: data})
        }
    }
})
