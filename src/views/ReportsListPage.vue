<template>
  <b-container>
    <b-row>
      <b-col>
        <b-table striped hover :items="issues" :fields="fields">
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
  </b-container>
</template>

<script>
import { db } from "../firebase";
import moment from "moment";

export default {
  name: "ReportsListPage",
  data() {
    return {
      issues: [],
      fields: ["type", "email", "createdAt", "link"]
    };
  },
  created() {
    db.collection("issues")
      .get()
      .then(querySnapshot => {
        this.issues = querySnapshot.docs.map(doc => {
          var obj = doc.data();
          obj["id"] = doc.id;
          return obj;
        });
      });
  },
  filters: {
    moment(value) {
      return moment(value).format("MM/DD/YY, hh:mmA");
    }
  }
};
</script>
