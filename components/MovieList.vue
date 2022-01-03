<template>
  <div>
    <h1 class="text-4xl text-zinc-200">{{ category.title }}</h1>

    <div
      class="relative grid grid-cols-2 gap-4 mt-6  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <Movie
        :isPaginationEnabled="true"
        :onPageChange="onPageChange"
        :moviesLength="movies.length"
        :isLoading="isLoading"
        :isCursorAllowed="isCursorAllowed"
        class="col-span-1"
        :key="movie.$id"
        :appwrite-id="movie.$id"
        :movie="movie"
        :index="index"
        v-for="(movie, index) in movies"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { mapActions, mapState } from 'vuex'
import { AppwriteMovie, AppwriteService } from '~/services/appwrite'

export default Vue.extend({
  props: ['category'],

  watch: {
    lastManualChangeTimestamp() {
      if (this.category.collectionName === 'watchlists') {
        this.reloadPage()
      }
    },
  },

  computed: {
    ...mapState('myList', ['lastManualChangeTimestamp']),
  },

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
      perPage = 6
    }

    return {
      perPage,
      isLoading: true,
      isBeforeAllowed: false,
      isAfterAllowed: true,
      movies: [] as AppwriteMovie[],

      lastCursor: undefined as undefined | string,
      lastDirection: undefined as undefined | 'before' | 'after',
    }
  },

  methods: {
    ...mapActions('myList', ['LOAD_FAVOURITE']),
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

    async reloadPage() {
      // Show spinners instead of arrows
      this.isLoading = true

      // Fetch new list of movies using direction and last document ID
      const newMovies = await AppwriteService.getMovies(
        this.perPage,
        this.$props.category,
        this.lastDirection,
        this.lastCursor
      )

      this.movies = newMovies.documents

      // Fetch status if movie is on My List or not
      await this.LOAD_FAVOURITE(newMovies.documents.map((d) => d.$id))

      // Hide spinners, show arrows again
      this.isLoading = false
    },

    async onPageChange(direction: 'before' | 'after') {
      // Show spinners instead of arrows
      this.isLoading = true

      // Use relation ID if provided
      const lastRelationId =
        direction === 'before'
          ? this.movies[0].relationId
          : this.movies[this.movies.length - 1].relationId

      // Depending on direction, get ID of last document we have
      let lastId = lastRelationId
        ? lastRelationId
        : direction === 'before'
        ? this.movies[0].$id
        : this.movies[this.movies.length - 1].$id

      // Fetch new list of movies using direction and last document ID
      const newMovies = await AppwriteService.getMovies(
        this.perPage,
        this.$props.category,
        direction,
        lastId
      )

      // Fetch status if movie is on My List or not
      await this.LOAD_FAVOURITE(newMovies.documents.map((d) => d.$id))

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

      // Store cursor and direction if I ever need to refresh the current page
      this.lastDirection = direction
      this.lastCursor = lastId

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

    // Fetch status if movie is on My List or not
    await this.LOAD_FAVOURITE(data.documents.map((d) => d.$id))

    // Store fetched data into component variables
    this.movies = data.documents
    this.isLoading = false
    this.isAfterAllowed = data.hasNext
  },
})
</script>