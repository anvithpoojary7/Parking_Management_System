import React from 'react';
import './SlotFilterPanel.css';

const SlotFilterPanel = ({
  onApply
}) => {
  return (
    <div className="slot-filter-panel">
      <div className="slot-filter-row">
       
        <select className="slot-filter-select">
          <option value="">Slot Type</option>
          <option value="compact">Compact</option>
          <option value="large">Large</option>
          <option value="ev">EV</option>
        </select>
        <input type="number" placeholder="Max Rate (₹/hr)" className="slot-filter-input" />
      </div>

   

      <div className="slot-filter-row checkbox-row">
        <label><input type="checkbox" /> EV Supported</label>
        <label><input type="checkbox" /> Covered</label>
        <label><input type="checkbox" /> CCTV</label>
      </div>

      <div className="slot-filter-row apply-btn-row">
        <button className="apply-button" onClick={onApply}>Apply</button>
      </div>
    </div>
  );
};

export default SlotFilterPanel;
