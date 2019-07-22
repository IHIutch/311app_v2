<template>
  <b-container role="main" class="mt-5">
    <b-row>
      <b-col cols="8" offset="2">
        <div class="border-bottom pb-2 mb-3">
          <h1>Submit an Issue</h1>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="8" offset="2">
        <div class="p-4 bg-white rounded shadow-sm mb-4">
          <b-form>
            <b-row>
              <b-col cols="12">
                <b-form-group label="What is the type?">
                  <b-form-select v-model="type" :options="types">
                    <template slot="first">
                      <option :value="null" disabled
                        >-- Please select an type --</option
                      >
                    </template>
                  </b-form-select>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="What is the subtype?">
                  <b-form-select v-model="subtype" :options="subtypes">
                    <template slot="first">
                      <option :value="null" disabled
                        >-- Please select an subtype --</option
                      >
                    </template>
                  </b-form-select>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="What is the location of the issue?">
                  <b-input
                    type="search"
                    v-model="search"
                    id="autocomplete"
                    placeholder="123 Main Street..."
                  />
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="What is your email?">
                  <b-form-checkbox v-model="anonymous">
                    I'd prefer to stay anonymous
                  </b-form-checkbox>
                  <b-input
                    type="email"
                    v-model="email"
                    placeholder="johndoe@email.com"
                    required
                  />
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="Upload Image">
                  <b-form-file
                    type="file"
                    ref="test"
                    @change="onFileChange"
                    v-model="file"
                    placeholder="Choose file(s)..."
                    drop-placeholder="Drop file(s) here..."
                    multiple=""
                  ></b-form-file>
                </b-form-group>
                <b-form-row>
                  <b-col
                    cols="3"
                    v-for="(preview, index) in filePreview"
                    :key="index"
                  >
                    <b-img thumbnail fluid :src="filePreview[index]" />
                  </b-col>
                </b-form-row>
              </b-col>
              <b-col cols="12">
                <b-form-group label="Additional Comments">
                  <b-textarea
                    class="form-control"
                    v-model="comments"
                    rows="4"
                    placeholder="Comments..."
                    no-resize
                  />
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-button variant="primary">Submit</b-button>
              </b-col>
            </b-row>
          </b-form>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "FormPage",
  data() {
    return {
      type: null,
      subtype: null,
      comments: null,
      anonymous: null,
      email: null,
      search: null,
      file: null,
      filePreview: [],
      types: [
        {
          value: 0,
          text: "type"
        }
      ],
      subtypes: [
        {
          value: 0,
          text: "subtype"
        }
      ]
    };
  },
  methods: {
    onFileChange(e) {
      var self = this;
      var files = e.target.files;
      Object.keys(files).forEach(index => {
        self.filePreview.push(URL.createObjectURL(files[index]));
      });
    }
  }
};
</script>
