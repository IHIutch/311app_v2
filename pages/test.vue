<template>
  <div
    :class="{
      'position-fixed top-0 h-100 w-100': $route.path === '/test/start'
    }"
  >
    <b-container
      tag="main"
      role="main"
      :class="{ 'h-100': $route.path === '/test/start' }"
    >
      <b-row
        class="position-relative"
        :class="{ 'h-100': $route.path === '/test/start' }"
        style="overflow-x: hidden;"
      >
        <transition
          :name="
            $route.path === '/test/start'
              ? 'slide-fade-back'
              : 'slide-fade-forward'
          "
          mode="out-in"
        >
          <b-col
            :key="$route.path"
            md="8"
            offset-md="2"
            xl="6"
            offset-xl="3"
            class="py-5"
            :class="{ 'h-100': $route.path === '/test/start' }"
          >
            <nuxt-child
              :key="$route.path"
              :group.sync="form.issueGroup"
              :type.sync="form.issueType"
              :images.sync="form.images"
              :description.sync="form.description"
              :location.sync="form.location"
              :neighborhood.sync="form.neighborhood"
              :email.sync="form.email"
            />
          </b-col>
        </transition>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "test",
  layout: "PublicLayout",
  data() {
    return {
      slideDirection: "",
      form: {
        issueGroup: "",
        issueType: "",
        images: [],
        description: "",
        location: {},
        email: ""
      },
      step: 1
    };
  },
  methods: {
    goBack() {
      this.step--;
      this.slideDirection = "slide-fade-back";
    },
    goForward() {
      this.step++;
      this.slideDirection = "slide-fade-forward";
    }
  }
};
</script>

<style lang="scss" scoped>
.slide-fade-forward-enter-active,
.slide-fade-back-enter-active,
.slide-fade-forward-leave-active,
.slide-fade-back-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-forward-enter,
.slide-fade-back-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.slide-fade-forward-leave-to,
.slide-fade-back-enter {
  transform: translateX(-30px);
  opacity: 0;
}
</style>
