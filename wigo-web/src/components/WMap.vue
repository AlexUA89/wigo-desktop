<template>
  <div class="w-container">
    <div class="loader" v-show="loading"><img src="../assets/map-loading.gif"/></div>
    <div class="map" v-map="statuses"></div>
  </div>
</template>

<script>
  import map from '../services/map';

  const mapDirective = {
    inserted(el) {
      map.init(el);
    },
    componentUpdated(el, binding) {
      map.clearAllStatuses();
      binding.value.forEach(status => map.addStatus(status));
    },
  };

  export default {
    props: ['statuses', 'loading'],
    directives: {
      map: mapDirective,
    },
  };
</script>

<style scoped>
  .map, .loader, .w-container {
    width: 100%;
    height: 100%;
  }
  .loader {
    height: calc(100% - 50px);  /* hack, should be corrected */
    background-color: rgba(200, 200, 200, .5);
    position: absolute;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .loader {
    z-index: 1;
  }
</style>
