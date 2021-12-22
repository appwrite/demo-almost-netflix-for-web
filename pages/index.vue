<template>
  <div class="w-screen h-screen bg-black bg-center bg-cover bg-image">
    <div class="w-screen h-screen bg-black/50">
      <div class="w-[calc(100%-20px)] lg:w-[calc(100%-200px)] mx-auto">
        <div class="flex justify-center lg:justify-start">
          <img src="/logo.svg" class="w-40 pt-6" alt="Netflix Logo" />
        </div>

        <div class="container mx-auto">
          <div
            class="flex flex-col items-center justify-center mt-12 space-y-4"
          >
            <h1 class="text-[100px] font-bold text-white">Netflix!</h1>
            <p class="text-4xl text-zinc-100">but like... fake...</p>
          </div>

          <div class="flex w-full max-w-md mx-auto mt-10 space-x-3">
            <nuxt-link to="/login" class="w-full"
              ><button
                type="button"
                class="
                  mt-4
                  rounded-md
                  w-full
                  font-bold
                  py-4
                  px-4
                  text-[#e50914]
                  bg-white
                "
              >
                Sign In
              </button></nuxt-link
            >

            <nuxt-link to="/register" class="w-full"
              ><button
                type="button"
                class="
                  mt-4
                  rounded-md
                  w-full
                  font-bold
                  py-4
                  px-4
                  bg-[#e50914]
                  text-white
                "
              >
                Sign Up
              </button></nuxt-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  middleware: 'only-unauthentificated',
})
</script>
