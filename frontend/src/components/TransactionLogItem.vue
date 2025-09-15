<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
    item: any
}>();
</script>

<template>
    <tr>
        <td>{{ item.name }}</td>
        <td>{{ item.amount }}</td>
        <td>{{ item.price }}</td>
        <td>{{ item.origin }}</td>
        <td>{{ item.date }}</td>
        <td>{{ item.totalPrice }}</td>
        <td>{{ item.steamValue }}</td>
        <td>{{ item.cashoutMargin }}</td>
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
</style>