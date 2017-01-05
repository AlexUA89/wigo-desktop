<template>
  <div id="myCarousel" class="carousel slide" data-ride="carousel">
    <!-- Wrapper for slides -->
    <div class="carousel-inner" role="listbox">
      <div v-for="(image, index) in images" class="item" v-bind:class="{ active: !index }">
        <img :src="image" class="img-responsive center-block">
      </div>
    </div>

    <!-- Left and right controls -->
    <a v-if="images.length > 1" class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
      <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a v-if="images.length > 1" class="right carousel-control" href="#myCarousel" role="button" data-slide="next">
      <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
</template>

<script>
  export default {
    props: ['images'],
  };
</script>

<style scoped>
  .item img {
    max-width:100%;
    max-height: 200px;
    height:auto;
  }
</style>