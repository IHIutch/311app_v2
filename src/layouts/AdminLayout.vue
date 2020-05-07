<template>
  <div>
    <b-navbar type="light" variant="white" fixed="top" class="shadow-sm h-14">
      <b-navbar-brand :to="{ name: 'ReportsListPage' }">
        Buffalo 311
      </b-navbar-brand>
    </b-navbar>
    <div class="pt-14">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminLayout",
};
</script>
