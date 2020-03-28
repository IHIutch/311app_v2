<template>
  <b-container>
    <b-row>
      <b-col cols="12">
        <b-row>
          <b-col size="12" md="3" class="mb-4 mb-md-0">
            <div class="p-2 border shadow rounded bg-white">
              <div class="embed-responsive embed-responsive-1by1">
                <div id="map" class="embed-responsive-item"></div>
              </div>
            </div>
          </b-col>
          <b-col cols="12" md="6">
            <div class="mb-2">
              <div class="d-inline-block mr-5">
                <a class="border rounded d-inline-block p-1" href="#"
                  >Report ID: {{ $route.params.issueId }}
                </a>
              </div>
              <div class="d-inline-block">
                <span><b>Status: </b></span>
                <span class="badge badge-pill">
                  {{ report.status }}
                </span>
              </div>
            </div>
            <div>
              <span class="text-muted"> {{ report.type }}</span>
            </div>
            <div>
              <h1>
                {{ report.subtype }}
              </h1>
            </div>
            <div class="mb-4">
              <div class="d-inline">
                {{ report.streetNum }}{{ report.streetName }}{{ report.zip }}
              </div>
              <div class="d-inline">
                <span class="text-muted">
                  {{ report.lat }}, {{ report.lng }}</span
                >
              </div>
            </div>
            <div>
              <div class="d-inline mr-4">
                <b>Open Date:</b>
                {{ report.createdAt | date }}
              </div>
              <div class="d-inline">
                <b>Closed Date:</b>
                {{ report.closeDate }}
              </div>
            </div>
          </b-col>
          <b-col md="3" class="d-none d-md-block">
            <div class="text-uppercase small mb-2"><b>Share</b></div>
            <div class="btn btn-secondary"><i class="fab fa-facebook"></i></div>
            <div class="btn btn-secondary"><i class="fab fa-twitter"></i></div>
            <div class="btn btn-secondary"><i class="fas fa-link"></i></div>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <hr class="my-4" />
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="6">
            <div class="mb-2">
              <b>Description:</b>
            </div>
            <div>
              {{ report.comments }}
            </div>
          </b-col>
          <b-col cols="6">
            <b-form-row class="form-row">
              <b-col cols="12" class="mb-2">
                <b>Photos:</b>
              </b-col>

              <b-col
                cols="6"
                v-for="(photo, index) in report.photos"
                :key="index"
              >
                <a href="#" class="embed-responsive embed-responsive-1by1 mb-2">
                  <img
                    :src="photo"
                    class="w-100 img-thumbnail embed-responsive-item"
                    style="object-fit: cover;"
                    data-toggle="modal"
                    data-target="#imageModal"
                  />
                </a>
              </b-col>
            </b-form-row>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { db } from "@/modules/firebase";
import dayjs from "dayjs";

export default {
  name: "ReportPage",
  data() {
    return {
      report: []
    };
  },
  created() {
    var self = this;
    db.collection("issues")
      .doc(this.$route.params.issueId)
      .get()
      .then(querySnapshot => {
        // console.log(querySnapshot);
        self.report = querySnapshot.data();
        self.report["id"] = querySnapshot.id;
        self.report.createdAt = self.report.createdAt.toDate();
      });
  },
  filters: {
    date(value) {
      return dayjs(value).format("MM/DD/YY, hh:mmA");
    }
  }
};
</script>
