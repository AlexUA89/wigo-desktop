var resource = config.vue.$resource('status{/id}');

resource.query().then((response) => {
  console.log(response.json())
});