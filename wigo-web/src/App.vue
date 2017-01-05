<!-- This file construct whole application together -->
<template>
  <div id="app">

    <div class="header">
      <div class="logo"><img src="./assets/logo.png"/></div>
      <div class="filters">
        <w-filters v-on:fts="executeFTS" 
                   v-on:daterange="executeDaterangeSearch"
                   v-on:categories="executeCategoriesSearch">
        </w-search>
      </div>
    </div>
    
    <w-login></w-login>

<!--     <div class="map" v-bind:class="{shortened: selectedStatus}">
      <w-map :statuses="statuses" 
             :loading="loading"
             :selected="selectedStatus"
             v-on:statusSelected="showSelectedStatus">
      </w-map>
    </div> -->
    
    <div class="selected-status" v-show="selectedStatus">
       <w-status :status="selectedStatus"></w-status>
    </div>
  </div>
</template>

<script>
  import backend from './services/backend';
  import WMap from './components/WMap';
  import WStatus from './components/WStatus';
  import WFilters from './components/WFilters';
  import WLogin from './components/WLogin';
  import utils from './utils';

  export default {
    name: 'app',
    data() {
      this.statuses = [];
      this.loading = true;
      this.selectedStatus = null;
      const queryString = utils.getQueryString();
      if (Object.prototype.hasOwnProperty.call(queryString, 'id')) this.showSelectedStatus({ id: queryString.id });
      backend.getStatuses().then(response => this.updateStatuses(response.body));
      return {
        statuses: this.statuses,
        loading: this.loading,
        selectedStatus: this.selectedStatus,
      };
    },
    components: {
      'w-map': WMap,
      'w-status': WStatus,
      'w-filters': WFilters,
      'w-login': WLogin,
    },
    methods: {
      executeFTS(ftsQuery) {
        this.loading = true;
        backend.search(ftsQuery).then(response => this.updateStatuses(response.body));
      },
      executeDaterangeSearch(startDate, endDate) {
        this.loading = true;
        backend.setDaterange(startDate, endDate).then(response => this.updateStatuses(response.body));
      },
      executeCategoriesSearch(categories) {
        this.loading = true;
        const names = [];
        categories.forEach(category => names.push(category.name.toUpperCase()));
        backend.setCategories(names).then(response => this.updateStatuses(response.body));
      },
      updateStatuses(newStatuses) {
        this.loading = false;
        this.statuses = newStatuses;
      },
      showSelectedStatus(status) {
        utils.addToCurrentLocation('id', status.id);
        backend.getStatusDetails(status.id).then(response => (this.selectedStatus = response.body));
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
    height: calc(100vh - 60px);
    float: left;
  }
  .map.shortened {
    width: calc(100% - 350px);
  }
  .selected-status {
    width: 350px;
    height: calc(100vh - 50px);
    float: right;
  }
</style>
