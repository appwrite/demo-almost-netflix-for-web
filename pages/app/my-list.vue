<template>
  <div>
    <div>
      <movie-list :category="category" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AppwriteCategory } from '../../services/appwrite'

export default Vue.extend({
  middleware: 'only-authentificated',
  layout: 'app',
  data() {
    const category: AppwriteCategory = {
      collectionName: 'watchlists',
      title: 'Movies in My List',
      queries: [],
      orderAttributes: [],
      orderTypes: [],
    }

    return {
      category,
    }
  },
})
</script>