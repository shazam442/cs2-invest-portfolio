<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
// @ts-ignore - No types available for sifter
import Sifter from "sifter";
import marketHashNames from "../../lib/static_assets/market_hash_names.json" with { type: "json" };

interface Props {
  modelValue: string;
  placeholder?: string;
  required?: boolean;
  items: string[];
  maxResults?: number;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  required: false,
  maxResults: 10,
});

const emit = defineEmits<Emits>();

const inputRef = ref<HTMLInputElement>();
const isOpen = ref(false);
const selectedIndex = ref(-1);
const searchQuery = ref(props.modelValue);

// Real CS2 market hash names data
const marketItems = marketHashNames as string[];

const sifter = new Sifter(marketItems.map(item => ({ text: item })));

const filteredItems = computed(() => {
  if (!searchQuery.value.trim() || searchQuery.value.trim().length < 3) {
    return [];
  }

  const results = sifter.search(searchQuery.value, {
    fields: ["text"],
    sort: [{ field: "score", direction: "desc" }],
    limit: props.maxResults,
  });

  return results.items.map((item: any) => marketItems[item.id]);
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;
  emit("update:modelValue", target.value);
  isOpen.value = true;
  selectedIndex.value = -1;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (!isOpen.value) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      selectedIndex.value = Math.min(selectedIndex.value + 1, filteredItems.value.length - 1);
      break;
    case "ArrowUp":
      event.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
      break;
    case "Enter":
      event.preventDefault();
      if (selectedIndex.value >= 0) {
        selectItem(filteredItems.value[selectedIndex.value]);
      }
      break;
    case "Escape":
      isOpen.value = false;
      selectedIndex.value = -1;
      break;
  }
};

const selectItem = (item: string) => {
  searchQuery.value = item;
  emit("update:modelValue", item);
  isOpen.value = false;
  selectedIndex.value = -1;
};

const handleFocus = () => {
  isOpen.value = true;
};

const handleBlur = () => {
  // Delay closing to allow for click events on dropdown items
  setTimeout(() => {
    isOpen.value = false;
    selectedIndex.value = -1;
  }, 150);
};

const handleClickOutside = (event: Event) => {
  if (inputRef.value && !inputRef.value.contains(event.target as Node)) {
    isOpen.value = false;
    selectedIndex.value = -1;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue;
});
</script>

<template>
  <div class="fuzzy-search-container" ref="inputRef">
    <input
      ref="inputRef"
      :value="searchQuery"
      @input="handleInput"
      @keydown="handleKeyDown"
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="placeholder"
      :required="required"
      class="input"
      autocomplete="off"
    />
    
    <div v-if="isOpen && filteredItems.length > 0" class="dropdown">
      <ul class="dropdown-list">
        <li
          v-for="(item, index) in filteredItems"
          :key="item"
          @click="selectItem(item)"
          :class="[
            'dropdown-item',
            { 'dropdown-item--selected': index === selectedIndex }
          ]"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.fuzzy-search-container {
  position: relative;
  width: 100%;
}

.input {
  width: 100%;
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  background: var(--color-bg);
  color: var(--color-text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 2px;
}

.dropdown-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-item {
  padding: var(--space-sm);
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.2s ease;
  font-size: var(--font-size-sm);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover,
.dropdown-item--selected {
  background: var(--color-bg-muted);
}

.dropdown-item:active {
  background: var(--color-primary);
  color: white;
}
</style>
