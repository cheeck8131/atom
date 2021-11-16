/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/index.ts":
/*!*****************************!*\
  !*** ./src/client/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _lib_noclip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/noclip */ \"./src/client/lib/noclip/index.js\");\n/* harmony import */ var _lib_noclip__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lib_noclip__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _race__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./race */ \"./src/client/race.ts\");\n/* harmony import */ var _race__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_race__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n//# sourceURL=webpack://test/./src/client/index.ts?");

/***/ }),

/***/ "./src/client/lib/noclip/index.js":
/*!****************************************!*\
  !*** ./src/client/lib/noclip/index.js ***!
  \****************************************/
/***/ (() => {

eval("var getNormalizedVector = function getNormalizedVector(vector) {\n  var mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);\n  vector.x = vector.x / mag;\n  vector.y = vector.y / mag;\n  vector.z = vector.z / mag;\n  return vector;\n};\n\nvar getCrossProduct = function getCrossProduct(v1, v2) {\n  var vector = new mp.Vector3(0, 0, 0);\n  vector.x = v1.y * v2.z - v1.z * v2.y;\n  vector.y = v1.z * v2.x - v1.x * v2.z;\n  vector.z = v1.x * v2.y - v1.y * v2.x;\n  return vector;\n};\n\nvar bindVirtualKeys = {\n  F2: 0x71\n};\nvar bindASCIIKeys = {\n  Q: 69,\n  E: 81,\n  LCtrl: 17,\n  Shift: 16\n};\nmp.game.graphics.notify('~r~NoClip ~w~by ~b~Morbo');\nvar isNoClip = false;\nvar noClipCamera;\nvar shiftModifier = false;\nvar controlModifier = false;\nvar localPlayer = mp.players.local;\nmp.keys.bind(bindVirtualKeys.F2, true, function () {\n  isNoClip = !isNoClip;\n  mp.game.ui.displayRadar(!isNoClip);\n\n  if (isNoClip) {\n    startNoClip();\n  } else {\n    stopNoClip();\n  }\n});\n\nfunction startNoClip() {\n  mp.game.graphics.notify('NoClip ~g~activated');\n  var camPos = new mp.Vector3(localPlayer.position.x, localPlayer.position.y, localPlayer.position.z);\n  var camRot = mp.game.cam.getGameplayCamRot(2);\n  noClipCamera = mp.cameras[\"new\"]('default', camPos, camRot, 45);\n  noClipCamera.setActive(true);\n  mp.game.cam.renderScriptCams(true, false, 0, true, false);\n  localPlayer.freezePosition(true);\n  localPlayer.setInvincible(true);\n  localPlayer.setVisible(false, false);\n  localPlayer.setCollision(false, false);\n}\n\nfunction stopNoClip() {\n  mp.game.graphics.notify('NoClip ~r~disabled');\n\n  if (noClipCamera) {\n    localPlayer.position = noClipCamera.getCoord();\n    localPlayer.setHeading(noClipCamera.getRot(2).z);\n    noClipCamera.destroy(true);\n    noClipCamera = null;\n  }\n\n  mp.game.cam.renderScriptCams(false, false, 0, true, false);\n  localPlayer.freezePosition(false);\n  localPlayer.setInvincible(false);\n  localPlayer.setVisible(true, false);\n  localPlayer.setCollision(true, false);\n}\n\nmp.events.add('render', function () {\n  if (!noClipCamera || mp.gui.cursor.visible) {\n    return;\n  }\n\n  controlModifier = mp.keys.isDown(bindASCIIKeys.LCtrl);\n  shiftModifier = mp.keys.isDown(bindASCIIKeys.Shift);\n  var rot = noClipCamera.getRot(2);\n  var fastMult = 1;\n  var slowMult = 1;\n\n  if (shiftModifier) {\n    fastMult = 3;\n  } else if (controlModifier) {\n    slowMult = 0.5;\n  }\n\n  var rightAxisX = mp.game.controls.getDisabledControlNormal(0, 220);\n  var rightAxisY = mp.game.controls.getDisabledControlNormal(0, 221);\n  var leftAxisX = mp.game.controls.getDisabledControlNormal(0, 218);\n  var leftAxisY = mp.game.controls.getDisabledControlNormal(0, 219);\n  var pos = noClipCamera.getCoord();\n  var rr = noClipCamera.getDirection();\n  var vector = new mp.Vector3(0, 0, 0);\n  vector.x = rr.x * leftAxisY * fastMult * slowMult;\n  vector.y = rr.y * leftAxisY * fastMult * slowMult;\n  vector.z = rr.z * leftAxisY * fastMult * slowMult;\n  var upVector = new mp.Vector3(0, 0, 1);\n  var rightVector = getCrossProduct(getNormalizedVector(rr), getNormalizedVector(upVector));\n  rightVector.x *= leftAxisX * 0.5;\n  rightVector.y *= leftAxisX * 0.5;\n  rightVector.z *= leftAxisX * 0.5;\n  var upMovement = 0.0;\n\n  if (mp.keys.isDown(bindASCIIKeys.Q)) {\n    upMovement = 0.5;\n  }\n\n  var downMovement = 0.0;\n\n  if (mp.keys.isDown(bindASCIIKeys.E)) {\n    downMovement = 0.5;\n  }\n\n  mp.players.local.position = new mp.Vector3(pos.x + vector.x + 1, pos.y + vector.y + 1, pos.z + vector.z + 1);\n  mp.players.local.heading = rr.z;\n  noClipCamera.setCoord(pos.x - vector.x + rightVector.x, pos.y - vector.y + rightVector.y, pos.z - vector.z + rightVector.z + upMovement - downMovement);\n  noClipCamera.setRot(rot.x + rightAxisY * -5.0, 0.0, rot.z + rightAxisX * -5.0, 2);\n});\n\n//# sourceURL=webpack://test/./src/client/lib/noclip/index.js?");

/***/ }),

/***/ "./src/client/race.ts":
/*!****************************!*\
  !*** ./src/client/race.ts ***!
  \****************************/
/***/ (() => {

eval("var player = mp.players.local;\nvar taskPlayerPutIntoVeh = null;\nmp.events.add(\"setTaskPutIntoVehicle\", function (vehicle, timeout) {\n  taskPlayerPutIntoVeh = vehicle;\n  setTimeout(function () {\n    taskPlayerPutIntoVeh = null;\n  }, timeout);\n});\nmp.events.add(\"entityStreamIn\", function (entity) {\n  if (entity === taskPlayerPutIntoVeh) {\n    player.setIntoVehicle(taskPlayerPutIntoVeh.handle, -1);\n    taskPlayerPutIntoVeh = null;\n  }\n});\nvar browser = mp.browsers[\"new\"](\"package://index.html\");\nmp.events.add({\n  showHot: function showHot() {\n    browser.call(\"showHot\");\n  },\n  showCold: function showCold() {\n    browser.call(\"showCold\");\n  }\n});\n\n//# sourceURL=webpack://test/./src/client/race.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/client/index.ts");
/******/ 	
/******/ })()
;