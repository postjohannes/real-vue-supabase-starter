<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import type { GlobalTheme, GlobalThemeOverrides } from 'naive-ui'
import { darkTheme, NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui';
import { isDark } from './composables'

export default defineComponent({
  components: {
    NConfigProvider,
    NMessageProvider,
    NDialogProvider,
  },
  setup() {
    const appThemeOverrides: GlobalThemeOverrides = {
      common: {
        primaryColor: '#3ecf8e',
        warningColor: '#f48120',
      },
    };

    const getDarkTheme = computed(() => isDark.value ? darkTheme : null)

    return {
      darkTheme,
      getDarkTheme,
      appThemeOverrides
    };
  },
});
</script>

<template>
  <n-config-provider id="View" :theme="getDarkTheme" :theme-overrides="appThemeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <router-view/>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
html,
body,
#app,
#View {
  margin: 0;
  height: 100%;
}

#View {
  min-width: 800px;
  max-width: 1280px;
  margin: 0 auto;
}

.n-page-header-wrapper {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 30px;
}

.n-page-header {
  padding: 20px 0;
}

.n-page-header-wrapper {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 30px;
}

.n-page-header {
  padding: 20px 0;
}

.n-page-header-footer {
  padding-bottom: 10px;
}

.n-page-header-content {
  flex-grow: 1;
}

.n-page-header-content,
.n-page-header-footer {
  margin-top: -20px;
}

.n-page-header-footer {
  padding-bottom: 10px;
}

.n-page-header-content,
.n-page-header-footer {
  margin-top: -20px;
}
</style>
