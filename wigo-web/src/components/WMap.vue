<template>
  <div class="w-container">
    <div class="loader" v-show="loading"><img src="../assets/map-loading.gif"/></div>
    <div class="map" v-map="{ statuses: statuses, selected: selected }"></div>
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
      binding.value.statuses.forEach(status => map.addStatus(status));
      if (binding.value.selected !== null) { map.setCenter(binding.value.selected); }
    },
  };

  export default {
    props: ['statuses', 'loading', 'selected'],
    directives: {
      map: mapDirective,
    },
    methods: {
      selectStatus(status) {
        this.$emit('statusSelected', status);
      },
    },
    mounted() {
      this.$nextTick(() => map.setClickCallback(this.selectStatus));
    },
  };
</script>

<style scoped>
  .map, .loader, .w-container {
    width: 100%;
    height: 100%;
  }
  .loader {
    height: calc(100% - 70px);  /* hack, should be corrected */
    background-color: rgba(200, 200, 200, .5);
    position: absolute;
    display:flex;
    align-items:center;
    justify-content:center;
    z-index: 1;
  }
</style>
