/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/_drawer.js":
/*!***************************!*\
  !*** ./src/js/_drawer.js ***!
  \***************************/
/***/ (() => {

console.log("drawer");
// ドロワーメニュー関連の処理
var menuButton = document.getElementById("js-menu");
var drawer = document.getElementById("js-drawer");
var drawerMenu = document.getElementById("js-drawer-menu");
var drawerAnchorLinks = drawerMenu.querySelectorAll('a[href*="#"]');

// ドロワーメニューを展開する処理
function openDrawer() {
  menuButton.setAttribute("aria-expanded", "true");
  drawer.setAttribute("aria-hidden", "false");
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

// ドロワーメニューを閉じる処理
function closeDrawer() {
  menuButton.setAttribute("aria-expanded", "false");
  drawer.setAttribute("aria-hidden", "true");
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}

// ハンバーガーメニューをクリックした時の処理
menuButton.addEventListener("click", function () {
  if (menuButton.getAttribute("aria-expanded") === "true") {
    closeDrawer();
  } else {
    openDrawer();
  }
});

// ページ内リンクをクリックしたとき、ドロワーメニューを閉じる
drawerAnchorLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    closeDrawer();
  });
});

// ドロワーメニュー以外の要素をクリックしたとき、ドロワーメニューを閉じる
drawer.addEventListener("click", function (event) {
  if (drawerMenu && drawerMenu.contains(event.target) || menuButton && menuButton.contains(event.target)) return;
  closeDrawer();
});

// ブレイクポイントを超えたとき、ドロワーメニューを閉じる
window.addEventListener("resize", function () {
  if (window.innerWidth >= 768) {
    closeDrawer();
  }
});

/***/ }),

/***/ "./src/js/_modal.js":
/*!**************************!*\
  !*** ./src/js/_modal.js ***!
  \**************************/
/***/ (() => {

// モーダル関連の処理
var modalBtns = document.querySelectorAll("[data-target]");
modalBtns.forEach(function (btn) {
  var touchStartX = 0;
  var touchStartY = 0;
  var touchStartTime = 0;

  // クリックイベントの処理
  var openModal = function openModal() {
    var modal = btn.getAttribute("data-target");
    document.getElementById(modal).classList.add("is-show");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  };

  // タッチ開始位置を記録
  btn.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  });

  // デスクトップおよびタッチデバイス用のクリックイベント
  btn.addEventListener('click', function (e) {
    // タッチデバイスでのタップ後のクリックイベントを防ぐためのフラグ
    var touchHandled = false;

    // タッチイベントが処理された場合はクリックを無視
    if (!touchHandled) {
      openModal();
    }
  });

  // タッチ終了時に移動距離をチェック
  btn.addEventListener('touchend', function (e) {
    var touchEndX = e.changedTouches[0].clientX;
    var touchEndY = e.changedTouches[0].clientY;
    var touchEndTime = Date.now();

    // 移動距離を計算
    var deltaX = Math.abs(touchEndX - touchStartX);
    var deltaY = Math.abs(touchEndY - touchStartY);
    var deltaTime = touchEndTime - touchStartTime;

    // 移動距離が10px未満かつタッチ時間が300ms未満の場合のみタップと判定
    if (deltaX < 10 && deltaY < 10 && deltaTime < 300) {
      e.preventDefault();
      openModal();
      touchHandled = true; // タッチイベントが処理されたことを記録
    }
  });
});

// 1つ目のモーダルを常時表示 // test
// const firstModal = document.querySelector("[data-modal]");
// if (firstModal) {
//   firstModal.classList.add("is-show");
//   document.documentElement.style.overflow = "hidden";
//   document.body.style.overflow = "hidden";
// }

var closeBtns = document.querySelectorAll("[data-modal-close]");
closeBtns.forEach(function (btn) {
  btn.onclick = function () {
    var modal = btn.closest("[data-modal]");
    modal.classList.remove("is-show");
    if (document.querySelectorAll(".is-show").length === 0) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  };
});
window.onclick = function (event) {
  if (event.target.getAttribute("data-modal") !== null) {
    event.target.classList.remove("is-show");
    if (document.querySelectorAll(".is-show").length === 0) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }
};

/***/ }),

/***/ "./src/js/_slider.js":
/*!***************************!*\
  !*** ./src/js/_slider.js ***!
  \***************************/
/***/ (() => {

// トップスライダー関連の処理
var mvSplide = document.getElementById("js-mv-splide");
if (mvSplide) {
  new Splide("#js-mv-splide", {
    type: "fade",
    rewind: true,
    autoplay: true,
    perPage: 1,
    perMove: 1,
    gap: 0,
    pagination: false,
    arrows: false
  }).mount();
}

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
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _drawer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_drawer.js */ "./src/js/_drawer.js");
/* harmony import */ var _drawer_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_drawer_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _slider_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_slider.js */ "./src/js/_slider.js");
/* harmony import */ var _slider_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_slider_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _modal_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_modal.js */ "./src/js/_modal.js");
/* harmony import */ var _modal_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_modal_js__WEBPACK_IMPORTED_MODULE_2__);



console.log('index.jsからこんにちは！');
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map