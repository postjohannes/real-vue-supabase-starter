<script setup lang="ts">
import { useMessage } from 'naive-ui';

import { onMounted } from "vue";
import { createSettings, hasSettings, initSettings } from "@/services/SettingsService";
import { useProfileSettingsStore } from "@/stores/settingsStore";

const message = useMessage()

const profileSettingsStore = useProfileSettingsStore()

initSettings()

onMounted(async () => {
  if (!profileSettingsStore.initialized && !await hasSettings()) {
    const error = await createSettings()
    if (error)
      message.error(`Something went wrong: ${error.message}`)
  }
})
</script>

<template>
  <app-view>
    <h1>Profile from '{{ profileSettingsStore.settings.displayName }}'</h1>
  </app-view>
</template>
