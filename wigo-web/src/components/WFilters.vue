<template>
  <div>
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
  };
</script>

<style scoped>
  .fts, .daterange {
    display: inline;
    padding: 10px;
    border: none;
    border-bottom: solid 2px #c9c9c9;
    transition: border 0.3s;
  }
  .daterange {
    width: 180px;
  }
  .fts {
    width: 250px;
    margin-left: 20px;
  }
  .daterange:focus,
  .daterange.focus,
  .fts:focus,
  .fts.focus {
    border-bottom: solid 2px #969696;
  }
</style>