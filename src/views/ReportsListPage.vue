<template>
  <b-container>
    <b-row>
      <b-col class="my-5">
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
                  <b-button :disabled="!table.filter" @click="table.filter = ''"
                    >Clear</b-button
                  >
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
                class="mb-0"
                small
                hover
                :items="issues"
                :fields="fields"
                :filter="table.filter"
                :current-page="table.currentPage"
                :per-page="table.perPage"
                :busy="table.isBusy"
                @filtered="onfiltered()"
              >
                <template v-slot:table-busy>
                  <div class="text-center text-primary my-2">
                    <b-spinner class="align-middle mr-2"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>
                <template v-slot:cell(createdAt)="data">
                  {{ data.item.createdAt | moment }}
                </template>
                <template v-slot:cell(link)="data">
                  <router-link
                    :to="{
                      name: 'ReportPage',
                      params: { issueId: data.item.id }
                    }"
                  >
                    Link
                  </router-link>
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
import moment from "moment";

export default {
  name: "ReportsListPage",
  data() {
    return {
      issues: [],
      fields: ["type", "email", "createdAt", "link"],
      table: {
        isBusy: true,
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
        filter: ""
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
  mounted() {},
  methods: {
    onFiltered(filteredItems) {
      this.table.totalRows = filteredItems.length;
      this.table.currentPage = 1;
    }
  },
  filters: {
    moment(value) {
      return moment(value).format("MM/DD/YY, hh:mmA");
    }
  }
};
</script>
