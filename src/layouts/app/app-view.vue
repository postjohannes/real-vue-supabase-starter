<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NPageHeader, useMessage } from 'naive-ui';
import { handleSignOut } from '@/services/AuthService';
import { createProfile, hasSupabaseEntry } from '@/services/ProfileService';
import { useAppStore } from '@/stores/appStore';
import { useProfileStore } from '@/stores/profileStore';
import { toggleDark } from '@/composables';
import SideBarProfileSettings from '@/components/SideBarProfileSettings.vue'
import { defaultMenus, mapping } from "@/composables/menu";
import Logo from '@/components/Logo.vue'

const router = useRouter();
const message = useMessage()
const activeNav = ref('');
const navLinks = [
  {
    key: 'dashboard',
    label: 'Dashboard'
  },
  {
    key: 'profile',
    label: 'Profile'
  },
]

const settingsVisible = ref(false)
const moreOptions = [
  {
    key: 'toggle_theme',
    label: 'Toggle theme'
  },
  {
    key: 'settings',
    label: 'Settings'
  }
]

const navActive = (type: any) => {
  if (router.currentRoute.value.name === type) {
    return '#f48120';
  }
  return '';
};

const navClicked = (type: string) => {
  activeNav.value = type;
  switch (type) {
    case 'dashboard':
      router.push('/dashboard');
      break;
    case 'profile':
      router.push('/profile');
      break;
    case 'settings':
      settingsVisible.value = !settingsVisible.value
      break;
    case 'toggle_theme':
      toggleDark()
      break;
    case 'sign_out':
      handleSignOut();
      router.push('/');
      break;
    default:
      break;
  }
};

const closeSettings = (value: boolean) => {
  settingsVisible.value = value
}

const currentKey = ref<string>('')
const expandedKeys = ref<string[]>([])
const options = mapping(defaultMenus)

onMounted(async () => {
  const appStore = useAppStore();
  const session = appStore.supabaseSession
  const profileStore = useProfileStore()
  if (session && !profileStore.initialized && !await hasSupabaseEntry(appStore.userId || '')) {
    const error = await createProfile(appStore.loginProvider, appStore.userLastLogin)
    if (error)
      message.error(`Something went wrong: ${error.message}`)
    else
      message.info('This is your first login. Please take some time to complete your profile.');
    router.push('/profile');
  }
})
</script>

<template>
  <n-space vertical size="large">
    <n-layout position="absolute" has-sider>
      <n-layout-sider
          collapse-mode="width"
          show-trigger="bar"
          bordered
      >
        <Logo/>
        <n-divider/>
        <n-menu
            :value="currentKey"
            :default-expanded-keys="expandedKeys"
            :options="options"
            :root-indent="18"
            @update:value="k => { currentKey = k }"
        />
      </n-layout-sider>

      <n-layout-content content-style="padding: 24px;">
        <n-page-header>
          <n-divider/>

          <slot/>

          <template #extra>
            <n-space>
              <n-button
                  v-for="nav in navLinks"
                  :key="nav.key"
                  :text-color="navActive(nav.key)"
                  :bordered="false"
                  @click="navClicked(nav.key)"
              >
                <b>{{ nav.label }}</b>
              </n-button>
              <n-dropdown
                  placement="bottom-start"
                  :options="moreOptions"
                  @select="navClicked">
                <n-button
                    :bordered="false">
                  <b>More</b>
                </n-button>
              </n-dropdown>
              <n-button type="error" dashed @click="navClicked('sign_out')">
                <b>Sign Out</b>
              </n-button>
            </n-space>
          </template>
        </n-page-header>
      </n-layout-content>
    </n-layout>
  </n-space>

  <side-bar-profile-settings :active="settingsVisible" @close="closeSettings"/>
</template>

<style lang="scss" scoped>
</style>
