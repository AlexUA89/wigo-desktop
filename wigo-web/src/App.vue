<!-- This file construct whole application together -->
<template>
  <div id="app">
    <div class="header">
      <div class="logo"><img src="./assets/logo-small.png"/></div>
      <div class="filters">
        <w-search v-on:search="executeSearch"></w-search>
      </div>
    </div>
    <div class="map"><w-map :statuses="statuses"></w-map></div>
  </div>
</template>

<script>
  import backend from './services/backend';
  import WMap from './components/WMap';
  import WStatus from './components/WStatus';
  import WSearch from './components/WSearch';

  export default {
    name: 'app',
    data() {
      this.statuses = [];
      backend.getStatuses().then(response => this.updateStatuses(response.body));
      return {
        statuses: this.statuses,
        message: '',
      };
    },
    components: {
      'w-map': WMap,
      'w-status': WStatus,
      'w-search': WSearch,
    },
    methods: {
      executeSearch(searchQuery) {
        console.log(`${searchQuery} - execuring search`);
        backend.searchStatuses(searchQuery).then(response => this.updateStatuses(response.body));
      },
      updateStatuses(newStatuses) {
        this.statuses = newStatuses;
      },
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
  .map {
    width: 100%;
    height: calc(100vh - 50px);
  }
</style>
