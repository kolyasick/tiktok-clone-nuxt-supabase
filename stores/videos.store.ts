import { defineStore } from 'pinia'
import { DB } from '@/utils/appwrite'
import { COLLECTION_VIDEOS, DB_ID } from '~~/app.constants';
import { useAuthStore } from './auth.store';
import { Query } from 'appwrite';

interface IAuthStore {
    $id: string,
    email: string,
    name: string,
    status: boolean,
    bio: string,
    avatar_url: string
}

interface IVideo {
    $id: string,
    title: string,
    description: string,
    likes: number,
    src: string,
    $createdAt: string,
    user: IAuthStore,
    users_like: string[],
    is_liked: boolean,
    comments: string[]
}

interface IVideoStoreState {
    videos: IVideo[],
    page: number,
    perPage: number
}

const defaultValue: IVideoStoreState = {
    videos: [],
    page: 1,
    perPage: 1 // Количество видео, загружаемых за один запрос
}

export const useVideoStore = defineStore('videos', {
    state: () => ({
        videos: defaultValue.videos,
        page: defaultValue.page,
        perPage: defaultValue.perPage,
        user: useAuthStore().user
    }),
    actions: {
        async getVideos() {
            try {
                const { page, perPage } = this;
                const offset = (page - 1) * perPage;
                const response = await DB.listDocuments(DB_ID, COLLECTION_VIDEOS, [
                    Query.limit(perPage),
                    Query.offset(offset)
                ]);
                
                const newVideos = response.documents.map((file: any) => ({
                    $id: file.$id,
                    title: file.title,
                    description: file.description,
                    likes: file.likes,
                    src: file.src,
                    $createdAt: file.$createdAt,
                    user: file.user,
                    users_like: file.users_like,
                    is_liked: file.users_like.some((like: { $id: string }) => like.$id === this.user.$id),
                    comments: file.comments
                }));
                
                this.videos = [...this.videos, ...newVideos];
                this.page += 1;
                
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        }
    },
})
