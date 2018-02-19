import React, { Component } from 'react';
import CheckPanelGroup from './CheckPanel/CheckPanelGroup.jsx';
export default class App extends Component {

  constructor(props) {
    super(props);
    const instance = this,
      callbackList = this.callbackList = [];
    this.url = 'http://172.17.0.1/spexAccess/original.json';
    this.FETCH_OPTIONS = {
      "timeout": 5 * 1000
    };
    this.state = {
      // "permissions" : props.permissions,
      // "enabled"     : props.enabled,
      // "checked"     : props.checked,
      "invertCheck": props.invertCheck
    };
    var obj;
    fetch(this.url,
      this.FETCH_OPTIONS, {
        headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/json'
        },
        method: 'GET'
      }
    )
      .then(function (response) {
        if (!response.ok) {
          throw Error(response.statusText)
        }
        return response.json();
      })
      // .then((response) => response.json())
      .then((data) => obj = data)
      .then(response => {
        this.setState({
          "permissions": obj.permissions,
          "enabled": obj.enabled,
          "checked": obj.checked
        })
      })

    if (props.controllerName) {
      const controller = {},
        setState = instance.setState.bind(instance);

      window[props.controllerName] = controller;

      controller.setData = function (data) {
        setState(data);
      };

      controller.addChangeListener = function (callback) {
        callbackList.push(callback);
      };

      controller.removeChangeListener = function (callback) {
        callbackList.splice(callbackList.indexOf(callback), 1);
      };
    }
  }

  stateChanged(newState) {
    const callbackList = this.callbackList;
    if (callbackList.length) {
      callbackList.forEach(function (callback) {
        if (callback && callback.constructor === Function) {
          callback(newState);
        }
      });
    }
  }

  render() {
    const instance = this,
      state = instance.state;
    return (
      <div className="App">
        <div className="check-holder">
          <CheckPanelGroup
            onChange={(data) => {
              const newState = {
                "permissions": data.permissions,
                "enabled": data.enabled,
                "checked": data.checked
              };
              instance.setState(newState);
              instance.stateChanged(newState);
            }}
            invertCheck={state.invertCheck}
            permissions={state.permissions}
            enabled={state.enabled}
            checked={state.checked}
          />
        </div>
      </div>
    );
  }
}
