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
          <b-form @submit.prevent="saveIssue()">
            <b-row>
              <b-col cols="12">
                <b-form-group label="What is the type?">
                  <b-form-select v-model="issue.type" :options="types">
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
                  <b-form-select
                    v-model="issue.subtype"
                    :options="filteredSubtypes"
                  >
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
                    v-model="issue.email"
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
                    <b-button variant="danger" @click="removeFile(index)"
                      >Delete</b-button
                    >
                  </b-col>
                </b-form-row>
              </b-col>
              <b-col cols="12">
                <b-form-group label="Additional Comments">
                  <b-textarea
                    class="form-control"
                    v-model="issue.comments"
                    rows="4"
                    placeholder="Comments..."
                    no-resize
                  />
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-button
                  type="submit"
                  variant="primary"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting">
                    <b-spinner label="Submitting..." />
                  </span>
                  <span v-else>Submit</span>
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { db } from "../firebase";

export default {
  name: "FormPage",
  data() {
    return {
      isSubmitting: false,
      issue: {
        type: null,
        subtype: null,
        comments: null,
        email: null,
        streetNumber: null,
        streetName: null,
        zipCode: null,
        city: null,
        state: null,
        createdAt: ""
      },
      anonymous: null,
      search: null,
      file: null,
      filePreview: [],
      types: {
        adjudicationOrdinanceViolation: {
          text: "Adjudication - Ordinance Violation"
        },
        administration: {
          text: "Administration"
        },
        animalShelter: {
          text: "Animal Shelter"
        },
        assessmentAndTaxation: {
          text: "Assessment & Taxation"
        },
        bfd: { text: "BFD" },
        bmha: { text: "BMHA" },
        buffaloSewerAuthority: {
          text: "Buffalo Sewer Authority"
        },
        buffaloWaterAuthority: {
          text: "Buffalo Water Authority"
        },
        buildingsDivision: {
          text: "Buildings Division"
        },
        citizenServicesGraffiti: {
          text: "Citizen Services - Graffiti"
        },
        citizenServicesQuickResponseTeams: {
          text: "Citizen Services - Quick Response Teams"
        },
        citizenServicesSaveOurStreets: {
          text: "Citizen Services - Save Our Streets"
        },
        citizenServicesCleanCity: {
          text: "Citizens Services - Clean City"
        },
        cityClerkIssue: {
          text: "City Clerk Issue"
        },
        cityParks: {
          text: "City Parks"
        },
        communityBasedOrgs: { text: "Community Based Orgs" },
        engineeringStreeRepairs: {
          text: "Engineering - Street Repairs"
        },
        engineeringTraffic: {
          text: "Engineering - Traffic"
        },
        forestry: {
          text: "Forestry"
        },
        freedomOfInformation: {
          text: "Freedom of Information"
        },
        harborMaster: {
          text: "Harbor Master"
        },
        housing: {
          text: "Housing"
        },
        hr: { text: "HR" },
        licenses: { text: "Licenses" },
        movingViolations: {
          text: "Moving Violations"
        },
        nationalGrid: {
          text: "National Grid"
        },
        osp: {
          text: "OSP"
        },
        parkingViolationsBureau: {
          text: "Parking Violations Bureau"
        },
        personnel: { text: "Personnel" },
        police: {
          text: "Police"
        },
        realEstate: {
          text: "Real Estate"
        },
        rodentControl: {
          text: "Rodent Control"
        },
        sanitation: {
          text: "Sanitation"
        },
        streets: {
          text: "Streets"
        },
        streetsSanitation: {
          text: "Streets / Sanitation"
        },
        taxation: { text: "Taxation" },
        telecommunications: {
          text: "Telecommunications"
        },
        youthBureau: { text: "Youth Bureau" }
      },
      subtypes: {
        illegalDumping: {
          text: "Illegal Dumping",
          value: "adjudicationOrdinanceViolation"
        },
        otherAdjucationIssue: {
          text: "Other Adjudication Issue",
          value: "adjudicationOrdinanceViolation"
        },
        fairHousingIssue: {
          text: "Fair Housing Issue",
          value: "administration"
        },
        animals: { text: "Animals", value: "animalShelter" },
        deadAnimalRemoval: {
          text: "Dead Animal Removal",
          value: "animalShelter"
        },
        assessmentIssue: {
          text: "Assessment Issue",
          value: "assessmentAndTaxation"
        },
        bfdSnowOnHydrant: { text: "BFD Snow on Hydrant", value: "bfd" },
        fire: { text: "Fire", value: "bfd" },
        hmhaIssue: { text: "BMHA Issue", value: "bmha" },
        basementFlooding: {
          text: "Basement Flooding",
          value: "buffaloSewerAuthority"
        },
        rainBarrels: {
          text: "Rain Barrels",
          value: "buffaloSewerAuthority"
        },
        sewer: { text: "Sewer", value: "buffaloSewerAuthority" },
        streetFlooding: {
          text: "Street Flooding",
          value: "buffaloSewerAuthority"
        },
        fireHydrantIssue: {
          text: "Fire Hydrant Issue",
          value: "buffaloWaterAuthority"
        },
        waterIssue: {
          text: "Water Issue",
          value: "buffaloWaterAuthority"
        },
        waterTested: {
          text: "Water Tested",
          value: "buffaloWaterAuthority"
        },
        waterBillingMeter: {
          text: "Water Billing Meter",
          value: "buffaloWaterAuthority"
        },
        buildingMaintenance: {
          text: "Building Maintenance",
          value: "buildingsDivision"
        },
        cityhallCitycourtMaintenance: {
          text: "CityHall CityCourt Maintenance",
          value: "buildingsDivision"
        },
        cityPropert: {
          text: "City Property",
          value: "citizenServicesGraffiti"
        },
        obsceneOther: {
          text: "Obscene Other",
          value: "citizenServicesGraffiti"
        },
        obscenePrivateProperty: {
          text: "Obscene Private Property",
          value: "citizenServicesGraffiti"
        },
        other: { text: "Other", value: "citizenServicesGraffiti" },
        parksCity: {
          text: "Parks City",
          value: "citizenServicesGraffiti"
        },
        privateProperty: {
          text: "Private Property",
          value: "citizenServicesGraffiti"
        },
        pwEngineering: {
          text: "PW Engineering",
          value: "citizenServicesGraffiti"
        },
        pwTraffic: {
          text: "PW Traffic",
          value: "citizenServicesGraffiti"
        },
        qrtIllegalDumpingOnViaduct: {
          text: "QRT Illegal Dumping on Viaduct",
          value: "citizenServicesQuickResponseTeams"
        },
        qrtOtherIssue: {
          text: "QRT Other Issue",
          value: "citizenServicesQuickResponseTeams"
        },
        qrtSnowRemoval: {
          text: "QRT Snow Removal",
          value: "citizenServicesQuickResponseTeams"
        },
        snowRemovalBusStopShelter: {
          text: "Snow Removal Bus Stop Shelter",
          value: "citizenServicesQuickResponseTeams"
        },
        saveOurStreetsProgram: {
          text: "Save Our Streets Program",
          value: "citizenServicesSaveOurStreets"
        },
        greatAmericanCleanup: {
          text: "Great American Clean-Up",
          value: "citizenServicesCleanCity"
        },
        neighborhoodCleanup: {
          text: "Neighborhood CleanUp",
          value: "citizenServicesCleanCity"
        },
        cityClerkIssue: {
          text: "City Clerk Issue",
          value: "cityClerkIssue"
        },
        cityParkTreeIssue: {
          text: "City Park Tree Issue",
          value: "cityParks"
        },
        cityParks: { text: "City Parks", value: "cityParks" },
        olmstedParks: { text: "Olmsted Parks", value: "cityParks" },
        poolsAndSplashpads: {
          text: "Pools and Splashpads",
          value: "cityParks"
        },
        recreationCenter: {
          text: "Recreation Center",
          value: "cityParks"
        },
        cbo: { text: "CBO", value: "communityBasedOrgs" },
        bridgeIssue: {
          text: "Bridge Issue",
          value: "engineeringStreeRepairs"
        },
        caveIn: { text: "Cave In", value: "engineeringStreeRepairs" },
        curbMetalProtruding: {
          text: "Curb - Metal Protruding",
          value: "engineeringStreeRepairs"
        },
        curbs: { text: "Curbs", value: "engineeringStreeRepairs" },
        damagedStreetLightPole: {
          text: "Damaged Street Light Pole",
          value: "engineeringStreeRepairs"
        },
        otherHoleInRoad: {
          text: "Other Hole in Road",
          value: "engineeringStreeRepairs"
        },
        paving: { text: "Paving", value: "engineeringStreeRepairs" },
        potHole: { text: "Pot Hole", value: "engineeringStreeRepairs" },
        pwMissingManholeCover: {
          text: "PW Missing Manhole Cover",
          value: "engineeringStreeRepairs"
        },
        pwOngoingContrstruction: {
          text: "PW Ongoing Construction",
          value: "engineeringStreeRepairs"
        },
        sidewalks: { text: "Sidewalks", value: "engineeringStreeRepairs" },
        bikeRack: { text: "Bike Rack", value: "engineeringTraffic" },
        pavementMarketLine: {
          text: "Pavement Marking Lines",
          value: "engineeringTraffic"
        },
        pwNeighborhoodTrafficCalming: {
          text: "PW Neighborhood Traffic Calming",
          value: "engineeringTraffic"
        },
        rightOfWayIssue: {
          text: "Right of Way Issue",
          value: "engineeringTraffic"
        },
        signHazards: { text: "Sign Hazards", value: "engineeringTraffic" },
        signMaintenance: {
          text: "Sign Maintenance",
          value: "engineeringTraffic"
        },
        signalIssueDot: {
          text: "Signal Issue DoT",
          value: "engineeringTraffic"
        },
        signalOtherIssue: {
          text: "Signal Other Issue",
          value: "engineeringTraffic"
        },
        signalOutOrFlashing: {
          text: "Signal Out or Flashing",
          value: "engineeringTraffic"
        },
        signalTimingIssueCity: {
          text: "Signal Timing Issue City",
          value: "engineeringTraffic"
        },
        sneakersHanging: {
          text: "Sneakers Hanging",
          value: "engineeringTraffic"
        },
        fallenTreeBlockingRow: {
          text: "Fallen Tree Blocking RoW",
          value: "forestry"
        },
        fallenTreeInspection: {
          text: "Fallen Tree Inspection",
          value: "forestry"
        },
        stumpRemoval: { text: "Stump Removal", value: "forestry" },
        stumpRemovalQualityIssue: {
          text: "Stump Removal Quality Issue",
          value: "forestry"
        },
        treeOther: { text: "Tree Other", value: "forestry" },
        treePlantingQualityIssue: {
          text: "Tree Planting Quality Issue",
          value: "forestry"
        },
        treePlantingRequest: {
          text: "Tree Planting Request",
          value: "forestry"
        },
        treeRemoval: { text: "Tree Removal", value: "forestry" },
        treeRemovalChallenge: {
          text: "Tree Removal Challenge",
          value: "forestry"
        },
        treeRemovalPerInspector: {
          text: "Tree Removal per Inspector",
          value: "forestry"
        },
        treeRemovalQualityIssue: {
          text: "Tree Removal Quality Issue",
          value: "forestry"
        },
        treeTrimmingQualityIssue: {
          text: "Tree Trimming Quality Issue",
          value: "forestry"
        },
        treeTrimmingRequest: {
          text: "Tree Trimming Request",
          value: "forestry"
        },
        foilRecordsAssessmentAndTaxation: {
          text: "FOIL Records Assessment & Taxation",
          value: "freedomOfInformation"
        },
        foilRecordsCityClerk: {
          text: "FOIL Records City Clerk",
          value: "freedomOfInformation"
        },
        foilRecordsEdpis: {
          text: "FOIL Records EDPIS",
          value: "freedomOfInformation"
        },
        foilRecordsFireDept: {
          text: "FOIL Records Fire Dept",
          value: "freedomOfInformation"
        },
        foilRecordsHumanResources: {
          text: "FOIL Records Human Resources",
          value: "freedomOfInformation"
        },
        foilRecordsLawDept: {
          text: "FOIL Records Law Dept",
          value: "freedomOfInformation"
        },
        foilRecordsPoliceDept: {
          text: "FOIL Records Police Dept",
          value: "freedomOfInformation"
        },
        foilRecordsRealEstate: {
          text: "FOIL Records Real Estate",
          value: "freedomOfInformation"
        },
        waterfrontIssue: {
          text: "Waterfront Issues",
          value: "harborMaster"
        },
        abandonedVehicleInspection: {
          text: "Abandoned Vehicle Inspection",
          value: "housing"
        },
        boardingRequest: { text: "Boarding request", value: "housing" },
        electricalIssue: { text: "Electrical Issue", value: "housing" },
        fallenTreeInspection: {
          text: "Fallen Tree Inspection",
          value: "housing"
        },
        graffitiPrivateProperty: {
          text: "Graffiti Private Property",
          value: "housing"
        },
        housingViolations: {
          text: "housing Violations",
          value: "housing"
        },
        illegalDumpingPrivateProperty: {
          text: "Illegal Dumping Private Property",
          value: "housing"
        },
        leadPaintInspection: {
          text: "Lead Paint Inspection",
          value: "housing"
        },
        rentalRegistration: {
          text: "Rental Registration",
          value: "housing"
        },
        snowRemovalInspection: {
          text: "Snow Removal Inspection",
          value: "housing"
        },
        compensationAndBenefits: {
          text: "Compensation & Benefits",
          value: "hr"
        },
        dogLicenseIssue: { text: "Dog License Issue", value: "licenses" },
        buffaloTrafficViolations: {
          text: "Buffalo Traffic Violations",
          value: "movingViolations"
        },
        streetlights: { text: "Streetlights", value: "nationalGrid" },
        ospOtherIssue: { text: "OSP Other Issue", value: "osp" },
        abandonedVehicles: {
          text: "Abandoned Vehicles",
          value: "parkingViolationsBureau"
        },
        parkingIssues: {
          text: "Parking Issues",
          value: "parkingViolationsBureau"
        },
        pvbViolationsBureau: {
          text: "PVB Mobile App Issue",
          value: "parkingViolationsBureau"
        },
        pvbMobileAppTicket: {
          text: "PVB Mobile App Ticket",
          value: "parkingViolationsBureau"
        },
        pvbPayStation: {
          text: "PVB Pay Station",
          value: "parkingViolationsBureau"
        },
        pvbSingleMeter: {
          text: "PVB Single Meter",
          value: "parkingViolationsBureau"
        },
        vehicleBlockingSnowPlow: {
          text: "Vehicle Blocking Snow Plow",
          value: "parkingViolationsBureau"
        },
        engineeringOperational: {
          text: "Engineering Operational",
          value: "personnel"
        },
        basketballHoopInRow: {
          text: "Basketball Hoop in RoW",
          value: "police"
        },
        policeIssue: { text: "Police Issue", value: "police" },
        qualityofLifeIssue: {
          text: "Quality of Life Issue",
          value: "police"
        },
        snowRemoval: { text: "Snow Removal", value: "police" },
        inremRealEstate: {
          text: "Inrem Real Estate",
          value: "realEstate"
        },
        ospIllegalDumping: {
          text: "OSP Illegal Dumping",
          value: "realEstate"
        },
        pest: { text: "Pest", value: "rodentControl" },
        rodents: { text: "Rodents", value: "rodentControl" },
        electronicWaste: { text: "Electronic Waste", value: "sanitation" },
        garbageMissedPicked: {
          text: "Garbage Missed Pick Up",
          value: "sanitation"
        },
        illegalDumpingCurb: {
          text: "Illegal Dumping Curb",
          value: "sanitation"
        },
        illegalDumpingStreet: {
          text: "Illegal Dumping Street",
          value: "sanitation"
        },
        missedPickup2PieceLargeTrash: {
          text: "Missed Pickup 2 Piece Large Trash",
          value: "sanitation"
        },
        parkGarbagePickup: {
          text: "Park Garbage Pickup",
          value: "sanitation"
        },
        pickAndPay: { text: "Pick and Pay", value: "sanitation" },
        recyclingEscalatedQuestions: {
          text: "Recycling - Escalated Questions",
          value: "sanitation"
        },
        recyclingMissedPickUp: {
          text: "Recycling Missed Pick Up",
          value: "sanitation"
        },
        recyclingToteAbandonPickup: {
          text: "Recycling Tote Abandon Pickup",
          value: "sanitation"
        },
        recyclingToteCombo: {
          text: "Recycling Tote Combo",
          value: "sanitation"
        },
        recyclingToteDeliver: {
          text: "Recycling Tote Deliver",
          value: "sanitation"
        },
        recyclingTotePickup: {
          text: "Recycling Tote Pickup",
          value: "sanitation"
        },
        recyclingToteReplace: {
          text: "Recycling Tote Replace",
          value: "sanitation"
        },
        specialEventTotes: {
          text: "Special Event Totes",
          value: "sanitation"
        },
        totesAbandonPickup: {
          text: "Totes Abandon Pickup",
          value: "sanitation"
        },
        totesAudit: { text: "Totes Audit", value: "sanitation" },
        totesCombo: { text: "Totes Combo", value: "sanitation" },
        totesDeliver: { text: "Totes Deliver", value: "sanitation" },
        totesPickup: { text: "Totes Pickup", value: "sanitation" },
        totesReplace: { text: "Totes Replace", value: "sanitation" },
        totesReportOfRemovedBrokenTote: {
          text: "Totes Report of Removed Broken Tote",
          value: "sanitation"
        },
        trashOrdincanceViolation: {
          text: "Trash Ordinance Violation",
          value: "sanitation"
        },
        userFee: { text: "User Fee", value: "sanitation" },
        bulkTrash: { text: "Bulk Trash", value: "streets" },
        christmasTree: { text: "Christmas Tree", value: "streets" },
        damageFromSnowRemoval: {
          text: "Damage from Snow Removal",
          value: "streets"
        },
        excessTrash: { text: "Excess Trash", value: "streets" },
        fridge: { text: "Fridge", value: "streets" },
        leavesLawnDebris: {
          text: "Leaves / Lawn Debris",
          value: "streets"
        },
        pwVacantLot: { text: "PW Vacant Lot", value: "streets" },
        streetSalting: { text: "Street Salting", value: "streets" },
        streetSnowPlowing: {
          text: "Street Snow Plowing",
          value: "streets"
        },
        streetSnowPlowingIssue: {
          text: "Street Snow Plowing Issue",
          value: "streets"
        },
        sweeper: { text: "Sweeper", value: "streets" },
        damageFromStreetWorker: {
          text: "Damage from Street Worker",
          value: "streetsSanitation"
        },
        taxationIssue: { text: "Taxation Issue", value: "taxation" },
        telecommunications: {
          text: "Telecommunications",
          value: "telecommunications"
        },
        youthBureauIssue: {
          text: "Youth Bureau Issue",
          value: "youthBureau"
        }
      }
    };
  },
  computed: {
    filteredSubtypes() {
      var self = this;
      var tempObject = {};
      Object.keys(self.subtypes).forEach(idx => {
        if (self.subtypes[idx].value == self.issue.type) {
          tempObject[idx] = self.subtypes[idx];
        }
      });
      return tempObject;
    }
  },
  methods: {
    onFileChange(e) {
      var self = this;
      var files = e.target.files;
      Object.keys(files).forEach(index => {
        self.filePreview.push(URL.createObjectURL(files[index]));
      });
    },
    removeFile(idx) {
      this.filePreview.splice(idx);
    },
    saveIssue() {
      this.isSubmitting = true;
      this.issue.createdAt = new Date();
      var self = this;
      db.collection("issues")
        .add(self.issue)
        .then(function(docRef) {
          self.$router.push({
            name: "ReportPage",
            params: { issueId: docRef.id }
          });
        })
        .catch(function(error) {
          alert("Error adding document: ", error);
        });
    }
  }
};
</script>
