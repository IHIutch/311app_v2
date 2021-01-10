<template>
  <div>
    <div class="px-4 pt-8 bg-white shadow-sm mb-12">
      <b-container>
        <b-row>
          <b-col cols="10" offset="1">
            <div class="d-flex align-items-end mb-12">
              <div>
                <div
                  class="w-14 h-14 rounded-sm bg-primary mb-1 mr-4 d-flex align-items-center justify-content-center"
                >
                  <AlertTriangleIcon size="32" class="text-white" />
                </div>
              </div>
              <div class="flex-grow-1">
                <div class="mb-4">
                  <div class="px-2 py-1 border rounded-sm d-inline-flex">
                    <span class="text-sm text-muted">
                      Report #{{ report.id }} • Opened on
                      {{ report.createdAt | date('MM/DD/YY') }}
                    </span>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1">
                    <div>
                      <span class="d-flex text-3xl">
                        {{ report.title }}
                      </span>
                    </div>
                    <div>
                      <span class="d-flex text-sm text-muted">
                        {{ report.department }} • {{ report.group }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div class="bg-success px-2 py-1 rounded-sm">
                      <span class="text-white text-lg">
                        {{ report.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <b-container>
      <b-row>
        <b-col cols="10" offset="1">
          <div class="bg-white shadow-sm rounded-sm">
            <b-row>
              <b-col cols="8" class="border-right">
                <div class="py-6 pl-6">
                  <div class="mb-20">
                    <div class="mb-3">
                      <h3 class="font-weight-bold mb-0">Details</h3>
                    </div>
                    <template v-if="report.description">
                      <p class="mb-0 text-xl">{{ report.description }}</p>
                    </template>
                    <template v-else>
                      <p class="text-muted mb-0">
                        <i>No description provided.</i>
                      </p>
                    </template>
                  </div>
                  <div class="mb-20">
                    <div class="mb-3">
                      <h4 class="font-weight-bold mb-0">Photos</h4>
                    </div>
                    <b-form-row>
                      <b-col
                        v-for="(image, index) in report.images"
                        :key="index"
                        cols="4"
                      >
                        <b-button
                          variant="link"
                          class="p-0 mb-2 w-100"
                          @click="showZoomImageModal(image)"
                        >
                          <div
                            class="embed-responsive embed-responsive-1by1 rounded-lg overflow-hidden border"
                          >
                            <img
                              class="embed-responsive-item object-cover"
                              :src="image"
                            />
                          </div>
                        </b-button>
                      </b-col>
                    </b-form-row>
                  </div>
                  <div>
                    <div class="mb-3">
                      <h4 class="font-weight-bold mb-0">Activity</h4>
                    </div>
                    <div>
                      <div
                        v-for="(comment, idx) in comments"
                        :key="idx"
                        class="d-flex mb-4"
                      >
                        <div class="flex-shrink-0 mr-4">
                          <div
                            class="rounded-circle bg-secondary h-8 w-8 d-flex align-items-center justify-content-center"
                          >
                            <MessageCircleIcon size="20" class="text-white" />
                          </div>
                        </div>
                        <div>
                          <div>
                            <span class="font-weight-bold leading-none mr-2"
                              >Someone</span
                            >
                          </div>
                          <div class="mt-n1 mb-1">
                            <span
                              class="small text-muted"
                              :title="comment.createdAt | date('MM/DD/YY')"
                            >
                              Commented {{ comment.createdAt | fromNow }}
                            </span>
                          </div>
                          <p>
                            {{ comment.content }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="d-flex">
                      <div class="flex-shrink-0 mr-4">
                        <div
                          class="rounded-circle bg-secondary h-10 w-10 d-flex align-items-center justify-content-center"
                        >
                          <span class="text-white leading-none">JH</span>
                        </div>
                      </div>
                      <div class="flex-grow-1">
                        <b-form @submit.prevent="submitComment">
                          <b-form-group
                            label="Comment"
                            label-for="comment"
                            label-class="sr-only"
                          >
                            <b-form-textarea
                              id="comment"
                              v-model="form.comment"
                              type="text"
                              rows="4"
                              :placeholder="
                                canComment
                                  ? 'Leave a comment'
                                  : 'Must be logged in to comment'
                              "
                              required
                              :disabled="!canComment"
                            />
                          </b-form-group>
                          <div v-if="canComment" class="d-flex">
                            <b-button
                              type="submit"
                              variant="primary"
                              class="ml-auto"
                              :disabled="!form.comment || form.isBusy"
                            >
                              <span v-if="form.isBusy">
                                <b-spinner small />
                                Submitting...
                              </span>
                              <span v-else>Comment</span>
                            </b-button>
                          </div>
                        </b-form>
                      </div>
                    </div>
                  </div>
                </div>
              </b-col>
              <b-col cols="4">
                <div class="py-6 pr-6">
                  <div>
                    <div class="mb-2">
                      <h4 class="font-weight-bold">Location</h4>
                    </div>
                    <div class="mb-2">
                      <div>
                        <span v-if="report.streetNum" class="text-muted">
                          {{ report.streetNum }}{{ report.streetName
                          }}{{ report.zip }}
                        </span>
                      </div>
                      <div>
                        <span class="text-sm text-muted">
                          {{ report.lat.toFixed(3) }},
                          {{ report.lng.toFixed(3) }}
                        </span>
                      </div>
                    </div>
                    <div class="p-1 border rounded mb-4">
                      <b-aspect
                        :aspect="16 / 9"
                        class="rounded-lg overflow-hidden"
                      >
                        <div id="map" class="embed-responsive-item"></div>
                      </b-aspect>
                    </div>
                  </div>
                  <div class="mb-5">
                    <div>
                      <span class="d-flex text-dark small font-weight-bold">
                        Date Created
                      </span>
                    </div>
                    <span>{{ report.dateCreated | date('MM/DD/YY') }}</span>
                  </div>
                  <div class="mb-5">
                    <div>
                      <span class="d-flex text-dark small font-weight-bold">
                        Date Assigned
                      </span>
                    </div>
                    <template v-if="report.dateAssigned">
                      <span>{{ report.dateAssigned | date('MM/DD/YY') }}</span>
                    </template>
                    <template v-else>
                      <span class="text-muted small"><i>Not Assigned</i></span>
                    </template>
                  </div>
                  <div class="mb-5">
                    <div>
                      <span class="d-flex text-dark small font-weight-bold">
                        Date Scheduled
                      </span>
                    </div>
                    <template v-if="report.dateScheduled">
                      <span>{{ report.dateScheduled | date('MM/DD/YY') }}</span>
                    </template>
                    <template v-else>
                      <span class="text-muted small"><i>Not scheduled</i></span>
                    </template>
                  </div>
                  <div>
                    <div>
                      <span class="d-flex text-dark small font-weight-bold">
                        Date Closed
                      </span>
                    </div>
                    <template v-if="report.closeDate">
                      <span>{{ report.closeDate | date('MM/DD/YY') }}</span>
                    </template>
                    <template v-else>
                      <span class="text-muted small"><i>Not Closed</i></span>
                    </template>
                  </div>
                </div>
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <b-modal
      ref="imageZoomModal"
      size="lg"
      content-class="bg-transparent border-0"
      body-class="p-0"
      scrollable
      hide-header
      hide-footer
    >
      <img
        :src="imageZoomUrl"
        class="h-auto w-auto max-h-100 max-w-100 m-auto d-block"
      />
    </b-modal>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getMeta } from '@/functions/index'
import { AlertTriangleIcon, MessageCircleIcon } from 'vue-feather-icons'
import reportTypesJSON from '@/data/reportTypes.json'

dayjs.extend(relativeTime)

export default {
  name: 'ReportPage',
  components: {
    AlertTriangleIcon,
    MessageCircleIcon,
  },
  filters: {
    date(val, format) {
      return dayjs(val).format(format)
    },
    fromNow(val) {
      return dayjs(val).fromNow()
    },
  },
  layout: 'PublicLayout',
  asyncData({ $axios, route, error, $config }) {
    const reportId = route.params.reportId
    return $axios
      .$get(`api/v1/reports/${reportId}`)
      .then((res) => {
        if (res) {
          const { report, comments } = res
          const type = reportTypesJSON
            .map((t, idx) => {
              return {
                id: idx,
                ...t,
              }
            })
            .find((t) => {
              return t.id === report.reportTypeId
            })
          return {
            currentRoute: $config.baseURL + route.path,
            report: { ...type, ...report },
            comments,
          }
        } else {
          throw new Error(error)
        }
      })
      .catch((err) => {
        error({ statusCode: 404, message: `Report not found. ${err}` })
      })
  },
  data() {
    return {
      imageZoomUrl: null,
      form: {
        isBusy: false,
        comment: '',
      },
    }
  },
  head() {
    const title = `Buffalo 311 · Report #${this.report.id}`
    const image =
      this.report.images && this.report.images.length
        ? this.report.images[0]
        : ''
    const description = this.report.comments
      ? `${this.report.type} · ${this.report.subtype} · ${this.report.comments}`
      : `${this.report.type} · ${this.report.subtype}`
    return getMeta({
      title,
      url: this.currentRoute,
      description,
      image,
    })
  },
  computed: {
    canComment() {
      // Must be logged in and the creator of the report to comment
      return (
        this.$auth.loggedIn &&
        this.$auth.user &&
        (this.$auth.user.email === this.report.email ||
          this.$auth.user.id === this.report.userId)
      )
    },
  },
  methods: {
    showZoomImageModal(imageUrl) {
      this.imageZoomUrl = imageUrl
      this.$refs.imageZoomModal.show()
    },
    submitComment() {
      this.form.isBusy = true
      this.$axios
        .$post('api/v1/reports/comment', {
          reportId: this.report.id,
          content: this.form.comment,
        })
        .then((data) => {
          this.form.isBusy = false
          this.form.comment = ''
          this.comments.push(data)
        })
        .catch((err) => {
          throw new Error(err)
        })
    },
  },
}
</script>
