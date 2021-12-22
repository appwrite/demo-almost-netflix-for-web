<template>
  <div class="flex flex-col my-20 space-y-20">
    <movie-list
      v-for="category in categories"
      :key="category.title"
      :category="category"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  AppwriteMovie,
  AppwriteService,
  AppwriteMovieCategories,
} from '~/services/appwrite'

export default Vue.extend({
  middleware: 'only-authentificated',
  layout: 'app',

  data: () => {
    return {
      categories: AppwriteMovieCategories,
      profilePhoto: null as any,
      movies: [] as AppwriteMovie[],
    }
  },
  async mounted() {},
})
</script>