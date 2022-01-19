<template>
  <div class="w-screen h-screen bg-black bg-center bg-cover bg-image">
    <div class="w-screen h-screen bg-black/50">
      <div class="w-[calc(100%-20px)] lg:w-[calc(100%-100px)] mx-auto">
        <div class="flex justify-center lg:justify-start">
          <img src="/logo.png" class="w-40 pt-6" alt="Almost Netflix Logo" />
        </div>

        <div class="flex items-start justify-center mt-12">
          <form
            @submit.prevent="onLogin()"
            class="
              w-full
              max-w-md
              p-8
              bg-black
              rounded-md
              sm:p-16
              bg-opacity-80
            "
          >
            <h1 class="text-3xl font-bold text-white">Sign In</h1>

            <div class="flex flex-col my-6 space-y-4">
              <input
                required="required"
                v-model="email"
                class="
                  rounded-md
                  w-full
                  bg-[#333333]
                  placeholder-[#8b8b8b]
                  focus:outline-none focus:ring
                  ring-zinc-500
                  text-white
                  p-4
                "
                type="email"
                placeholder="Email address"
              />

              <input
                required="required"
                v-model="pass"
                class="
                  rounded-md
                  w-full
                  bg-[#333333]
                  placeholder-[#8b8b8b]
                  focus:outline-none focus:ring
                  ring-zinc-500
                  text-white
                  p-4
                "
                type="password"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              class="
                mt-4
                rounded-md
                w-full
                font-bold
                py-4
                px-4
                bg-[#e50914]
                text-white
                flex
                items-center
                justify-center
              "
            >
              <span v-if="!isLoading">Sign In</span>
              <svg
                v-if="isLoading"
                class="w-6 h-6 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </button>

            <div class="mt-12">
              <p class="text-zinc-500">
                New to Almost Netflix?
                <nuxt-link to="/register" class="text-white hover:underline"
                  >Sign up now</nuxt-link
                >.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AppwriteService } from '~/services/appwrite'

export default Vue.extend({
  middleware: 'only-unauthenticated',

  data: () => {
    return {
      email: '',
      pass: '',
      isLoading: false,
    }
  },
  methods: {
    async onLogin() {
      this.isLoading = true

      try {
        await AppwriteService.login(this.email, this.pass)
        this.$router.push('/app')
      } catch (err: any) {
        alert(err.message)
      }

      this.isLoading = false
    },
  },
})
</script>

<style>
.bg-image {
  background-image: url('/bg.png');
}
</style>