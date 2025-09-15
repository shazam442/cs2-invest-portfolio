<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const newTransactionName = ref('');
const newTransactionAmount = ref(0);
const newTransactionPrice = ref(0);
const newTransactionOrigin = ref('');
const newTransactionDate = ref('');

const emit = defineEmits(['addTransaction']);

const handleAddTransactionClicked = () => {
    const transaction = {
        name: newTransactionName.value,
        amount: newTransactionAmount.value,
        price: newTransactionPrice.value,
        origin: newTransactionOrigin.value,
        date: newTransactionDate.value,
    }

    emit('addTransaction', transaction);
}

const clearForm = () => {
    newTransactionName.value = '';
    newTransactionAmount.value = 0;
    newTransactionPrice.value = 0;
    newTransactionOrigin.value = '';
    newTransactionDate.value = '';
}
</script>

<template>
    <form style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;"
        @submit.prevent.stop="handleAddTransactionClicked" @reset.prevent.stop="clearForm">
        <div style="display: flex; flex-direction: column;;">
            <label for="newTransactionName">Name</label>
            <input type="text" v-model="newTransactionName" style="margin-bottom: 1rem;" id="newTransactionName" />
        </div>
        <div style="display: flex; flex-direction: column;">
            <label for="newTransactionAmount">Amount</label>
            <input type="number" v-model="newTransactionAmount" style="margin-bottom: 1rem;"
                id="newTransactionAmount" />
        </div>
        <div style="display: flex; flex-direction: column;">
            <label for="newTransactionPrice">Price</label>
            <input type="text" v-model="newTransactionPrice" style="margin-bottom: 1rem;" id="newTransactionPrice" />
        </div>
        <div style="display: flex; flex-direction: column;">
            <label for="newTransactionOrigin">Origin</label>
            <input type="text" v-model="newTransactionOrigin" style="margin-bottom: 1rem;" id="newTransactionOrigin" />
        </div>
        <div style="display: flex; flex-direction: column;">
            <label for="newTransactionDate">Date</label>
            <input type="date" v-model="newTransactionDate" style="margin-bottom: 1rem;" id="newTransactionDate" />
        </div>
        <div style="display: flex; flex-direction: column;">
            <button type="submit">Add Transaction</button>
            <button type="reset">Clear Form</button>
        </div>
    </form>
</template>