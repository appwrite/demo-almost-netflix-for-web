<template>
  <div class="text-white bg-[#181818] rounded-lg">
    <div
      class="
        relative
        w-full
        aspect-video
        bg-gradient-to-b
        from-black
        to-[#141414]
      "
    >
      <img
        :src="getSrc(movie.thumbnailImageId)"
        alt="Cover"
        class="object-cover object-top w-full h-full rounded-t-lg"
      />

      <div
        class="
          z-[2]
          absolute
          left-0
          bottom-0
          w-full
          h-10
          bg-gradient-to-b
          from-transparent
          to-[#181818]
        "
      ></div>

      <button
        @click="CLOSE_MODAL()"
        type="button"
        class="
          text-white
          absolute
          top-4
          flex
          items-center
          justify-center
          right-4
          rounded-full
          bg-[#181818]
          w-10
          h-10
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div class="absolute left-4 bottom-14">
        <button
          type="button"
          class="
            px-2
            py-2
            font-bold
            text-[#141414]
            flex
            items-center
            justify-center
            space-x-2
            bg-white
            hover:!bg-[rgba(255,255,255,0.8)]
            transition-all
            duration-300
            rounded-md
            text-lg
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
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

    <div class="p-8">
      <div class="grid grid-cols-12 gap-y-6 md:gap-y-0 md:gap-x-6">
        <div class="col-span-12 md:col-span-8">
          <div class="flex items-center justify-start space-x-2">
            <p class="font-semibold text-green-500">96% Match</p>

            <p>{{ getVerboseDate(movie.releaseDate) }}</p>
            <div class="px-3 py-1 text-sm border border-gray-500 rounded-md">
              {{ movie.ageRestriction === 'AR13' ? '13+' : '18+' }}
            </div>
            <p>{{ getVerboseDuration(movie.durationMinutes) }}</p>
            <div class="px-3 py-1 text-sm border border-gray-500 rounded-md">
              Full-HD
            </div>
          </div>

          <h1 class="py-4 mt-4 text-4xl font-semibold">
            {{ movie.name }}
          </h1>

          <p class="mt-6 text-lg">{{ movie.description }}</p>
        </div>
        <div class="flex flex-col col-span-12 space-y-4 text-sm md:col-span-4">
          <p class="text-zinc-600">
            Cast:
            <button
              type="button"
              v-for="(cast, castIndex) in movie.cast.split(', ')"
              :key="cast"
              class="text-white hover:underline"
            >
              {{
                castIndex >= movie.cast.split(', ').length - 1
                  ? cast
                  : cast + ',&nbsp;'
              }}
            </button>
          </p>
          <p class="text-zinc-600">
            Genres:
            <button
              type="button"
              v-for="(genre, genreIndex) in movie.genres.split(', ')"
              :key="genre"
              class="text-white hover:underline"
            >
              {{
                genreIndex >= movie.genres.split(', ').length - 1
                  ? genre
                  : genre + ',&nbsp;'
              }}
            </button>
          </p>
          <p class="text-zinc-600">
            This show is:
            <button
              type="button"
              v-for="(tag, tagIndex) in movie.tags.split(', ')"
              :key="tag"
              class="text-white hover:underline"
            >
              {{
                tagIndex >= movie.tags.split(', ').length - 1
                  ? capitalizeString(tag)
                  : capitalizeString(tag) + ',&nbsp;'
              }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AppwriteMovie, AppwriteService } from '~/services/appwrite'
import { mapMutations } from 'vuex'

export default Vue.extend({
  props: {
    movie: {
      required: true,
      type: Object as () => AppwriteMovie,
    },
  },
  methods: {
    ...mapMutations('modal', ['CLOSE_MODAL']),
    capitalizeString(text: string) {
      const capitalized = text.charAt(0).toUpperCase() + text.slice(1)
      return capitalized
    },
    getSrc(imageId: string) {
      return AppwriteService.getMainThumbnail(imageId)
    },
    getVerboseDate(unix: number) {
      const date = new Date(unix * 1000)
      return date.getFullYear()
    },
    getVerboseDuration(duration: number) {
      if (duration > 60) {
        const hours = Math.floor(duration / 60)
        const minutes = duration - 60 * hours

        if (minutes === 0) {
          return `${hours}h`
        } else {
          return `${hours}h ${minutes}m`
        }
      } else {
        return `${duration}m`
      }
    },
  },
  created() {
    document.addEventListener('keyup', (e) => {
      if (e.key == 'Escape') {
        if (this.movie) {
          this.CLOSE_MODAL()
        }
      }
    })
  },
})
</script>