const fs = require('fs');
const path = require('path');
const cssPath = path.join(__dirname, 'src', 'style.css');

const styles = `
/* Pipeline Chart specific styles */
.pipeline-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
}

.pipeline-visual-area {
  position: relative;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  min-height: 250px;
}

.pipeline-highlights {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.pipeline-conflict-zone {
  position: absolute;
  top: 0;
  bottom: 0;
  background: rgba(211, 47, 47, 0.15); /* Red conflict zone */
  border-left: 1px dashed rgba(211, 47, 47, 0.3);
  border-right: 1px dashed rgba(211, 47, 47, 0.3);
}

.pipeline-rows {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
}

.pipeline-row-header {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid #e2e8f0;
  background: #fff;
  color: #334155;
}

.pipeline-scale-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.pipeline-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
}

.pipeline-row:last-child {
  border-bottom: none;
}

.pipeline-row-label {
  padding: 1rem;
  font-weight: 600;
  color: #0f172a;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.pipeline-row-tracks {
  position: relative;
  height: 100%;
  min-height: 60px;
  background: #f1f5f9;
  padding: 1rem 0;
}

.pipeline-bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 28px;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.75rem;
  font-weight: bold;
  opacity: 0.9;
  transition: opacity 0.2s;
}

.pipeline-bar:hover {
  opacity: 1;
}

.pipeline-legend {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  padding-left: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #334155;
  font-weight: 500;
}

.legend-color {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color--conflict {
  background: rgba(211, 47, 47, 0.2);
  border: 1px dashed rgba(211, 47, 47, 0.4);
}

.legend-color--bar {
  background: #10b981;
}
`;

fs.appendFileSync(cssPath, styles, 'utf8');
console.log('Appended pipeline CSS styles.');
