<script setup lang="ts">
import { ref, watch } from "vue";
import { FormInst, NDrawer, NDrawerContent, NForm, NFormItem, NInput, NButton, NSwitch,NSkeleton, useMessage } from 'naive-ui';

import { initSettings, updateSettings } from "@/services/SettingsService";
import { useProfileSettingsStore } from "@/stores/settingsStore";
import { useAppStore } from "@/stores/appStore";

const store = useProfileSettingsStore()
const message = useMessage();

const loading = ref(false)
const show = ref(false)
const model = ref({
  name: '',
  email: '',
  newsletterSubscribe: false
})

const props = defineProps({
  active: {
    type: [Boolean],
    required: false,
    default: null,
  }
})
watch(() => props.active, async () => {
  if (props.active) {
    loading.value = true
    show.value = true
    if (!store.initialized) {
      await initSettings()
    }
    model.value.name = store.settings.displayName
    model.value.email = store.settings.email
    model.value.newsletterSubscribe = store.settings.newsletterSubscribe
    loading.value = false
  }
})

const emits = defineEmits(['close'])
watch(show, () => {
  if (!show.value)
    emits('close')
})
const formRef = ref<FormInst | null>(null)

async function saveSettings() {
  loading.value = true
  await updateSettings({
    displayName: model.value.name,
    email: model.value.email,
    newsletterSubscribe: model.value.newsletterSubscribe
  }, useAppStore().userId)
  message.info('Your profile settings are saved.')
  loading.value = false
  show.value = false
}
</script>

<template>
  <n-drawer v-model:show="show" :native-scrollbar="true" :width="502">
    <n-drawer-content title="Profile Settings" closable>
      <div v-if="loading">
        <n-skeleton text :repeat="2"/>
        <n-skeleton text style="width: 60%"/>
      </div>
      <div v-else>
        <n-form
            ref="formRef"
            :model="model"
            label-placement="left"
            label-width="auto">
          <n-form-item label="Your name" path="name">
            <n-input v-model:value="model.name"/>
          </n-form-item>
          <n-form-item label="Contact email" path="email">
            <n-input v-model:value="model.email"/>
          </n-form-item>
          <n-form-item label="Get newsletter" path="newsletterSubscribe">
            <n-switch v-model:value="model.newsletterSubscribe"/>
          </n-form-item>
        </n-form>
      </div>
      <template #footer>
        <div style="display: flex; justify-content: flex-end">
          <n-button class="dist" round type="warning" @click="show = false">
            Close
          </n-button>
          <n-button round type="primary" :disabled="loading" @click="saveSettings">
            Save
          </n-button>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
.dist {
  margin-right: 10px;
}
</style>