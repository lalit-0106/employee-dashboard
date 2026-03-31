const fs = require('fs');
const path = require('path');

const mainTsxPath = path.join(__dirname, 'src', 'main.tsx');
let mainContent = fs.readFileSync(mainTsxPath, 'utf8');

const oldOverlapsViewStart = mainContent.indexOf('function OverlapsView() {');
const projectsSectionStart = mainContent.indexOf('function ProjectsSection({');

if (oldOverlapsViewStart !== -1 && projectsSectionStart !== -1) {
    const replacement = `function OverlapsView() {
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
                title={\`Overallocated\`}
              />
            );
          })}
        </div>
        
        <div className="pipeline-rows">
          <div className="pipeline-row-header">
            <strong>Active Projects Pipeline</strong>
            <span className="pipeline-scale-label">({minDate.toLocaleDateString('en-US', {month: 'short', year: 'numeric'})} - {maxDate.toLocaleDateString('en-US', {month: 'short', year: 'numeric'})})</span>
          </div>
          {activeProjects.map(proj => (
            <div className="pipeline-row" key={proj.id}>
              <div className="pipeline-row-label">
                <span>{proj.name}</span>
                <small className={\`type-pill \${proj.type === 'Client' ? 'type-pill--client' : 'type-pill--internal'}\`}>{proj.type}</small>
              </div>
              <div className="pipeline-row-tracks">
                {proj.utilizationPhases.map((phase, i) => {
                  const sDate = parseDate(phase.startDate);
                  const eDate = parseDate(phase.endDate);
                  const left = ((sDate.getTime() - minDate.getTime()) / totalDuration) * 100;
                  const width = ((eDate.getTime() - sDate.getTime()) / totalDuration) * 100;
                  return (
                    <div 
                      key={i} 
                      className="pipeline-bar" 
                      style={{ left: \`\${left}%\`, width: \`\${width}%\` }}
                    >
                      <span className="pipeline-bar-label">{phase.utilizationPercentage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pipeline-legend">
        <span className="legend-item"><span className="legend-color legend-color--conflict"></span> Overallocated (\u003e100%) Time</span>
        <span className="legend-item"><span className="legend-color legend-color--bar"></span> Assigned Utilization</span>
      </div>
    </div>
  )
}

`;
    mainContent = mainContent.substring(0, oldOverlapsViewStart) + replacement + mainContent.substring(projectsSectionStart);
    fs.writeFileSync(mainTsxPath, mainContent, 'utf8');
    console.log('Successfully updated OverlapsView component.');
} else {
    console.log('Could not find boundaries.');
}

