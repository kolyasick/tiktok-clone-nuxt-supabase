<template>
    <TopNav/>
    <div 
        class="wrapper max-w-[1240px] flex justify-between mx-auto w-full"
    >
        <div>
            <SideNavMain />
        </div>
        <slot />
    </div>
</template>

<script setup>
const route = useRoute()


</script>

<style scoped>
@media(max-width: 1000px) {
    .wrapper {
        width: 100%;
        justify-content: center;
    }
}
</style>
