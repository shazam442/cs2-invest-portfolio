<script setup lang="ts">
import { computed, provide } from "vue";

import DashboardCard from "../components/DashboardCard.vue";
import TransactionLog from "../components/TransactionLog.vue";
import AddTransactionForm from "../components/AddTransactionForm.vue";
import { type NewCsTransaction } from "../../lib/types/supabase.types";
import supabase from "../../lib/api";
import { useFlash } from "../composables/useFlash";
import { useAuth } from "../../lib/authentication";
import { useAppStore } from "@src/stores/useAppStore";
import { useUserProfileStore } from "@src/stores";

const Flash = useFlash();
const Auth = useAuth();
const App = useAppStore();
const userProfileStore = useUserProfileStore();

const DASHBOARD_GAP = {
  factor: 1.5,
  unit: "rem",
};

const DASHBOARD_GAP_FULL = computed(
  () => `${DASHBOARD_GAP.factor}${DASHBOARD_GAP.unit}`,
);

provide("globalStyles", {
  DASHBOARD_GAP,
  DASHBOARD_GAP_FULL,
});

const handleAddTransactionClicked = async (transaction: NewCsTransaction) => {
  const { data, error } = await supabase
    .from("cs_transaction")
    .insert(transaction)
    .select();

  App.transactions.push(data[0])

  if (error) {
    Flash.error(`Failed to add transaction: ${error.message}`);
  } else {
    Flash.success("Transaction added successfully!");
  }
};

const handleDeleteTransactionClicked = async (id: string) => {
  const response = await supabase
    .from("cs_transaction")
    .delete()
    .eq("id", id);

  console.debug("response", response);

  if (response.status !== 200) {
    Flash.error(`Failed to delete transaction: ${response.error?.message}`);
  } else {
    Flash.success("Transaction deleted successfully!");
  }
};

// Computed properties for dashboard statistics
const totalSpent = computed(() => {
  return App.transactions.reduce((sum, transaction) => {
    return sum + transaction.unit_factor * transaction.unit_price;
  }, 0);
});

const totalItems = computed(() => {
  return App.transactions.reduce((sum, transaction) => {
    return sum + transaction.unit_factor;
  }, 0);
});

const steamValue = computed(() => {
  // Steam market fees: 15% total (5% Steam + 10% game-specific for CS2)
  // Net value after fees = gross value / 1.15 - 0.01
  return totalSpent.value / 1.15 - 0.01;
});

const cashoutMargin = computed(() => {
  return steamValue.value - totalSpent.value;
});

const totalSpentChange = computed(() => {
  if (App.transactions.length === 0) return "0%";

  // Calculate change based on recent transactions (last 7 days)
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentTransactions = App.transactions.filter(
    (t) => t.transacted_at && new Date(t.transacted_at) >= weekAgo,
  );

  const recentValue = recentTransactions.reduce(
    (sum, t) => sum + t.unit_factor * t.unit_price,
    0,
  );
  const totalSpentNum = totalSpent.value;

  if (totalSpentNum === 0) return "0%";

  // Calculate what percentage of total value was added in the last 7 days
  const changePercent = (recentValue / totalSpentNum) * 100;
  return changePercent > 0
    ? `+${changePercent.toFixed(1)}%`
    : `${changePercent.toFixed(1)}%`;
});

const steamValueChange = computed(() => {
  if (App.transactions.length === 0) return "0%";

  // Calculate Steam value change based on recent transactions
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentTransactions = App.transactions.filter(
    (t) => t.transacted_at && new Date(t.transacted_at) >= weekAgo,
  );

  const recentValue = recentTransactions.reduce(
    (sum, t) => sum + t.unit_factor * t.unit_price,
    0,
  );
  const recentSteamValue = recentValue / 1.15 - 0.01;
  const totalSteamValue = steamValue.value;

  if (totalSteamValue === 0) return "0%";

  const changePercent = (recentSteamValue / totalSteamValue) * 100;
  return changePercent > 0
    ? `+${changePercent.toFixed(1)}%`
    : `${changePercent.toFixed(1)}%`;
});

const cashoutMarginChange = computed(() => {
  if (App.transactions.length === 0) return "0%";

  // Calculate cashout margin change based on recent transactions
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentTransactions = App.transactions.filter(
    (t) => t.transacted_at && new Date(t.transacted_at) >= weekAgo,
  );

  const recentValue = recentTransactions.reduce(
    (sum, t) => sum + t.unit_factor * t.unit_price,
    0,
  );
  const recentSteamValue = recentValue / 1.15 - 0.01;
  const recentMargin = recentValue - recentSteamValue;
  const totalMargin = cashoutMargin.value;

  if (totalMargin === 0) return "0%";

  const changePercent = (recentMargin / totalMargin) * 100;
  return changePercent > 0
    ? `+${changePercent.toFixed(1)}%`
    : `${changePercent.toFixed(1)}%`;
});

const totalItemsChange = computed(() => {
  if (App.transactions.length === 0) return "+0";

  // Calculate items added in the last 7 days
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentItems = App.transactions
    .filter((t) => t.transacted_at && new Date(t.transacted_at) >= weekAgo)
    .reduce((sum, t) => sum + t.unit_factor, 0);

  // Show percentage change for items if we have enough data
  if (totalItems.value > 0 && recentItems > 0) {
    const changePercent = (recentItems / totalItems.value) * 100;
    return changePercent > 0
      ? `+${changePercent.toFixed(1)}%`
      : `${changePercent.toFixed(1)}%`;
  }

  return recentItems > 0 ? `+${recentItems}` : "+0";
});

// Computed properties for change types
const totalSpentChangeType = computed(() => {
  const change = parseFloat(totalSpentChange.value.replace("%", ""));
  return change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
});

const steamValueChangeType = computed(() => {
  const change = parseFloat(steamValueChange.value.replace("%", ""));
  return change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
});

const cashoutMarginChangeType = computed(() => {
  const change = parseFloat(cashoutMarginChange.value.replace("%", ""));
  return change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
});

const totalItemsChangeType = computed(() => {
  const changeStr = totalItemsChange.value.replace("+", "").replace("%", "");
  const change = parseFloat(changeStr);
  return change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
});

const selectedUserProfile = computed(() => {
  return userProfileStore.userProfiles.find(userProfile => userProfile.user_id === App.selectedUserId);
})

// Utility function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
</script>

<template>
  <main class="main-content">
    <!-- Header Section -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-title-section">
          <h1 class="app-title">CS2 Investment Portfolio</h1>
          <div class="user-display-name">{{ selectedUserProfile?.display_name }}</div>
        </div>
      </div>
    </header>

    <!-- Stats Cards -->
    <section class="stats-section">
      <div class="stats-grid">
        <DashboardCard title="Portfolio" :value="formatCurrency(totalSpent)" :change="totalSpentChange"
          :change-type="totalSpentChangeType" icon="💰" />
        <DashboardCard title="Steam Netto" :value="formatCurrency(steamValue)" :change="steamValueChange"
          :change-type="steamValueChangeType" icon="🎮" />
        <DashboardCard title="Steam Gewinn" :value="formatCurrency(cashoutMargin)" :change="cashoutMarginChange"
          :change-type="cashoutMarginChangeType" icon="📈" />
        <DashboardCard title="Gesamt Items" :value="totalItems.toString()" :change="totalItemsChange"
          :change-type="totalItemsChangeType" icon="📦" />
      </div>
    </section>

    <!-- Content Grid -->
    <section class="content-section">
      <div class="content-grid">
        <!-- Transactions Panel -->
        <div class="transactions-container">
          <TransactionLog v-model="App.transactions" @delete-transaction="handleDeleteTransactionClicked" />
        </div>

        <!-- Side Panel -->
        <AddTransactionForm v-if="Auth.user.id === App.selectedUserId"
          @add-transaction="handleAddTransactionClicked" />
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Dashboard Header */
.dashboard-header {
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg-muted) 100%);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-xl);
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.header-title-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
}

.app-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0;
  background: linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.user-display-name {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  margin: 0;
  background: linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  display: inline-block;
  max-width: fit-content;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
  font-weight: var(--font-weight-bold);
}

.session-id {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: var(--color-bg-muted);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  display: inline-block;
  max-width: fit-content;
}

.page-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-xl);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--space-sm);
}

.btn-icon {
  margin-right: var(--space-xs);
}

/* Stats Section */
.stats-section {
  padding: var(--space-xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
}

/* Content Section */
.content-section {
  flex: 1;
  padding: 0 var(--space-xl) var(--space-xl);
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-lg);
  height: 100%;
}

.content-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
}

.main-panel {
  min-height: 0;
}

.side-panel {
  min-height: 0;
}

.transactions-container {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.panel-header {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-bg-muted);
}

.panel-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0;
}

.panel-actions {
  display: flex;
  gap: var(--space-sm);
}

.panel-content {
  flex: 1;
  padding: var(--space-lg);
  overflow: auto;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--color-bg-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.action-btn:hover {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.action-icon {
  font-size: var(--font-size-lg);
}

.action-text {
  flex: 1;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .dashboard-header {
    padding: var(--space-lg);
  }

  .app-title {
    font-size: var(--font-size-2xl);
  }

  .session-id {
    font-size: var(--font-size-xs);
    padding: var(--space-xs);
  }

  .page-header {
    padding: var(--space-lg);
  }

  .page-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
