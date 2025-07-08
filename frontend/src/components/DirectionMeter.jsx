import React from 'react';
import './DirectionMeter.css';

export default function DirectionMeter({ counts }) {
  const better = counts['better'] || 0;
  const same = counts['same'] || 0;
  const worse = counts['worse'] || 0;
  const total = better + same + worse;

  if (total === 0) return <p className="no-data">No data</p>;

  const score = (better * 1 + same * 0.5 + worse * 0) / total;
  const centerScore = score - 0.5;
  const fillPercent = Math.abs(centerScore * 200); // now on a 0–100% scale from center
  const isBetter = centerScore > 0;

  return (
    <div className="direction-meter-wrapper">
      <div className="direction-meter">
        {centerScore === 0 ? (
          <div
            className="direction-meter-fill fill-same"
            style={{
              width: `5%`,
              left: '50%',
              position: 'absolute',
              transform: 'translateX(-50%)',
            }}
          />
        ) : (
          <div
            className={`direction-meter-fill ${isBetter ? 'fill-better' : 'fill-worse'}`}
            style={{
              width: `${fillPercent}%`,
              left: '50%',
              position: 'absolute',
              transform: `translateX(${isBetter ? '0%' : `-${fillPercent}%`})`,
            }}
          />
        )}
      </div>
      <div className="direction-labels">
        <span className="label left">Getting Worse</span>
        <span className="label middle">Same</span>
        <span className="label right">Getting Better</span>
      </div>
    </div>
  );
}
