<template>
  <b-container role="main" class="pt-14 vh-100">
    <b-row class="h-100 py-5">
      <b-col md="6" offset-md="3" class="h-100">
        <div class="bg-white p-4 rounded shadow-sm h-100 d-flex flex-column">
          <div class="mb-4">
            <div>
              <h1>Select an Issue</h1>
            </div>
            <div>
              <b-form-input
                v-model="search"
                type="text"
                placeholder="Find an issue"
              ></b-form-input>
            </div>
          </div>
          <div class="d-flex flex-grow-1 overflow-auto border rounded">
            <b-list-group class="w-100" flush>
              <div v-for="(group, gIdx) in groups">
                <b-list-group-item
                  :key="`group-${gIdx}`"
                  class="sticky-top text-uppercase font-weight-bold bg-secondary text-white p-2 text-sm border-left-0 border-right-0"
                >
                  {{ group.title }}
                </b-list-group-item>
                <b-list-group-item
                  v-for="(issue, iIdx) in group.issues"
                  :key="`issue-${iIdx}`"
                  class="border-left-0 border-right-0"
                >
                  {{ issue }}
                </b-list-group-item>
              </div>
            </b-list-group>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import issuesJSON from "@/data/issues.json";

export default {
  name: "test",
  layout: "PublicLayout",
  data() {
    return {
      search: ""
    };
  },
  computed: {
    groups() {
      let filtered = issuesJSON.filter(data => {
        return data.text.toLowerCase().includes(this.search.toLowerCase());
      });

      let types = [...new Set(filtered.map(data => data.type))].sort();

      let issues = types.map(group => {
        return {
          title: group,
          issues: filtered
            .filter(g => {
              return g.type == group;
            })
            .map(issue => {
              return issue.text;
            })
        };
      });
      return issues;
    }
  }
};
</script>
