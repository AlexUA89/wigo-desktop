<template>
  <div>
    <input class="search" type="text" placeholder="Search.." v-model="searchQuery">
    <button type="button" class="btn btn-default" v-on:click="search">
      <i class="fa fa-search" aria-hidden="true"></i>
    </button>
  </div>
</template>

<script>
  export default {
    data() {
      console.log('Search initialized');
      return {
        searchQuery: '',
      };
    },
    methods: {
      search() {
        this.$emit('search', this.searchQuery);
      },
    },
  };
</script>

<style scoped>
  .search {
    padding: 10px;
    border: none;
    border-bottom: solid 2px #c9c9c9;
    transition: border 0.3s;
    width:250px;
  }
  .search:focus,
  .search.focus {
    border-bottom: solid 2px #969696;
  }
</style>