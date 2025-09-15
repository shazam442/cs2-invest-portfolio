<script setup lang="ts">
import TransactionLogItem from './TransactionLogItem.vue';

const sampleItem = {
  name: 'Sample Item',
  amount: 100,
  price: 100,
  origin: 'Sample Origin',
  date: '2021-01-01',
  totalPrice: 10000,
  steamValue: 10000,
  cashoutMargin: 10000
}
</script>

<template>
  <table :style="{ padding: DASHBOARD_GAP }" style="width: 100%;">
    <thead>
      <tr>
        <th>Name</th>
        <th>Anzahl</th>
        <th>Einheitspreis</th>
        <th>Ursprung</th>
        <th>Datum</th>
        <th>Kaufpreis gesamt</th>
        <th>Steamwert heute</th>
        <th>Cashoutmarge</th>
      </tr>
    </thead>
    <tbody>
      <TransactionLogItem :item="sampleItem" />
    </tbody>
  </table>
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th {
  background-color: var(--color-bg-muted);
  color: var(--color-text);
  font-weight: 600;
  padding: 0.75rem 0.5rem;
  text-align: left;
  border-bottom: 2px solid var(--color-border);
}

th:first-child {
  padding-left: 0;
}

th:last-child {
  padding-right: 0;
}
</style>