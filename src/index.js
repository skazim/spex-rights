import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App.jsx';

const
  ENV = process.env.NODE_ENV,
  IS_DEV_ENV = ENV === "development",
  appData = {};

if (IS_DEV_ENV) {
  // appData.permissions = [
  //   {
  //     "key": "video",
  //     "name": "Video",
  //     "values": [
  //       {
  //         "key": "embed",
  //         "name": "Embed Video"
  //       }, {
  //         "key": "upload",
  //         "name": "Upload"
  //       },
  //       {
  //         "key": "download",
  //         "name": "Download"
  //       }
  //     ]
  //   }, {
  //     "key": "title",
  //     "name": "Title",
  //     "values": [
  //       {
  //         "key": "edit",
  //         "name": "Edit"
  //       }, {
  //         "key": "remove",
  //         "name": "Remove"
  //       }, {
  //         "key": "destroy",
  //         "name": "Destroy"
  //       }]
  //   }, {
  //     "key": "images",
  //     "name": "Images",
  //     "values": [
  //       {
  //         "key": "upload",
  //         "name": "Upload"
  //       }, {
  //         "key": "remove",
  //         "name": "Remove"
  //       }, {
  //         "key": "paint",
  //         "name": "Paint"
  //       }]
  //   }];
  appData.controllerName = "test";

  // appData.enabled = {
  //   "video": ["embed", "upload", "download"],
  //   "title": ["remove", "destroy"]
  // };

  // appData.checked = {
  //   "video": ["upload"]
  // };

} else {
  const controllerNameAttribute = "data-spex-controller-name",
    scriptTag = document.querySelector("[" + controllerNameAttribute + "]");
  appData.controllerName = scriptTag.getAttribute(controllerNameAttribute);
}

ReactDOM.render(
  <App
    // permissions={appData.permissions}
    enabled={appData.enabled}
    checked={appData.checked}
    invertCheck={appData.invertCheck}
    controllerName={appData.controllerName}
  />, document.querySelector(".spexaccess-user-rights"));