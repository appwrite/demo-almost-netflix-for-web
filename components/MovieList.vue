<template>
  <div>
    <h1 class="text-4xl text-zinc-200">{{ category.title }}</h1>

    <div class="grid grid-cols-7 gap-4 mt-6">
      <button
        v-for="movie in movies"
        :key="movie.$id"
        class="
          col-span-1
          rounded-md
          aspect-[1.78/1]
          w-full
          bg-gradient-to-b
          from-zinc-800
          to-black
        "
      >
        <div
          v-bind:style="{
            backgroundImage: 'url(\'' + getSrc(movie.thumbnailImageId) + '\')',
          }"
          class="w-full h-full bg-center bg-cover"
        ></div>
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
    return {
      movies: [] as AppwriteMovie[],
    }
  },

  methods: {
    getSrc(imageId: string) {
      return AppwriteService.getThumbnail(imageId)
    },
  },

  async created() {
    this.movies = await AppwriteService.getMovies(this.$props.category)
  },
})
</script>