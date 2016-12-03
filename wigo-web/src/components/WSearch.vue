<template>
  <div>
    <input class="search" type="text" placeholder="Search.."/>
    <button type="button" class="btn btn-default">
      <i class="fa fa-search" aria-hidden="true"></i>
    </button>
  </div>
</template>

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