<template>
  <div>
    <b-container class="pb-5 pt-20">
      <b-row>
        <b-col cols="6" offset="3">
          <div class="bg-white shadow-sm p-4 rounded-sm">
            <h1 class="mb-5">Create Account</h1>
            <div v-if="errorMessage" class="mb-4">
              <b-alert variant="danger" show>{{ errorMessage }}</b-alert>
            </div>
            <b-form @submit.prevent="signIn()">
              <b-form-group label="Your Email" label-for="email">
                <b-form-input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="Enter email"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Create Password" label-for="new-password">
                <b-form-input
                  id="new-password"
                  v-model="form.password"
                  required
                  placeholder="Enter password"
                  type="password"
                  autocomplete="new-password"
                ></b-form-input>
              </b-form-group>
              <b-button type="submit" variant="primary" :disabled="busy">
                <span v-if="busy" class="mr-2">
                  <b-spinner small label="Submitting..." />
                </span>
                <span>{{ busy ? 'Creating...' : 'Create Account' }}</span>
              </b-button>
            </b-form>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'CreateAccountPage',
  layout: 'PublicLayout',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      errorMessage: null,
      busy: false,
    }
  },
  methods: {
    signIn() {
      this.busy = true
    },
  },
}
</script>
