<template>
  <div>
    <w-modal v-if="showModal">
      <h4 class="categories-select-modal" slot="header">Categories</h4>
      <div slot="body">
        <ul class="categories-list">
          <li class="categories-list-item" 
              v-for="category in categories"
              v-bind:class="{ selected: category.selected }" 
              @click="category.selected = !category.selected">
            <img :src="category.icon"/>{{ category.name }}
          </li>
        </ul>
      </div>
      <div slot="footer">
        <button class="btn btn-primary btn-left"
                @click="categories.forEach(category => category.select())">
          Select all
        </button>
        <button class="btn btn-primary btn-left"
                @click="categories.forEach(category => category.deselect())">
          Deselect all
        </button>
        <button class="btn btn-success" @click="categoriesSelected">OK</button>
      </div>
    </w-modal>
    <div class="category" @click="showModal = true">
      <span>
        <img v-for="category in categories.filter(c => c.selected).slice(0, 5)" 
             :src="category.icon"/>
        &nbsp;...&nbsp;
      </span>
    </div>

    <input class="daterange" type="text" name="datefilter">
    <input class='fts' type='text' placeholder='Search..' v-model='ftsQuery'>
    <button type='button' class='btn btn-default' v-on:click='fts'>
      <i class='fa fa-search' aria-hidden='true'></i>
    </button>
  </div>
</template>

<script>
  /* global $ */
  /* global moment */
  import backend from '../services/backend';
  import WModal from './WModal';

  const dateFormat = 'MM/DD/YYYY';
  const daterangeConfig = {
    ranges: {
      Today: [moment().format(dateFormat), moment().format(dateFormat)],
      Tomorrow: [moment().add(1, 'days').format(dateFormat), moment().add(1, 'days').format(dateFormat)],
      'Today and Tomorrow': [moment().format(dateFormat), moment().add(1, 'days').format(dateFormat)],
      'This weekend': [
        moment().endOf('isoWeek').add(-1, 'days').format(dateFormat),
        moment().endOf('isoWeek').format(dateFormat),
      ],
    },
    alwaysShowCalendars: true,
    startDate: moment(backend.statusListQueryParams.startDate).format(dateFormat),
    endDate: moment(backend.statusListQueryParams.endDate).format(dateFormat),
    minDate: moment().format(dateFormat),
    maxDate: moment().add(1, 'months').format(dateFormat),
    opens: 'center',
    autoApply: true,
  };

  class Category {
    constructor(name, icon, selected) {
      this.name = name;
      this.icon = icon;
      this.selected = selected;
    }
    deselect() {
      this.selected = false;
    }
    select() {
      this.selected = true;
    }
    changeSelection() {
      this.selected = !this.selected;
    }
  }

  export default {
    data() {
      this.categories = [];
      const icons = backend.getSelectedIcons();
      Object.keys(icons).map(key => this.categories.push(new Category(key, icons[key], true)));
      return {
        ftsQuery: backend.statusListQueryParams.search || '',
        showModal: false,
        categories: this.categories,
      };
    },
    methods: {
      fts() {
        this.$emit('fts', this.ftsQuery);
      },
      daterange(start, end) {
        const endDate = end.endOf('day');
        let startDate = start.startOf('day');
        if (startDate < moment()) startDate = moment();
        this.$emit('daterange', startDate, endDate);
      },
      categoriesSelected() {
        this.showModal = false;
        this.$emit('categories', this.categories.filter(c => c.selected));
      },
    },
    mounted() {
      this.$nextTick(() => $('.daterange').daterangepicker(daterangeConfig, this.daterange));
    },
    components: {
      'w-modal': WModal,
    },
  };
</script>

<style scoped>
  .daterange, .fts {
    display: inline;
    padding: 10px;
    border: none;
    border-bottom: solid 2px #c9c9c9;
    transition: border 0.3s;
    width: 200px;
  }
  .daterange, .fts {
    margin-left: 20px;
  }
  .daterange:focus,
  .daterange.focus,
  .fts:focus,
  .fts.focus {
    border-bottom: solid 2px #969696;
  }
  .category {
    float: left;
    display: inline-block;
    width: 200px;
    max-width: 210px;
    min-width: 210px;
    padding: 10px;
  }
  .category:hover {
    cursor: pointer;
  }
  .categories-select-modal {
    width: 600px;
  }
  .categories-list {
    list-style-type: none;
    -moz-column-gap: 20;
    -moz-column-count: 3;
    -webkit-column-count: 3;
    -webkit-column-gap: 20;
    column-count: 3;
    column-gap: 20;
  }
  .categories-list-item {
    cursor: pointer;
    margin-bottom: 5px;
    margin: 2px;
  }
  .categories-list-item.selected {
    background: #c1f0c1;
  }
  .categories-list-item:hover {
    border: solid 2px #969696;
  }
  .btn-left {
    float: left;
  }
</style>