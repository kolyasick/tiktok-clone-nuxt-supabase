import { defineStore } from 'pinia';
import { useAuthStore } from './auth.store';
import { supabase } from '~~/services/supabase';


export const useVideoStore = defineStore('videos', {
    state: () => ({
        videos: [],
        user: useAuthStore().user
    }),
    actions: {
        async getVideos() {
            try {
                const {data} = await supabase.from('videos').select('*')
                this.videos = data.map((video) => ({
                    ...video,
                    liked: video.likes.includes(this.user.id),
                }))
                
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        }
    },
})
