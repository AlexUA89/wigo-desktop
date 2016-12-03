<template>
  <div class="map" v-map>
    <div v-for="status in statuses" v-status="status"></div>  
  </div>
</template>

<script>
  import map from '../services/map';

  const mapDirective = {
    inserted(el) {
      map.init(el);
    },
  };

  const statusDirective = {
    inserted(el, binding) {
      map.addStatus(binding.value);
    },
  };

  export default {
    props: ['statuses'],
    data() {
      return {};
    },
    directives: {
      map: mapDirective,
      status: statusDirective,
    },
  };
</script>

<style scoped>
  .map {
    width: 100%;
    height: 100%;
  }
</style>
