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
    <div class="show-details">
      <button class="btn btn-success" @click="openModal(status)">Show details</button>
      <button class="btn btn-default" @click="close">close</button>
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
          <div class="modal-dates">{{ getStatusDate(status) }}</div>
          <div class="status-modal-description-text">
            {{ status.text }}
          </div>
        </div>
        <div class="modal-chat">
          <div v-if="statusComments.length" id="messages" class="messages">
            <div v-for="comment in statusComments" class="talkbubble">
              <strong>{{ comment.nickname }}</strong>,
              <small><i>{{ formatDatetime(comment.created) }}</i></small><br>
              <span>{{ comment.text }}</span>
            </div>
          </div>
          <div v-if="!statusComments.length" class="no-comments">No comments yet. Be first!</div>
          <div class="new-comment">
            <textarea v-model='newCommentText' @keyup.enter="comment"></textarea>
            <button class="btn btn-success" @click="comment"><i class="glyphicon glyphicon-send"></i></button>
          </div>
        </div>
      </div>
      <div slot="footer">
        <a v-bind:href="status.url" target="_blank"><button class="btn btn-primary">Event on Facebook</button></a>
        <button class="btn btn-default" @click="showModal = false">Close</button>
      </div>
    </w-modal>
  </div>

</template>

<script>
  /* global moment */
  /* global document */
  import backend from '../services/backend';
  import WModal from './WModal';
  import WImageSlider from './WImageSlider';
  import fb from '../services/fb';

  const defaultImage = require('../assets/logo.png');

  function scrollDown() {
    const element = document.getElementById('messages');
    element.scrollTop = element.scrollHeight;
  }

  export default {
    props: ['status', 'loading'],
    data() {
      this.statusComments = [];
      this.newCommentText = '';
      return {
        showModal: false,
        newCommentText: this.newCommentText,
        statusComments: this.statusComments,
        profile: fb.profile,
      };
    },
    mounted() {
      setInterval(this.pullComments, 5000);
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
        backend.getStatusComments(status).then((response) => {
          this.statusComments = response.body;
          this.$nextTick(scrollDown);
        });
      },
      formatDatetime(datetime) {
        /* global moment */
        let momentDatetime = null;
        if (datetime) {
          momentDatetime = moment(datetime);
        } else {
          momentDatetime = moment();
        }
        return momentDatetime.format('YYYY-MM-DD HH:mm');
      },
      postComment(text) {
        const vm = this;
        function c() {
          backend.postStatusComment(vm.status, text, fb.profile).then((response) => {
            vm.statusComments.push({
              text,
              nickname: fb.profile.name,
              created: vm.formatDatetime(),
              id: response.body.id,
            });
          });
        }
        return c;
      },
      pullComments() {
        if (!this.showModal) { return; }
        const from = moment().utc().add(-5, 'minutes');
        const existIds = [];
        this.statusComments.forEach((comment) => { existIds.push(comment.id); });
        backend.getStatusComments(this.status, from).then((response) => {
          const comments = response.body;
          comments.forEach((comment) => {
            if (!existIds.includes(comment.id)) { this.statusComments.push(comment); }
          });
        });
      },
      comment() {
        if (!this.newCommentText) return;
        if (!fb.profile.activated) {
          fb.loginWithMessage('Please login to add a new comment.', this.postComment(this.newCommentText));
        } else {
          this.postComment(this.newCommentText)();
        }
        this.newCommentText = '';
        this.$nextTick(scrollDown);
      },
      close() {
        this.showModal = false;
        this.$emit('close');
      },
    },
    components: {
      'w-modal': WModal,
      'w-image-slider': WImageSlider,
    },
  };
</script>

<style scoped>
  .main, .header, .main-image, .text, .details, .show-details {
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
    height: calc(100vh - 370px);
    background: white;
    overflow-y: auto;
    text-align: justify;
  }
  .show-details {
    background: white;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .show-details .btn-default {
    margin-left: 10px;
  }
  .modal-body {
    width: 100%;
    height: 70vh;
  }
  .modal-image {
    margin-bottom: 5px;
  }
  .status-modal-description {
    width: calc(100% - 300px);
    height: 70vh;
    float: left;
    text-align: justify;
  }
  .status-modal-description-text {
    height: calc(70vh - 230px);
    overflow-y: auto;
    padding-right: 12px;
  }
  .modal-dates {
    background-color: lightgrey;
    margin-bottom: 3px;
  }
  .modal-chat {
    width: 300px;
    height: 70vh;
    float: right;
  }
  .modal-chat .messages {
    height: calc(70vh - 65px);
    overflow-y: auto;
    padding-left: 25px;
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
  .talkbubble span {
    width: 257px;
    word-wrap: break-word;
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
    padding-left: 25px;
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
