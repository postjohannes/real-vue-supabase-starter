<script setup lang="ts">
import { NButton, NIcon, NResult, NSpace } from 'naive-ui';
import router from "@/router";
import Icon from "@/components/Icon.vue";

const backClicked = () => {
  router.back();
}
</script>

<template>
  <n-space justify="center">
    <n-result
        status="404"
        title="404 Not Found"
        description="You know, life is sometimes ridiculous."
    >
      <template #footer>
        <n-button icon-placement="right" @click="backClicked">
          <template #icon>
            <icon type="Sync"/>
          </template>
          Go back
        </n-button>
      </template>
    </n-result>
  </n-space>
</template>

<style lang="scss" scoped>
.n-space {
  padding-top: 100px;
}
</style>
