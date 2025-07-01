import React from 'react';
import './DirectionMeter.css';

export default function DirectionMeter({ counts }) {
  const better = counts['better'] || 0;
  const same = counts['same'] || 0;
  const worse = counts['worse'] || 0;
  const total = better + same + worse;

  if (total === 0) return <p className="no-data">No data</p>;

  const score = (better * 1 + same * 0.5 + worse * 0) / total;
  const fillWidth = score * 100;

  return (
    <div className="direction-meter">
      <div
        className="direction-meter-fill"
        style={{ width: `${fillWidth}%` }}
      />
    </div>
  );
}
