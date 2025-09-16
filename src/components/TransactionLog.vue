<script setup lang="ts">
import { defineEmits, ref, inject, computed } from "vue";
import supabase from "../../lib/api";
import { type Database } from "../../lib/types/supabase.types";
import TransactionLogItem from "./TransactionLogItem.vue";
import { formatDate, formatCurrency } from "../../lib/utils";
import { usePriceCheckStore } from "@src/stores";
import { getItemPrice } from "@lib/steamMarket";

const transactions =
  defineModel<Database["public"]["Tables"]["cs_transaction"]["Row"][]>();

defineProps<{ canDelete?: boolean }>();

const error = ref<string | null>(null);
const sortBy = ref<"date" | "name" | "value">("date");
const sortOrder = ref<"asc" | "desc">("desc");
const filterOrigin = ref<string>("all");
const showFilters = ref<boolean>(false);

const globalStyles = inject("globalStyles") as {
  DASHBOARD_GAP: { factor: number; unit: string };
};

const emit = defineEmits(["deleteTransaction"]);

const handleDeleteTransactionClicked = (id: string) => {
  console.debug("deleteTransactionClicked", id);
  emit("deleteTransaction", id);
  transactions.value = transactions.value.filter(
    (transaction) => transaction.id !== id,
  );
};

const sortedAndFilteredTransactions = computed(() => {
  if (!transactions.value) return [];

  let filtered = transactions.value;

  // Filter by origin
  if (filterOrigin.value !== "all") {
    filtered = filtered.filter((t) => t.origin === filterOrigin.value);
  }

  // Sort transactions
  return filtered.sort((a, b) => {
    let comparison = 0;

    switch (sortBy.value) {
      case "date":
        comparison =
          new Date(a.transacted_at).getTime() -
          new Date(b.transacted_at).getTime();
        break;
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "value":
        const aValue = a.unit_factor * a.unit_price;
        const bValue = b.unit_factor * b.unit_price;
        comparison = aValue - bValue;
        break;
    }

    return sortOrder.value === "asc" ? comparison : -comparison;
  });
});

const uniqueItems = computed(() => {
  if (!transactions.value) return [] as string[];
  const names = [...new Set(transactions.value.map((t) => t.name))];
  return names.sort((a, b) => a.localeCompare(b));
})

const priceChecks = usePriceCheckStore();
const isCheckingPrices = ref(false);

const handleCheckPricesClicked = async () => {
  if (!uniqueItems.value.length || isCheckingPrices.value) return;
  isCheckingPrices.value = true;
  try {
    for (const name of uniqueItems.value) {
      // Randomized small delay before each call to spread requests
      const jitter = 200 + Math.floor(Math.random() * 400); // 200-600ms
      await new Promise((resolve) => setTimeout(resolve, jitter));

      const result = await getItemPrice(name, {
        currency: 3,
        appId: 730,
        retries: 4,
        baseDelayMs: 900,
        maxDelayMs: 6000,
      });
      await priceChecks.add({
        market_hash_name: name,
        lowest_price: result.lowestPrice ?? null,
        median_price: result.medianPrice ?? null,
      });
      // Base throttle to avoid Steam rate limits
      await new Promise((resolve) => setTimeout(resolve, 900));
    }
  } catch (err) {
    console.error("Error checking prices:", err);
  } finally {
    isCheckingPrices.value = false;
  }
};

const uniqueOrigins = computed(() => {
  if (!transactions.value) return [];
  const origins = [...new Set(transactions.value.map((t) => t.origin))];
  return origins.sort();
});

const totalValue = computed(() => {
  if (!transactions.value) return 0;
  return transactions.value.reduce((sum, t) => sum + (t.unit_factor * t.unit_price), 0);
});

const totalItems = computed(() => {
  if (!transactions.value) return 0;
  return transactions.value.reduce((sum, t) => sum + t.unit_factor, 0);
});

const averageValue = computed(() => {
  if (!transactions.value || transactions.value.length === 0) return 0;
  return totalValue.value / transactions.value.length;
});

const toggleSort = (field: "date" | "name" | "value") => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortOrder.value = "asc";
  }
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};
</script>

<template>
  <div class="transaction-log">
    <div class="log-header">
      <div class="log-title">
        <h3>Transaktionshistorie</h3>
        <div class="log-stats">
          <span class="log-count">{{ totalItems }} Items | {{ sortedAndFilteredTransactions.length }}
            Transaktionen</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="filter-toggle-btn" :disabled="isCheckingPrices" @click="handleCheckPricesClicked">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          {{ isCheckingPrices ? 'Prüfe Preise…' : 'Preis-Check' }}
        </button>

        <button class="filter-toggle-btn" :class="{ active: showFilters }" @click="toggleFilters">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
          </svg>
          Filter
        </button>
      </div>
    </div>

    <!-- Filters and Sorting -->
    <div v-show="showFilters" class="log-controls">
      <div class="control-group">
        <label class="control-label">Nach Herkunft filtern:</label>
        <select v-model="filterOrigin" class="control-select">
          <option value="all">Alle Herkünfte</option>
          <option v-for="origin in uniqueOrigins" :key="origin" :value="origin">
            {{ origin }}
          </option>
        </select>
      </div>

      <div class="control-group">
        <label class="control-label">Sortieren nach:</label>
        <div class="sort-buttons">
          <button class="sort-btn" :class="{ active: sortBy === 'date' }" @click="toggleSort('date')">
            Datum
            {{ sortBy === "date" ? (sortOrder === "asc" ? "↑" : "↓") : "" }}
          </button>
          <button class="sort-btn" :class="{ active: sortBy === 'name' }" @click="toggleSort('name')">
            Name
            {{ sortBy === "name" ? (sortOrder === "asc" ? "↑" : "↓") : "" }}
          </button>
          <button class="sort-btn" :class="{ active: sortBy === 'value' }" @click="toggleSort('value')">
            Wert
            {{ sortBy === "value" ? (sortOrder === "asc" ? "↑" : "↓") : "" }}
          </button>
        </div>
      </div>
    </div>

    <div class="log-content">
      <div v-if="!transactions || transactions.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <h4>Noch keine Transaktionen</h4>
        <p>Fügen Sie Ihren ersten CS2-Item-Kauf hinzu, um zu beginnen</p>
      </div>

      <div v-else-if="sortedAndFilteredTransactions.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h4>Keine passenden Transaktionen</h4>
        <p>
          Versuchen Sie, Ihre Filter anzupassen, um mehr Ergebnisse zu sehen
        </p>
      </div>

      <div v-else class="transaction-list">
        <TransactionLogItem v-for="transaction in sortedAndFilteredTransactions"
          :key="transaction.id || transaction.name" :item="transaction" :can-delete="canDelete"
          @delete-transaction="handleDeleteTransactionClicked($event)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.transaction-log {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.log-header {
  background: var(--color-bg-muted);
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.log-title {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.log-title h3 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0;
}

.log-stats {
  display: flex;
  align-items: center;
  gap: 6px;
}

.log-count {
  font-size: 10px;
  color: var(--color-text-muted);
  background: var(--color-surface);
  padding: 1px var(--space-xs);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  font-weight: var(--font-weight-medium);
}

.log-value {
  font-size: 10px;
  color: var(--color-accent);
  background: var(--color-accent-light);
  padding: 1px var(--space-xs);
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-semibold);
}

.log-avg {
  font-size: 9px;
  color: var(--color-text-subtle);
  background: var(--color-bg-muted);
  padding: 1px 4px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-medium);
}

.filter-toggle-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px var(--space-xs);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-toggle-btn:hover {
  background: var(--color-bg-muted);
  color: var(--color-text);
  border-color: var(--color-border-strong);
}

.filter-toggle-btn.active {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.filter-toggle-btn svg {
  flex-shrink: 0;
}

.log-controls {
  background: var(--color-bg-muted);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-xs) var(--space-md);
  display: flex;
  gap: var(--space-sm);
  align-items: center;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.control-label {
  font-size: 10px;
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  white-space: nowrap;
}

.control-select {
  padding: 2px 4px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 10px;
  min-width: 80px;
  height: 20px;
}

.control-select:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.sort-buttons {
  display: flex;
  gap: 1px;
}

.sort-btn {
  padding: 2px 6px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  height: 20px;
}

.sort-btn:hover {
  background: var(--color-bg-muted);
  color: var(--color-text);
  border-color: var(--color-border-strong);
}

.sort-btn.active {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.log-content {
  max-height: 500px;
  overflow-y: auto;
  padding: var(--space-xs);
}

.empty-state {
  text-align: center;
  padding: var(--space-md);
  color: var(--color-text-muted);
}

.empty-icon {
  font-size: 1.5rem;
  margin-bottom: var(--space-xs);
}

.empty-state h4 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0 0 4px 0;
}

.empty-state p {
  font-size: 10px;
  margin: 0;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Custom scrollbar */
.log-content::-webkit-scrollbar {
  width: 6px;
}

.log-content::-webkit-scrollbar-track {
  background: var(--color-bg-muted);
}

.log-content::-webkit-scrollbar-thumb {
  background: var(--color-border-strong);
  border-radius: 3px;
}

.log-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-subtle);
}

/* Responsive */
@media (max-width: 768px) {
  .log-header {
    flex-direction: column;
    gap: var(--space-xs);
    align-items: stretch;
  }

  .log-stats {
    flex-wrap: wrap;
    gap: 4px;
  }

  .log-controls {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-xs);
  }

  .control-group {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
  }

  .sort-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }

  .log-content {
    max-height: 400px;
  }
}

@media (max-width: 480px) {
  .log-controls {
    padding: var(--space-xs) var(--space-sm);
  }

  .sort-buttons {
    gap: 2px;
  }

  .sort-btn {
    flex: 1;
    min-width: 0;
    font-size: 9px;
  }
}
</style>
