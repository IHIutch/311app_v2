<template>
  <b-container fluid>
    <b-row>
      <b-col cols="6" class="px-0">
        <DashboardMap :points="reports" />
      </b-col>
      <b-col cols="6" class="my-5">
        <div class="border rounded bg-white p-3">
          <b-row>
            <b-col cols="6">
              <b-input-group>
                <b-form-input
                  v-model="table.filter"
                  type="search"
                  id="filterInput"
                  placeholder="Type to Search"
                ></b-form-input>
                <b-input-group-append>
                  <b-button
                    :disabled="!table.filter"
                    @click="table.filter = ''"
                  >
                    Clear
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-col>
            <b-col cols="6">
              <div class="d-flex justify-content-end">
                <b-pagination
                  v-model="table.currentPage"
                  :total-rows="table.totalRows"
                  :per-page="table.perPage"
                ></b-pagination>
              </div>
            </b-col>
            <b-col cols="12">
              <b-table
                class="mb-0 small"
                small
                hover
                :items="reports"
                :fields="fields"
                :filter="table.filter"
                :current-page="table.currentPage"
                :per-page="table.perPage"
                :busy="table.isBusy"
                :sort-by.sync="table.sortBy"
                :sort-desc.sync="table.sortDesc"
                sort-icon-left
                @filtered="onFiltered"
              >
                <template v-slot:table-busy>
                  <div class="text-center text-primary my-2">
                    <b-spinner small class="align-middle mr-2"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>
                <template v-slot:cell(dateCreated)="data">
                  {{ data.item.dateCreated | date }}
                </template>
                <template v-slot:cell(link)="data">
                  <router-link :to="`/reports/${data.item.id}`">
                    View Details
                  </router-link>
                </template>
                <template v-slot:table-caption>
                  Showing {{ tableRangeShowing.start }} -
                  {{ tableRangeShowing.end }} of {{ table.totalRows }}
                </template>
              </b-table>
            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import dayjs from "dayjs";
import DashboardMap from "@/components/dashboard/DashboardMap";

export default {
  name: "ReportsList",
  layout: "PublicLayout",
  components: { DashboardMap },
  data() {
    return {
      reports: [],
      fields: [
        { key: "type", sortable: true },
        { key: "email", sortable: true },
        { key: "dateCreated", label: "Created", sortable: true },
        { key: "link", label: "", sortable: false }
      ],
      table: {
        isBusy: true,
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        filter: "",
        sortBy: "dateCreated",
        sortDesc: false
      }
    };
  },
  async created() {
    await this.getReports();
    this.table.totalRows = this.reports.length;
    this.table.isBusy = false;
  },
  methods: {
    async getReports() {
      const reportsRef = this.$fireStore.collection("issues");
      try {
        const reportsDoc = await reportsRef.get();
        this.reports = reportsDoc.docs.map(doc => {
          var obj = doc.data();
          obj["id"] = doc.id;
          obj.dateCreated = obj.dateCreated.toDate();
          return obj;
        });
      } catch (e) {
        alert(e);
        return;
      }
    },
    onFiltered(filteredItems) {
      this.table.totalRows = filteredItems.length;
      this.table.currentPage = 1;
    }
  },
  computed: {
    tableRangeShowing() {
      let range = this.table.currentPage * this.table.perPage;
      return {
        start: range - this.table.perPage + 1,
        end: range < this.table.totalRows ? range : this.table.totalRows
      };
    }
  },
  filters: {
    date(value) {
      return dayjs(value).format("MM/DD/YY");
    }
  }
};
</script>
