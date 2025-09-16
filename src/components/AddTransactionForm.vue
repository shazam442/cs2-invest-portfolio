<script setup lang="ts">
import { ref, defineEmits, onMounted, nextTick, watch } from "vue";
import { NewCsTransaction } from "../../lib/types/types";
import FuzzySearchInput from "./FuzzySearchInput.vue";

const newTransactionName = ref("");
const newTransactionAmount = ref(1);
const newTransactionPrice = ref(0);
const newTransactionOrigin = ref("steam");
const newTransactionDate = ref(new Date().toISOString().split('T')[0]);
const formKey = ref(0);

// Debug: Log initial values
onMounted(() => {
  console.debug("Form initial values:", {
    name: newTransactionName.value,
    amount: newTransactionAmount.value,
    price: newTransactionPrice.value,
    origin: newTransactionOrigin.value,
    date: newTransactionDate.value
  });
  
  // Force set the form values after mount to ensure they're displayed
  nextTick(() => {
    // Re-set the values to ensure they're properly bound
    forceSetDefaults();
    
    const amountInput = document.getElementById('newTransactionAmount') as HTMLInputElement;
    const priceInput = document.getElementById('newTransactionPrice') as HTMLInputElement;
    const originInput = document.getElementById('newTransactionOrigin') as HTMLInputElement;
    const dateInput = document.getElementById('newTransactionDate') as HTMLInputElement;
    
    console.debug("DOM input values after force set:", {
      amount: amountInput?.value,
      price: priceInput?.value,
      origin: originInput?.value,
      date: dateInput?.value
    });
  });
});

const emit = defineEmits(["addTransaction"]);

// Watch for changes to debug any unexpected resets
watch([newTransactionAmount, newTransactionPrice, newTransactionOrigin, newTransactionDate], 
  ([amount, price, origin, date], [oldAmount, oldPrice, oldOrigin, oldDate]) => {
    console.debug("Form values changed:", {
      amount: { from: oldAmount, to: amount },
      price: { from: oldPrice, to: price },
      origin: { from: oldOrigin, to: origin },
      date: { from: oldDate, to: date }
    });
  }
);

const handleAddTransactionClicked = () => {
  const transaction: NewCsTransaction = {
    name: newTransactionName.value,
    unit_factor: newTransactionAmount.value || 1,
    unit_price: newTransactionPrice.value,
    origin: newTransactionOrigin.value || "steam",
    transacted_at: newTransactionDate.value || new Date().toISOString(),
  };

  emit("addTransaction", transaction);
  
  // Clear form after successful submission
  clearForm();
};

const clearForm = () => {
  newTransactionName.value = "";
  newTransactionAmount.value = 1;
  newTransactionPrice.value = 0;
  newTransactionOrigin.value = "steam";
  newTransactionDate.value = new Date().toISOString().split('T')[0];
  formKey.value += 1; // Force form re-render
};

const forceSetDefaults = () => {
  newTransactionAmount.value = 1;
  newTransactionPrice.value = 0;
  newTransactionOrigin.value = "steam";
  newTransactionDate.value = new Date().toISOString().split('T')[0];
};
</script>

<template>
  <div class="add-transaction-form">
    <div class="form-header">
      <h3 class="form-title">Neue Transaktion hinzufügen</h3>
      <p class="form-subtitle">
        Geben Sie die Details des Kauf oder Verkaufes ein
      </p>
    </div>

    <form
      class="form"
      @submit.prevent.stop="handleAddTransactionClicked"
      :key="formKey"
    >
      <div class="form-grid">
        <div class="form-group">
          <label for="newTransactionName" class="label">Item Name</label>
          <FuzzySearchInput
            id="newTransactionName"
            v-model="newTransactionName"
            placeholder="z.B. AK-47 Redline"
            :required="true"
            :items="[]"
            :max-results="10"
          />
        </div>

        <div class="form-group">
          <label for="newTransactionAmount" class="label">Anzahl</label>
          <input
            id="newTransactionAmount"
            v-model="newTransactionAmount"
            type="number"
            class="input"
            placeholder="1"
            min="1"
            required
          />
        </div>

        <div class="form-group">
          <label for="newTransactionPrice" class="label">Einzelpreis (€)</label>
          <input
            id="newTransactionPrice"
            v-model="newTransactionPrice"
            type="number"
            class="input"
            placeholder="0,00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div class="form-group">
          <label for="newTransactionOrigin" class="label">Herkunft</label>
          <input
            id="newTransactionOrigin"
            v-model="newTransactionOrigin"
            type="text"
            class="input"
            placeholder="z.B. steam"
            required
          />
        </div>

        <div class="form-group">
          <label for="newTransactionDate" class="label">Kaufdatum</label>
          <input
            id="newTransactionDate"
            v-model="newTransactionDate"
            type="date"
            class="input"
            required
          />
        </div>

        <div class="form-group form-actions">
          <button type="submit" class="btn btn-primary">
            <span class="btn-icon">+</span>
            Transaktion hinzufügen
          </button>
          <button type="button" class="btn btn-secondary" @click="clearForm">
            <span class="btn-icon">↻</span>
            Formular leeren
          </button>
          <button type="button" class="btn btn-secondary" @click="forceSetDefaults">
            <span class="btn-icon">🔧</span>
            Setze Standardwerte
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-transaction-form {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
  box-shadow: var(--shadow-sm);
}

.form-header {
  margin-bottom: var(--space-lg);
  text-align: center;
}

.form-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0 0 var(--space-xs) 0;
}

.form-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
}

.form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
  margin-top: var(--space-md);
}

.btn-secondary {
  background: var(--color-bg-muted);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-border);
  color: var(--color-text);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn-icon {
  margin-right: var(--space-xs);
  font-size: var(--font-size-sm);
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .form-actions {
    flex-direction: column;
  }

  .add-transaction-form {
    padding: var(--space-md);
  }
}

@media (max-width: 480px) {
  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
