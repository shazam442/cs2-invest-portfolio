<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { type Database } from '../../lib/supabase.types';
import { formatDate } from '../../lib/utils';

const props = defineProps<{
    item: Database['public']['Tables']['cs_transaction']['Row']
}>();

const emit = defineEmits(['deleteTransaction']);

const handleDeleteTransactionClicked = (id: string) => {
    console.log('deleting transaction', id);
    emit('deleteTransaction', id);
}
</script>

<template>
    <tr>
        <td>{{ item.name }}</td>
        <td>{{ item.unit_factor }}x</td>
        <td>{{ item.unit_price }} €</td>
        <td>{{ item.origin }}</td>
        <td>{{ formatDate(item.transacted_at) }}</td>
        <td>{{ item.unit_factor * item.unit_price }} €</td>
        <td>{{ item.steamValue || "-" }} €</td>
        <td>{{ item.cashoutMargin || "-" }} €</td>
        <td><button class="delete-btn" @click="handleDeleteTransactionClicked(item.id)">Del</button>
        </td>
    </tr>
</template>

<style scoped>
tr {
    border-bottom: 1px solid var(--color-border);
}

tr:hover {
    background-color: var(--color-bg-muted);
}

td {
    padding: 0.75rem 0.5rem;
    color: var(--color-text);
}

td:first-child {
    padding-left: 0;
    font-weight: 500;
}

td:last-child {
    padding-right: 0;
}

.delete-btn {
    background-color: red;
    border: none;
    padding: 0.2rem 0.5rem;
    color: white;
    border-radius: 0.2rem;
}
</style>