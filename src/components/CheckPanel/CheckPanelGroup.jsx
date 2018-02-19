import React, { Component } from "react";
import CheckPanel from "./CheckPanel.jsx";

export default class CheckPanelGroup extends Component {

  constructor(props) {
    super(props);
    this.permissionMap = {};
    this.state = {};
  }

  componentWillMount() {
    this.gotProps(this.props, true);
  }

  componentWillReceiveProps(nextProps) {
    this.gotProps(nextProps, false);
  }

  gotProps(props, gotFromMount) {
    const permissions = props.permissions,
      enabled = props.enabled,
      checked = props.checked,
      permissionMap = this.permissionMap,
      currentProps = this.props,
      firstRun = currentProps === props,
      currentPermissions = currentProps.permissions;
    // console.log(permissions)
    // console.log(enabled)
    // console.log(checked)
    // console.log(permissionMap)
    // console.log(currentProps)
    // console.log(firstRun)
    // console.log(currentPermissions)
    if (!permissions) {
      return;
    }
    let doSort = false;

    if (permissions && (firstRun || !currentPermissions)) {
      doSort = true;
      // console.log(doSort)
    }

    if (doSort) {
      permissions.forEach(function (item) {
        //groupKey has Key and Value has Array
        const groupKey = item.key,
          values = item.values,
          enabledList = enabled[groupKey] || [],
          checkedList = checked[groupKey] || [];
        let enabledCount = 0,
          checkedCount = 0;

        const permission = permissionMap[groupKey] = {};
        values.sort(function (v1, v2) { // just doing sorting of Enabled elements
          // console.log(values)
          // console.log(v1.key,v2.key)
          const
            k1 = v1.key,
            k2 = v2.key,
            e1 = enabledList.indexOf(k1) === -1 ? -1 : 1,
            e2 = enabledList.indexOf(k2) === -1 ? -1 : 1,
            c1 = checkedList.indexOf(k1) === -1 ? -1 : 1,
            c2 = checkedList.indexOf(k2) === -1 ? -1 : 1,
            diffCheck = c2 - c1,
            diffEnabled = e2 - e1;
          return diffCheck ? diffCheck : diffEnabled;
        });

        values.forEach(function (value) {
          const itemKey = value.key;
          permission[itemKey] = true;

          if (enabledList.indexOf(itemKey) !== -1) {
            enabledCount++;
          }

          if (checkedList.indexOf(itemKey) !== -1) {
            checkedCount++;
          }
        });

        item.checkedCount = checkedCount;
        item.enabledCount = enabledCount;
      });
    }
    // console.log(permissions)
    // console.log(enabled)
    // console.log(checked)
    //this newState is maintaining changing states
    const newState = {
      "permissions": permissions,
      "enabled": enabled,
      "checked": checked
    };
    // console.log(newState)
    this.setState(newState);
  }

  valueChanged(groupKey, itemKey, isChecked) {
    // console.log(groupKey, itemKey, isChecked)

    const props = this.props,
      onChange = props.onChange,
      state = this.state,
      permissions = state.permissions,
      checked = state.checked,
      enabled = state.enabled,
      newState = {
        "permissions": permissions,
        "enabled": enabled,
        "checked": checked,
      };

    this.setItemChecked(groupKey, itemKey, isChecked, checked, enabled);

    this.setState(newState);
    if (onChange) {
      onChange(newState);
    }
  }

  setItemChecked(groupKey, itemKey, checked, checkedGroup, enabledGroup) {
    const enabledList = enabledGroup[groupKey];

    if (checked) {//Selecting
      if (itemKey) {//Selecting 1 item
        this.addItemToGroup(groupKey, itemKey, checkedGroup);

        const allChecked = this.wholeGroupHasList(groupKey, checkedGroup[groupKey]);
        if (allChecked) {
          checkedGroup[groupKey] = null;
        }

      } else {//Selecting group
        const allEnabled = this.wholeGroupHasList(groupKey, enabledList);
        checkedGroup[groupKey] = allEnabled ? null : enabledList.slice(0);
      }

    } else {//Deselecting
      if (itemKey) {//Deselecting 1 item
        if (!this.removeItemFromGroup(groupKey, itemKey, checkedGroup)) {
          /*
            The case in which no list exists(all permissions are selected)
            Create a new `Checked-List` by copying all the enabled ones
            then removing only this `itemKey`
          */
          checkedGroup[groupKey] = enabledList.slice(0);
          checkedGroup[groupKey].splice(enabledList.indexOf(itemKey), 1);
        }

      } else {//Deselecting group
        delete checkedGroup[groupKey];
      }
    }
  }

  getAllGroupItems(groupKey) {
    const group = this.permissionMap[groupKey];
    return group ? Object.keys(group) : [];
  }

  wholeGroupHasList(groupKey, items) {
    const totalItems = this.getAllGroupItems(groupKey);
    return totalItems.length === items.length;
  }

  removeItemFromGroup(groupKey, itemKey, checkedGroup) {
    const list = checkedGroup[groupKey];
    if (list) {
      const index = list.indexOf(itemKey);

      if (index !== -1) {
        list.splice(index, 1);
      }

      if (!list.length) {
        delete checkedGroup[groupKey];
      }
      return true;
    }

    return false;
  }

  addItemToGroup(groupKey, itemKey, checkedGroup) {
    let list = checkedGroup[groupKey];
    if (!list) {
      checkedGroup[groupKey] = list = [];
    }

    if (list.indexOf(itemKey) === -1) {
      list.push(itemKey);
      return true;

    } else {
      return false;
    }
  }
  handleSubmitEvent = formSubmitEvent => {
    formSubmitEvent.preventDefault();

  }
  render() {
    const instance = this,
      props = instance.props,
      invertCheck = props.invertCheck,
      state = instance.state,
      permissions = state.permissions,
      enabled = state.enabled,
      checked = state.checked,
      list = [];

    if (!permissions) {
      return null;
    }

    permissions.forEach(function (permissionGroup) {
      const key = permissionGroup.key,
        enabledGroup = enabled[key],
        checkedGroup = checked[key];
      // console.log("key",key)
      // console.log("name and values" ,permissionGroup.name, permissionGroup.values)
      // console.log("enabled",enabledGroup) 
      // console.log("checked",checkedGroup)        
      list.push(
        <CheckPanel
          key={key}
          groupKey={key}
          title={permissionGroup.name}
          permissions={permissionGroup.values}
          enabled={enabledGroup}
          checked={checkedGroup}
          invertCheck={invertCheck}
          onChange={(groupKey, itemKey, checked) => {
            instance.valueChanged(groupKey, itemKey, checked);
          }}
        />
      );
    });

    return (
      <div>
        <form action="" onSubmit={this.handleSubmitEvent}>
          {list}
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}