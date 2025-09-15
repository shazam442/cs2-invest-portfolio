<script setup lang="ts">
import { defineEmits, ref, inject } from 'vue';
import mongoClient from '../../lib/mongo';
import { type Transaction } from '../../lib/types';
import TransactionLogItem from './TransactionLogItem.vue';

const transactions = defineModel<Transaction[]>();

const error = ref<string | null>(null);

const globalStyles = inject('globalStyles') as { DASHBOARD_GAP: { factor: number, unit: string } };

const emit = defineEmits(['deleteTransaction']);

const handleDeleteTransactionClicked = (id: string) => {
  console.debug('deleteTransactionClicked', id);
  emit('deleteTransaction', id);
  transactions.value = transactions.value.filter(transaction => transaction._id !== id);
}

</script>

<template>
  <table :style="{ padding: globalStyles.DASHBOARD_GAP }" style="width: 100%;">
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
      <TransactionLogItem v-for="transaction in transactions" :key="transaction._id || transaction.name"
        :item="transaction" @deleteTransaction="handleDeleteTransactionClicked($event)" />
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