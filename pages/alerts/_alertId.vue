<template>
  <div>
    <b-container class="py-12">
      <b-row>
        <b-col cols="8">
          <div>
            <h1>{{ alert.title }}</h1>
            <p>{{ alert.content }}</p>
          </div>
        </b-col>
        <b-col cols="4">
          <div class="mb-4">
            <div><span class="font-weight-bold">Status</span></div>
            <AlertStatusBadge
              :status="alert.status"
              :start-date="alert.startDate"
              :end-date="alert.endDate"
            />
          </div>
          <div class="mb-4">
            <div><span class="font-weight-bold">Start Date</span></div>
            <span>{{ alert.startDate | date('MM/DD/YY') }}</span>
          </div>
          <div class="mb-4">
            <div><span class="font-weight-bold">End Date</span></div>
            <span>{{ alert.endDate | date('MM/DD/YY') }}</span>
          </div>
          <div>
            <div><span class="font-weight-bold">Neighborhoods</span></div>
            <div>
              <ul class="pl-6">
                <li v-for="(n, idx) in alert.neighborhoods" :key="idx">
                  {{ n }}
                </li>
              </ul>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AlertStatusBadge from '~/components/common/AlertStatusBadge.vue'

export default {
  name: 'AlertPage',
  components: { AlertStatusBadge },
  layout: 'PublicLayout',
  asyncData({ $axios, route, error, $config }) {
    const alertId = route.params.alertId
    return $axios
      .$get(`api/v1/alerts/${alertId}`)
      .then((res) => {
        if (res) {
          return {
            alert: res,
            currentRoute: $config.baseURL + route.path,
          }
        } else {
          throw new Error(error)
        }
      })
      .catch((err) => {
        if (err) {
          error({ statusCode: 404, message: `Alert not found. ${err}` })
        }
      })
  },
}
</script>
