<template>
  <div id="app" class="bg-light antialiased">
    <div>
      <router-view />
    </div>
    <b-toast
      id="pwaUpdateAvailable"
      toast-class="hide"
      toaster="b-toaster-bottom-right"
      solid
      visible
      no-auto-hide
    >
      <template v-slot:toast-title>
        <div class="d-flex flex-grow-1 align-items-baseline">
          <strong class="mr-auto">Update Available!</strong>
        </div>
      </template>
      <div class="d-flex align-items-center">
        <div>
          <span>An update of Buffalo 311 is available, please reload.</span>
        </div>
        <div class="d-flex">
          <b-button size="sm" @click="reloadPage()" variant="outline-primary"
            >Reload</b-button
          >
        </div>
      </div>
    </b-toast>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    reloadPage() {
      location.reload(true);
    },
  },
};
</script>
