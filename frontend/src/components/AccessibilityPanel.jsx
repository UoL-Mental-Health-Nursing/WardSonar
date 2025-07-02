import { useContext } from 'react';
import { AccessibilityContext } from '../context/AccessibilityContext';
import './AccessibilityPanel.css';

export default function AccessibilityPanel() {
  const { setFontScale, highContrast, setHighContrast } = useContext(AccessibilityContext);

  return (
    <div className="accessibility-panel">
      <h4>Accessibility</h4>
      <div className="control-group">
        <span>Font Size:</span>
        <button onClick={() => setFontScale((f) => Math.max(0.75, f - 0.1))}>A–</button>
        <button onClick={() => setFontScale((f) => Math.min(2, f + 0.1))}>A+</button>
      </div>
      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
          />
          High Contrast
        </label>
      </div>
    </div>
  );
}

