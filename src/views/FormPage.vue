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
          <b-form @submit.prevent="addIssue()">
            <b-row>
              <b-col cols="12">
                <b-form-group label="What is the type?">
                  <b-form-select
                    v-model="issue.type"
                    :options="types"
                    @change="filterSubtypes()"
                  >
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
                <b-button type="submit" variant="primary">Submit</b-button>
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
      issue: {
        type: null,
        subtype: null,
        comments: null,
        email: null,
        createdAt: ""
      },
      anonymous: null,
      search: null,
      file: null,
      filePreview: [],
      filteredSubtypes: [],
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
          parentType: "adjudicationOrdinanceViolation"
        },
        otherAdjucationIssue: {
          text: "Other Adjudication Issue",
          parentType: "adjudicationOrdinanceViolation"
        },
        fairHousingIssue: {
          text: "Fair Housing Issue",
          parentType: "administration"
        },
        animals: { text: "Animals", parentType: "animalShelter" },
        deadAnimalRemoval: {
          text: "Dead Animal Removal",
          parentType: "animalShelter"
        },
        assessmentIssue: {
          text: "Assessment Issue",
          parentType: "assessmentAndTaxation"
        },
        bfdSnowOnHydrant: { text: "BFD Snow on Hydrant", parentType: "bfd" },
        fire: { text: "Fire", parentType: "bfd" },
        hmhaIssue: { text: "BMHA Issue", parentType: "bmha" },
        basementFlooding: {
          text: "Basement Flooding",
          parentType: "buffaloSewerAuthority"
        },
        rainBarrels: {
          text: "Rain Barrels",
          parentType: "buffaloSewerAuthority"
        },
        sewer: { text: "Sewer", parentType: "buffaloSewerAuthority" },
        streetFlooding: {
          text: "Street Flooding",
          parentType: "buffaloSewerAuthority"
        },
        fireHydrantIssue: {
          text: "Fire Hydrant Issue",
          parentType: "buffaloWaterAuthority"
        },
        waterIssue: {
          text: "Water Issue",
          parentType: "buffaloWaterAuthority"
        },
        waterTested: {
          text: "Water Tested",
          parentType: "buffaloWaterAuthority"
        },
        waterBillingMeter: {
          text: "Water Billing Meter",
          parentType: "buffaloWaterAuthority"
        },
        buildingMaintenance: {
          text: "Building Maintenance",
          parentType: "buildingsDivision"
        },
        cityhallCitycourtMaintenance: {
          text: "CityHall CityCourt Maintenance",
          parentType: "buildingsDivision"
        },
        cityPropert: {
          text: "City Property",
          parentType: "citizenServicesGraffiti"
        },
        obsceneOther: {
          text: "Obscene Other",
          parentType: "citizenServicesGraffiti"
        },
        obscenePrivateProperty: {
          text: "Obscene Private Property",
          parentType: "citizenServicesGraffiti"
        },
        other: { text: "Other", parentType: "citizenServicesGraffiti" },
        parksCity: {
          text: "Parks City",
          parentType: "citizenServicesGraffiti"
        },
        privateProperty: {
          text: "Private Property",
          parentType: "citizenServicesGraffiti"
        },
        pwEngineering: {
          text: "PW Engineering",
          parentType: "citizenServicesGraffiti"
        },
        pwTraffic: {
          text: "PW Traffic",
          parentType: "citizenServicesGraffiti"
        },
        qrtIllegalDumpingOnViaduct: {
          text: "QRT Illegal Dumping on Viaduct",
          parentType: "citizenServicesQuickResponseTeams"
        },
        qrtOtherIssue: {
          text: "QRT Other Issue",
          parentType: "citizenServicesQuickResponseTeams"
        },
        qrtSnowRemoval: {
          text: "QRT Snow Removal",
          parentType: "citizenServicesQuickResponseTeams"
        },
        snowRemovalBusStopShelter: {
          text: "Snow Removal Bus Stop Shelter",
          parentType: "citizenServicesQuickResponseTeams"
        },
        saveOurStreetsProgram: {
          text: "Save Our Streets Program",
          parentType: "citizenServicesSaveOurStreets"
        },
        greatAmericanCleanup: {
          text: "Great American Clean-Up",
          parentType: "citizenServicesCleanCity"
        },
        neighborhoodCleanup: {
          text: "Neighborhood CleanUp",
          parentType: "citizenServicesCleanCity"
        },
        cityClerkIssue: {
          text: "City Clerk Issue",
          parentType: "cityClerkIssue"
        },
        cityParkTreeIssue: {
          text: "City Park Tree Issue",
          parentType: "cityParks"
        },
        cityParks: { text: "City Parks", parentType: "cityParks" },
        olmstedParks: { text: "Olmsted Parks", parentType: "cityParks" },
        poolsAndSplashpads: {
          text: "Pools and Splashpads",
          parentType: "cityParks"
        },
        recreationCenter: {
          text: "Recreation Center",
          parentType: "cityParks"
        },
        cbo: { text: "CBO", parentType: "communityBasedOrgs" },
        bridgeIssue: {
          text: "Bridge Issue",
          parentType: "engineeringStreeRepairs"
        },
        caveIn: { text: "Cave In", parentType: "engineeringStreeRepairs" },
        curbMetalProtruding: {
          text: "Curb - Metal Protruding",
          parentType: "engineeringStreeRepairs"
        },
        curbs: { text: "Curbs", parentType: "engineeringStreeRepairs" },
        damagedStreetLightPole: {
          text: "Damaged Street Light Pole",
          parentType: "engineeringStreeRepairs"
        },
        otherHoleInRoad: {
          text: "Other Hole in Road",
          parentType: "engineeringStreeRepairs"
        },
        paving: { text: "Paving", parentType: "engineeringStreeRepairs" },
        potHole: { text: "Pot Hole", parentType: "engineeringStreeRepairs" },
        pwMissingManholeCover: {
          text: "PW Missing Manhole Cover",
          parentType: "engineeringStreeRepairs"
        },
        pwOngoingContrstruction: {
          text: "PW Ongoing Construction",
          parentType: "engineeringStreeRepairs"
        },
        sidewalks: { text: "Sidewalks", parentType: "engineeringStreeRepairs" },
        bikeRack: { text: "Bike Rack", parentType: "engineeringTraffic" },
        pavementMarketLine: {
          text: "Pavement Marking Lines",
          parentType: "engineeringTraffic"
        },
        pwNeighborhoodTrafficCalming: {
          text: "PW Neighborhood Traffic Calming",
          parentType: "engineeringTraffic"
        },
        rightOfWayIssue: {
          text: "Right of Way Issue",
          parentType: "engineeringTraffic"
        },
        signHazards: { text: "Sign Hazards", parentType: "engineeringTraffic" },
        signMaintenance: {
          text: "Sign Maintenance",
          parentType: "engineeringTraffic"
        },
        signalIssueDot: {
          text: "Signal Issue DoT",
          parentType: "engineeringTraffic"
        },
        signalOtherIssue: {
          text: "Signal Other Issue",
          parentType: "engineeringTraffic"
        },
        signalOutOrFlashing: {
          text: "Signal Out or Flashing",
          parentType: "engineeringTraffic"
        },
        signalTimingIssueCity: {
          text: "Signal Timing Issue City",
          parentType: "engineeringTraffic"
        },
        sneakersHanging: {
          text: "Sneakers Hanging",
          parentType: "engineeringTraffic"
        },
        fallenTreeBlockingRow: {
          text: "Fallen Tree Blocking RoW",
          parentType: "forestry"
        },
        fallenTreeInspection: {
          text: "Fallen Tree Inspection",
          parentType: "forestry"
        },
        stumpRemoval: { text: "Stump Removal", parentType: "forestry" },
        stumpRemovalQualityIssue: {
          text: "Stump Removal Quality Issue",
          parentType: "forestry"
        },
        treeOther: { text: "Tree Other", parentType: "forestry" },
        treePlantingQualityIssue: {
          text: "Tree Planting Quality Issue",
          parentType: "forestry"
        },
        treePlantingRequest: {
          text: "Tree Planting Request",
          parentType: "forestry"
        },
        treeRemoval: { text: "Tree Removal", parentType: "forestry" },
        treeRemovalChallenge: {
          text: "Tree Removal Challenge",
          parentType: "forestry"
        },
        treeRemovalPerInspector: {
          text: "Tree Removal per Inspector",
          parentType: "forestry"
        },
        treeRemovalQualityIssue: {
          text: "Tree Removal Quality Issue",
          parentType: "forestry"
        },
        treeTrimmingQualityIssue: {
          text: "Tree Trimming Quality Issue",
          parentType: "forestry"
        },
        treeTrimmingRequest: {
          text: "Tree Trimming Request",
          parentType: "forestry"
        },
        foilRecordsAssessmentAndTaxation: {
          text: "FOIL Records Assessment & Taxation",
          parentType: "freedomOfInformation"
        },
        foilRecordsCityClerk: {
          text: "FOIL Records City Clerk",
          parentType: "freedomOfInformation"
        },
        foilRecordsEdpis: {
          text: "FOIL Records EDPIS",
          parentType: "freedomOfInformation"
        },
        foilRecordsFireDept: {
          text: "FOIL Records Fire Dept",
          parentType: "freedomOfInformation"
        },
        foilRecordsHumanResources: {
          text: "FOIL Records Human Resources",
          parentType: "freedomOfInformation"
        },
        foilRecordsLawDept: {
          text: "FOIL Records Law Dept",
          parentType: "freedomOfInformation"
        },
        foilRecordsPoliceDept: {
          text: "FOIL Records Police Dept",
          parentType: "freedomOfInformation"
        },
        foilRecordsRealEstate: {
          text: "FOIL Records Real Estate",
          parentType: "freedomOfInformation"
        },
        waterfrontIssue: {
          text: "Waterfront Issues",
          parentType: "harborMaster"
        },
        abandonedVehicleInspection: {
          text: "Abandoned Vehicle Inspection",
          parentType: "housing"
        },
        boardingRequest: { text: "Boarding request", parentType: "housing" },
        electricalIssue: { text: "Electrical Issue", parentType: "housing" },
        fallenTreeInspection: {
          text: "Fallen Tree Inspection",
          parentType: "housing"
        },
        graffitiPrivateProperty: {
          text: "Graffiti Private Property",
          parentType: "housing"
        },
        housingViolations: {
          text: "housing Violations",
          parentType: "housing"
        },
        illegalDumpingPrivateProperty: {
          text: "Illegal Dumping Private Property",
          parentType: "housing"
        },
        leadPaintInspection: {
          text: "Lead Paint Inspection",
          parentType: "housing"
        },
        rentalRegistration: {
          text: "Rental Registration",
          parentType: "housing"
        },
        snowRemovalInspection: {
          text: "Snow Removal Inspection",
          parentType: "housing"
        },
        compensationAndBenefits: {
          text: "Compensation & Benefits",
          parentType: "hr"
        },
        dogLicenseIssue: { text: "Dog License Issue", parentType: "licenses" },
        buffaloTrafficViolations: {
          text: "Buffalo Traffic Violations",
          parentType: "movingViolations"
        },
        streetlights: { text: "Streetlights", parentType: "nationalGrid" },
        ospOtherIssue: { text: "OSP Other Issue", parentType: "osp" },
        abandonedVehicles: {
          text: "Abandoned Vehicles",
          parentType: "parkingViolationsBureau"
        },
        parkingIssues: {
          text: "Parking Issues",
          parentType: "parkingViolationsBureau"
        },
        pvbViolationsBureau: {
          text: "PVB Mobile App Issue",
          parentType: "parkingViolationsBureau"
        },
        pvbMobileAppTicket: {
          text: "PVB Mobile App Ticket",
          parentType: "parkingViolationsBureau"
        },
        pvbPayStation: {
          text: "PVB Pay Station",
          parentType: "parkingViolationsBureau"
        },
        pvbSingleMeter: {
          text: "PVB Single Meter",
          parentType: "parkingViolationsBureau"
        },
        vehicleBlockingSnowPlow: {
          text: "Vehicle Blocking Snow Plow",
          parentType: "parkingViolationsBureau"
        },
        engineeringOperational: {
          text: "Engineering Operational",
          parentType: "personnel"
        },
        basketballHoopInRow: {
          text: "Basketball Hoop in RoW",
          parentType: "police"
        },
        policeIssue: { text: "Police Issue", parentType: "police" },
        qualityofLifeIssue: {
          text: "Quality of Life Issue",
          parentType: "police"
        },
        snowRemoval: { text: "Snow Removal", parentType: "police" },
        inremRealEstate: {
          text: "Inrem Real Estate",
          parentType: "realEstate"
        },
        ospIllegalDumping: {
          text: "OSP Illegal Dumping",
          parentType: "realEstate"
        },
        pest: { text: "Pest", parentType: "rodentControl" },
        rodents: { text: "Rodents", parentType: "rodentControl" },
        electronicWaste: { text: "Electronic Waste", parentType: "sanitation" },
        garbageMissedPicked: {
          text: "Garbage Missed Pick Up",
          parentType: "sanitation"
        },
        illegalDumpingCurb: {
          text: "Illegal Dumping Curb",
          parentType: "sanitation"
        },
        illegalDumpingStreet: {
          text: "Illegal Dumping Street",
          parentType: "sanitation"
        },
        missedPickup2PieceLargeTrash: {
          text: "Missed Pickup 2 Piece Large Trash",
          parentType: "sanitation"
        },
        parkGarbagePickup: {
          text: "Park Garbage Pickup",
          parentType: "sanitation"
        },
        pickAndPay: { text: "Pick and Pay", parentType: "sanitation" },
        recyclingEscalatedQuestions: {
          text: "Recycling - Escalated Questions",
          parentType: "sanitation"
        },
        recyclingMissedPickUp: {
          text: "Recycling Missed Pick Up",
          parentType: "sanitation"
        },
        recyclingToteAbandonPickup: {
          text: "Recycling Tote Abandon Pickup",
          parentType: "sanitation"
        },
        recyclingToteCombo: {
          text: "Recycling Tote Combo",
          parentType: "sanitation"
        },
        recyclingToteDeliver: {
          text: "Recycling Tote Deliver",
          parentType: "sanitation"
        },
        recyclingTotePickup: {
          text: "Recycling Tote Pickup",
          parentType: "sanitation"
        },
        recyclingToteReplace: {
          text: "Recycling Tote Replace",
          parentType: "sanitation"
        },
        specialEventTotes: {
          text: "Special Event Totes",
          parentType: "sanitation"
        },
        totesAbandonPickup: {
          text: "Totes Abandon Pickup",
          parentType: "sanitation"
        },
        totesAudit: { text: "Totes Audit", parentType: "sanitation" },
        totesCombo: { text: "Totes Combo", parentType: "sanitation" },
        totesDeliver: { text: "Totes Deliver", parentType: "sanitation" },
        totesPickup: { text: "Totes Pickup", parentType: "sanitation" },
        totesReplace: { text: "Totes Replace", parentType: "sanitation" },
        totesReportOfRemovedBrokenTote: {
          text: "Totes Report of Removed Broken Tote",
          parentType: "sanitation"
        },
        trashOrdincanceViolation: {
          text: "Trash Ordinance Violation",
          parentType: "sanitation"
        },
        userFee: { text: "User Fee", parentType: "sanitation" },
        bulkTrash: { text: "Bulk Trash", parentType: "streets" },
        christmasTree: { text: "Christmas Tree", parentType: "streets" },
        damageFromSnowRemoval: {
          text: "Damage from Snow Removal",
          parentType: "streets"
        },
        excessTrash: { text: "Excess Trash", parentType: "streets" },
        fridge: { text: "Fridge", parentType: "streets" },
        leavesLawnDebris: {
          text: "Leaves / Lawn Debris",
          parentType: "streets"
        },
        pwVacantLot: { text: "PW Vacant Lot", parentType: "streets" },
        streetSalting: { text: "Street Salting", parentType: "streets" },
        streetSnowPlowing: {
          text: "Street Snow Plowing",
          parentType: "streets"
        },
        streetSnowPlowingIssue: {
          text: "Street Snow Plowing Issue",
          parentType: "streets"
        },
        sweeper: { text: "Sweeper", parentType: "streets" },
        damageFromStreetWorker: {
          text: "Damage from Street Worker",
          parentType: "streetsSanitation"
        },
        taxationIssue: { text: "Taxation Issue", parentType: "taxation" },
        telecommunications: {
          text: "Telecommunications",
          parentType: "telecommunications"
        },
        youthBureauIssue: {
          text: "Youth Bureau Issue",
          parentType: "youthBureau"
        }
      }
    };
  },
  computed: {},
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
    filterSubtypes() {
      var self = this;
      self.filteredSubtypes = [];
      Object.keys(self.subtypes).forEach(idx => {
        if (self.subtypes[idx].parentType == self.issue.type) {
          self.filteredSubtypes.push(self.subtypes[idx]);
        }
      });
    },
    addIssue() {
      var moment = require("moment");
      this.issue.createdAt = moment().format();
      db.ref("issues").push(this.issue);
      this.issue = [];
    }
  }
};
</script>
