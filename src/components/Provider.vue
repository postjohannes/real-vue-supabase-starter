<script setup lang="ts">
import { computed } from 'vue'
import { darkTheme } from 'naive-ui'
import { isDark } from '@/composables'

const theme = computed(() => isDark.value ? darkTheme : null)

</script>

<template>
  <n-config-provider :theme="theme">
    <n-global-style />
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <slot />
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
