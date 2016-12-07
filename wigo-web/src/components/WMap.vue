<template>
  <div class="map" v-map="statuses"></div>
</template>

<script>
  import map from '../services/map';

  const mapDirective = {
    inserted(el) {
      map.init(el);
    },
    componentUpdated(el, binding) {
      map.clearAllStatuses();
      for (let i = 0; i < binding.value.length; i += 1) { map.addStatus(binding.value[i]); }
    },
  };

  export default {
    props: ['statuses'],
    directives: {
      map: mapDirective,
    },
  };
</script>

<style scoped>
  .map {
    width: 100%;
    height: 100%;
  }
</style>
