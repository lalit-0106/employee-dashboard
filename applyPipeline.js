const fs = require('fs');
const path = require('path');

const mainTsxPath = path.join(__dirname, 'src', 'main.tsx');
let content = fs.readFileSync(mainTsxPath, 'utf8');

const normalizeLF = (str) => str.replace(/\r\n/g, '\n');
content = normalizeLF(content);

// 1. Add Type
content = content.replace(
  "type ProjectMode = 'active' | 'completed'",
  "type ProjectMode = 'active' | 'completed' | 'overlaps'"
);

// 2. Add Label
content = content.replace(
  "  completed: 'Completed Projects',\n}",
  "  completed: 'Completed Projects',\n  overlaps: 'Utilization Overlaps',\n}"
);

// 3. Update URL Parser
content = content.replace(
  "if (mode === 'active' || mode === 'completed') {",
  "if (mode === 'active' || mode === 'completed' || mode === 'overlaps') {"
);

// 4. Update Toggle Map
content = content.replace(
  "(['active', 'completed'] as const).map(",
  "(['active', 'completed', 'overlaps'] as const).map("
);

// 5. Conditional Rendering
const layoutTarget = `      <div className="projects-layout">\n        <aside className="projects-list"`;
const layoutReplace = `      <div className="projects-layout">\n        {mode === 'overlaps' ? (\n          <GanttPipelineView />\n        ) : (\n          <>\n        <aside className="projects-list"`;
content = content.replace(layoutTarget, layoutReplace);

content = content.replace(
  `            </div>\n          </article>\n        ) : null}\n      </div>\n    </section>\n  )\n}`,
  `            </div>\n          </article>\n        ) : null}\n          </>\n        )}\n      </div>\n    </section>\n  )\n}`
);

// 6. Insert new Component
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

  // Pad by 15 days
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

content = content.replace("function ProjectsSection({", componentCode);

fs.writeFileSync(mainTsxPath, content, 'utf8');
console.log('main.tsx fully updated structure to pipeline Gantt.');
