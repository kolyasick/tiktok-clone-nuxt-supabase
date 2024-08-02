<template>
    <div class="text-center text-[28px] mb-4 font-bold">Sign up</div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Full name"
            v-model:input="name"
            inputType="text"
            :autoFocus="true"
            :error="errors && errors.name ? errors.name[0] : ''"
        />
    </div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Email address"
            v-model:input="email"
            inputType="email"
            :error="errors && errors.email ? errors.email[0] : ''"
        />
    </div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Password"
            v-model:input="password"
            inputType="password"
            :error="errors && errors.password ? errors.password[0] : ''"
        />
    </div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Confirm password"
            v-model:input="confirmPassword"
            inputType="password"
            :error="errors && errors.confirmPassword ? errors.confirmPassword[0] : ''"
        />
    </div>
    <div class="px-6 text-[12px] text-gray-600">Forgot password?</div>

    <div class="px-6 pb-2 mt-6">
        <button 
            :disabled="(!name || !email || !password || !confirmPassword)"
            :class="(!name || !email || !password || !confirmPassword) ? 'bg-gray-200' : 'bg-[#F02C56]'"
            @click="register()" 
            class="w-full text-[17px] font-semibold text-white bg-[#F02C56] py-3 rounded-sm"
        >
            Sign up
        </button>
    </div>
    <span class="px-6 text-[12px] text-gray-600" v-if="errors">
        {{ errors }}
    </span>
</template>

<script setup>
import { DB } from '@/utils/appwrite.ts'
import { COLLECTION_USERS, DB_ID } from '~~/app.constants';
const { $generalStore } = useNuxtApp()
import { useAuthStore, useIsLoadingStore } from '@/stores/auth.store'
import { supabase } from '~~/services/supabase';

let name = ref(null)    
let email = ref(null)
let password = ref(null)
let confirmPassword = ref(null)
let errors = ref(null)

const authStore = useAuthStore()
const isLoadingStore = useIsLoadingStore()

const login = async () => {
    errors.value = null

    try {
        await account.createEmailPasswordSession(email.value, password.value)
        const response = await account.get()

        if (response) {
            await createUser(response)
            
            isLoadingStore.set(true)
            authStore.set({
                email: response.email,
                name: response.name,
                status: response.status
            })
            email.value = ''
            password.value = ''
            $generalStore.isLoginOpen = false
        }
    } catch (error) {
        console.log(error);
        errors.value = error
    }
}

// const createUser = async (user) => {
//     console.log('creating...', user);
//     try {
//         const response = await supabase.auth.signUp({
//             email: user.email,
//             password: user.password
//         })
//         console.log(response);
//         // if (response) {
//         //         authStore.set({
//         //         email: user.email,
//         //         name: user.name,
//         //         status: user.status
//         //     })
//         // }
//     } catch (error) {
//         console.log(error);
//     }
// }

const register = async () => {
    errors.value = null;

    if (password.value !== confirmPassword.value) {
        errors.value = 'Пароли не совпадают';
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value
        });

        if (error) {
            if (error.message.includes('Email rate limit exceeded')) {
                errors.value = 'Превышен лимит попыток регистрации. Попробуйте позже.';
            } else {
                errors.value = error.message;
            }
        } else {
            // Успешная регистрация, отправлено подтверждение на почту
            successMessage.value = 'Регистрация прошла успешно. Проверьте свою почту для подтверждения аккаунта.';
        }
    } catch (error) {
        console.log(error);
        errors.value = 'Произошла ошибка при регистрации. Попробуйте снова.';
    }
}


</script>