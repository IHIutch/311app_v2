<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <div class="py-12">
            <div class="bg-white rounded border p-4">
              <div>
                <h1>My Alerts</h1>
              </div>
              <b-table
                class="mb-0"
                hover
                :items="alerts"
                :fields="fields"
                :busy="table.isBusy"
              >
                <template #table-busy>
                  <div class="text-center text-primary my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>
                <template #cell(status)="data">
                  <AlertStatusBadge
                    :status="data.item.status"
                    :start-date="data.item.startDate"
                    :end-date="data.item.endDate"
                  />
                </template>
                <template #cell(startDate)="data">
                  {{ data.item.startDate | date('MM/DD/YY') }}
                </template>
                <template #cell(endDate)="data">
                  {{ data.item.endDate | date('MM/DD/YY') }}
                </template>
                <template #cell(neighborhoods)="data">
                  {{ data.item.neighborhoods.length }}
                </template>
                <template #cell(createdAt)="data">
                  {{ data.item.createdAt | date('MM/DD/YY') }}
                </template>
                <template #cell(link)="data">
                  <router-link :to="`/alerts/${data.item.id}`"
                    >View Details</router-link
                  >
                </template>
              </b-table>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AlertStatusBadge from '@/components/common/AlertStatusBadge.vue'

export default {
  name: 'MyAlertsPage',
  components: { AlertStatusBadge },
  layout: 'PublicLayout',
  middleware: 'auth',
  asyncData({ $axios, error }) {
    return $axios
      .$get(`api/v1/users/alerts`)
      .then((res) => {
        if (res) {
          return res
        } else {
          throw new Error(error)
        }
      })
      .catch((err) => {
        if (err) {
          error({ statusCode: 404, error: 'You must log in to see this page.' })
        }
      })
  },
  data() {
    return {
      fields: [
        { key: 'title', label: 'Title', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'startDate', label: 'Start Date', sortable: true },
        { key: 'endDate', label: 'End Date', sortable: true },
        { key: 'neighborhoods', label: 'Neighborhoods', sortable: true },
        { key: 'createdAt', label: 'Created', sortable: true },
        {
          key: 'link',
          label: '',
          sortable: false,
        },
      ],
      table: {
        isBusy: true,
      },
    }
  },
  mounted() {
    this.table.isBusy = false
  },
}
</script>
