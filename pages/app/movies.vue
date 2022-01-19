<template>
  <div>
    <div class="flex flex-col space-y-20">
      <movie-list
        v-for="category in categories"
        :key="category.title"
        :category="category"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AppwriteMovieCategories } from '~/services/appwrite'

export default Vue.extend({
  middleware: 'only-authenticated',
  layout: 'app',

  data: () => {
    return {
      categories: AppwriteMovieCategories,
    }
  },
  async mounted() {},
})
</script>