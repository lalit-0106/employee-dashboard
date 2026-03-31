const fs = require('fs');
const path = require('path');

const mainTsxPath = path.join(__dirname, 'src', 'main.tsx');
let mainContent = fs.readFileSync(mainTsxPath, 'utf8');

// We use regex replacement to ensure it applies regardless of line endings (\r?\n)

mainContent = mainContent.replace(
  /type ProjectMode = 'active' \| 'completed'(?! \| 'overlaps')/,
  "type ProjectMode = 'active' | 'completed' | 'overlaps'"
);

mainContent = mainContent.replace(
  /completed: 'Completed Projects',(\r?\n)}/,
  "completed: 'Completed Projects',$1  overlaps: 'Utilization Overlaps',$1}"
);

mainContent = mainContent.replace(
  /if \(mode === 'active' \|\| mode === 'completed'\) \{/,
  "if (mode === 'active' || mode === 'completed' || mode === 'overlaps') {"
);

mainContent = mainContent.replace(
  /\(\['active', 'completed'\] as const\)\.map\(/,
  "(['active', 'completed', 'overlaps'] as const).map("
);

// Layout replace
mainContent = mainContent.replace(
  /<div className="projects-layout">\s*<aside className="projects-list"/,
  `<div className="projects-layout">
        {mode === 'overlaps' ? (
          <GanttPipelineView />
        ) : (
          <>
            <aside className="projects-list"`
);

mainContent = mainContent.replace(
  /<\/article>\s*\)\s*:\s*null\}\s*<\/div>\s*<\/section>\s*\)\s*\}/,
  `          </article>\n        ) : null}\n          </>\n        )}\n      </div>\n    </section>\n  )\n}`
);

const componentCode = `
type UtilizationInterval = {
  startDate: Date
  endDate: Date
  projects: { projectId: string; utilPercent: number }[]
}

function parseDate(dateStr: string) {
  return new Date(dateStr)
}

function calculateOverlaps(activeProjects: Project[]) {
  const events: { date: Date; type: 'start' | 'end'; projectId: string; utilPercent: number }[] = []
  activeProjects.forEach(p => {
    p.utilizationPhases.forEach(phase => {
      const util = parseInt(phase.utilizationPercentage.replace('%', ''), 10)
      events.push({ date: parseDate(phase.startDate), type: 'start', projectId: p.id, utilPercent: util })
      events.push({ date: parseDate(phase.endDate), type: 'end', projectId: p.id, utilPercent: util })
    })
  })
  events.sort((a, b) => a.date.getTime() - b.date.getTime())
  const intervals: UtilizationInterval[] = []
  const currentProjects: Map<string, number> = new Map()
  for (let i = 0; i < events.length - 1; i++) {
    const e = events[i]
    if (e.type === 'start') {
      currentProjects.set(e.projectId, e.utilPercent)
    } else {
      currentProjects.delete(e.projectId)
    }
    const nextE = events[i+1]
    if (e.date.getTime() !== nextE.date.getTime() && currentProjects.size > 0) {
      intervals.push({
        startDate: e.date,
        endDate: nextE.date,
        projects: Array.from(currentProjects.entries()).map(([projectId, utilPercent]) => ({ projectId, utilPercent }))
      })
    }
  }
  return intervals
}

function GanttPipelineView() {
  const activeProjects = React.useMemo(() => projects.filter(p => p.mode === 'active'), []);
  const overlaps = React.useMemo(() => calculateOverlaps(activeProjects), [activeProjects]);
  
  let minDate = new Date(activeProjects[0]?.utilizationPhases[0]?.startDate || Date.now());
  let maxDate = new Date(activeProjects[0]?.utilizationPhases[0]?.endDate || Date.now());
  
  overlaps.forEach(o => {
    if (o.startDate < minDate) minDate = o.startDate;
    if (o.endDate > maxDate) maxDate = o.endDate;
  });
  
  if (minDate > maxDate) [minDate, maxDate] = [maxDate, minDate];

  minDate = new Date(minDate.getTime() - 15 * 86400000);
  maxDate = new Date(maxDate.getTime() + 15 * 86400000);
  
  const totalDuration = maxDate.getTime() - minDate.getTime();

  return (
    <div className="pipeline-container">
      <div className="pipeline-visual-area">
        <div className="pipeline-highlights">
          {overlaps.map((interval, i) => {
            const isConflict = interval.projects.reduce((sum, p) => sum + p.utilPercent, 0) > 100;
            if (!isConflict || totalDuration <= 0) return null;
            const left = ((interval.startDate.getTime() - minDate.getTime()) / totalDuration) * 100;
            const width = ((interval.endDate.getTime() - interval.startDate.getTime()) / totalDuration) * 100;
            return (
              <div 
                key={\`conflict-\${i}\`} 
                className="pipeline-conflict-zone" 
                style={{ left: \`\${left}%\`, width: \`\${width}%\` }} 
                title="Overallocated"
              />
            );
          })}
        </div>
        
        <div className="pipeline-rows">
          <div className="pipeline-row-header">
            <strong>Active Projects Pipeline</strong>
            <span className="pipeline-scale-label">Timeline ({minDate.toLocaleDateString('en-US', {month: 'short', year: 'numeric'})} - {maxDate.toLocaleDateString('en-US', {month: 'short', year: 'numeric'})})</span>
          </div>
          {activeProjects.map(proj => (
            <div className="pipeline-row" key={proj.id}>
              <div className="pipeline-row-label">
                <span>{proj.name}</span>
              </div>
              <div className="pipeline-row-tracks">
                {proj.utilizationPhases.map((phase, i) => {
                  const sDate = parseDate(phase.startDate);
                  const eDate = parseDate(phase.endDate);
                  let left = ((sDate.getTime() - minDate.getTime()) / totalDuration) * 100;
                  let width = ((eDate.getTime() - sDate.getTime()) / totalDuration) * 100;
                  return (
                    <div 
                      key={i} 
                      className="pipeline-bar" 
                      style={{ left: \`\${left}%\`, width: \`\${width}%\` }}
                    >
                      <span>{phase.utilizationPercentage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pipeline-legend">
        <span className="legend-item"><span className="legend-color legend-color--conflict"></span> Overallocated (\u003e100%) Range</span>
        <span className="legend-item"><span className="legend-color legend-color--bar"></span> Assigned Phase</span>
      </div>
    </div>
  )
}

function ProjectsSection({`;

if (!mainContent.includes('function GanttPipelineView')) {
  mainContent = mainContent.replace("function ProjectsSection({", componentCode);
}

fs.writeFileSync(mainTsxPath, mainContent, 'utf8');
console.log('main.tsx updated successfully using precise Regex.');

const cssPath = path.join(__dirname, 'src', 'style.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

if (!cssContent.includes('.pipeline-container')) {
  const styles = \`
/* Pipeline Chart specific styles */
.pipeline-container { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; }
.pipeline-visual-area { position: relative; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; min-height: 250px; }
.pipeline-highlights { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 1; }
.pipeline-conflict-zone { position: absolute; top: 0; bottom: 0; background: rgba(211, 47, 47, 0.15); border-left: 1px dashed rgba(211, 47, 47, 0.3); border-right: 1px dashed rgba(211, 47, 47, 0.3); }
.pipeline-rows { position: relative; z-index: 2; display: flex; flex-direction: column; }
.pipeline-row-header { display: flex; justify-content: space-between; padding: 0.75rem 1rem; border-bottom: 2px solid #e2e8f0; background: #fff; color: #334155; }
.pipeline-scale-label { font-size: 0.85rem; color: #64748b; font-weight: 500; }
.pipeline-row { display: grid; grid-template-columns: 200px 1fr; align-items: center; border-bottom: 1px solid #e2e8f0; background: #fff; }
.pipeline-row:last-child { border-bottom: none; }
.pipeline-row-label { padding: 1rem; font-weight: 600; color: #0f172a; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.pipeline-row-tracks { position: relative; height: 100%; min-height: 60px; background: #f1f5f9; padding: 1rem 0; }
.pipeline-bar { position: absolute; top: 50%; transform: translateY(-50%); height: 28px; background: linear-gradient(90deg, #10b981 0%, #059669 100%); border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.75rem; font-weight: bold; opacity: 0.9; transition: opacity 0.2s; }
.pipeline-list .pipeline-bar:hover { opacity: 1; }
.pipeline-legend { display: flex; gap: 1.5rem; align-items: center; padding: 0.5rem; }
.legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #334155; font-weight: 500; }
.legend-color { display: inline-block; width: 16px; height: 16px; border-radius: 4px; }
.legend-color--conflict { background: rgba(211, 47, 47, 0.2); border: 1px dashed rgba(211, 47, 47, 0.4); }
.legend-color--bar { background: #10b981; }
  \`;
  fs.appendFileSync(cssPath, styles, 'utf8');
  console.log('style.css updated successfully.');
} else {
  console.log('CSS already injected.');
}
