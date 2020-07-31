<template>
  <div>
    <AdminNav />
    <nuxt class="pt-14" />
  </div>
</template>

<script>
import AdminNav from "@/components/common/AdminNav";

export default {
  name: "AdminLayout",
  components: {
    AdminNav
  }
};
</script>
