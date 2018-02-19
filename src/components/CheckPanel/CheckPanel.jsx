import React, { Component } from "react";
import Checkbox from "./Checkbox.jsx";

export default class CheckPanel extends Component {

  render() {
    let enabledCount = 0,
      checkedCount = 0
      //,permissionCount = 0
      ;
    // console.log(this.props)
    const props = this.props,
      groupKey = props.groupKey,
      values = props.permissions,
      invertCheck = props.invertCheck,
      enabledList = props.enabled,
      checkedList = props.checked,
      checkList = values.map(function (item, index) {
        let key = item.key,
          enabled = enabledList ? (enabledList.indexOf(key) !== -1) : false,
          checked = checkedList ? (checkedList.indexOf(key) !== -1) : ((checkedList === null) ? enabled : false);
        if (invertCheck && enabled) {
          checked = !checked;
        }
        console.log(invertCheck)
        //permissionCount++;
        if (enabled) {
          enabledCount++;
          if (checked) {
            checkedCount++;
          }
        }

        return (
          //for single checks
          <Checkbox
            key={key}
            name={item.name}
            checked={checked}
            enabled={enabled}
            onChange={checked => {
              props.onChange(groupKey, item.key, invertCheck ? !checked : checked);
            }}
          />
        );
      }),
      title = props.title;

    const anyEnabled = (enabledCount >= 1),
      //TODO to check from the list being null.
      everythingChecked = anyEnabled && (checkedCount === enabledCount);
    // console.log(title)
    // console.log(everythingChecked)
    // console.log(checkedCount ? checkedCount : undefined)
    // console.log(anyEnabled)
      console.log(checkList)
    return (
      // For all checks
      <div className="check-panel">
        <div className="check-panel__title">
          <Checkbox
            name={title}
            checked={everythingChecked}
            enabled={anyEnabled}
            sup={checkedCount ? checkedCount : undefined}
            onChange={checked => {
              props.onChange(groupKey, undefined, invertCheck ? !checked : checked);
            }}
          />
        </div>
        <div className="check-panel__check-group">
          {checkList}
        </div>
      </div>
    );
  }
}