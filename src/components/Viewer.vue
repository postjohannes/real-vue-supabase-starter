<script setup lang="ts">
import { useLoadingBar } from 'naive-ui'
import AppFooter from "@/layouts/AppFooter.vue";
import router from '../router'

const loadingBar = useLoadingBar()

router.beforeEach(() => loadingBar?.start())

router.afterEach(() => loadingBar?.finish())
</script>

<template>
  <router-view/>
  <app-footer/>
</template>
