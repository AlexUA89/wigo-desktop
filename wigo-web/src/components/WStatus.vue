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
    <div class="showDetails">
      <button class="btn btn-success" @click="openModal(status)">Show details</button>
    </div>

    <!-- modal window with details -->
    <w-modal v-if="showModal">
      <h4 slot="header">
        <img :src="getStatusIcon(status)"/><i>{{ status.category }}:</i>&nbsp;&nbsp;{{ status.name }}
      </h4>
      <div class="modal-body" slot="body">
        <div class="status-modal-description">
          <div class="modal-image">
            <w-image-slider :images="getStatusImages(status)"></w-image-slider>
          </div>
          <hr/>
          <div class="status-modal-description-text">
            {{ status.text }}
          </div>
        </div>
        <div class="modal-chat">
          <div v-for="comment in statusComments" class="talkbubble">
            <strong>{{ comment.nickname }}</strong>,&nbsp;&nbsp;<small><i>{{ comment.created }}</i></small><br>
            {{ comment.text }}
          </div>
          <div v-if="!statusComments.length" class="no-comments">No comments yet. Be first!</div>
          <div class="new-comment">
            <textarea></textarea>
            <button class="btn btn-success">S</button>
          </div>
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-primary">Event on Facebook</button>
        <button class="btn btn-default" @click="showModal = false">Close</button>
      </div>
    </w-modal>
  </div>

</template>

<script>
  /* global moment */
  import backend from '../services/backend';
  import WModal from './WModal';
  import WImageSlider from './WImageSlider';

  const defaultImage = require('../assets/logo.png');

  export default {
    props: ['status', 'loading'],
    data() {
      this.statusComments = [];
      return {
        showModal: false,
        statusComments: this.statusComments,
      };
    },
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
      getStatusImages(status) {
        if (status.images.length) return status.images;
        return [defaultImage];
      },
      openModal(status) {
        this.showModal = true;
        backend.getStatusComments(status).then(response => (this.statusComments = response.body));
      },
    },
    components: {
      'w-modal': WModal,
      'w-image-slider': WImageSlider,
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
  .modal-body {
    width: 100%;
    height: 70vh;
  }
  .status-modal-description {
    width: calc(100% - 300px);
    height: 70vh;
    float: left;
    text-align: justify;
  }
  .status-modal-description-text {
    height: calc(70vh - 250px);
    overflow-y: auto;
    padding-right: 12px;
  }
  .modal-chat {
    width: 300px;
    height: 70vh;
    float: right;
    padding-left: 25px;
    overflow-y: auto;
  }
  .talkbubble {
    position: relative;
    width: 257px;
    padding: 10px;
    border-radius: 5px;
    border: solid lightblue;
    background: lightblue;
    margin-bottom: 10px;
  }
  .talkbubble:before {
    content:"";
    position: absolute;
    right: 100%;
    width: 0;
    height: 0;
    
    border-top: 13px solid transparent;
    border-right: 13px solid lightblue;
    border-bottom: 13px solid transparent;
  }
  .talkbubble-my:before {
    content:"";
    position: absolute;
    left: 100%;
    width: 0;
    height: 0;
    
    border-top: 13px solid transparent;
    border-left: 13px solid lightblue;
    border-bottom: 13px solid transparent;
  }
  .no-comments { 
    text-align: center;
  }
  .new-comment {
    position: absolute;
    bottom: 0;
  }
  .new-comment textarea {
    float: left;
    width: 235px;
    height: 3em;
    resize: none;
    overflow-y: hidden;
    border: none;
    border-bottom: solid 2px #c9c9c9;
    border-top: solid 2px #c9c9c9;
    transition: border 0.3s;
  }
  .new-comment textarea:focus {
    border-bottom: solid 2px #969696;
    border-top: solid 2px #969696;
  }
  .new-comment button {
    float: right;
    height: 3em;
    width: 3em;
    margin-left: 5px;
  } 
</style>
