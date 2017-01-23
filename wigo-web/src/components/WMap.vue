<template>
  <div class="w-container">
    <div class="loader" v-show="loading"><img src="../assets/map-loading.gif"/></div>
    <div class="loader map"><img src="../assets/map-loading.gif"/></div>
    <div class="map" v-map="{ statuses: statuses, selected: selected, callback: clickCallback }"></div>
    <div class="add-button" v-if="!loading" @click="startAddition">
      <img src="../assets/add-button.png" title="Add my event"/>
    </div>

    <!-- modal window with new status -->
    <w-modal v-if="showModal">
      <h4 slot="header">New Event</h4>
      <div class="modal-body" slot="body">
        <div class="category-select">
          <div v-for="category in categories"
               @click="selectCategory(category)"
               v-bind:class="{ active: category.isSelected }">
               <img class="category-select-image" :src="category.icon"/><br>{{ category.label }}
          </div>
        </div>
        <div class="name-and-date">
          What?&nbsp;&nbsp;
          <input class="name" type="text" placeholder="My awesome event" v-model="newStatus.name"/>
          &nbsp;&nbsp;&nbsp;When?&nbsp;&nbsp;
          <input class="date" type="text" name="datefilter">
        </div>
        <div class="description">
          <textarea placeholder="Tell me more about event ..." v-model="newStatus.text"></textarea>
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-success" @click="createNewStatus">Create</button>
        <button class="btn btn-default" @click="showModal = false">Cancel</button>
      </div>
    </w-modal>
  </div>
</template>

<script>
  /* global google */
  /* global $ */
  /* global moment */
  import map from '../services/map';
  import fb from '../services/fb';
  import backend from '../services/backend';
  import WModal from './WModal';

  const mapDirective = {
    inserted(el, binding) {
      map.init(el, binding.value.callback);
    },
    componentUpdated(el, binding) {
      map.clearAllStatuses();
      binding.value.statuses.forEach(status => map.addStatus(status));
      if (binding.value.selected !== null) { map.setCenter(binding.value.selected); }
    },
  };

  const dateFormat = 'MM/DD/YYYY';
  const daterangeConfig = {
    ranges: {
      Today: [moment().format(dateFormat), moment().format(dateFormat)],
      Tomorrow: [moment().add(1, 'days').format(dateFormat), moment().add(1, 'days').format(dateFormat)],
      'This weekend': [
        moment().endOf('isoWeek').add(-1, 'days').format(dateFormat),
        moment().endOf('isoWeek').format(dateFormat),
      ],
    },
    alwaysShowCalendars: true,
    startDate: moment().format(dateFormat),
    endDate: moment().format(dateFormat),
    minDate: moment().format(dateFormat),
    maxDate: moment().add(3, 'months').format(dateFormat),
    opens: 'left',
    autoApply: true,
  };


  export default {
    props: ['statuses', 'loading', 'selected'],
    data() {
      return {
        adding: false,
        showModal: false,
        icons: backend.icons,
        newStatus: {},
        categories: [
          { name: 'chat', icon: backend.icons.chat, label: 'Chat', isSelected: false },
          { name: 'celebration', icon: backend.icons.celebration, label: 'Celebration', isSelected: false },
          { name: 'activity', icon: backend.icons.activity, label: 'Activity', isSelected: false },
          { name: 'shopping', icon: backend.icons.shopping, label: 'Shopping', isSelected: false },
          { name: 'other', icon: backend.icons.other, label: 'Other', isSelected: false },
        ],
      };
    },
    directives: {
      map: mapDirective,
    },
    components: {
      'w-modal': WModal,
    },
    methods: {
      selectStatus(status) {
        this.$emit('statusSelected', status);
      },
      enableAdditionMode() {
        $.notify('Click on the map to select place for a new event.', {
          globalPosition: 'top left',
          className: 'info',
        });
        this.adding = true;
        map.enableAddition();
      },
      disableAdditionMode() {
        this.adding = false;
        map.disableAddition();
      },
      startAddition() {
        if (!fb.profile.activated) {
          fb.loginWithMessage('Please login to add a new event.', this.enableAdditionMode);
        } else {
          this.enableAdditionMode();
        }
      },
      setNewStatusDates(start, end) {
        this.newStatus.start = start;
        this.newStatus.end = end;
      },
      clickCallback(lat, long) {
        this.newStatus = { start: moment(), end: moment() };
        this.deselectCategories();
        this.newStatus.latitude = lat;
        this.newStatus.longitude = long;
        this.showModal = true;
        this.$nextTick(() => {
          $('.date').daterangepicker(daterangeConfig, this.setNewStatusDates);
        });
      },
      selectCategory(category) {
        this.newStatus.category = category.name;
        this.deselectCategories();
        category.isSelected = true;
      },
      deselectCategories() {
        /* eslint no-param-reassign: ["error", { "props": false }] */
        this.categories.forEach((category) => { category.isSelected = false; });
      },
      createNewStatus() {
        this.newStatus.startDate = this.newStatus.start.startOf('day').add(-2, 'hours').format('YYYY-MM-DDTHH:mm:ss[Z]');
        this.newStatus.endDate = this.newStatus.end.endOf('day').add(-2, 'hours').format('YYYY-MM-DDTHH:mm:ss[Z]');
        if (!this.newStatus.name) {
          $.notify('Please define what is your event about.', {
            globalPosition: 'top left',
            className: 'error',
          });
          return;
        }
        if (!this.newStatus.category) {
          $.notify('Please define your event type.', {
            globalPosition: 'top left',
            className: 'error',
          });
          return;
        }
        backend.postStatus(this.newStatus, fb.profile).then((response) => {
          this.newStatus.id = response.body;
          this.statuses.push(this.newStatus);
          this.$emit('statusSelected', this.newStatus);
          map.setCenter(this.newStatus);
          this.newStatus = {};
          this.showModal = false;
        }, () => {
          $.notify('Something went wrong. Please contact developers.', {
            globalPosition: 'top left',
            className: 'error',
          });
        });
      },
    },
    mounted() {
      this.$nextTick(() => {
        map.setClickCallback(this.selectStatus);
      });
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
  .loader.map {
    z-index: -1;
  }
  .add-button {
    position: absolute;
    left: 50px;
    bottom: 50px;
    z-index: 2;
    cursor: pointer;
  }
  .modal-body {
    height: 400px;
  }
  .category-select {
    height: 100px;
  }
  .category-select div {
    width: 150px;
    height: 100px;
    float: left;
    border: solid 2px #c9c9c9;
    margin-left: 8px;
    margin-right: 8px;
    cursor: pointer;
    text-align: center;
  }
  .category-select div:hover {
    border: solid 2px #969696;
  }
  .category-select div.active {
    background: #e9e9e9;
  }
  .category-select-image {
    padding-top: 20px;
  }
  .name-and-date, .description {
    margin-top: 25px;
    margin-left: 8px;
    margin-right: 8px;
    width: 100%;
  }
  .name-and-date input {
    border: none;
    border-bottom: solid 2px #c9c9c9;
    transition: border 0.3s;
  }
  .name-and-date .name {
    width: 520px;
  }
  .description textarea {
    width: 820px;
    height: 200px;
    border: none;
    border-bottom: solid 2px #c9c9c9;
    border-top: solid 2px #c9c9c9;
    transition: border 0.3s;
  }
</style>
