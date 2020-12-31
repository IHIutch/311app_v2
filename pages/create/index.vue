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
          :description="`Example: &quot;${searchExamples[0].title}&quot; or &quot;${searchExamples[1].title}&quot;`"
        >
          <div class="position-relative">
            <b-form-input
              v-model="search"
              class="pl-10"
              placeholder="Search..."
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
        <div v-for="(group, gIdx) in groups" :key="gIdx">
          <b-list-group-item
            :key="`group-${gIdx}`"
            class="sticky-top text-uppercase font-weight-bold bg-secondary text-white px-2 py-1 text-sm border-left-0 border-right-0"
          >
            {{ group.title }}
          </b-list-group-item>
          <b-list-group-item
            v-for="(type, iIdx) in group.types"
            :key="`type-${iIdx}`"
            class="border-left-0 border-right-0 d-flex align-items-center justify-content-between text-primary"
            button
            @click="selectType(type.id, group.title, type.title)"
          >
            <span>{{ type.title }}</span>
            <chevron-right-icon />
          </b-list-group-item>
        </div>
      </b-list-group>
    </div>
  </div>
</template>

<script>
import reportTypes from '@/data/reportTypes.json'
import { ChevronRightIcon, SearchIcon } from 'vue-feather-icons'

export default {
  name: 'CreateStart',
  components: {
    ChevronRightIcon,
    SearchIcon,
  },
  asyncData() {
    return {
      searchExamples: [],
    }
  },
  data() {
    return {
      reportType: {
        id: '',
        title: '',
        group: '',
      },
      search: '',
      types: reportTypes
        .map((type, idx) => {
          return {
            id: idx,
            ...type,
          }
        })
        .sort(),
    }
  },
  computed: {
    groups() {
      const filteredTypes = this.types.filter((data) => {
        return data.title.toLowerCase().includes(this.search.toLowerCase())
      })

      const filteredGroups = [
        ...new Set(filteredTypes.map((data) => data.group)),
      ].sort()

      const sortedTypes = filteredGroups.map((group) => {
        return {
          title: group,
          types: filteredTypes
            .filter((g) => {
              return g.group === group
            })
            .map((type) => {
              return {
                id: type.id,
                title: type.title,
              }
            })
            .sort(),
        }
      })
      return sortedTypes
    },
  },
  created() {
    if (!this.searchExamples.length) {
      this.getSearchExamples()
    }
  },
  methods: {
    slugify(value) {
      return value.replace(/\W+/g, '-').toLowerCase()
    },
    selectType(id, group, title) {
      this.$emit('update:reportType', {
        id,
        group,
        title,
      })
      this.$router.push(`/create/${this.slugify(title)}`)
    },
    getSearchExamples() {
      while (this.searchExamples.length < 2) {
        const val = this.types[Math.floor(Math.random() * this.types.length)]
        if (!this.searchExamples.includes(val)) {
          this.searchExamples.push(val)
        }
      }
    },
  },
}
</script>
