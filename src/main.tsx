import React from 'react'
import ReactDOM from 'react-dom/client'
import './style.css'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import CakeRoundedIcon from '@mui/icons-material/CakeRounded'
import EditRoundedIcon from '@mui/icons-material/Edit'
import DoneRoundedIcon from '@mui/icons-material/DoneRounded'
import heroImage from './assets/hero.png'

type MainTab = 'about' | 'job' | 'projects'
type ProjectType = 'Client' | 'Internal' | 'Support Development' | 'Training' | 'Talent Pool'
type ProjectStatus = 'Active' | 'Completed'

type UtilizationPhase = {
  startDate: string
  endDate: string
  utilizationPercentage: string
}

type Project = {
  id: string
  projectName: string
  accountName: string
  projectType: ProjectType
  utilizationPhases: UtilizationPhase[]
  rollOffDate?: string
}

type DateRange = {
  start: Date
  end: Date
}

type TimelineRange = {
  start: Date
  end: Date
  utilizationPercentage?: string
}

type TimelinePoint = {
  date: Date
  utilization: number
  talentPool: number
}

type ProjectTableRow = {
  id: string
  projectName: string
  accountName: string
  projectType: ProjectType
  status: ProjectStatus
  tenureLabel: string
  tenureDays: number
  utilizationTimeline: TimelineRange[]
  talentPoolTimeline: TimelineRange[]
  timelinePoints: TimelinePoint[]
  startDateInRange: Date | null
  rollOffDateInRange: Date | null
  isTalentPoolSummary?: boolean
}

type ProjectColumnKey =
  | 'projectName'
  | 'accountName'
  | 'projectType'
  | 'tenure'
  | 'status'

type ProjectColumnDef = {
  key: ProjectColumnKey
  label: string
  defaultWidth: number
  minWidth: number
}

const PROJECT_COLUMNS: ProjectColumnDef[] = [
  { key: 'projectName', label: 'Project Name', defaultWidth: 190, minWidth: 80 },
  { key: 'accountName', label: 'Account Name', defaultWidth: 170, minWidth: 80 },
  { key: 'projectType', label: 'Project Type', defaultWidth: 150, minWidth: 75 },
  { key: 'tenure', label: 'Tenure', defaultWidth: 150, minWidth: 95 },
  { key: 'status', label: 'Status', defaultWidth: 120, minWidth: 70 },
]

const PROJECT_COLUMN_BY_KEY: Record<ProjectColumnKey, ProjectColumnDef> = PROJECT_COLUMNS.reduce(
  (accumulator, column) => {
    accumulator[column.key] = column
    return accumulator
  },
  {} as Record<ProjectColumnKey, ProjectColumnDef>,
)

const DEFAULT_COLUMN_ORDER: ProjectColumnKey[] = PROJECT_COLUMNS.map((column) => column.key)
const DEFAULT_COLUMN_WIDTHS: Record<ProjectColumnKey, number> = PROJECT_COLUMNS.reduce(
  (accumulator, column) => {
    accumulator[column.key] = column.defaultWidth
    return accumulator
  },
  {} as Record<ProjectColumnKey, number>,
)

const projects: Project[] = [
  {
    id: 'equinox-workforce-modernization',
    projectName: 'Workforce Modernization',
    accountName: 'Equinox',
    projectType: 'Client',
    utilizationPhases: [
      { startDate: 'Mar 31, 2026', endDate: 'Apr 30, 2026', utilizationPercentage: '40%' },
      { startDate: 'May 01, 2026', endDate: 'Dec 31, 2026', utilizationPercentage: '40%' },
    ],
  },
  {
    id: 'pgl-claims-automation',
    projectName: 'Claims Automation Platform',
    accountName: 'PGL Insurance',
    projectType: 'Client',
    utilizationPhases: [
      { startDate: 'Nov 10, 2025', endDate: 'Jan 31, 2026', utilizationPercentage: '62%' },
      { startDate: 'Feb 01, 2026', endDate: 'Aug 31, 2026', utilizationPercentage: '68%' },
    ],
  },
  {
    id: 'paltech-resource-planner',
    projectName: 'Resource Planner Revamp',
    accountName: 'PalTech Corporate IT',
    projectType: 'Internal',
    utilizationPhases: [
      { startDate: 'Oct 14, 2025', endDate: 'Jan 15, 2026', utilizationPercentage: '48%' },
      { startDate: 'Jan 20, 2026', endDate: 'Jun 30, 2026', utilizationPercentage: '52%' },
    ],
  },
  {
    id: 'jira-copilot-rollout',
    projectName: 'Jira Copilot Rollout',
    accountName: 'PalTech Engineering Excellence',
    projectType: 'Support Development',
    utilizationPhases: [
      { startDate: 'Dec 02, 2025', endDate: 'Mar 31, 2026', utilizationPercentage: '58%' },
      { startDate: 'Apr 01, 2026', endDate: 'Sep 30, 2026', utilizationPercentage: '61%' },
    ],
  },
  {
    id: 'cloud-upskilling-cohort',
    projectName: 'Cloud Upskilling Cohort',
    accountName: 'PalTech Learning & Development',
    projectType: 'Training',
    utilizationPhases: [
      { startDate: 'Nov 03, 2025', endDate: 'Jan 09, 2026', utilizationPercentage: '35%' },
      { startDate: 'Jan 12, 2026', endDate: 'May 29, 2026', utilizationPercentage: '42%' },
    ],
  },
  {
    id: 'northstar-cloud-migration-wave2',
    projectName: 'Cloud Migration Wave 2',
    accountName: 'NorthStar Logistics',
    projectType: 'Client',
    utilizationPhases: [
      { startDate: 'Apr 02, 2025', endDate: 'Aug 15, 2025', utilizationPercentage: '88%' },
      { startDate: 'Aug 18, 2025', endDate: 'Nov 18, 2025', utilizationPercentage: '72%' },
    ],
    rollOffDate: 'Nov 30, 2025',
  },
  {
    id: 'hrms-wave',
    projectName: 'HRMS Experience Wave',
    accountName: 'PalTech People Ops',
    projectType: 'Internal',
    utilizationPhases: [
      { startDate: 'Mar 10, 2025', endDate: 'Jun 30, 2025', utilizationPercentage: '50%' },
      { startDate: 'Jul 14, 2025', endDate: 'Oct 20, 2025', utilizationPercentage: '47%' },
    ],
    rollOffDate: 'Oct 31, 2025',
  },
  {
    id: 'skills-forge-platform',
    projectName: 'Skills Forge Platform',
    accountName: 'PalTech Academy',
    projectType: 'Training',
    utilizationPhases: [
      { startDate: 'Feb 03, 2025', endDate: 'May 16, 2025', utilizationPercentage: '60%' },
      { startDate: 'Jun 02, 2025', endDate: 'Jul 25, 2025', utilizationPercentage: '54%' },
    ],
    rollOffDate: 'Aug 15, 2025',
  },
  {
    id: 'helpdesk-360',
    projectName: 'Helpdesk 360',
    accountName: 'Support Hub',
    projectType: 'Support Development',
    utilizationPhases: [
      { startDate: 'Sep 01, 2025', endDate: 'Dec 15, 2025', utilizationPercentage: '62%' },
      { startDate: 'Jan 10, 2026', endDate: 'Mar 20, 2026', utilizationPercentage: '58%' },
    ],
    rollOffDate: 'Mar 31, 2026',
  },
  {
    id: 'legacy-billing-stabilization',
    projectName: 'Legacy Billing Stabilization',
    accountName: 'Aster Telecom',
    projectType: 'Client',
    utilizationPhases: [
      { startDate: 'Oct 07, 2025', endDate: 'Jan 03, 2026', utilizationPercentage: '74%' },
      { startDate: 'Jan 06, 2026', endDate: 'Feb 14, 2026', utilizationPercentage: '63%' },
    ],
    rollOffDate: 'Feb 28, 2026',
  },
  {
    id: 'infra-pods-support',
    projectName: 'Infra Pod Support',
    accountName: 'Managed Services',
    projectType: 'Support Development',
    utilizationPhases: [
      { startDate: 'Jan 05, 2026', endDate: 'Jun 30, 2026', utilizationPercentage: '68%' },
    ],
  },
]

const tabs: { id: MainTab; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'job', label: 'Job' },
  { id: 'projects', label: 'Projects' },
]

function parseDate(value: string): Date | null {
  if (!value) {
    return null
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsedIso = new Date(`${value}T00:00:00`)
    return Number.isNaN(parsedIso.getTime()) ? null : parsedIso
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function normalizeRange(start: Date, end: Date): DateRange {
  if (start <= end) {
    return { start, end }
  }
  return { start: end, end: start }
}

function rangesOverlap(a: DateRange, b: DateRange): boolean {
  return a.start <= b.end && a.end >= b.start
}

function clipRange(source: DateRange, filter: DateRange): DateRange | null {
  if (!rangesOverlap(source, filter)) {
    return null
  }

  const start = source.start > filter.start ? source.start : filter.start
  const end = source.end < filter.end ? source.end : filter.end

  if (end < start) {
    return null
  }

  return { start, end }
}

function daysBetweenInclusive(start: Date, end: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())
  return Math.floor((utcEnd - utcStart) / msPerDay) + 1
}

function getTenureFromDays(days: number): string {
  if (days <= 0) {
    return '0 days'
  }
  return `${days} day${days === 1 ? '' : 's'}`
}

function resolveStatus(project: Project): ProjectStatus {
  if (!project.rollOffDate) {
    return 'Active'
  }

  const rollOff = parseDate(project.rollOffDate)
  if (!rollOff) {
    return 'Active'
  }

  const hasPhaseAfterRollOff = project.utilizationPhases.some((phase) => {
    const start = parseDate(phase.startDate)
    return start ? start > rollOff : false
  })

  return hasPhaseAfterRollOff ? 'Active' : 'Completed'
}

function getUtilizationTimeline(project: Project): TimelineRange[] {
  const ranges: TimelineRange[] = []
  for (const phase of project.utilizationPhases) {
    const start = parseDate(phase.startDate)
    const end = parseDate(phase.endDate)
    if (!start || !end) {
      continue
    }
    const ordered = normalizeRange(start, end)
    ranges.push({
      start: ordered.start,
      end: ordered.end,
      utilizationPercentage: phase.utilizationPercentage,
    })
  }
  return ranges.sort((a, b) => a.start.getTime() - b.start.getTime())
}

function getTalentPoolTimeline(project: Project): TimelineRange[] {
  const utilization = getUtilizationTimeline(project)
  if (utilization.length === 0) {
    return []
  }

  const talentPool: TimelineRange[] = []

  for (let index = 0; index < utilization.length - 1; index += 1) {
    const currentEnd = utilization[index].end
    const nextStart = utilization[index + 1].start

    if (nextStart.getTime() > currentEnd.getTime()) {
      const gapStart = new Date(currentEnd)
      gapStart.setDate(gapStart.getDate() + 1)

      const gapEnd = new Date(nextStart)
      gapEnd.setDate(gapEnd.getDate() - 1)

      if (gapEnd >= gapStart) {
        talentPool.push({ start: gapStart, end: gapEnd })
      }
    }
  }

  if (project.rollOffDate) {
    const rollOff = parseDate(project.rollOffDate)
    const lastUtilizationEnd = utilization[utilization.length - 1].end

    if (rollOff && rollOff > lastUtilizationEnd) {
      const gapStart = new Date(lastUtilizationEnd)
      gapStart.setDate(gapStart.getDate() + 1)
      if (rollOff >= gapStart) {
        talentPool.push({ start: gapStart, end: rollOff })
      }
    }
  }

  return talentPool
}

function applyRangeFilter(ranges: TimelineRange[], rangeFilter: DateRange | null): TimelineRange[] {
  if (!rangeFilter) {
    return ranges
  }

  const clippedRanges: TimelineRange[] = []
  for (const range of ranges) {
    const clipped = clipRange({ start: range.start, end: range.end }, rangeFilter)
    if (!clipped) {
      continue
    }
    clippedRanges.push({
      start: clipped.start,
      end: clipped.end,
      utilizationPercentage: range.utilizationPercentage,
    })
  }
  return clippedRanges
}

function getUtilizationNumber(value: string | undefined): number {
  if (!value) {
    return 0
  }
  const parsed = Number.parseInt(value.replace('%', '').trim(), 10)
  if (Number.isNaN(parsed)) {
    return 0
  }
  return Math.min(100, Math.max(0, parsed))
}

function buildTimelinePoints(utilizationTimeline: TimelineRange[]): TimelinePoint[] {
  const timestampMap = new Map<number, number>()

  utilizationTimeline.forEach((range) => {
    const utilization = getUtilizationNumber(range.utilizationPercentage)
    timestampMap.set(range.start.getTime(), utilization)
    timestampMap.set(range.end.getTime(), utilization)
  })

  return [...timestampMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([timestamp, utilization]) => ({
      date: new Date(timestamp),
      utilization,
      talentPool: Math.max(0, 100 - utilization),
    }))
}

function buildTalentPoolSummaryRows(baseRows: ProjectTableRow[]): ProjectTableRow[] {
  const scopedRows = baseRows.filter((row) => row.timelinePoints.length > 0)
  if (scopedRows.length === 0) {
    return []
  }

  const utilizationByTimestamp = new Map<number, number[]>()
  scopedRows.forEach((row) => {
    row.timelinePoints.forEach((point) => {
      const key = point.date.getTime()
      const bucket = utilizationByTimestamp.get(key) ?? []
      bucket.push(point.utilization)
      utilizationByTimestamp.set(key, bucket)
    })
  })

  const summaryPoints: TimelinePoint[] = [...utilizationByTimestamp.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([timestamp, utilizationValues]) => {
      const averageUtilization = utilizationValues.reduce((sum, value) => sum + value, 0) / utilizationValues.length
      const roundedUtilization = Math.round(averageUtilization)
      return {
        date: new Date(timestamp),
        utilization: roundedUtilization,
        talentPool: Math.max(0, 100 - roundedUtilization),
      }
    })

  const summaryStatus: ProjectStatus = scopedRows.some((row) => row.status === 'Active') ? 'Active' : 'Completed'
  const summaryStart = summaryPoints[0]?.date ?? null
  const summaryEnd = summaryPoints[summaryPoints.length - 1]?.date ?? null
  const summaryTenureDays = summaryStart && summaryEnd ? daysBetweenInclusive(summaryStart, summaryEnd) : 0

  const row: ProjectTableRow = {
    id: 'talent-pool-summary',
    projectName: 'Talent Pool',
    accountName: 'Talent Pool',
    projectType: 'Talent Pool',
    status: summaryStatus,
    tenureLabel: getTenureFromDays(summaryTenureDays),
    tenureDays: summaryTenureDays,
    utilizationTimeline: [],
    talentPoolTimeline: [],
    timelinePoints: summaryPoints,
    startDateInRange: summaryStart,
    rollOffDateInRange: summaryStatus === 'Completed' ? summaryEnd : null,
    isTalentPoolSummary: true,
  }

  return [row]
}

function isWithinRange(date: Date, rangeFilter: DateRange | null): boolean {
  if (!rangeFilter) {
    return true
  }
  return date >= rangeFilter.start && date <= rangeFilter.end
}

function getTypeClass(projectType: ProjectType): string {
  if (projectType === 'Client') {
    return 'type-pill--client'
  }
  if (projectType === 'Internal') {
    return 'type-pill--internal'
  }
  if (projectType === 'Support Development') {
    return 'type-pill--support'
  }
  if (projectType === 'Talent Pool') {
    return 'type-pill--talent'
  }
  return 'type-pill--training'
}

function getMainTabFromUrl(): MainTab {
  if (typeof window === 'undefined') {
    return 'job'
  }
  const tab = new URLSearchParams(window.location.search).get('tab')
  if (tab === 'about' || tab === 'job' || tab === 'projects') {
    return tab
  }
  return 'job'
}

function ProjectsSection() {
  const today = React.useMemo(() => new Date(), [])
  const defaultFrom = React.useMemo(() => {
    const value = new Date(today)
    value.setMonth(value.getMonth() - 6)
    return toDateInputValue(value)
  }, [today])

  const [draftFromDate, setDraftFromDate] = React.useState(defaultFrom)
  const [draftToDate, setDraftToDate] = React.useState(toDateInputValue(today))
  const [appliedFromDate, setAppliedFromDate] = React.useState(defaultFrom)
  const [appliedToDate, setAppliedToDate] = React.useState(toDateInputValue(today))
  const [dateError, setDateError] = React.useState('')

  const [projectNameFilter, setProjectNameFilter] = React.useState('')
  const [accountNameFilter, setAccountNameFilter] = React.useState('')
  const [projectTypeFilter, setProjectTypeFilter] = React.useState<'all' | ProjectType>('all')
  const [statusFilter, setStatusFilter] = React.useState<'all' | ProjectStatus>('all')
  const [columnOrder, setColumnOrder] = React.useState<ProjectColumnKey[]>(DEFAULT_COLUMN_ORDER)
  const [columnWidths, setColumnWidths] = React.useState<Record<ProjectColumnKey, number>>(DEFAULT_COLUMN_WIDTHS)
  const [draggedColumnKey, setDraggedColumnKey] = React.useState<ProjectColumnKey | null>(null)
  const [dragOverColumnKey, setDragOverColumnKey] = React.useState<ProjectColumnKey | null>(null)
  const [timelineModalRowId, setTimelineModalRowId] = React.useState<string | null>(null)
  const resizeStateRef = React.useRef<{ key: ProjectColumnKey; startX: number; startWidth: number } | null>(null)

  const orderedColumns = React.useMemo(
    () => columnOrder.map((columnKey) => PROJECT_COLUMN_BY_KEY[columnKey]),
    [columnOrder],
  )

  React.useEffect(() => {
    function onMouseMove(event: MouseEvent): void {
      const resizeState = resizeStateRef.current
      if (!resizeState) {
        return
      }

      const column = PROJECT_COLUMN_BY_KEY[resizeState.key]
      const delta = event.clientX - resizeState.startX
      const nextWidth = Math.max(column.minWidth, Math.round(resizeState.startWidth + delta))

      setColumnWidths((previous) => ({
        ...previous,
        [resizeState.key]: nextWidth,
      }))
    }

    function onMouseUp(): void {
      resizeStateRef.current = null
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  function onResizeStart(event: React.MouseEvent<HTMLSpanElement>, columnKey: ProjectColumnKey): void {
    event.preventDefault()
    event.stopPropagation()
    resizeStateRef.current = {
      key: columnKey,
      startX: event.clientX,
      startWidth: columnWidths[columnKey] ?? PROJECT_COLUMN_BY_KEY[columnKey].defaultWidth,
    }
  }

  function moveColumn(sourceKey: ProjectColumnKey, targetKey: ProjectColumnKey): void {
    setColumnOrder((previousOrder) => {
      const sourceIndex = previousOrder.indexOf(sourceKey)
      const targetIndex = previousOrder.indexOf(targetKey)
      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
        return previousOrder
      }

      const nextOrder = [...previousOrder]
      const [removed] = nextOrder.splice(sourceIndex, 1)
      nextOrder.splice(targetIndex, 0, removed)
      return nextOrder
    })
  }

  function onColumnDragStart(columnKey: ProjectColumnKey): void {
    setDraggedColumnKey(columnKey)
  }

  function onColumnDragOver(event: React.DragEvent<HTMLTableCellElement>, columnKey: ProjectColumnKey): void {
    event.preventDefault()
    if (draggedColumnKey && draggedColumnKey !== columnKey) {
      setDragOverColumnKey(columnKey)
    }
  }

  function onColumnDrop(event: React.DragEvent<HTMLTableCellElement>, columnKey: ProjectColumnKey): void {
    event.preventDefault()
    if (draggedColumnKey && draggedColumnKey !== columnKey) {
      moveColumn(draggedColumnKey, columnKey)
    }
    setDraggedColumnKey(null)
    setDragOverColumnKey(null)
  }

  function onColumnDragEnd(): void {
    setDraggedColumnKey(null)
    setDragOverColumnKey(null)
  }

  const appliedRangeFilter = React.useMemo(() => {
    const start = parseDate(appliedFromDate)
    const end = parseDate(appliedToDate)
    if (!start || !end) {
      return null
    }
    return normalizeRange(start, end)
  }, [appliedFromDate, appliedToDate])

  const rows = React.useMemo(() => {
    const baseRows = projects
      .map((project) => {
        const utilizationTimeline = applyRangeFilter(getUtilizationTimeline(project), appliedRangeFilter)
        const talentPoolTimeline = applyRangeFilter(getTalentPoolTimeline(project), appliedRangeFilter)
        const parsedRollOffDate = project.rollOffDate ? parseDate(project.rollOffDate) : null
        const rollOffDateInRange =
          parsedRollOffDate && isWithinRange(parsedRollOffDate, appliedRangeFilter) ? parsedRollOffDate : null
        const timelinePoints = buildTimelinePoints(utilizationTimeline)
        const startDateInRange = timelinePoints[0]?.date ?? utilizationTimeline[0]?.start ?? null

        if (
          appliedRangeFilter &&
          utilizationTimeline.length === 0 &&
          talentPoolTimeline.length === 0 &&
          !rollOffDateInRange &&
          timelinePoints.length === 0
        ) {
          return null
        }

        const tenureDays = utilizationTimeline.reduce((total, timelineRange) => {
          return total + daysBetweenInclusive(timelineRange.start, timelineRange.end)
        }, 0)

        const row: ProjectTableRow = {
          id: project.id,
          projectName: project.projectName,
          accountName: project.accountName,
          projectType: project.projectType,
          status: resolveStatus(project),
          tenureLabel: getTenureFromDays(tenureDays),
          tenureDays,
          utilizationTimeline,
          talentPoolTimeline,
          timelinePoints,
          startDateInRange,
          rollOffDateInRange,
        }

        return row
      })
      .filter((row): row is ProjectTableRow => Boolean(row))

    const summaryRows = buildTalentPoolSummaryRows(baseRows)
    const allRows = [...summaryRows, ...baseRows]

    return allRows
      .filter((row) => row.projectName.toLowerCase().includes(projectNameFilter.toLowerCase()))
      .filter((row) => row.accountName.toLowerCase().includes(accountNameFilter.toLowerCase()))
      .filter((row) => projectTypeFilter === 'all' || row.projectType === projectTypeFilter)
      .filter((row) => statusFilter === 'all' || row.status === statusFilter)
  }, [
    accountNameFilter,
    appliedRangeFilter,
    projectNameFilter,
    projectTypeFilter,
    statusFilter,
  ])

  const timelineModalRow = React.useMemo(
    () => rows.find((row) => row.id === timelineModalRowId) ?? null,
    [rows, timelineModalRowId],
  )

  React.useEffect(() => {
    if (timelineModalRowId && !timelineModalRow) {
      setTimelineModalRowId(null)
    }
  }, [timelineModalRow, timelineModalRowId])

  function onApplyDateRange(): void {
    const start = parseDate(draftFromDate)
    const end = parseDate(draftToDate)

    if (!start || !end) {
      setDateError('Please select both From and To date before applying.')
      return
    }

    if (start > end) {
      setDateError('From date must be earlier than or equal to To date.')
      return
    }

    setDateError('')
    setAppliedFromDate(draftFromDate)
    setAppliedToDate(draftToDate)
  }

  function onResetDateRange(): void {
    const toDate = toDateInputValue(today)
    setDraftFromDate(defaultFrom)
    setDraftToDate(toDate)
    setAppliedFromDate(defaultFrom)
    setAppliedToDate(toDate)
    setDateError('')
  }

  type TimelineNode = {
    key: string
    kind: 'start' | 'util' | 'rolloff' | 'talent'
    title: string
    value: string
    note?: string
  }

  function getTimelineNodes(row: ProjectTableRow): TimelineNode[] {
    if (row.isTalentPoolSummary) {
      return row.timelinePoints.map((point, index) => ({
        key: `${row.id}-tp-point-${index}`,
        kind: 'talent',
        title: 'Talent Pool',
        value: formatDate(point.date),
        note: `${point.talentPool}% Talent Pool`,
      }))
    }

    const nodes: TimelineNode[] = []
    if (row.startDateInRange) {
      nodes.push({
        key: `${row.id}-start`,
        kind: 'start',
        title: 'Start',
        value: formatDate(row.startDateInRange),
      })
    }

    row.utilizationTimeline.forEach((timelineRange, index) => {
      nodes.push({
        key: `${row.id}-util-${index}`,
        kind: 'util',
        title: `Utilization ${index + 1}`,
        value: `${formatDate(timelineRange.start)} \u2192 ${formatDate(timelineRange.end)}`,
        note: timelineRange.utilizationPercentage
          ? `${timelineRange.utilizationPercentage} Utilization`
          : 'Utilization',
      })
    })

    if (row.rollOffDateInRange) {
      nodes.push({
        key: `${row.id}-rolloff`,
        kind: 'rolloff',
        title: 'Roll-off',
        value: formatDate(row.rollOffDateInRange),
      })
    }

    return nodes
  }

  function getTimelineDotClass(kind: TimelineNode['kind']): string {
    if (kind === 'util') {
      return 'timeline-dot timeline-dot--utilization'
    }
    if (kind === 'rolloff') {
      return 'timeline-dot timeline-dot--rolloff'
    }
    if (kind === 'talent') {
      return 'timeline-dot timeline-dot--talent'
    }
    return 'timeline-dot'
  }

  function renderTimelineVertical(row: ProjectTableRow): React.ReactNode {
    const nodes = getTimelineNodes(row)
    if (nodes.length === 0) {
      return <span className="timeline-empty">No timeline data in range</span>
    }

    return (
      <div className="timeline-panel">
        <div className="timeline-track timeline-track--table">
          {nodes.map((node) => (
            <div className="timeline-step timeline-step--table" key={node.key}>
              <span className={getTimelineDotClass(node.kind)} />
              <label>{node.title}</label>
              <strong>{node.value}</strong>
              {node.note ? <span className="timeline-utilization">{node.note}</span> : null}
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderCellByColumn(row: ProjectTableRow, columnKey: ProjectColumnKey): React.ReactNode {
    switch (columnKey) {
      case 'projectName':
        return (
          <span className="cell-ellipsis" title={row.projectName}>
            {row.projectName}
          </span>
        )
      case 'accountName':
        return (
          <span className="cell-ellipsis" title={row.accountName}>
            {row.accountName}
          </span>
        )
      case 'projectType':
        return <span className={`type-pill ${getTypeClass(row.projectType)}`}>{row.projectType}</span>
      case 'tenure':
        return (
          <div className="tenure-cell">
            <span className="tenure-cell__value cell-ellipsis" title={row.tenureLabel}>
              {row.tenureLabel}
            </span>
            <button
              type="button"
              className="timeline-view-btn"
              aria-haspopup="dialog"
              onClick={() => setTimelineModalRowId(row.id)}
            >
              View Timeline
            </button>
          </div>
        )
      case 'status':
        return (
          <span className={`status-pill ${row.status === 'Active' ? 'status-pill--active' : 'status-pill--completed'}`}>
            {row.status}
          </span>
        )
      default:
        return null
    }
  }

  return (
    <section className="card projects-card">
      <div className="card__header">
        <h3>Projects</h3>
      </div>

      <div className="projects-table-toolbar">
        <div className="projects-date-range">
          <label>
            From
            <input type="date" value={draftFromDate} onChange={(event) => setDraftFromDate(event.target.value)} />
          </label>
          <label>
            To
            <input type="date" value={draftToDate} onChange={(event) => setDraftToDate(event.target.value)} />
          </label>
          <button type="button" className="projects-btn projects-btn--primary" onClick={onApplyDateRange}>
            Apply
          </button>
          <button type="button" className="projects-btn projects-btn--ghost" onClick={onResetDateRange}>
            Reset
          </button>
        </div>

        <p className="projects-applied-range">
          Applied Range: {formatDate(parseDate(appliedFromDate) ?? today)} to {formatDate(parseDate(appliedToDate) ?? today)}
        </p>
      </div>

      {dateError ? <p className="projects-error">{dateError}</p> : null}

      <div className="projects-filter-grid">
        <input
          value={projectNameFilter}
          onChange={(event) => setProjectNameFilter(event.target.value)}
          placeholder="Filter Project Name"
          aria-label="Filter Project Name"
        />
        <input
          value={accountNameFilter}
          onChange={(event) => setAccountNameFilter(event.target.value)}
          placeholder="Filter Account Name"
          aria-label="Filter Account Name"
        />
        <select value={projectTypeFilter} onChange={(event) => setProjectTypeFilter(event.target.value as 'all' | ProjectType)}>
          <option value="all">All Types</option>
          <option value="Client">Client</option>
          <option value="Internal">Internal</option>
          <option value="Support Development">Support Development</option>
          <option value="Training">Training</option>
        </select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | ProjectStatus)}>
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="projects-table-wrap">
        <table className="projects-table">
          <thead>
            <tr>
              {orderedColumns.map((column) => (
                <th
                  key={column.key}
                  className={`projects-th ${draggedColumnKey === column.key ? 'projects-th--dragging' : ''} ${
                    dragOverColumnKey === column.key ? 'projects-th--drag-over' : ''
                  }`}
                  style={{ width: `${columnWidths[column.key]}px`, minWidth: `${column.minWidth}px` }}
                  draggable
                  onDragStart={() => onColumnDragStart(column.key)}
                  onDragOver={(event) => onColumnDragOver(event, column.key)}
                  onDrop={(event) => onColumnDrop(event, column.key)}
                  onDragEnd={onColumnDragEnd}
                >
                  <div className="projects-th__inner">
                    <span className="projects-th__label">{column.label}</span>
                    <span
                      className="projects-th__resize"
                      onMouseDown={(event) => onResizeStart(event, column.key)}
                      role="separator"
                      aria-label={`Resize ${column.label} column`}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={orderedColumns.length} className="projects-empty">
                  No records found for the applied date range and filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className={row.isTalentPoolSummary ? 'projects-row--talent' : ''}>
                  {orderedColumns.map((column) => (
                    <td key={`${row.id}-${column.key}`} style={{ width: `${columnWidths[column.key]}px`, minWidth: `${column.minWidth}px` }}>
                      {renderCellByColumn(row, column.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {timelineModalRow ? (
        <div className="timeline-modal-backdrop" onClick={() => setTimelineModalRowId(null)}>
          <div
            className="timeline-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${timelineModalRow.projectName} timeline`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="timeline-modal__head">
              <h4>{timelineModalRow.projectName} Timeline</h4>
              <button type="button" className="timeline-modal__close" onClick={() => setTimelineModalRowId(null)}>
                Close
              </button>
            </div>
            {renderTimelineVertical(timelineModalRow)}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function ProfileDetailView() {
  return (
    <>
      <section className="card">
        <div className="card__header">
          <h3>Personal Information</h3>
          <button className="edit-btn" type="button">
            <EditRoundedIcon /> Edit
          </button>
        </div>
        <div className="info-grid info-grid--three">
          <div className="info-item">
            <PersonRoundedIcon />
            <div>
              <strong>Mulpuru Lalit Kalyan</strong>
              <span>Name</span>
            </div>
          </div>
          <div className="info-item">
            <BadgeRoundedIcon />
            <div>
              <strong>Lalit Mulpuru</strong>
              <span>Display Name</span>
            </div>
          </div>
          <div className="info-item">
            <DoneRoundedIcon />
            <div>
              <strong>Single</strong>
              <span>Marital Status</span>
            </div>
          </div>
          <div className="info-item">
            <CakeRoundedIcon />
            <div>
              <strong>Jun 01, 2003</strong>
              <span>Date of Birth</span>
            </div>
          </div>
          <div className="info-item">
            <PersonRoundedIcon />
            <div>
              <strong>Male</strong>
              <span>Gender</span>
            </div>
          </div>
          <div className="info-item">
            <BadgeRoundedIcon />
            <div>
              <strong>O+</strong>
              <span>Blood Group</span>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card__header">
          <h3>Contact Details</h3>
          <button className="edit-btn" type="button">
            <EditRoundedIcon /> Edit
          </button>
        </div>
        <div className="info-grid info-grid--two">
          <div className="info-item">
            <EmailRoundedIcon />
            <div>
              <strong>lalitkalyan15@gmail.com</strong>
              <span>Email (Personal)</span>
            </div>
          </div>
          <div className="info-item">
            <PhoneRoundedIcon />
            <div>
              <strong>IN +91 9154807731</strong>
              <span>Phone Number (Primary)</span>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card__header">
          <h3>My Qualifications</h3>
          <button className="details-btn" type="button">
            + Add Details
          </button>
        </div>
      </section>
    </>
  )
}

function App() {
  const [mainTab, setMainTab] = React.useState<MainTab>(getMainTabFromUrl)

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set('tab', mainTab)
    params.delete('mode')
    const query = params.toString()
    const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname
    window.history.replaceState(null, '', nextUrl)
  }, [mainTab])

  return (
    <div className="profile-shell">
      <aside className="left-nav">
        <div className="left-nav__logo" aria-hidden="true">
          <span />
          <span />
        </div>
        <nav className="left-nav__menu">
          <button className="left-nav__item" type="button">
            <HomeRoundedIcon />
            <span>Home</span>
          </button>
          <button className="left-nav__item left-nav__item--active" type="button">
            <PersonRoundedIcon />
            <span>Me</span>
          </button>
          <button className="left-nav__item" type="button">
            <BusinessRoundedIcon />
            <span>Organization</span>
          </button>
        </nav>
      </aside>

      <main className="profile-main">
        <header className="top-header">
          <h1>Profile</h1>
          <div className="top-header__actions">
            <label className="search-input" aria-label="Search">
              <SearchRoundedIcon />
              <input type="search" placeholder="Search..." />
            </label>
            <button className="user-pill" type="button">
              <img alt="Lalit Mulpuru" src={heroImage} />
              <span>Lalit Mulpuru</span>
              <KeyboardArrowDownRoundedIcon />
            </button>
          </div>
        </header>

        <section className="profile-content">
          <aside className="left-panel">
            <article className="profile-card">
              <div className="profile-card__hero">
                <img alt="portrait" src={heroImage} />
              </div>
              <div className="profile-card__name">
                <h2>Lalit Mulpuru</h2>
                <MoreVertRoundedIcon />
              </div>
              <span className="week-off-tag">Week Off</span>
              <div className="profile-contact">
                <div>
                  <p>Lalit.Mulpuru@pal.tech</p>
                  <EmailRoundedIcon />
                </div>
                <div>
                  <p>+91 9154807731</p>
                  <PhoneRoundedIcon />
                </div>
                <div>
                  <p>Equinox</p>
                  <PlaceRoundedIcon />
                </div>
                <div>
                  <p>Associate Business Analyst - G1</p>
                  <BadgeRoundedIcon />
                </div>
                <div>
                  <p>Jun 01, 2003</p>
                  <CakeRoundedIcon />
                </div>
              </div>
              <div className="profile-meta">
                <p>PalTech</p>
                <span>Business Unit</span>
                <p>BA</p>
                <span>Department</span>
                <p>1305 - Pavan Seepana</p>
                <span>Reporting Manager</span>
              </div>
            </article>
          </aside>

          <section className="right-panel">
            <div className="banner" />
            <nav className="section-tabs" aria-label="Profile sections">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`section-tabs__tab ${mainTab === tab.id ? 'section-tabs__tab--active' : ''}`}
                  onClick={() => setMainTab(tab.id)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            {mainTab === 'projects' ? <ProjectsSection /> : <ProfileDetailView />}
          </section>
        </section>
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
