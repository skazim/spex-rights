import React from "react";

const Checkbox = ({ name, enabled, checked, sup, onChange }) => (
  <div
    className={
      "check-panel__check" +
      (checked ? " check-panel__check--checked" : "") +
      (enabled ? "" : " check-panel__check--disabled")
    }
    onClick={enabled ? (event => { onChange(!checked); }) : undefined}>
    <span className="check">{checked ? "\u2611" : "\u2610"}</span>
    <span className="label">{name}</span> {sup !== undefined && <sup>{sup}</sup>}
  </div>
);

export default Checkbox;
