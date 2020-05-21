<template>
  <div>
    <b-container class="mt-5">
      <b-row>
        <b-col cols="12">
          <b-row>
            <b-col cols="12" md="9">
              <b-row>
                <b-col cols="12">
                  <div class="d-flex mb-4 pb-4 border-bottom">
                    <div>
                      <div>
                        <span class="text-muted">{{ report.type }}</span>
                      </div>
                      <div>
                        <h1>
                          {{ report.subtype }}
                        </h1>
                      </div>
                      <div>
                        <div class="d-flex align-items-center">
                          <span class="mr-2">
                            <map-pin-icon class="text-primary" />
                          </span>
                          <span class="text-muted">
                            {{ report.lat | fixed3 }}, {{ report.lng | fixed3 }}
                          </span>
                          <span class="text-muted">
                            {{ report.streetNum }} {{ report.streetName }}
                            {{ report.zip }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="ml-auto d-flex">
                      <div class="mr-5">
                        <div class="border rounded p-1 bg-white">
                          <span class="h4">
                            ID: {{ report.id | substr7 }}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div>
                          <span
                            class="d-flex text-uppercase small font-weight-bold"
                          >
                            Share
                          </span>
                        </div>
                        <div class="btn btn-secondary">
                          <i class="fab fa-facebook"></i>
                        </div>
                        <div class="btn btn-secondary">
                          <i class="fab fa-twitter"></i>
                        </div>
                        <div class="btn btn-secondary">
                          <i class="fas fa-link"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="6">
                  <div class="p-1 border rounded mb-4">
                    <b-aspect
                      :aspect="16 / 9"
                      class="rounded-lg overflow-hidden"
                    >
                      <div id="map" class="embed-responsive-item"></div>
                    </b-aspect>
                  </div>
                </b-col>
                <b-col cols="6">
                  <div>
                    <div class="mb-2">
                      <span class="font-weight-bold">Details</span>
                    </div>
                    <p>
                      {{ report.comments }}
                    </p>
                  </div>
                  <div>
                    <div class="mb-2">
                      <span class="font-weight-bold">Photos</span>
                    </div>
                    <b-form-row>
                      <b-col
                        cols="6"
                        v-for="(image, index) in report.images"
                        :key="index"
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
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="12" md="3">
              <div class="mb-4">
                <div>
                  <span class="d-flex text-dark small font-weight-bold">
                    Status
                  </span>
                </div>
                <span class="badge badge-pill">
                  {{ report.status }}
                </span>
              </div>
              <div class="mb-5">
                <div>
                  <span class="d-flex text-dark small font-weight-bold">
                    Date Created
                  </span>
                </div>
                <span>{{ report.dateCreated | date }}</span>
              </div>
              <div class="mb-5">
                <div>
                  <span class="d-flex text-dark small font-weight-bold">
                    Date Assigned
                  </span>
                </div>
                <template v-if="report.dateAssigned">
                  <span>{{ report.dateAssigned | date }}</span>
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
                  <span>{{ report.dateScheduled | date }}</span>
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
                  <span>{{ report.closeDate | date }}</span>
                </template>
                <template v-else>
                  <span class="text-muted small"><i>Not Closed</i></span>
                </template>
              </div>
            </b-col>
          </b-row>
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
import dayjs from "dayjs";
import { MapPinIcon } from "vue-feather-icons";

export default {
  name: "ReportPage",
  layout: "PublicLayout",
  components: {
    MapPinIcon
  },
  head() {
    const reportId = this.substr7(this.report.id).toUpperCase();
    const reportDesc =
      this.report.subtype + this.report.comments
        ? `- ${this.report.comments}`
        : "";
    return {
      title: `Issue: #${reportId} - ${this.report.subtype}`,
      meta: [
        { hid: "og:url", property: "og:url", content: this.currentRoute },
        {
          hid: "og:title",
          property: "og:title",
          content: `Issue: #${reportId} - ${this.report.type}`
        },
        {
          hid: "description",
          name: "description",
          content: reportDesc
        },
        {
          hid: "og:description",
          property: "og:description",
          content: reportDesc
        },
        {
          hid: "og:image",
          property: "og:image",
          content: this.report.images.length ? this.report.images[0] : undefined
        },
        {
          hid: "twitter:title",
          property: "twitter:title",
          content: `Issue: #${reportId} - ${this.report.subtype}`
        },
        {
          hid: "twitter:description",
          property: "twitter:description",
          content: reportDesc
        }
      ]
    };
  },
  async asyncData({ app, route, env }) {
    let report = {};
    const reportRef = app.$fireStore
      .collection("issues")
      .doc(route.params.reportId);
    try {
      const reportDoc = await reportRef.get();
      report = reportDoc.data();
      report["id"] = reportDoc.id;
      report.dateCreated = report.dateCreated.toDate();
    } catch (e) {
      alert(e);
      return;
    }
    return { report: report, currentRoute: env.baseUrl + route.path };
  },
  data() {
    return {
      imageZoomUrl: null,
      report: []
    };
  },
  methods: {
    substr7(val) {
      return val.substring(0, 7);
    },
    showZoomImageModal(imageUrl) {
      this.imageZoomUrl = imageUrl;
      this.$refs["imageZoomModal"].show();
    }
  },
  filters: {
    date(value) {
      return dayjs(value).format("MM/DD/YY, hh:mmA");
    },
    fixed3(value) {
      return value.toFixed(3);
    },
    substr7(value) {
      return value.substring(0, 7);
    }
  }
};
</script>
