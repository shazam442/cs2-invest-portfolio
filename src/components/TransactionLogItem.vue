<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
import { type Database } from "../../lib/types/supabase.types";
import { formatDate, formatCurrency } from "../../lib/utils";
import { usePriceCheckStore } from "@src/stores";

const { item, canDelete } = defineProps<{
  item: Database["public"]["Tables"]["cs_transaction"]["Row"];
  canDelete?: boolean;
}>();

const emit = defineEmits<{
  deleteTransaction: [id: string];
}>();

const handleDeleteTransactionClicked = (id: string) => {
  console.debug("deleting transaction", id);
  emit("deleteTransaction", id);
};

const PriceChecks = usePriceCheckStore();
const latestPriceCheck = computed(() =>
  PriceChecks.priceChecks.find((pc) => pc.market_hash_name === item.name)
);

const steamLowestPrice = computed(() => latestPriceCheck.value?.lowest_price ?? 0);
const steamMedianPrice = computed(() => latestPriceCheck.value?.median_price ?? 0);
const steamCheckedAt = computed(() =>
  latestPriceCheck.value?.created_at
    ? new Date(latestPriceCheck.value.created_at).toLocaleString("de-DE")
    : ""
);
const steamTotalPrice = computed(() => (steamLowestPrice.value || 0) * (item.unit_factor || 0));
</script>

<template>
  <div class="transaction-item">
    <div class="item-main">
      <div class="item-info">
        <h4 class="item-name">{{ item.name }}</h4>
        <div class="item-meta">
          <span class="item-origin">{{ item.origin }}</span>
          <span class="item-date">{{ formatDate(item.transacted_at) }}</span>
        </div>
      </div>

      <div class="item-details">
        <div class="detail-item">
          <span class="detail-label">Anzahl</span>
          <span class="detail-value">{{ item.unit_factor }}x</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Einzelpreis</span>
          <span class="detail-value">{{ item.unit_price }} €</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Gesamtkosten</span>
          <span class="detail-value">{{ formatCurrency(item.unit_factor * item.unit_price) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Steam Einzel</span>
          <span
            class="detail-value steam-value"
            :title="steamCheckedAt ? `Preis geprüft: ${steamCheckedAt}` : ''"
          >
            {{ formatCurrency(steamLowestPrice) }}
          </span>
          <span class="detail-subtle">Median: {{ formatCurrency(steamMedianPrice) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Steam Gesamt</span>
          <span class="detail-value steam-value">{{ formatCurrency(steamTotalPrice) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Marge</span>
          <span class="detail-value margin-value">{{ formatCurrency(item.cashoutMargin) }}</span>
        </div>
      </div>

      <div class="item-actions" v-if="canDelete">
        <button class="delete-btn" @click="handleDeleteTransactionClicked(item.id)">
          -
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.delete-btn {
  background: var(--color-error);
  color: white;
  border: none;
  padding: 0 var(--space-xs);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: all 0.2s ease;
}

.transaction-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-sm);
  transition: all 0.2s ease;
  position: relative;
}

.transaction-item:hover {
  box-shadow: var(--shadow-sm);
  border-color: var(--color-border-strong);
}

.transaction-item:not(:last-child) {
  margin-bottom: var(--space-xs);
}

.item-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0 0 var(--space-xs) 0;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.item-origin {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  background: var(--color-bg-muted);
  padding: 2px var(--space-xs);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.item-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-subtle);
}

.item-details {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 60px;
}

.detail-label {
  font-size: 10px;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.detail-subtle {
  font-size: 10px;
  color: var(--color-text-muted);
}

.steam-value {
  color: var(--color-success);
}

.margin-value {
  color: var(--color-warning);
}

.item-actions {
  display: flex;
  align-items: center;
}

.btn-icon {
  font-size: var(--font-size-xs);
}

/* Responsive */
@media (max-width: 768px) {
  .item-main {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-sm);
  }

  .item-details {
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .detail-item {
    min-width: 50px;
  }
}

@media (max-width: 480px) {
  .item-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
  }

  .item-details {
    flex-direction: column;
    gap: var(--space-xs);
    align-items: stretch;
  }

  .detail-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width: auto;
  }
}
</style>
