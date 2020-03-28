<template>
  <b-container fluid>
    <b-row>
      <b-col cols="6" class="px-0">
        <DashboardMap :points="issues" />
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
                :items="issues"
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
                <template v-slot:cell(createdAt)="data">
                  {{ data.item.createdAt | date }}
                </template>
                <template v-slot:cell(link)="data">
                  <router-link
                    :to="{
                      name: 'ReportPage',
                      params: { issueId: data.item.id }
                    }"
                  >
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
import { db } from "@/modules/firebase";
import dayjs from "dayjs";
import DashboardMap from "@/components/dashboard/DashboardMap";

export default {
  name: "ReportsListPage",
  components: {
    DashboardMap
  },
  data() {
    return {
      issues: [],
      fields: [
        { key: "type", sortable: true },
        { key: "email", sortable: true },
        { key: "createdAt", label: "Created", sortable: true },
        { key: "link", label: "", sortable: false }
      ],
      table: {
        isBusy: true,
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        filter: "",
        sortBy: "createdAt",
        sortDesc: false
      }
    };
  },
  async created() {
    await db
      .collection("issues")
      .get()
      .then(querySnapshot => {
        this.issues = querySnapshot.docs.map(doc => {
          var obj = doc.data();
          obj["id"] = doc.id;
          return obj;
        });
      });

    this.table.totalRows = this.issues.length;
    this.table.isBusy = false;
  },
  methods: {
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
        end: range + 1 < this.table.totalRows ? range + 1 : this.table.totalRows
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
