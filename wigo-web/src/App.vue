<!-- This file construct whole application together -->
<template>
  <div id="app">
    <div class="header">
      <div class="logo"><img src="./assets/logo-small.png"/></div>
      <div class="filters">
        <input class="search" type="text" placeholder="Search..">
      </div>
    </div>
    <div class="map"><w-map :statuses="statuses"></w-map></div>
  </div>
</template>

<script>
  import backend from './services/backend';
  import WMap from './components/WMap';
  import WStatus from './components/WStatus';

  export default {
    name: 'app',
    data() {
      const vm = this;
      function success(response) { vm.statuses = response.body; }
      backend.getStatuses.then(success);
      return {
        statuses: vm.statuses,
      };
    },
    components: {
      'w-map': WMap,
      'w-status': WStatus,
    },
  };
</script>

<style scoped>
  .header {
    width:100%;
    background: white;
    height: 50px;
  }
  .logo {
    width: 250px;
    float: left;
  }
  .logo img {
    height: 50px;
    margin-left: 20px;
  }
  .filters {
    height: 50px;
    width: calc(100% - 250px);
  }
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
  .map {
    width: 100%;
    height: calc(100vh - 50px);
  }
</style>
