<template>
  <b-container tag="main" role="main" class="pt-14 vh-100">
    <b-row class="h-100 py-5">
      <b-col md="6" offset-md="3" class="h-100 position-relative">
        <transition :name="slideDirection">
          <template v-if="step == 1">
            <div
              key="1"
              class="bg-white rounded shadow-sm h-100 w-100 overflow-hidden position-absolute d-flex flex-column p-4"
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
                      @click="selectType(issue)"
                    >
                      <span>{{ issue }}</span>
                      <chevron-right-icon />
                    </b-list-group-item>
                  </div>
                </b-list-group>
              </div>
            </div>
          </template>
          <template v-else>
            <div
              key="2"
              class="bg-white rounded shadow-sm h-100 w-100 overflow-hidden position-absolute"
            >
              <div class="embed-responsive embed-responsive-21by9">
                <div
                  class="embed-responsive-item bg-secondary d-flex align-items-end"
                >
                  <div class="p-2">
                    <span class="text-white">{{ form.issueType }}</span>
                  </div>
                </div>
              </div>
              <div class="p-4">
                <b-button @click="goBack()">Back</b-button>
              </div>
            </div>
          </template>
        </transition>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import issuesJSON from "@/data/issues.json";
import { ChevronRightIcon, SearchIcon } from "vue-feather-icons";

export default {
  name: "test",
  layout: "PublicLayout",
  components: {
    ChevronRightIcon,
    SearchIcon
  },
  data() {
    return {
      slideDirection: "",
      types: [...new Set(issuesJSON.map(data => data.text))].sort(),
      search: "",
      searchExamples: [],
      form: {
        issueType: ""
      },
      step: 1
    };
  },
  methods: {
    selectType(val) {
      this.form.issueType = val;
      this.step = 2;
      this.slideDirection = "slide-fade-forward";
    },
    getSearchExamples() {
      while (this.searchExamples.length < 3) {
        let val = this.types[Math.floor(Math.random() * this.types.length)];
        if (!this.searchExamples.includes(val)) {
          this.searchExamples.push(val);
        }
      }
    },
    goBack() {
      this.step = 1;
      this.slideDirection = "slide-fade-back";
    }
  },
  created() {
    this.getSearchExamples();
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

<style lang="scss" scoped>
.slide-fade-forward-enter-active,
.slide-fade-back-enter-active,
.slide-fade-forward-leave-active,
.slide-fade-back-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-forward-enter,
.slide-fade-back-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.slide-fade-forward-leave-to,
.slide-fade-back-enter {
  transform: translateX(-10px);
  opacity: 0;
}
</style>
