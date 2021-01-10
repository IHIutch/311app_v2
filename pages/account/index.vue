<template>
  <div>
    <b-container class="py-12">
      <b-row>
        <b-col>
          <div>
            <h1>My Reports</h1>
          </div>
          <div class="border rounded bg-white p-3">
            <b-row>
              <b-col cols="6">
                <b-input-group>
                  <b-form-input
                    id="filterInput"
                    v-model="search"
                    type="search"
                    placeholder="Type to Search"
                    @input="onSearch()"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button :disabled="!search" @click="search = ''">
                      Clear
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
              <b-col cols="6">
                <div class="d-flex justify-content-end">
                  <b-pagination
                    v-model="pagination.currentPage"
                    :total-rows="pagination.totalRows"
                    :per-page="pagination.perPage"
                  ></b-pagination>
                </div>
              </b-col>
              <b-col cols="12">
                <b-list-group class="mb-2">
                  <b-list-group-item
                    v-for="(report, idx) in filteredReports"
                    :key="idx"
                    :to="`/reports/${report.id}`"
                  >
                    <div>
                      <span class="font-weight-bold text-black">
                        {{ report.group }} - {{ report.title }}
                      </span>
                    </div>
                    <div class="d-flex">
                      <span class="text-sm text-muted">
                        #{{ report.id }} • Opened on
                        {{ report.createdAt | date('MM/DD/YY') }}
                      </span>
                    </div>
                  </b-list-group-item>
                </b-list-group>
                <div>
                  <span class="text-muted small">
                    Showing {{ tableRangeShowing.start }} -
                    {{ tableRangeShowing.end }} of
                    {{ pagination.totalRows }}
                  </span>
                </div>
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import reportTypesJSON from '@/data/reportTypes.json'

export default {
  name: 'MyAccountPage',
  filters: {
    date(val, format) {
      return dayjs(val).format(format)
    },
  },
  layout: 'PublicLayout',
  middleware: 'auth',
  asyncData({ $axios, error }) {
    return $axios
      .$get(`api/v1/users/account`)
      .then((res) => {
        if (res) {
          const types = reportTypesJSON.map((t, idx) => {
            return {
              id: idx,
              ...t,
            }
          })
          res.reports = res.reports.map((r) => {
            const type = types.find((t) => {
              return t.id === r.reportTypeId
            })
            return { ...type, ...r }
          })
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
      pagination: {
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
      },
      search: '',
    }
  },
  computed: {
    tableRangeShowing() {
      const range = this.pagination.currentPage * this.pagination.perPage
      return {
        start: range - this.pagination.perPage + 1,
        end:
          range < this.pagination.totalRows ? range : this.pagination.totalRows,
      }
    },
    filteredReports() {
      const range = this.pagination.currentPage * this.pagination.perPage
      const filtered = this.search
        ? this.reports.filter((report) => {
            const title = report.title ? report.title.toLowerCase() : ''
            const group = report.group ? report.group.toLowerCase() : ''
            const search = this.search.toLowerCase()
            return title.includes(search) || group.includes(search)
          })
        : this.reports

      return [...filtered].slice(range - this.pagination.perPage, range)
    },
  },
  mounted() {
    this.pagination.totalRows = this.reports.length
  },
  methods: {
    onSearch() {
      this.pagination.currentPage = 1
    },
  },
}
</script>
