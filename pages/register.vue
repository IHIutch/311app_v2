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
            <b-form @submit.prevent="register()">
              <b-form-group label="Your Email" label-for="email">
                <b-form-input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="Enter email"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Your Neighborhood" label-for="neighborhood">
                <b-form-select
                  id="neighborhood"
                  v-model="form.neighborhood"
                  :options="neighborhoodList"
                  required
                >
                  <template #first>
                    <b-form-select-option :value="null" disabled>
                      -- Please select an option --
                    </b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
              <b-form-group label="Create Password" label-for="new-password">
                <b-form-input
                  id="new-password"
                  v-model="form.password"
                  placeholder="Enter password"
                  type="password"
                  autocomplete="new-password"
                  required
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
import neighborhoodJSON from '@/data/neighborhoods.json'
import { userType } from '@/constants'

export default {
  name: 'CreateAccountPage',
  layout: 'PublicLayout',
  data() {
    return {
      form: {
        email: '',
        password: '',
        neighborhood: null,
      },
      errorMessage: null,
      busy: false,
      neighborhoodList: neighborhoodJSON.map((n) => n.neighborhood).sort(),
    }
  },
  methods: {
    register() {
      this.busy = true
      this.$axios
        .$post('api/v1/users', {
          ...this.form,
          type: userType.USER,
        })
        .then((data) => {
          this.busy = false
        })
        .catch((err) => {
          throw new Error(err)
        })
    },
  },
}
</script>
