<template>
  <div class="relative">
    <div
      class="
        z-[2]
        absolute
        top-0
        left-0
        right-0
        bg-gradient-to-b
        from-black
        h-24
        to-[rgba(0,0,0,0)]
      "
    ></div>
    <div class="w-[calc(100%-20px)] lg:w-[calc(100%-100px)] mx-auto h-10 pt-6">
      <header
        class="
          z-[3]
          relative
          flex flex-col
          items-center
          justify-between
          w-full
          space-y-6
          sm:space-y-0 sm:flex-row
        "
      >
        <section class="flex items-center justify-end space-x-10">
          <img src="/logo.png" class="h-8" alt="Almost Netflix Logo" />

          <div class="flex space-x-6 text-zinc-200">
            <nuxt-link to="/app/movies">Movies</nuxt-link>
            <nuxt-link to="/app/my-list">My List</nuxt-link>
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
    </div>

    <div
      class="
        relative
        z-[1]
        w-full
        h-screen
        flex
        items-center
        -mt-16
        bg-gradient-to-b
        from-black
        to-[#141414]
        bg-top bg-cover
      "
      v-bind:style="{
        backgroundImage: mainMovie
          ? 'url(\'' + getSrc(mainMovie.thumbnailImageId) + '\')'
          : undefined,
      }"
    >
      <div
        v-if="mainMovie"
        class="
          relative
          z-[3]
          w-[calc(100%-20px)]
          lg:w-[calc(100%-100px)]
          mx-auto
        "
      >
        <div>
          <h1
            class="max-w-3xl pb-6 text-5xl font-semibold text-center text-white  sm:text-left"
          >
            {{ mainMovie.name }}
          </h1>
          <p
            class="max-w-3xl pb-6 text-3xl font-light text-center text-white  sm:text-left"
          >
            {{ mainMovie.description }}
          </p>

          <div
            class="flex flex-col items-center space-y-3  sm:space-y-0 sm:flex-row sm:space-x-3"
          >
            <button
              @click="OPEN_MODAL(mainMovie)"
              type="button"
              class="
                px-4
                py-4
                font-bold
                text-[#141414]
                flex
                items-center
                justify-center
                space-x-3
                bg-white
                rounded-md
                text-xl
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>

              <span>More info</span>
            </button>

            <button
              class="flex items-center justify-center px-4 py-4 space-x-3 text-xl font-bold text-white transition duration-300 bg-opacity-75 rounded-md  bg-zinc-700 hover:bg-opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>

              <span>Add to My List</span>
            </button>
          </div>
        </div>
      </div>

      <div class="z-[1] absolute inset-0 bg-black opacity-[60%]"></div>

      <div
        class="
          z-[2]
          absolute
          left-0
          bottom-0
          w-full
          h-20
          bg-gradient-to-b
          from-transparent
          to-[#141414]
        "
      ></div>
    </div>

    <div class="-mt-[250px] relative z-[3]">
      <div class="py-12">
        <div class="w-[calc(100%-20px)] lg:w-[calc(100%-100px)] mx-auto mt-6">
          <Nuxt />
        </div>
      </div>
    </div>

    <footer class="py-12 text-white bg-black">
      <div
        class="
          flex flex-col
          md:flex-row
          space-y-6
          md:space-y-0 md:space-x-6
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
          Almost netflix - Netflix Clone for education purposes using
          <a
            class="text-white hover:underline"
            href="https://www.themoviedb.org/"
            >TMDB</a
          >
          data
        </p>
        <p class="text-center md:text-right">
          Check out original
          <a class="text-white hover:underline" href="https://www.netflix.com/"
            >Netflix.com</a
          >
        </p>
      </div>
    </footer>

    <transition class="transition-fade" name="fade">
      <div
        @click="CLOSE_MODAL()"
        v-if="openedMovie"
        class="fixed inset-0 bg-black bg-opacity-50 z-[10]"
      ></div>
    </transition>

    <transition class="transition-scale" name="scale">
      <div
        @click="CLOSE_MODAL()"
        v-if="openedMovie"
        class="
          fixed
          left-0
          top-0
          w-full
          min-h-screen
          h-[fit-content]
          overflow-y-auto
          z-[11]
        "
      >
        <div class="w-full mx-auto mt-8 max-w-7xl" v-on:click.stop="() => {}">
          <MovieModal :movie="openedMovie" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AppwriteMovie, AppwriteService } from '~/services/appwrite'
import { mapMutations, mapState } from 'vuex'

export default Vue.extend({
  data: () => {
    return {
      profilePhoto: null as URL | null,
      mainMovie: null as null | AppwriteMovie,
    }
  },
  computed: {
    ...mapState('modal', ['openedMovie']),
  },
  async mounted() {
    const bodyElement = document.querySelector('body')
    bodyElement?.classList.add('bg-[#141414]')

    this.profilePhoto = await AppwriteService.getProfilePhoto()
    this.mainMovie = await AppwriteService.getMainMovie()
  },
  methods: {
    ...mapMutations('modal', ['OPEN_MODAL', 'CLOSE_MODAL']),
    getSrc(imageId: string) {
      return AppwriteService.getMainThumbnail(imageId)
    },
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

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.transition-fade {
  opacity: 1;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s;
}
.scale-enter,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

.transition-scale {
  opacity: 1;
  transform: scale(1);
}
</style>