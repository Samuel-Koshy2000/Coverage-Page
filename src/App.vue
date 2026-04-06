<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useDatasources } from './composables/useDatasources.js'
import { stableSort } from './utils/sort.js'
import TabBar from './components/TabBar.vue'
import DataTable from './components/DataTable.vue'

const CATEGORIES = [
  'All Platforms',
  'Gig Economy',
  'Payments',
  'Payroll & HRIS',
  'Tax Portals',
  'Utilities',
]

// ── URL state init ────────────────────────────────────────────────────────────
function readUrlState() {
  const p = new URLSearchParams(window.location.search)
  return {
    tab:      p.get('tab') || 'All Platforms',
    search:   p.get('search') || '',
    sortKey:  p.get('sortKey') || 'name',
    sortDir:  p.get('sortDir') || 'asc',
    statuses: p.get('statuses')
      ? p.get('statuses').split(',')
      : ['Working', 'Coming soon'],
  }
}

const init = readUrlState()

// ── Reactive state ────────────────────────────────────────────────────────────
const { datasources, loading, error, fetchDatasources } = useDatasources()

const activeTab     = ref(init.tab)
const searchQuery   = ref(init.search)
const activeStatuses = ref(init.statuses)
const sortKey       = ref(init.sortKey)
const sortDir       = ref(init.sortDir)

// ── URL sync (bonus) ──────────────────────────────────────────────────────────
watch([activeTab, searchQuery, activeStatuses, sortKey, sortDir], () => {
  const p = new URLSearchParams()
  if (activeTab.value !== 'All Platforms') p.set('tab', activeTab.value)
  if (searchQuery.value)                   p.set('search', searchQuery.value)
  if (sortKey.value !== 'name')            p.set('sortKey', sortKey.value)
  if (sortDir.value !== 'asc')             p.set('sortDir', sortDir.value)
  if (activeStatuses.value.length < 2)     p.set('statuses', activeStatuses.value.join(','))
  const qs = p.toString()
  history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
})

// ── Computed ──────────────────────────────────────────────────────────────────
const tabList = computed(() =>
  CATEGORIES.map(label => ({
    label,
    count: label === 'All Platforms'
      ? datasources.value.length
      : datasources.value.filter(d => d.category === label).length,
  }))
)

const tabItems = computed(() =>
  activeTab.value === 'All Platforms'
    ? datasources.value
    : datasources.value.filter(d => d.category === activeTab.value)
)

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return tabItems.value
    .filter(d => !q || d.name.toLowerCase().includes(q))
    .filter(d => activeStatuses.value.includes(d.status))
})

const sortedItems = computed(() =>
  stableSort(filteredItems.value, sortKey.value, sortDir.value)
)

// ── Actions ───────────────────────────────────────────────────────────────────
function handleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

function toggleStatus(status) {
  if (activeStatuses.value.includes(status)) {
    activeStatuses.value = activeStatuses.value.filter(s => s !== status)
  } else {
    activeStatuses.value = [...activeStatuses.value, status]
  }
}

// Reset search & filters when switching tabs
watch(activeTab, () => {
  searchQuery.value = ''
  activeStatuses.value = ['Working', 'Coming soon']
})

onMounted(fetchDatasources)
</script>

<template>
  <div class="app">
    <!-- ── Header ── -->
    <header class="header">
      <div class="header__inner">
        <!-- Rollee wordmark -->
        <div class="header__logo" aria-label="Rollee">
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <circle cx="20" cy="20" r="20" fill="#2563eb"/>
            <circle cx="14" cy="20" r="5" fill="#fff"/>
            <circle cx="28" cy="14" r="3" fill="#93c5fd"/>
          </svg>
          <span class="header__wordmark">rollee</span>
        </div>

        <!-- Coverage counter -->
        <div class="header__coverage" aria-live="polite">
          <span class="header__coverage-label">Coverage</span>
          <span class="header__coverage-count">
            {{ loading ? '…' : datasources.length }} platforms in total
          </span>
        </div>
      </div>
    </header>

    <!-- ── Tabs ── -->
    <TabBar
      v-model="activeTab"
      :tabs="tabList"
    />

    <!-- ── Main content ── -->
    <main class="main">
      <div class="content-card">

        <!-- Toolbar: search + status chips -->
        <div class="toolbar">
          <div class="search-wrap">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke="#9ca3af" stroke-width="1.8"/>
              <path d="M13.5 13.5l3.5 3.5" stroke="#9ca3af" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <input
              v-model="searchQuery"
              type="search"
              class="search-input"
              placeholder="Search platforms…"
              aria-label="Search platforms by name"
            />
          </div>

          <div class="chips" role="group" aria-label="Filter by status">
            <button
              v-for="status in ['Working', 'Coming soon']"
              :key="status"
              :class="['chip', { 'chip--active': activeStatuses.includes(status) }]"
              :aria-pressed="activeStatuses.includes(status)"
              @click="toggleStatus(status)"
            >
              <svg v-if="status === 'Working'" width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
                <path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 5v3.5l2 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ status }}
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="state-msg" aria-live="polite" aria-busy="true">
          <div class="spinner" aria-label="Loading datasources…"></div>
          <span>Loading platforms…</span>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="state-msg state-msg--error" role="alert">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 6v5M10 14v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <span>Failed to load data: {{ error }}</span>
        </div>

        <!-- Table -->
        <DataTable
          v-else-if="sortedItems.length > 0"
          :items="sortedItems"
          :sort-key="sortKey"
          :sort-dir="sortDir"
          @sort="handleSort"
        />

        <!-- Empty state -->
        <div v-else class="state-msg" role="status">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect x="4" y="8" width="24" height="18" rx="2" stroke="#d1d5db" stroke-width="1.5"/>
            <path d="M4 13h24" stroke="#d1d5db" stroke-width="1.5"/>
            <path d="M10 19h12M10 23h8" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>No platforms match your filters.</span>
          <button class="reset-btn" @click="searchQuery = ''; activeStatuses = ['Working', 'Coming soon']">
            Clear filters
          </button>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Layout ─────────────────────────────────────────────────────────────────── */
.app {
  min-height: 100vh;
  background: #f5f6fa;
  display: flex;
  flex-direction: column;
}

/* ── Header ─────────────────────────────────────────────────────────────────── */
.header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.header__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header__wordmark {
  font-size: 17px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.3px;
}

.header__coverage {
  font-size: 13px;
  color: #6b7280;
}

.header__coverage-label {
  font-weight: 600;
  color: #111827;
  margin-right: 4px;
}

/* ── Tabs ─── (TabBar has its own scoped styles; just constrain width here) */
:deep(.tab-bar) {
  max-width: 1100px;
  margin: 0 auto;
}

/* ── Main ───────────────────────────────────────────────────────────────────── */
.main {
  flex: 1;
  max-width: 1100px;
  width: 100%;
  margin: 24px auto;
  padding: 0 24px;
}

.content-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

/* ── Toolbar ─────────────────────────────────────────────────────────────────── */
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
  flex-wrap: wrap;
}

.search-wrap {
  position: relative;
  flex: 1;
  min-width: 180px;
  max-width: 320px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 7px 12px 7px 32px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  color: #111827;
  background: #f9fafb;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
}

.search-input:focus {
  border-color: #2563eb;
  background: #fff;
}

/* ── Chips ───────────────────────────────────────────────────────────────────── */
.chips {
  display: flex;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 12.5px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.chip:hover {
  border-color: #d1d5db;
  color: #374151;
}

.chip:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.chip--active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}

/* ── State messages ──────────────────────────────────────────────────────────── */
.state-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 24px;
  color: #9ca3af;
  font-size: 14px;
}

.state-msg--error {
  color: #dc2626;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.reset-btn {
  margin-top: 4px;
  padding: 6px 16px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 13px;
  color: #2563eb;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.15s;
}

.reset-btn:hover {
  background: #eff6ff;
}

.reset-btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
</style>
