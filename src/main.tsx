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
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import heroImage from './assets/hero.png'

type MainTab = 'about' | 'job' | 'projects'
type ProjectMode = 'active' | 'completed'
type ProjectType = 'Client' | 'Internal'

type UtilizationPhase = {
  startDate: string
  endDate: string
  utilizationPercentage: string
}

type Project = {
  id: string
  accountName: string
  name: string
  type: ProjectType
  mode: ProjectMode
  utilizationPhases: UtilizationPhase[]
  rollOffDate?: string
}

function calcTenure(startStr: string, endStr: string): string {
  const start = new Date(startStr)
  const end = new Date(endStr)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return ''
  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()
  if (days < 0) {
    months -= 1
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) { years -= 1; months += 12 }
  const parts: string[] = []
  if (years > 0) parts.push(`${years} Year${years !== 1 ? 's' : ''}`)
  if (months > 0) parts.push(`${months} Month${months !== 1 ? 's' : ''}`)
  if (days > 0) parts.push(`${days} Day${days !== 1 ? 's' : ''}`)
  return parts.length > 0 ? parts.join(' ') : '< 1 Day'
}

// AC9/AC10: Resolve project mode
function resolveMode(project: Project): 'active' | 'completed' {
  if (!project.rollOffDate) return 'active'
  const rollOff = new Date(project.rollOffDate)
  const hasPhaseAfterRollOff = project.utilizationPhases.some(
    (p) => new Date(p.startDate) > rollOff
  )
  return hasPhaseAfterRollOff ? 'active' : 'completed'
}

function getUtilizationValue(project: Project): number {
  const latest = project.utilizationPhases[project.utilizationPhases.length - 1]
  return parseInt(latest?.utilizationPercentage || '0', 10)
}

const projects: Project[] = [
  {
    id: 'apollo-core',
    accountName: 'Apollo',
    name: 'Apollo Core Modernization',
    type: 'Client',
    mode: 'active',
    utilizationPhases: [
      { startDate: 'Mar 31, 2026', endDate: 'Apr 30, 2026', utilizationPercentage: '40%' },
      { startDate: 'Apr 30, 2026', endDate: 'Dec 31, 2026', utilizationPercentage: '40%' },
    ],
  },
  {
    id: 'workforce-pulse',
    accountName: 'Workforce',
    name: 'Workforce Pulse Analytics',
    type: 'Client',
    mode: 'active',
    utilizationPhases: [
      { startDate: 'Feb 10, 2026', endDate: 'May 15, 2026', utilizationPercentage: '74%' },
      { startDate: 'May 16, 2026', endDate: 'Sep 12, 2026', utilizationPercentage: '66%' },
    ],
  },
  {
    id: 'ops-compass',
    accountName: 'PalTech Internal',
    name: 'Ops Compass Accelerator',
    type: 'Internal',
    mode: 'active',
    utilizationPhases: [
      { startDate: 'Mar 01, 2026', endDate: 'Jun 10, 2026', utilizationPercentage: '48%' },
      { startDate: 'Jun 11, 2026', endDate: 'Aug 01, 2026', utilizationPercentage: '52%' },
    ],
  },
  {
    id: 'northstar-migration',
    accountName: 'NorthStar',
    name: 'NorthStar Cloud Migration',
    type: 'Client',
    mode: 'completed',
    utilizationPhases: [
      { startDate: 'Apr 02, 2025', endDate: 'Aug 15, 2025', utilizationPercentage: '89%' },
      { startDate: 'Aug 16, 2025', endDate: 'Nov 18, 2025', utilizationPercentage: '70%' },
    ],
    rollOffDate: 'Nov 30, 2025',
  },
  {
    id: 'skills-forge',
    accountName: 'PalTech Internal',
    name: 'Skills Forge Platform',
    type: 'Internal',
    mode: 'completed',
    utilizationPhases: [
      { startDate: 'Jan 20, 2025', endDate: 'Apr 30, 2025', utilizationPercentage: '64%' },
      { startDate: 'May 01, 2025', endDate: 'Jul 22, 2025', utilizationPercentage: '57%' },
    ],
    rollOffDate: 'Aug 04, 2025',
  },
  {
    id: 'nexus-revamp',
    accountName: 'Nexus Corp',
    name: 'Nexus Platform Revamp',
    type: 'Client',
    mode: 'completed',
    utilizationPhases: [
      { startDate: 'Sep 01, 2025', endDate: 'Dec 15, 2025', utilizationPercentage: '80%' },
      { startDate: 'Jan 05, 2026', endDate: 'Jun 30, 2026', utilizationPercentage: '72%' },
    ],
    rollOffDate: 'Dec 31, 2025',
  },
  {
    id: 'extra-1',
    accountName: 'Global Tech',
    name: 'Cloud Infrastructure Upgrade',
    type: 'Client',
    mode: 'active',
    utilizationPhases: [
      { startDate: 'Jan 15, 2026', endDate: 'Dec 31, 2026', utilizationPercentage: '90%' },
    ],
  },
  {
    id: 'extra-2',
    accountName: 'InnoSystems',
    name: 'Mobile Gateway Implementation',
    type: 'Client',
    mode: 'active',
    utilizationPhases: [
      { startDate: 'Feb 01, 2026', endDate: 'Nov 30, 2026', utilizationPercentage: '85%' },
    ],
  }
]

const tabs: { id: MainTab; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'job', label: 'Job' },
  { id: 'projects', label: 'Projects' },
]

function getMainTabFromUrl(): MainTab {
  if (typeof window === 'undefined') return 'job'
  const tab = new URLSearchParams(window.location.search).get('tab')
  if (tab === 'about' || tab === 'job' || tab === 'projects') return tab
  return 'job'
}

function getProjectModeFromUrl(): ProjectMode {
  if (typeof window === 'undefined') return 'active'
  const mode = new URLSearchParams(window.location.search).get('mode')
  if (mode === 'active' || mode === 'completed') return mode
  return 'active'
}

function ProjectsSection({ mode, onModeChange }: { mode: ProjectMode; onModeChange: (mode: ProjectMode) => void }) {
  const resolvedProjects = React.useMemo(() => {
    return projects.map(p => ({ ...p, resolvedMode: resolveMode(p) }))
  }, [])

  const activeProjects = resolvedProjects.filter(p => p.resolvedMode === 'active')
  const completedProjects = resolvedProjects.filter(p => p.resolvedMode === 'completed')

  // AC4: Sort Active Projects by utilization descending
  const sortedActive = React.useMemo(() => {
    return [...activeProjects].sort((a, b) => getUtilizationValue(b) - getUtilizationValue(a))
  }, [activeProjects])

  // AC12: Sort Completed Projects by latest roll-off date descending
  const sortedCompleted = React.useMemo(() => {
    return [...completedProjects].sort((a, b) => {
      const dateA = a.rollOffDate ? new Date(a.rollOffDate).getTime() : 0
      const dateB = b.rollOffDate ? new Date(b.rollOffDate).getTime() : 0
      return dateB - dateA
    })
  }, [completedProjects])

  const modeProjects = mode === 'active' ? sortedActive : sortedCompleted
  const isTalentPool = activeProjects.length === 0 && mode === 'active'

  const [selectedId, setSelectedId] = React.useState(modeProjects[0]?.id ?? '')

  React.useEffect(() => {
    if (!modeProjects.some((project) => project.id === selectedId)) {
      setSelectedId(modeProjects[0]?.id ?? '')
    }
  }, [modeProjects, selectedId])

  const selectedProject = modeProjects.find((project) => project.id === selectedId)

  // AC10/AC11: Talent Pool Logic
  const lastRollOffDate = React.useMemo(() => {
    if (completedProjects.length === 0) return null
    return [...completedProjects].sort((a, b) => {
      const dateA = a.rollOffDate ? new Date(a.rollOffDate).getTime() : 0
      const dateB = b.rollOffDate ? new Date(b.rollOffDate).getTime() : 0
      return dateB - dateA
    })[0].rollOffDate
  }, [completedProjects])

  return (
    <section className="card projects-card">
      <div className="card__header">
        <h3>Projects</h3>
      </div>

      <div className="project-mode-toggle">
        <button
          className={`project-mode-toggle__btn ${mode === 'active' ? 'project-mode-toggle__btn--active' : ''}`}
          onClick={() => onModeChange('active')}
          type="button"
        >
          {activeProjects.length > 0 ? 'Active Projects' : 'Talent Pool'}
        </button>
        {completedProjects.length > 0 && (
          <button
            className={`project-mode-toggle__btn ${mode === 'completed' ? 'project-mode-toggle__btn--active' : ''}`}
            onClick={() => onModeChange('completed')}
            type="button"
          >
            Completed Projects
          </button>
        )}
      </div>

      <div className="projects-layout">
        <aside className={`projects-list ${modeProjects.length > 4 || isTalentPool ? 'has-scroll' : ''}`}>
          {isTalentPool ? (
            <button className="project-item project-item--active" type="button">
              <div className="project-item__head">
                <strong>Talent Pool</strong>
              </div>
            </button>
          ) : (
            modeProjects.map((project) => (
              <button
                key={project.id}
                className={`project-item ${selectedId === project.id ? 'project-item--active' : ''}`}
                onClick={() => setSelectedId(project.id)}
                type="button"
              >
                <div className="project-item__head">
                  <strong>{project.accountName} : {project.name}</strong>
                  <span className={`type-pill ${project.type === 'Client' ? 'type-pill--client' : 'type-pill--internal'}`}>
                    {project.type}
                  </span>
                </div>
              </button>
            ))
          )}
        </aside>

        <article className="project-timeline">
          {isTalentPool ? (
            <>
              <header className="project-timeline__head">
                <h4>Talent Pool</h4>
              </header>
              <div className="project-tenure-row">
                <span className="project-tenure-row__label">Tenure since last roll-off</span>
                <span className="project-tenure-row__value">
                  {lastRollOffDate ? calcTenure(lastRollOffDate, new Date().toDateString()) : 'N/A'}
                </span>
              </div>
              <div className="timeline-track">
                {lastRollOffDate && (
                  <div className="timeline-step">
                    <span className="timeline-dot timeline-dot--rolloff" />
                    <label>Latest Roll-off Date</label>
                    <strong>{lastRollOffDate}</strong>
                  </div>
                )}
              </div>
            </>
          ) : selectedProject ? (
            <>
              <header className="project-timeline__head">
                <h4>{selectedProject.name}</h4>
                <span className={`type-pill ${selectedProject.type === 'Client' ? 'type-pill--client' : 'type-pill--internal'}`}>
                  {selectedProject.type}
                </span>
              </header>

              <div className="project-tenure-row">
                <span className="project-tenure-row__label">Total Tenure in Project</span>
                <span className="project-tenure-row__value">
                  {/* For active projects, calculate till today as per latest user request */}
                  {selectedProject.resolvedMode === 'active' 
                    ? calcTenure(selectedProject.utilizationPhases[0].startDate, new Date().toDateString())
                    : calcTenure(selectedProject.utilizationPhases[0].startDate, selectedProject.rollOffDate || selectedProject.utilizationPhases[selectedProject.utilizationPhases.length - 1].endDate)
                  }
                </span>
              </div>

              <div className={`timeline-track ${((selectedProject.rollOffDate ? 1 : 0) + selectedProject.utilizationPhases.length + 1) > 4 ? 'has-scroll' : ''}`}>
                <div className="timeline-step">
                  <span className="timeline-dot" />
                  <label>Start Date</label>
                  <strong>{selectedProject.utilizationPhases[0]?.startDate}</strong>
                </div>

                {(() => {
                  type TimelineNode = | { kind: 'phase'; phase: UtilizationPhase; index: number } | { kind: 'rolloff'; date: string }
                  const nodes: TimelineNode[] = [
                    ...selectedProject.utilizationPhases.map((phase, index) => ({ kind: 'phase' as const, phase, index })),
                    ...(selectedProject.rollOffDate ? [{ kind: 'rolloff' as const, date: selectedProject.rollOffDate }] : []),
                  ].sort((a, b) => new Date(a.kind === 'phase' ? a.phase.startDate : a.date).getTime() - new Date(b.kind === 'phase' ? b.phase.startDate : b.date).getTime())

                  return nodes.map((node, i) => node.kind === 'phase' ? (
                    <div className="timeline-step" key={`phase-${node.index}`}>
                      <span className="timeline-dot timeline-dot--utilization" />
                      <strong className="timeline-range">
                        <span>{node.phase.startDate}</span>
                        <ArrowForwardRoundedIcon />
                        <span>{node.phase.endDate}</span>
                      </strong>
                      <span className="timeline-utilization">{node.phase.utilizationPercentage} utilization</span>
                    </div>
                  ) : (
                    <div className="timeline-step" key={`rolloff-${i}`}>
                      <span className="timeline-dot timeline-dot--rolloff" />
                      <label>Roll-off Date</label>
                      <strong>{node.date}</strong>
                    </div>
                  ))
                })()}
              </div>
            </>
          ) : null}
        </article>
      </div>
    </section>
  )
}

function ProfileDetailView() {
  return (
    <>
      <section className="card">
        <div className="card__header">
          <h3>Personal Information</h3>
          <button className="edit-btn" type="button"><EditRoundedIcon /> Edit</button>
        </div>
        <div className="info-grid info-grid--three">
          <div className="info-item"><PersonRoundedIcon /><div><strong>Mulpuru Lalit Kalyan</strong><span>Name</span></div></div>
          <div className="info-item"><BadgeRoundedIcon /><div><strong>Lalit Mulpuru</strong><span>Display Name</span></div></div>
          <div className="info-item"><DoneRoundedIcon /><div><strong>Single</strong><span>Marital Status</span></div></div>
          <div className="info-item"><CakeRoundedIcon /><div><strong>Jun 01, 2003</strong><span>Date of Birth</span></div></div>
          <div className="info-item"><PersonRoundedIcon /><div><strong>Male</strong><span>Gender</span></div></div>
          <div className="info-item"><BadgeRoundedIcon /><div><strong>O+</strong><span>Blood Group</span></div></div>
        </div>
      </section>

      <section className="card">
        <div className="card__header">
          <h3>Contact Details</h3>
          <button className="edit-btn" type="button"><EditRoundedIcon /> Edit</button>
        </div>
        <div className="info-grid info-grid--two">
          <div className="info-item"><EmailRoundedIcon /><div><strong>lalitkalyan15@gmail.com</strong><span>Email (Personal)</span></div></div>
          <div className="info-item"><PhoneRoundedIcon /><div><strong>IN +91 9154807731</strong><span>Phone Number (Primary)</span></div></div>
        </div>
      </section>

      <section className="card">
        <div className="card__header">
          <h3>My Qualifications</h3>
          <button className="details-btn" type="button">+ Add Details</button>
        </div>
      </section>
    </>
  )
}

function App() {
  const [mainTab, setMainTab] = React.useState<MainTab>(getMainTabFromUrl)
  const [projectMode, setProjectMode] = React.useState<ProjectMode>(getProjectModeFromUrl)

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set('tab', mainTab)
    if (mainTab === 'projects') params.set('mode', projectMode)
    else params.delete('mode')
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }, [mainTab, projectMode])

  return (
    <div className="profile-shell">
      <aside className="left-nav">
        <div className="left-nav__logo" aria-hidden="true"><span /><span /></div>
        <nav className="left-nav__menu">
          <button className="left-nav__item" type="button"><HomeRoundedIcon /><span>Home</span></button>
          <button className="left-nav__item left-nav__item--active" type="button"><PersonRoundedIcon /><span>Me</span></button>
          <button className="left-nav__item" type="button"><BusinessRoundedIcon /><span>Organization</span></button>
        </nav>
      </aside>

      <main className="profile-main">
        <header className="top-header">
          <h1>Profile</h1>
          <div className="top-header__actions">
            <label className="search-input"><SearchRoundedIcon /><input type="search" placeholder="Search..." /></label>
            <button className="user-pill" type="button"><img alt="Lalit Mulpuru" src={heroImage} /><span>Lalit Mulpuru</span><KeyboardArrowDownRoundedIcon /></button>
          </div>
        </header>

        <section className="profile-content">
          <aside className="left-panel">
            <article className="profile-card">
              <div className="profile-card__hero"><img alt="portrait" src={heroImage} /></div>
              <div className="profile-card__name"><h2>Lalit Mulpuru</h2><MoreVertRoundedIcon /></div>
              <span className="week-off-tag">Week Off</span>
              <div className="profile-contact">
                <div><p>Lalit.Mulpuru@pal.tech</p><EmailRoundedIcon /></div>
                <div><p>+91 9154807731</p><PhoneRoundedIcon /></div>
                <div><p>Equinox</p><PlaceRoundedIcon /></div>
                <div><p>Associate Business Analyst - G1</p><BadgeRoundedIcon /></div>
                <div><p>Jun 01, 2003</p><CakeRoundedIcon /></div>
              </div>
              <div className="profile-meta">
                <p>PalTech</p><span>Business Unit</span>
                <p>BA</p><span>Department</span>
                <p>1305 - Pavan Seepana</p><span>Reporting Manager</span>
              </div>
            </article>
          </aside>

          <section className="right-panel">
            <div className="banner" />
            <nav className="section-tabs">
              {tabs.map((tab) => (
                <button key={tab.id} className={`section-tabs__tab ${mainTab === tab.id ? 'section-tabs__tab--active' : ''}`} onClick={() => setMainTab(tab.id)} type="button">{tab.label}</button>
              ))}
            </nav>
            {mainTab === 'projects' ? <ProjectsSection mode={projectMode} onModeChange={setProjectMode} /> : <ProfileDetailView />}
          </section>
        </section>
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('app')!).render(<React.StrictMode><App /></React.StrictMode>)
