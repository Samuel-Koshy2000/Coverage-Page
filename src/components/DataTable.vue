<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
  sortKey: {
    type: String,
    required: true,
  },
  sortDir: {
    type: String,
    required: true,
  },
})

defineEmits(['sort'])

function getInitials(name) {
  return name?.charAt(0)?.toUpperCase() ?? '?'
}

// Deterministic pastel color from name string
function avatarColor(name) {
  const colors = ['#f87171','#fb923c','#facc15','#4ade80','#34d399','#38bdf8','#818cf8','#c084fc','#f472b6']
  let hash = 0
  for (const ch of name ?? '') hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff
  return colors[Math.abs(hash) % colors.length]
}
</script>

<template>
  <div class="table-wrapper" role="region" aria-label="Datasources table">
    <table class="data-table" aria-live="polite">
      <thead>
        <tr>
          <th scope="col">
            <button
              class="sort-btn"
              :aria-sort="sortKey === 'name' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'"
              @click="$emit('sort', 'name')"
            >
              Platform
              <span class="sort-icon" aria-hidden="true">
                <svg v-if="sortKey === 'name' && sortDir === 'asc'" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 3l4 5H2z"/>
                </svg>
                <svg v-else-if="sortKey === 'name' && sortDir === 'desc'" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 9L2 4h8z"/>
                </svg>
                <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="currentColor" opacity="0.35">
                  <path d="M6 2l3 4H3zM6 10L3 6h6z"/>
                </svg>
              </span>
            </button>
          </th>
          <th scope="col">
            <button
              class="sort-btn"
              :aria-sort="sortKey === 'type' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'"
              @click="$emit('sort', 'type')"
            >
              Type
              <span class="sort-icon" aria-hidden="true">
                <svg v-if="sortKey === 'type' && sortDir === 'asc'" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 3l4 5H2z"/>
                </svg>
                <svg v-else-if="sortKey === 'type' && sortDir === 'desc'" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 9L2 4h8z"/>
                </svg>
                <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="currentColor" opacity="0.35">
                  <path d="M6 2l3 4H3zM6 10L3 6h6z"/>
                </svg>
              </span>
            </button>
          </th>
          <th scope="col">
            <button
              class="sort-btn"
              :aria-sort="sortKey === 'status' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'"
              @click="$emit('sort', 'status')"
            >
              Status
              <span class="sort-icon" aria-hidden="true">
                <svg v-if="sortKey === 'status' && sortDir === 'asc'" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 3l4 5H2z"/>
                </svg>
                <svg v-else-if="sortKey === 'status' && sortDir === 'desc'" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 9L2 4h8z"/>
                </svg>
                <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="currentColor" opacity="0.35">
                  <path d="M6 2l3 4H3zM6 10L3 6h6z"/>
                </svg>
              </span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <!-- Platform -->
          <td class="cell-platform">
            <div class="platform">
              <div class="platform__logo" :style="!item.logoUrl ? { background: avatarColor(item.name) } : {}">
                <img
                  v-if="item.logoUrl"
                  :src="item.logoUrl"
                  :alt="item.name + ' logo'"
                  @error="e => e.target.style.display = 'none'"
                />
                <span v-else class="platform__initials">{{ getInitials(item.name) }}</span>
              </div>
              <span class="platform__name">{{ item.name }}</span>
            </div>
          </td>

          <!-- Type -->
          <td class="cell-type">{{ item.type }}</td>

          <!-- Status -->
          <td class="cell-status">
            <span :class="['status-badge', item.status === 'Working' ? 'status-badge--working' : 'status-badge--soon']">
              <!-- Working: check circle -->
              <svg v-if="item.status === 'Working'" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
                <path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <!-- Coming soon: clock -->
              <svg v-else width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 5v3.5l2 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ item.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

thead tr {
  border-bottom: 1px solid #e5e7eb;
}

th {
  text-align: left;
  padding: 0;
  font-weight: 600;
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

th:first-child { width: 45%; }
th:nth-child(2) { width: 30%; }
th:nth-child(3) { width: 25%; }

.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 12px 16px;
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: color 0.15s;
}

.sort-btn:hover {
  color: #111827;
}

.sort-btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
  border-radius: 4px;
}

.sort-icon {
  display: inline-flex;
  align-items: center;
}

tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.1s;
}

tbody tr:last-child {
  border-bottom: none;
}

tbody tr:hover {
  background: #f9fafb;
}

td {
  padding: 12px 16px;
  font-size: 13.5px;
  color: #374151;
  vertical-align: middle;
}

/* Platform cell */
.platform {
  display: flex;
  align-items: center;
  gap: 10px;
}

.platform__logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  background: #f3f4f6;
}

.platform__logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.platform__initials {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}

.platform__name {
  font-weight: 500;
  color: #111827;
}

/* Status badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 500;
}

.status-badge--working {
  color: #16a34a;
}

.status-badge--soon {
  color: #9ca3af;
}
</style>
