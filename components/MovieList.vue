<template>
  <div>
    <h1 class="text-4xl text-zinc-200">{{ category.title }}</h1>

    <div
      class="relative grid grid-cols-2 gap-4 mt-6  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7"
    >
      <button
        v-for="(movie, index) in movies"
        :key="movie.$id"
        :appwrite-id="movie.$id"
        class="
          z-[3]
          hover:z-[4]
          relative
          col-span-1
          rounded-md
          aspect-[1.78/1]
          w-full
        "
      >
        <div
          class="absolute w-full transform -translate-x-1/2 -translate-y-1/2  left-1/2 right-1/2"
        >
          <div
            class="relative block rounded-lg  bg-gradient-to-b from-zinc-800 to-black"
          >
            <div
              @click="onPageChange(index === 0 ? 'before' : 'after')"
              v-if="
                (index === 0 || index === movies.length - 1) &&
                isCursorAllowed(index)
              "
              v-bind:class="
                index === 0
                  ? 'left-0 bg-gradient-to-r'
                  : 'right-0 bg-gradient-to-l'
              "
              class="
                flex
                z-[5]
                group
                duration-500
                transition-all
                group-hover:to-[rgba(0,0,0,0.5)]
                absolute
                -top-[1px]
                h-[calc(100%+2px)]
                w-[50px]
                hover:w-[80px]
                items-center
                justify-end
                pr-3
                text-white
                from-black
                to-transparent
              "
            >
              <div
                v-bind:class="index === 0 ? 'rotate-180' : 'rotate-0'"
                class="transition-all duration-500 transform  group-hover:scale-150"
              >
                <svg
                  v-if="isLoading"
                  class="w-4 h-4 mr-1 animate-spin"
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

                <svg
                  v-if="!isLoading"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            <div class="relative group">
              <img
                :src="getSrc(movie.thumbnailImageId)"
                class="
                  object-cover object-top
                  w-full
                  aspect-[1.78/1]
                  group-hover:aspect-[500/800]
                  transition-all
                  duration-500
                  rounded-none
                  group-hover:rounded-lg
                  shadow-none
                  group-hover:shadow-lg
                "
                alt="Cover"
              />

              <div class="absolute bottom-4 left-4 right-4">
                <button
                  class="
                    px-2
                    py-2
                    font-bold
                    text-[#141414]
                    flex
                    items-center
                    justify-center
                    space-x-2
                    bg-[rgba(255,255,255,0.5)]
                    group-hover:bg-white
                    hover:!bg-[rgba(255,255,255,0.8)]
                    transition-all
                    duration-300
                    rounded-md
                    text-sm
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <span class="hidden group-hover:block">Add to My List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AppwriteMovie, AppwriteService } from '~/services/appwrite'

export default Vue.extend({
  props: ['category'],

  data: () => {
    const width = window.innerWidth
    let perPage: number

    if (width < 640) {
      perPage = 2
    } else if (width < 768) {
      perPage = 3
    } else if (width < 1024) {
      perPage = 4
    } else if (width < 1280) {
      perPage = 5
    } else {
      perPage = 7
    }

    return {
      perPage,
      isLoading: true,
      isBeforeAllowed: false,
      isAfterAllowed: true,
      movies: [] as AppwriteMovie[],
    }
  },

  methods: {
    isCursorAllowed(index: number) {
      // Simply use variables we fill duging fetching data from API
      // Depending on index (direction) we want to return different variables
      if (index === 0) {
        return this.isBeforeAllowed
      }

      if (index === this.movies.length - 1) {
        return this.isAfterAllowed
      }
    },
    getSrc(imageId: string) {
      // Just a middleware since we cant directly talk to service from HTML
      return AppwriteService.getThumbnail(imageId)
    },
    async onPageChange(direction: 'before' | 'after') {
      // Show spinners instead of arrows
      this.isLoading = true

      // Depending on direction, get ID of last document we have
      const lastId =
        direction === 'before'
          ? this.movies[0].$id
          : this.movies[this.movies.length - 1].$id

      // Fetch new list of movies using direction and last document ID
      const newMovies = await AppwriteService.getMovies(
        this.perPage,
        this.$props.category,
        direction,
        lastId
      )

      // Now lets figure out if we have previous and next page...
      // Let's start with saying we have them both, then we will set it to false if we are sure there isnt any
      // By setting default to true, we never hide it when we shouldnt.. Worst case scenario, we show it when we shoulding, resulsing in you seing the arrow, but taking no effect and then dissapearing
      this.isBeforeAllowed = true
      this.isAfterAllowed = true

      // If we dont get any documents, it means we got to edge-case when we thought there is next/previous page, but there isnt
      if (newMovies.documents.length === 0) {
        // Depending on direction, set that arrow to disabled
        if (direction === 'before') {
          this.isBeforeAllowed = false
        } else {
          this.isAfterAllowed = false
        }
      } else {
        // If we got some documents, store them to component variable and keep both arrows enabled
        this.movies = newMovies.documents
      }

      // If our Appwrite service says there isn' next page, then...
      if (!newMovies.hasNext) {
        // Depnding on direction, set that specific direction to disabled
        if (direction === 'before') {
          this.isBeforeAllowed = false
        } else {
          this.isAfterAllowed = false
        }
      }

      // This system is not fully perfect, because if dataset changes while we are watching specific page, we have arrow even tho there isnt next page. Thats why we have edge-case check earlier

      // This solution also fails if document with ID we use as cursor is removed.
      // TODO: Implement fallback to next document ID in list, if first one fails. If all fails, WHAT THE HELL.

      // Hide spinners, show arrows again
      this.isLoading = false
    },
  },

  async created() {
    // When component loads, fetch movie list with defaults for pagination (no cursor)
    const data = await AppwriteService.getMovies(
      this.perPage,
      this.$props.category
    )

    // Store fetched data into component variables
    this.movies = data.documents
    this.isLoading = false
    this.isAfterAllowed = data.hasNext
  },
})
</script>