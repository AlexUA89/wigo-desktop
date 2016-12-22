<template>

  <div class="main" v-if="status">
    <!-- short version -->
    <div class="main-image">
      <img :src="getMainImage(status)"/>
    </div>
    <div class="header">
      <img class="category-image" :src="getStatusIcon(status)"/>
      <div class="status-name"><strong>{{ status.name }}</strong></div>
    </div>
    <div class="details">
      <div class="category-name">{{ status.category }}</div>
      <div class="dates">{{ getStatusDate(status) }}</div>
    </div>
    <div class="text">{{ status.text.slice(0, 450) }}...</div>
    <div class="showDetails"><button class="btn btn-success">Show details</button></div>

    <!-- modal window with details -->
    <w-modal v-if="showModal">
      <h4 class="categories-select-modal" slot="header">Categories</h4>
    </w-modal>
  </div>

</template>

<script>
  /* global moment */
  import backend from '../services/backend';

  const defaultImage = require('../assets/logo.png');

  export default {
    props: ['status', 'loading'],
    methods: {
      getStatusIcon: backend.getStatusIcon,
      getStatusDate(status) {
        const format = 'MMM Do HH:mm';
        const start = moment(status.startDate).format(format);
        const end = moment(status.endDate).format(format);
        return `${start} - ${end}`;
      },
      getMainImage(status) {
        return status.images[0] || defaultImage;
      },
    },
  };
</script>

<style scoped>
  .main, .header, .main-image, .text, .details, .showDetails {
    width: 100%;
  }
  .header {
    height: 40px;
    background: #d6d6d6;
    display:flex;
    align-items:center;
    justify-content:center;
    padding-left: 5px;
    padding-right: 5px;
  }
  .main-image {
    height: 200px;
    background: white;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .main-image img {
    max-width:100%;
    max-height: 200px;
    height:auto;
  }
  .category-image {
    float: left;
  }
  .status-name {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .details {
    height: 20px;
    padding-left: 5px;
    padding-right: 5px;
    background: #b7b7b7;
  }
  .category-name {
    float: left;
    font-style: italic;
  }
  .dates {
    float: right;
  }
  .text {
    padding-left: 5px;
    padding-right: 5px;
    height: calc(100vh - 390px);
    background: white;
    overflow-y: auto;
    text-align: justify;
  }
  .showDetails {
    background: white;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
