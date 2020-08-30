<template>
  <div
    class="bg-white rounded shadow-sm h-100 overflow-hidden d-flex flex-column p-4"
  >
    <div class="mb-4">
      <div>
        <h1 class="text-2xl">Select a Report Type</h1>
      </div>
      <div>
        <b-form-group
          class="mb-0"
          :description="
            `Example: &quot;${searchExamples[0]}&quot; or &quot;${searchExamples[1]}&quot;`
          "
        >
          <div class="position-relative">
            <b-form-input
              class="pl-10"
              placeholder="Search..."
              v-model="search"
              type="text"
            ></b-form-input>
            <div
              class="position-absolute top-0 left-0 h-100 w-10 d-flex align-items-center justify-content-center"
            >
              <search-icon />
            </div>
          </div>
        </b-form-group>
      </div>
    </div>
    <div class="d-flex flex-grow-1 overflow-auto border rounded">
      <b-list-group class="w-100" flush>
        <div v-for="(group, gIdx) in groups">
          <b-list-group-item
            :key="`group-${gIdx}`"
            class="sticky-top text-uppercase font-weight-bold bg-secondary text-white px-2 py-1 text-sm border-left-0 border-right-0"
          >
            {{ group.title }}
          </b-list-group-item>
          <b-list-group-item
            v-for="(issue, iIdx) in group.issues"
            :key="`issue-${iIdx}`"
            class="border-left-0 border-right-0 d-flex align-items-center justify-content-between text-primary"
            button
            @click="selectType(group.title, issue)"
          >
            <span>{{ issue }}</span>
            <chevron-right-icon />
          </b-list-group-item>
        </div>
      </b-list-group>
    </div>
  </div>
</template>

<script>
import issuesJSON from "@/data/issues.json";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  SearchIcon,
  MapPinIcon,
  CameraIcon,
  EditIcon,
  PlusIcon
} from "vue-feather-icons";

export default {
  name: "CreateStart",
  components: {
    ChevronRightIcon,
    ChevronLeftIcon,
    SearchIcon,
    MapPinIcon,
    CameraIcon,
    EditIcon,
    PlusIcon
  },
  asyncData() {
    return {
      searchExamples: []
    };
  },
  data() {
    return {
      form: {
        issueGroup: "",
        issueType: ""
      },
      search: "",
      types: [...new Set(issuesJSON.map(data => data.text))].sort()
    };
  },
  methods: {
    slugify(value) {
      return value.replace(/\W+/g, "-").toLowerCase();
    },
    selectType(group, type) {
      this.$emit("update:group", group);
      this.$emit("update:type", type);
      this.$router.push(`/create/${this.slugify(type)}`);
    },
    getSearchExamples() {
      while (this.searchExamples.length < 2) {
        let val = this.types[Math.floor(Math.random() * this.types.length)];
        if (!this.searchExamples.includes(val)) {
          this.searchExamples.push(val);
        }
      }
    }
  },
  created() {
    if (!this.searchExamples.length) {
      this.getSearchExamples();
    }
  },
  computed: {
    groups() {
      let filtered = issuesJSON.filter(data => {
        return data.text.toLowerCase().includes(this.search.toLowerCase());
      });

      let filteredtTypes = [...new Set(filtered.map(data => data.type))].sort();

      let issues = filteredtTypes.map(group => {
        return {
          title: group,
          issues: filtered
            .filter(g => {
              return g.type == group;
            })
            .map(issue => {
              return issue.text;
            })
            .sort()
        };
      });
      return issues;
    }
  }
};
</script>
