<template>
  <div id="app" class="bg-light">
    <b-navbar type="light" variant="white" class="shadow-sm" fixed="top">
      <b-navbar-brand :to="{ name: 'ReportsListPage' }">
        Buffalo 311
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-button variant="primary" :to="{ name: 'FormPage' }">
          Create New Report
        </b-button>
      </b-navbar-nav>
    </b-navbar>
    <router-view />
  </div>
</template>
