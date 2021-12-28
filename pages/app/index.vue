<template></template>

<script lang="ts">
import Vue from 'vue'

// Dummy component, simply redirects. Used for better route naming conventions
export default Vue.extend({
  middleware: [
    function ({ redirect }) {
      redirect('/app/movies')
    },
  ],
})
</script>