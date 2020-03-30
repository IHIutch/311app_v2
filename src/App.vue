<template>
  <div id="app" class="bg-light antialiased">
    <b-navbar type="light" variant="white" fixed="top" class="shadow-sm h-14">
      <b-navbar-brand :to="{ name: 'ReportsListPage' }">
        Buffalo 311
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-button variant="primary" :to="{ name: 'FormPage' }">
          Create New Report
        </b-button>
      </b-navbar-nav>
    </b-navbar>
    <div class="pt-14">
      <router-view />
    </div>
  </div>
</template>
