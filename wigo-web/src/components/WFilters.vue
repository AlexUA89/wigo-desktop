<template>
  <div>
    <!-- use the modal component, pass in the prop -->
    <w-modal v-if="showModal" @close="showModal = false">
      <!--
        you can use custom content here to overwrite
        default content
      -->
      <h3 slot="header">custom header</h3>
    </w-modal>
    <input class="category" @click="showModal = true">
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
  import config from '../config';
  import WModal from './WModal';

  const defaults = config.filtersDefaults;
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
    startDate: defaults.startDate.format(dateFormat),
    endDate: defaults.endDate.format(dateFormat),
    minDate: moment().format(dateFormat),
    maxDate: moment().add(1, 'months').format(dateFormat),
    opens: 'center',
    autoApply: true,
  };

  export default {
    data() {
      return {
        ftsQuery: '',
        showModal: false,
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
  .category, .daterange, .fts {
    display: inline;
    padding: 10px;
    border: none;
    border-bottom: solid 2px #c9c9c9;
    transition: border 0.3s;
    width: 180px;
  }
  .daterange, .fts {
    margin-left: 20px;
  }
  .category:focus,
  .category.focus,
  .daterange:focus,
  .daterange.focus,
  .fts:focus,
  .fts.focus {
    border-bottom: solid 2px #969696;
  }
</style>