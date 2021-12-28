<template>
  <div>
    <div
      class="
        absolute
        top-0
        left-0
        right-0
        bg-gradient-to-b
        from-black
        h-10
        to-[rgba(0,0,0,0)]
      "
    ></div>
    <div class="w-[calc(100%-20px)] lg:w-[calc(100%-100px)] mx-auto mt-6">
      <header
        class="relative flex flex-col items-center justify-between w-full space-y-6  md:space-y-0 md:flex-row"
      >
        <section class="flex items-center justify-end space-x-10">
          <img src="/logo.png" class="h-8" alt="Almost Netflix Logo" />

          <div class="flex space-x-6 text-zinc-200">
            <nuxt-link to="/app/movies">Movies</nuxt-link>
            <nuxt-link to="/app/tv-shows">TV Shows</nuxt-link>
          </div>
        </section>

        <section class="flex items-center justify-end space-x-3">
          <img
            class="w-8 h-8 rounded-md shadow-inner"
            :src="profilePhoto"
            alt="Profile"
          />

          <button
            type="button"
            @click="onLogout()"
            class="
              px-8
              py-1
              bg-[#e50914]
              border-2 border-[#e50914]
              text-white
              rounded-md
            "
          >
            Log Out
          </button>
        </section>
      </header>

      <Nuxt />
    </div>

    <footer class="py-12 text-white bg-black">
      <div
        class="
          flex flex-col
          md:flex-row
          space-y-6
          md:space-y-0
          items-center
          justify-between
          text-lg text-gray-500
          w-[calc(100%-20px)]
          lg:w-[calc(100%-100px)]
          mx-auto
          mt-6
        "
      >
        <p class="text-center md:text-left">
          Almost netflix - Netflix Clone for education purposes
        </p>
        <p class="text-center md:text-right">
          Check out original
          <a class="text-white hover:underline" href="https://www.netflix.com/"
            >Netflix.com</a
          >
        </p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AppwriteService } from '~/services/appwrite'

export default Vue.extend({
  data: () => {
    return {
      profilePhoto: null as URL | null,
    }
  },
  async mounted() {
    const bodyElement = document.querySelector('body')
    bodyElement?.classList.add('bg-[#141414]')

    this.profilePhoto = await AppwriteService.getProfilePhoto()
  },
  methods: {
    async onLogout() {
      const didLogout = await AppwriteService.logout()
      if (didLogout) {
        this.$router.push('/')
      }
    },
  },
})
</script>


<style scoped>
.nuxt-link-exact-active {
  @apply font-bold text-white;
}
</style>