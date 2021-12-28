<template>
  <div class="w-screen h-screen bg-black bg-center bg-cover bg-image">
    <div class="w-screen h-screen bg-black/50">
      <div class="w-[calc(100%-20px)] lg:w-[calc(100%-100px)] mx-auto">
        <div class="flex justify-center lg:justify-start">
          <img src="/logo.png" class="w-40 pt-6" alt="Almost Netflix Logo" />
        </div>

        <div class="container mx-auto">
          <div
            class="flex flex-col items-center justify-center mt-12 space-y-4 text-center "
          >
            <h1 class="text-[100px] font-bold text-white">Almost Netflix</h1>
            <p class="text-4xl text-zinc-100">Almost the best Netflix clone.</p>
          </div>

          <div
            class="flex flex-col w-full max-w-md mx-auto mt-10 space-y-3  sm:flex-row sm:space-y-0 sm:space-x-3"
          >
            <nuxt-link to="/login" class="w-full"
              ><button
                type="button"
                class="
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

    <a
      href="https://appwrite.io/"
      target="_blank"
      style="position: fixed; right: 18px; bottom: 18px; z-index: 999"
    >
      <img
        style="width: 130px"
        src="https://appwrite.io/images-ee/press/badge-pink-box.svg"
        alt="Built with Appwrite"
      />
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  middleware: 'only-unauthentificated',
})
</script>
