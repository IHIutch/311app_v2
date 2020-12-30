<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <div class="py-12">
            <div class="bg-white rounded border p-4">
              <b-table class="mb-0" hover :items="alerts" :fields="fields">
                <template #cell(createdAt)="data">
                  {{ data.item.createdAt | date }}
                </template>
                <template #cell(startDate)="data">
                  {{ data.item.startDate | date }}
                </template>
                <template #cell(endDate)="data">
                  {{ data.item.endDate | date }}
                </template>
                <template #cell(neighborhoods)="data">
                  {{ data.item.neighborhoods.length }}
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
import dayjs from 'dayjs'

export default {
  name: 'AlertsPage',
  filters: {
    date(value) {
      return dayjs(value).format('MM/DD/YY')
    },
  },
  asyncData({ $axios, error }) {
    return $axios
      .$get('api/v1/alerts/')
      .then((res) => {
        if (res) {
          return {
            alerts: res,
          }
        } else {
          throw new Error(error)
        }
      })
      .catch((err) => {
        error({ statusCode: 404, message: err })
      })
  },
  data() {
    return {
      fields: [
        { key: 'title', label: 'Title', sortable: true },
        { key: 'createdAt', label: 'Created', sortable: true },
        { key: 'startDate', label: 'Start Date', sortable: true },
        { key: 'endDate', label: 'End Date', sortable: true },
        { key: 'neighborhoods', label: 'Neighborhoods', sortable: true },
        {
          key: 'link',
          label: '',
          sortable: false,
        },
      ],
    }
  },
}
</script>
