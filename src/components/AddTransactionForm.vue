<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { NewCsTransaction } from "../../lib/types/types";

const newTransactionName = ref("");
const newTransactionAmount = ref(1);
const newTransactionPrice = ref(0);
const newTransactionOrigin = ref("");
const newTransactionDate = ref("");

const emit = defineEmits(["addTransaction"]);

const handleAddTransactionClicked = () => {
  const transaction: NewCsTransaction = {
    name: newTransactionName.value,
    unit_factor: newTransactionAmount.value || 1,
    unit_price: newTransactionPrice.value,
    origin: newTransactionOrigin.value || "steam",
    transacted_at: newTransactionDate.value || new Date().toISOString(),
  };

  emit("addTransaction", transaction);
};

const clearForm = () => {
  newTransactionName.value = "";
  newTransactionAmount.value = 1;
  newTransactionPrice.value = 0;
  newTransactionOrigin.value = "";
  newTransactionDate.value = "";
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
      @reset.prevent.stop="clearForm"
    >
      <div class="form-grid">
        <div class="form-group">
          <label for="newTransactionName" class="label">Item Name</label>
          <input
            id="newTransactionName"
            v-model="newTransactionName"
            type="text"
            class="input"
            placeholder="z.B. AK-47 Redline"
            required
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
          <button type="reset" class="btn btn-secondary">
            <span class="btn-icon">↻</span>
            Formular leeren
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
