<script setup lang="ts">
import { computed } from 'vue';

import DashboardCard from './components/DashboardCard.vue';
import TransactionLog from './components/TransactionLog.vue';

const DASHBOARD_GAP = {
  factor: 1.5,
  unit: "rem"
}

const DASHBOARD_GAP_FULL = computed(() => `${DASHBOARD_GAP.factor}${DASHBOARD_GAP.unit}`)
</script>

<template>
  <div style="display: flex; flex-direction: row; height: 100vh; width: 100vw; align-items: stretch;">
    <div style="width: 5rem; background-color: var(--color-bg-muted); padding: 1rem;">
      <div style="font-weight: bold; text-align: center; padding: 0.5rem;">
        CS2
      </div>
    </div>

    <div style="flex-grow: 1; display: flex; flex-direction: column; align-items: stretch; padding: 3rem;"
      :style="{ gap: DASHBOARD_GAP.factor * 1.5 + DASHBOARD_GAP.unit }">
      <div
        style="display: flex; flex-direction: row; align-items: stretch; justify-content: space-between; flex-grow: 1"
        :style="{ gap: DASHBOARD_GAP_FULL }">
        <DashboardCard />
        <DashboardCard />
        <DashboardCard />
        <DashboardCard />
      </div>
      <div
        style="display: flex; flex-direction: row; align-items: stretch; justify-content: space-between; flex-grow: 4;"
        :style="{ gap: DASHBOARD_GAP_FULL }">
        <div style="flex-grow: 5; background-color: var(--color-surface); padding: 1rem;">
          <TransactionLog />
        </div>
        <div style="flex-grow: 1; background-color: var(--color-bg-muted);" :style="{ padding: DASHBOARD_GAP }">card2
        </div>
      </div>
    </div>

  </div>

</template>

<style scoped></style>
