<script setup lang="ts">
defineProps<{
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
}>();
</script>

<template>
  <div class="stats-card">
    <div class="card-header">
      <div class="card-icon">{{ icon }}</div>
      <div class="card-title">{{ title }}</div>
    </div>
    <div class="card-content">
      <div class="card-value">{{ value }}</div>
      <div class="card-change" :class="`change-${changeType}`">
        {{ change }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.stats-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-strong);
  transform: translateY(-2px);
}

.stats-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--color-accent),
    var(--color-accent-hover)
  );
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.card-icon {
  font-size: var(--font-size-xl);
  width: 40px;
  height: 40px;
  background: var(--color-bg-muted);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.card-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  line-height: 1.2;
}

.card-change {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.change-positive {
  color: var(--color-success);
}

.change-positive::before {
  content: "↗";
  font-size: var(--font-size-sm);
}

.change-negative {
  color: var(--color-error);
}

.change-negative::before {
  content: "↘";
  font-size: var(--font-size-sm);
}

.change-neutral {
  color: var(--color-text-muted);
}

.change-neutral::before {
  content: "→";
  font-size: var(--font-size-sm);
}

/* Responsive */
@media (max-width: 768px) {
  .stats-card {
    padding: var(--space-md);
  }

  .card-value {
    font-size: var(--font-size-xl);
  }

  .card-icon {
    width: 32px;
    height: 32px;
    font-size: var(--font-size-lg);
  }
}
</style>
