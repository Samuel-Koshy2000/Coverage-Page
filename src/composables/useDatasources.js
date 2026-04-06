import { ref } from 'vue'

const API_URL = 'https://api.getrollee.com/api/dashboard/v0.1/documentation/datasources'

// Map API category values to the display labels used in tabs
const CATEGORY_MAP = {
  gig_economy:   'Gig Economy',
  'gig economy': 'Gig Economy',
  gigeconomy:    'Gig Economy',
  payments:      'Payments',
  payroll_hris:  'Payroll & HRIS',
  'payroll & hris': 'Payroll & HRIS',
  'payroll hris':   'Payroll & HRIS',
  payrollhris:   'Payroll & HRIS',
  tax_portals:   'Tax Portals',
  'tax portals': 'Tax Portals',
  taxportals:    'Tax Portals',
  utilities:     'Utilities',
}

function normalizeCategory(raw) {
  if (!raw) return ''
  const key = raw.toString().toLowerCase().trim()
  return CATEGORY_MAP[key] ?? raw
}

function normalizeStatus(raw) {
  if (!raw) return 'Coming soon'
  const val = raw.toString().toLowerCase()
  if (val === 'working' || val === 'active' || val === 'live') return 'Working'
  return 'Coming soon'
}

function normalizeItem(raw, index) {
  const category = normalizeCategory(raw.category ?? raw.type ?? '')
  return {
    id:       raw.id ?? raw._id ?? raw.slug ?? `item-${index}`,
    name:     raw.name ?? raw.title ?? raw.platform ?? '',
    category,
    type:     raw.type ?? category,
    status:   normalizeStatus(raw.status),
    logoUrl:  raw.logo ?? raw.logoUrl ?? raw.logo_url ?? raw.image ?? raw.icon ?? '',
  }
}

export function useDatasources() {
  const datasources = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchDatasources() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`)
      const data = await res.json()
      // Handle common response shapes: plain array or wrapped object
      const items = Array.isArray(data)
        ? data
        : (data.data ?? data.datasources ?? data.items ?? data.results ?? [])
      datasources.value = items.map(normalizeItem)
    } catch (e) {
      error.value = e.message ?? 'Something went wrong'
    } finally {
      loading.value = false
    }
  }

  return { datasources, loading, error, fetchDatasources }
}
