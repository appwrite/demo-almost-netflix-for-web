<template>
  <div class="text-white bg-[#181818] rounded-lg">
    <div class="p-8">
      <div>
        <div class="flex items-center justify-between w-full">
          <button
            @click="CLOSE_FILTER_MODAL()"
            type="button"
            class="
              flex
              items-center
              justify-center
              w-10
              h-10
              text-white
              bg-[#181818]
              border-2 border-white
              rounded-full
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            @click="
              () => {
                CLOSE_FILTER_MODAL()
                CLOSE_MODAL()
              }
            "
            type="button"
            class="
              text-white
              flex
              items-center
              justify-center
              rounded-full
              bg-[#181818]
              border-2 border-white
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
        </div>
        <h1 class="py-4 text-4xl font-semibold text-center">{{ value }}</h1>

        <div
          class="relative grid grid-cols-2 gap-10 mt-6  sm:grid-cols-2 lg:grid-cols-3"
        >
          <Movie
            :isPaginationEnabled="false"
            class="col-span-1"
            :key="movie.$id"
            :appwrite-id="movie.$id"
            :movie="movie"
            v-for="movie in movies"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  AppwriteCategory,
  AppwriteMovie,
  AppwriteService,
  Query,
} from '~/services/appwrite'
import { mapMutations, mapActions } from 'vuex'

export default Vue.extend({
  props: {
    type: {
      required: true,
      type: String, // cast, genres, tags
    },
    value: {
      required: true,
      type: String,
    },
  },

  data() {
    const category: AppwriteCategory = {
      title: '',
      queries: [Query.search(this.type, this.value)],
      orderAttributes: ['trendingIndex'],
      orderTypes: ['DESC'],
    }

    return {
      movies: [] as AppwriteMovie[],
      category,
    }
  },

  async created() {
    document.addEventListener('keyup', (e) => {
      if (e.key == 'Escape') {
        if (this.type) {
          this.CLOSE_FILTER_MODAL()
        }
      }
    })

    const data = await AppwriteService.getMovies(12, this.category)
    await this.LOAD_FAVOURITE([data.documents.map((d) => d.$id)])
    this.movies = data.documents
  },

  methods: {
    ...mapActions('myList', ['LOAD_FAVOURITE']),
    ...mapMutations('modal', ['CLOSE_FILTER_MODAL', 'CLOSE_MODAL']),
  },
})
</script>