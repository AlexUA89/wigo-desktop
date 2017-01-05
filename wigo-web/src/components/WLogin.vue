<template>
  <button @click="login">Login!</button>
</template>

<script>
  /* global FB */
  export default {
    mounted() {
      // this.$nextTick(() => console.log(FB));
    },
    methods: {
      login() {
        FB.login((login) => {
          console.log(login);
        });
      },
    },
  };
</script>