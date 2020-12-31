<template>
  <div>
    <b-form @submit.prevent="publish()">
      <b-container class="py-12">
        <b-row>
          <b-col>
            <h1>Create Alert</h1>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="8">
            <div class="p-4 border rounded bg-white">
              <b-form-group
                label="Alert Title"
                label-class="font-weight-bold"
                label-for="title"
              >
                <b-form-input
                  id="title"
                  v-model="form.title"
                  type="text"
                  required
                />
              </b-form-group>
              <b-form-group
                label="Content"
                label-class="font-weight-bold"
                label-for="content"
                class="mb-0"
              >
                <b-form-textarea
                  id="content"
                  v-model="form.content"
                  rows="6"
                  required
                />
              </b-form-group>
            </div>
          </b-col>
          <b-col cols="4">
            <div class="border rounded bg-white">
              <div class="p-4 border-bottom">
                <b-form-checkbox
                  v-model="form.sendNotification"
                  name="sendNotification"
                  class="mb-4"
                >
                  Send Email Notification to Users
                </b-form-checkbox>
                <b-button
                  type="submit"
                  variant="primary"
                  block
                  :disabled="busy"
                >
                  <b-spinner
                    v-if="busy"
                    label="Publishing..."
                    small
                  ></b-spinner>
                  <span v-else>Publish Alert</span>
                </b-button>
              </div>
              <div class="p-4 border-bottom">
                <b-form-group
                  v-slot="{ ariaDescribedby }"
                  label="Start Date"
                  label-class="font-weight-bold"
                  label-for="startDate"
                >
                  <b-form-datepicker
                    id="startDate"
                    v-model="form.startDate"
                    :aria-describedby="ariaDescribedby"
                    :min="today"
                    hide-header
                  />
                </b-form-group>
                <b-form-group
                  v-slot="{ ariaDescribedby }"
                  label="End Date"
                  label-class="font-weight-bold"
                  label-for="endDate"
                  class="mb-0"
                >
                  <b-form-datepicker
                    id="endDate"
                    v-model="form.endDate"
                    :aria-describedby="ariaDescribedby"
                    :disabled="!form.startDate"
                    :min="form.startDate ? form.startDate : today"
                    hide-header
                  />
                </b-form-group>
              </div>
              <div class="p-4">
                <b-form-group
                  label="Choose Neighborhoods"
                  class="m-0"
                  label-class="font-weight-bold"
                  label-for="neighborhoods"
                >
                  <b-form-checkbox-group
                    id="neighborhoods"
                    v-model="form.neighborhoods"
                    name="neighborhoods"
                    :options="neighborhoodList"
                    stacked
                  />
                </b-form-group>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </b-form>
  </div>
</template>

<script>
import neighborhoodJSON from '@/data/neighborhoods.json'
import dayjs from 'dayjs'
import { alertStatus } from '@/constants'

export default {
  name: 'AlertCreatePage',
  layout: 'AdminLayout',
  data() {
    return {
      form: {
        title: '',
        content: '',
        startDate: '',
        endDate: '',
        neighborhoods: [],
        sendNotification: false,
      },
      neighborhoodList: neighborhoodJSON.map((n) => n.neighborhood).sort(),
      busy: false,
    }
  },
  computed: {
    today() {
      return dayjs().format()
    },
  },
  methods: {
    publish() {
      this.busy = true
      const {
        title,
        content,
        startDate,
        endDate,
        neighborhoods,
        sendNotification,
      } = this.form
      this.$axios
        .$post('api/v1/alerts', {
          title,
          content,
          startDate,
          endDate,
          neighborhoods,
          status: alertStatus.PUBLISHED,
          sendNotification,
        })
        .then((id) => {
          this.busy = false
          this.$router.push(`/alerts/${id}`)
        })
        .catch((err) => {
          throw new Error(err)
        })
    },
  },
}
</script>
