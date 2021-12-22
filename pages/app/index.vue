<template></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  middleware: [
    function ({ redirect }) {
      redirect('/app/movies')
    },
  ],
})
</script>