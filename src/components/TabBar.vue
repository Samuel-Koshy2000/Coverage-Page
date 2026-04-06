<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
    // [{ label: 'All Platforms', count: 106 }, ...]
  },
  modelValue: {
    type: String,
    required: true,
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <nav class="tab-bar" role="tablist" aria-label="Platform categories">
    <button
      v-for="tab in tabs"
      :key="tab.label"
      role="tab"
      :aria-selected="modelValue === tab.label"
      :class="['tab', { 'tab--active': modelValue === tab.label }]"
      @click="$emit('update:modelValue', tab.label)"
    >
      {{ tab.label }}
      <span class="tab__count">{{ tab.count }}</span>
    </button>
  </nav>
</template>

<style scoped>
.tab-bar {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  padding: 0 24px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1px;
}

.tab:hover {
  color: #111827;
}

.tab:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
  border-radius: 4px;
}

.tab--active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.tab__count {
  font-size: 11px;
  font-weight: 600;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 10px;
  padding: 1px 7px;
  min-width: 22px;
  text-align: center;
}

.tab--active .tab__count {
  background: #eff6ff;
  color: #2563eb;
}
</style>
