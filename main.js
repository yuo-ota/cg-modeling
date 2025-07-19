/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_examples_jsm_lines_LineMaterial__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/lines/LineMaterial */ "./node_modules/three/examples/jsm/lines/LineMaterial.js");
/* harmony import */ var three_examples_jsm_controls_TransformControls_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/controls/TransformControls.js */ "./node_modules/three/examples/jsm/controls/TransformControls.js");
/* harmony import */ var three_examples_jsm_lines_Line2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/lines/Line2 */ "./node_modules/three/examples/jsm/lines/Line2.js");
/* harmony import */ var three_examples_jsm_lines_LineGeometry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three/examples/jsm/lines/LineGeometry */ "./node_modules/three/examples/jsm/lines/LineGeometry.js");






class ThreeJSContainer {
    camera;
    renderer;
    orbitControls;
    scene;
    chainGroup;
    emptyObjControls = [];
    emptyObjects = [];
    light;
    chainPiece;
    meshStr;
    chainGeometry;
    constructor() { }
    // 画面部分の作成(表示する枠ごとに)*
    createRendererDOM = (cameraPos) => {
        this.renderer = new three__WEBPACK_IMPORTED_MODULE_5__.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_5__.Color(0x0495ed));
        //カメラの設定
        this.camera = new three__WEBPACK_IMPORTED_MODULE_5__.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
        this.camera.position.copy(cameraPos);
        this.camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_5__.Vector3(0, 1.5, 0));
        this.orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(this.camera, this.renderer.domElement);
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render = (time) => {
            this.orbitControls.update();
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        });
        return this.renderer.domElement;
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_5__.Scene();
        this.chainGroup = new three__WEBPACK_IMPORTED_MODULE_5__.Group();
        // グリッドの表示
        const grid = new three__WEBPACK_IMPORTED_MODULE_5__.GridHelper(1000, 500, 0xeeeeee, 0xeeeeee);
        if (Array.isArray(grid.material)) {
            grid.material.forEach((mat, index) => {
                if (index === 0) {
                    mat.transparent = true; // 透明を有効化
                    mat.opacity = 0.3; // 透明度（0.0〜1.0）
                }
            });
        }
        else {
            grid.material.transparent = true; // 透明を有効化
            grid.material.opacity = 0.3; // 透明度（0.0〜1.0）
        }
        this.scene.add(grid);
        // 軸の線描画
        function createInfiniteAxis(direction, color) {
            let material = new three_examples_jsm_lines_LineMaterial__WEBPACK_IMPORTED_MODULE_1__.LineMaterial({
                color: color,
                linewidth: 0.001,
                alphaToCoverage: true,
            });
            const points = [
                direction.clone().clone().multiplyScalar(-1e6),
                direction.clone().clone().multiplyScalar(1e6),
            ];
            const positions = points.flatMap((v) => [v.x, v.y, v.z]);
            const geometry = new three_examples_jsm_lines_LineGeometry__WEBPACK_IMPORTED_MODULE_4__.LineGeometry();
            geometry.setPositions(positions);
            const lineObject = new three_examples_jsm_lines_Line2__WEBPACK_IMPORTED_MODULE_3__.Line2(geometry, material);
            return lineObject;
        }
        this.scene.add(createInfiniteAxis(new three__WEBPACK_IMPORTED_MODULE_5__.Vector3(1, 0, 0), 0xff0000)); // X軸（赤）
        this.scene.add(createInfiniteAxis(new three__WEBPACK_IMPORTED_MODULE_5__.Vector3(0, 1, 0), 0x00ff00)); // Y軸（緑）
        this.scene.add(createInfiniteAxis(new three__WEBPACK_IMPORTED_MODULE_5__.Vector3(0, 0, 1), 0x0000ff)); // Z軸（青）
        // 支点の設定
        let initPostZ = [-3, 3];
        for (let i = 0; i < 2; i++) {
            // gismo
            this.emptyObjControls[i] = new three_examples_jsm_controls_TransformControls_js__WEBPACK_IMPORTED_MODULE_2__.TransformControls(this.camera, this.renderer.domElement);
            this.emptyObjControls[i].size = 0.7;
            // ドラッグ開始・終了時の制御
            this.emptyObjControls[i].addEventListener('dragging-changed', (event) => {
                if (!this.emptyObjControls[i].visible)
                    return;
                this.orbitControls.enabled = !event.value; // ドラッグ中は OrbitControls 無効化
            });
            // ドラッグ中のリアルタイム再計算
            this.emptyObjControls[i].addEventListener('change', () => {
                if (!this.emptyObjControls[i].visible)
                    return;
                if (!this.emptyObjControls[i].dragging)
                    return; // 実際にドラッグしているときだけ
                reCalcChain(); // 毎フレーム再計算
            });
            this.scene.add(this.emptyObjControls[i]);
            this.emptyObjects[i] = new three__WEBPACK_IMPORTED_MODULE_5__.Mesh();
            this.emptyObjects[i].position.set(0, 2, initPostZ[i]);
            this.scene.add(this.emptyObjects[i]);
            this.emptyObjControls[i].attach(this.emptyObjects[i]);
        }
        const samplingCount = 10000;
        let chainPieceLength = 0.7;
        let chainAngleOffset = 0;
        let chainAngleRandomFactor = 1;
        let a = 1;
        window.emptyObj = this.emptyObjControls;
        window.setChainPieceLength = (i) => {
            chainPieceLength = i;
            reloadChain();
            reCalcChain();
        };
        window.setChainAngleOffset = (i) => {
            chainAngleOffset = i;
            reCalcChain();
        };
        window.setChainAngleRandomFactor = (i) => {
            chainAngleRandomFactor = i;
            reCalcChain();
        };
        window.setAFactor = (i) => {
            a = i;
            reCalcChain();
        };
        const chainOffset = 0.5;
        const reloadChain = () => {
            let vertexIndices = [];
            let vertices = [];
            const meshLines = this.meshStr.split('\n');
            for (let i = 0; i < meshLines.length; ++i) {
                const meshLine = meshLines[i];
                const meshSpaceSplitArray = meshLine.split(' ');
                const meshType = meshSpaceSplitArray[0]; //どの情報を表すか
                if (meshType == 'v') {
                    //頂点
                    vertices.push(parseFloat(meshSpaceSplitArray[1])); //x座標
                    vertices.push(parseFloat(meshSpaceSplitArray[2])); //y座標
                    let z = parseFloat(meshSpaceSplitArray[3]);
                    if (z < 0) {
                        vertices.push(z -
                            (chainPieceLength - chainOffset) / 2 +
                            (chainPieceLength - chainOffset) / 2); //z座標
                    }
                    else {
                        vertices.push(z + chainPieceLength / 2 + (chainPieceLength - chainOffset) / 2); //z座標
                    }
                }
                else if (meshType == 'f') {
                    //面の情報
                    const f1 = meshSpaceSplitArray[1].split('/');
                    const f2 = meshSpaceSplitArray[2].split('/');
                    const f3 = meshSpaceSplitArray[3].split('/');
                    vertexIndices.push(parseInt(f1[0]) - 1); //頂点インデックス
                    vertexIndices.push(parseInt(f2[0]) - 1); //頂点インデックス
                    vertexIndices.push(parseInt(f3[0]) - 1); //頂点インデックス
                }
            }
            const geometry = new three__WEBPACK_IMPORTED_MODULE_5__.BufferGeometry();
            geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_5__.BufferAttribute(new Float32Array(vertices), 3));
            geometry.setIndex(vertexIndices);
            geometry.computeVertexNormals();
            this.chainGeometry = geometry;
            const chainMaterial = new three__WEBPACK_IMPORTED_MODULE_5__.MeshStandardMaterial({
                color: 0x999999,
                emissive: 0x333333,
                roughness: 0,
                metalness: 1,
            });
            const chain = new three__WEBPACK_IMPORTED_MODULE_5__.Mesh(this.chainGeometry, chainMaterial);
            this.chainPiece = chain;
        };
        // チェーンピースオブジェクト作成
        const loadGeometryFromObjFile = async (filePath) => {
            this.meshStr = await readFile(filePath);
        };
        (async () => {
            await loadGeometryFromObjFile('chain.obj');
            reloadChain();
            reCalcChain();
        })();
        const reCalcChain = () => {
            // ロープの設定
            // ロープ軌道サンプリング
            const calcB = (a, v) => {
                const denominator = v.y / (2 * a * Math.sinh(v.x / (2 * a)));
                const result = v.x / 2 - a * Math.log(denominator + Math.sqrt(denominator ** 2 + 1));
                return result;
            };
            const calcC = (a, b) => {
                const result = -a * Math.cosh(-b / a);
                return result;
            };
            const a1 = (a *
                this.emptyObjects[0].position
                    .clone()
                    .distanceTo(this.emptyObjects[1].position)) /
                Math.log(this.emptyObjects[0].position
                    .clone()
                    .distanceTo(this.emptyObjects[1].position) * 10);
            const samplingCurve = (p1, p2, t) => {
                const directionVector = p2.clone().clone().sub(p1);
                const directionUVector = new three__WEBPACK_IMPORTED_MODULE_5__.Vector2(directionVector.x, directionVector.z);
                const directionSize = directionUVector.distanceTo(new three__WEBPACK_IMPORTED_MODULE_5__.Vector2(0, 0));
                const endPoint = new three__WEBPACK_IMPORTED_MODULE_5__.Vector2(directionSize, directionVector.y);
                const b = calcB(a1, endPoint);
                const u = directionSize * t;
                const v = a1 * Math.cosh((u - b) / a1) + calcC(a1, b) + p1.y;
                const p = directionUVector.clone().normalize().clone().multiplyScalar(u);
                const result = new three__WEBPACK_IMPORTED_MODULE_5__.Vector3(p.x + p1.x, v, p.y + p1.z);
                return result;
            };
            const samplePoints = [];
            for (let i = 0; i < samplingCount; i++) {
                samplePoints.push(samplingCurve(this.emptyObjects[0].position, this.emptyObjects[1].position, i / samplingCount));
            }
            // チェーンピース毎のベクトル算定
            const chainPieceVectors = [];
            let currentPosition = this.emptyObjects[0].position.clone();
            chainPieceVectors.push(currentPosition);
            samplePoints.forEach((targetPosition, index) => {
                const distance = currentPosition.distanceTo(targetPosition);
                if (distance >= chainPieceLength || index === samplingCount - 1) {
                    // 差分ベクトル（方向 × 長さ）
                    const direction = targetPosition.clone().clone().sub(currentPosition).clone().normalize();
                    const offset = direction.clone().multiplyScalar(chainPieceLength); // 差分ベクトル
                    chainPieceVectors.push(offset); // 差分を記録
                    currentPosition = currentPosition.clone().clone().add(offset); // 次の支点位置へ進む
                }
            });
            const generateChain = () => {
                if (this.chainPiece === undefined) {
                    return;
                }
                this.chainGroup.clear();
                currentPosition = chainPieceVectors[0].clone();
                let randomAngleSum = 0;
                chainPieceVectors.forEach((relativePosition, index) => {
                    if (index === 0) {
                        return;
                    }
                    const targetChain = this.chainPiece.clone();
                    targetChain.lookAt(relativePosition.clone().clone().normalize());
                    targetChain.rotateZ(three__WEBPACK_IMPORTED_MODULE_5__.MathUtils.degToRad(chainAngleOffset + randomAngleSum));
                    randomAngleSum += (Math.random() * 120 - 60) * chainAngleRandomFactor + 90;
                    const p = currentPosition;
                    targetChain.position.set(p.x, p.y, p.z);
                    this.chainGroup.add(targetChain);
                    currentPosition = currentPosition.clone().clone().add(relativePosition);
                });
            };
            generateChain();
        };
        this.scene.add(this.chainGroup);
        //ライトの設定
        const ambientLight = new three__WEBPACK_IMPORTED_MODULE_5__.AmbientLight(0x000000);
        this.scene.add(ambientLight);
        const light1 = new three__WEBPACK_IMPORTED_MODULE_5__.DirectionalLight(0x555555, 3);
        light1.position.set(0, 200, 0);
        this.scene.add(light1);
        const light2 = new three__WEBPACK_IMPORTED_MODULE_5__.DirectionalLight(0x555555, 3);
        light2.position.set(100, 200, 100);
        this.scene.add(light2);
        const light3 = new three__WEBPACK_IMPORTED_MODULE_5__.DirectionalLight(0x555555, 3);
        light3.position.set(-100, -200, -100);
        this.scene.add(light3);
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update = (time) => {
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
}
async function readFile(path) {
    return new Promise((resolve) => {
        const loader = new three__WEBPACK_IMPORTED_MODULE_5__.FileLoader();
        loader.load(path, (data) => {
            if (typeof data === 'string') {
                resolve(data);
            }
            else {
                const decoder = new TextDecoder('utf-8');
                const decodedString = decoder.decode(data);
                resolve(decodedString);
            }
        });
    });
}
window.addEventListener('DOMContentLoaded', () => {
    try {
        const container = new ThreeJSContainer();
        const viewport = container.createRendererDOM(new three__WEBPACK_IMPORTED_MODULE_5__.Vector3(20, 1.5, 0));
        const dom = document.getElementById('three-container');
        if (dom) {
            dom.appendChild(viewport);
        }
    }
    catch (e) {
        console.error(e);
    }
});


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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_three_examples_jsm_controls_OrbitControls_js-node_modules_three_examples-c71a49"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSc7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMnO1xuaW1wb3J0IHsgTGluZU1hdGVyaWFsIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2xpbmVzL0xpbmVNYXRlcmlhbCc7XG5pbXBvcnQgeyBUcmFuc2Zvcm1Db250cm9scyB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9UcmFuc2Zvcm1Db250cm9scy5qcyc7XG5pbXBvcnQgeyBMaW5lMiB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS9saW5lcy9MaW5lMic7XG5pbXBvcnQgeyBMaW5lR2VvbWV0cnkgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vbGluZXMvTGluZUdlb21ldHJ5JztcblxuY2xhc3MgVGhyZWVKU0NvbnRhaW5lciB7XG4gICAgcHJpdmF0ZSBjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xuICAgIHByaXZhdGUgcmVuZGVyZXI6IFRIUkVFLldlYkdMUmVuZGVyZXI7XG4gICAgcHJpdmF0ZSBvcmJpdENvbnRyb2xzOiBPcmJpdENvbnRyb2xzO1xuICAgIHByaXZhdGUgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICAgIHByaXZhdGUgY2hhaW5Hcm91cDogVEhSRUUuR3JvdXA7XG4gICAgcHJpdmF0ZSBlbXB0eU9iakNvbnRyb2xzOiBUcmFuc2Zvcm1Db250cm9sc1tdID0gW107XG4gICAgcHJpdmF0ZSBlbXB0eU9iamVjdHM6IFRIUkVFLk1lc2hbXSA9IFtdO1xuICAgIHByaXZhdGUgbGlnaHQ6IFRIUkVFLkxpZ2h0O1xuICAgIHByaXZhdGUgY2hhaW5QaWVjZTogVEhSRUUuTWVzaDtcbiAgICBwcml2YXRlIG1lc2hTdHI6IHN0cmluZztcbiAgICBwcml2YXRlIGNoYWluR2VvbWV0cnk6IFRIUkVFLkJ1ZmZlckdlb21ldHJ5O1xuXG4gICAgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgLy8g55S76Z2i6YOo5YiG44Gu5L2c5oiQKOihqOekuuOBmeOCi+aeoOOBlOOBqOOBqykqXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKGNhbWVyYVBvczogVEhSRUUuVmVjdG9yMykgPT4ge1xuICAgICAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4MDQ5NWVkKSk7XG5cbiAgICAgICAgLy/jgqvjg6Hjg6njga7oqK3lrppcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoXG4gICAgICAgICAgICA0NSxcbiAgICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICAgICAgMC4xLFxuICAgICAgICAgICAgMjAwXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLmNvcHkoY2FtZXJhUG9zKTtcbiAgICAgICAgdGhpcy5jYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEuNSwgMCkpO1xuXG4gICAgICAgIHRoaXMub3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKHRoaXMuY2FtZXJhLCB0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlU2NlbmUoKTtcbiAgICAgICAgLy8g5q+O44OV44Os44O844Og44GudXBkYXRl44KS5ZG844KT44Gn77yMcmVuZGVyXG4gICAgICAgIC8vIHJlcWVzdEFuaW1hdGlvbkZyYW1lIOOBq+OCiOOCiuasoeODleODrOODvOODoOOCkuWRvOOBtlxuICAgICAgICBsZXQgcmVuZGVyOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9yYml0Q29udHJvbHMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuY2FtZXJhLmFzcGVjdCA9IHdpZHRoIC8gaGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5kb21FbGVtZW50O1xuICAgIH07XG5cbiAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgICAgIHRoaXMuY2hhaW5Hcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuXG4gICAgICAgIC8vIOOCsOODquODg+ODieOBruihqOekulxuICAgICAgICBjb25zdCBncmlkID0gbmV3IFRIUkVFLkdyaWRIZWxwZXIoMTAwMCwgNTAwLCAweGVlZWVlZSwgMHhlZWVlZWUpO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGdyaWQubWF0ZXJpYWwpKSB7XG4gICAgICAgICAgICBncmlkLm1hdGVyaWFsLmZvckVhY2goKG1hdCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0LnRyYW5zcGFyZW50ID0gdHJ1ZTsgLy8g6YCP5piO44KS5pyJ5Yq55YyWXG4gICAgICAgICAgICAgICAgICAgIG1hdC5vcGFjaXR5ID0gMC4zOyAvLyDpgI/mmI7luqbvvIgwLjDjgJwxLjDvvIlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdyaWQubWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlOyAvLyDpgI/mmI7jgpLmnInlirnljJZcbiAgICAgICAgICAgIGdyaWQubWF0ZXJpYWwub3BhY2l0eSA9IDAuMzsgLy8g6YCP5piO5bqm77yIMC4w44CcMS4w77yJXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNjZW5lLmFkZChncmlkKTtcblxuICAgICAgICAvLyDou7jjga7nt5rmj4/nlLtcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlSW5maW5pdGVBeGlzKGRpcmVjdGlvbjogVEhSRUUuVmVjdG9yMywgY29sb3I6IG51bWJlcik6IExpbmUyIHtcbiAgICAgICAgICAgIGxldCBtYXRlcmlhbCA9IG5ldyBMaW5lTWF0ZXJpYWwoe1xuICAgICAgICAgICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgICAgICAgICBsaW5ld2lkdGg6IDAuMDAxLFxuICAgICAgICAgICAgICAgIGFscGhhVG9Db3ZlcmFnZTogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgcG9pbnRzID0gW1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbi5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKC0xZTYpLFxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbi5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKDFlNiksXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zID0gcG9pbnRzLmZsYXRNYXAoKHYpID0+IFt2LngsIHYueSwgdi56XSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IExpbmVHZW9tZXRyeSgpO1xuICAgICAgICAgICAgZ2VvbWV0cnkuc2V0UG9zaXRpb25zKHBvc2l0aW9ucyk7XG4gICAgICAgICAgICBjb25zdCBsaW5lT2JqZWN0ID0gbmV3IExpbmUyKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgICAgICByZXR1cm4gbGluZU9iamVjdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGNyZWF0ZUluZmluaXRlQXhpcyhuZXcgVEhSRUUuVmVjdG9yMygxLCAwLCAwKSwgMHhmZjAwMDApKTsgLy8gWOi7uO+8iOi1pO+8iVxuICAgICAgICB0aGlzLnNjZW5lLmFkZChjcmVhdGVJbmZpbml0ZUF4aXMobmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCksIDB4MDBmZjAwKSk7IC8vIFnou7jvvIjnt5HvvIlcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoY3JlYXRlSW5maW5pdGVBeGlzKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpLCAweDAwMDBmZikpOyAvLyBa6Lu477yI6Z2S77yJXG5cbiAgICAgICAgLy8g5pSv54K544Gu6Kit5a6aXG4gICAgICAgIGxldCBpbml0UG9zdFogPSBbLTMsIDNdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgICAgICAgICAgLy8gZ2lzbW9cbiAgICAgICAgICAgIHRoaXMuZW1wdHlPYmpDb250cm9sc1tpXSA9IG5ldyBUcmFuc2Zvcm1Db250cm9scyh0aGlzLmNhbWVyYSwgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMuZW1wdHlPYmpDb250cm9sc1tpXS5zaXplID0gMC43O1xuICAgICAgICAgICAgLy8g44OJ44Op44OD44Kw6ZaL5aeL44O757WC5LqG5pmC44Gu5Yi25b6hXG4gICAgICAgICAgICB0aGlzLmVtcHR5T2JqQ29udHJvbHNbaV0uYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2dpbmctY2hhbmdlZCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5lbXB0eU9iakNvbnRyb2xzW2ldLnZpc2libGUpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMub3JiaXRDb250cm9scy5lbmFibGVkID0gIWV2ZW50LnZhbHVlOyAvLyDjg4njg6njg4PjgrDkuK3jga8gT3JiaXRDb250cm9scyDnhKHlirnljJZcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyDjg4njg6njg4PjgrDkuK3jga7jg6rjgqLjg6vjgr/jgqTjg6Dlho3oqIjnrpdcbiAgICAgICAgICAgIHRoaXMuZW1wdHlPYmpDb250cm9sc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmVtcHR5T2JqQ29udHJvbHNbaV0udmlzaWJsZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5lbXB0eU9iakNvbnRyb2xzW2ldLmRyYWdnaW5nKSByZXR1cm47IC8vIOWun+mam+OBq+ODieODqeODg+OCsOOBl+OBpuOBhOOCi+OBqOOBjeOBoOOBkVxuXG4gICAgICAgICAgICAgICAgcmVDYWxjQ2hhaW4oKTsgLy8g5q+O44OV44Os44O844Og5YaN6KiI566XXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5lbXB0eU9iakNvbnRyb2xzW2ldKTtcblxuICAgICAgICAgICAgdGhpcy5lbXB0eU9iamVjdHNbaV0gPSBuZXcgVEhSRUUuTWVzaCgpO1xuICAgICAgICAgICAgdGhpcy5lbXB0eU9iamVjdHNbaV0ucG9zaXRpb24uc2V0KDAsIDIsIGluaXRQb3N0WltpXSk7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmVtcHR5T2JqZWN0c1tpXSk7XG5cbiAgICAgICAgICAgIHRoaXMuZW1wdHlPYmpDb250cm9sc1tpXS5hdHRhY2godGhpcy5lbXB0eU9iamVjdHNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2FtcGxpbmdDb3VudDogbnVtYmVyID0gMTAwMDA7XG4gICAgICAgIGxldCBjaGFpblBpZWNlTGVuZ3RoOiBudW1iZXIgPSAwLjc7XG4gICAgICAgIGxldCBjaGFpbkFuZ2xlT2Zmc2V0OiBudW1iZXIgPSAwO1xuICAgICAgICBsZXQgY2hhaW5BbmdsZVJhbmRvbUZhY3RvcjogbnVtYmVyID0gMTtcbiAgICAgICAgbGV0IGE6IG51bWJlciA9IDE7XG5cbiAgICAgICAgKHdpbmRvdyBhcyBhbnkpLmVtcHR5T2JqID0gdGhpcy5lbXB0eU9iakNvbnRyb2xzO1xuICAgICAgICAod2luZG93IGFzIGFueSkuc2V0Q2hhaW5QaWVjZUxlbmd0aCA9IChpOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGNoYWluUGllY2VMZW5ndGggPSBpO1xuICAgICAgICAgICAgcmVsb2FkQ2hhaW4oKTtcbiAgICAgICAgICAgIHJlQ2FsY0NoYWluKCk7XG4gICAgICAgIH07XG4gICAgICAgICh3aW5kb3cgYXMgYW55KS5zZXRDaGFpbkFuZ2xlT2Zmc2V0ID0gKGk6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgY2hhaW5BbmdsZU9mZnNldCA9IGk7XG4gICAgICAgICAgICByZUNhbGNDaGFpbigpO1xuICAgICAgICB9O1xuICAgICAgICAod2luZG93IGFzIGFueSkuc2V0Q2hhaW5BbmdsZVJhbmRvbUZhY3RvciA9IChpOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGNoYWluQW5nbGVSYW5kb21GYWN0b3IgPSBpO1xuICAgICAgICAgICAgcmVDYWxjQ2hhaW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgKHdpbmRvdyBhcyBhbnkpLnNldEFGYWN0b3IgPSAoaTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICBhID0gaTtcbiAgICAgICAgICAgIHJlQ2FsY0NoYWluKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY2hhaW5PZmZzZXQgPSAwLjU7XG4gICAgICAgIGNvbnN0IHJlbG9hZENoYWluID0gKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHZlcnRleEluZGljZXM6IG51bWJlcltdID0gW107XG4gICAgICAgICAgICBsZXQgdmVydGljZXM6IG51bWJlcltdID0gW107XG5cbiAgICAgICAgICAgIGNvbnN0IG1lc2hMaW5lcyA9IHRoaXMubWVzaFN0ci5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc2hMaW5lcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc2hMaW5lID0gbWVzaExpbmVzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc2hTcGFjZVNwbGl0QXJyYXkgPSBtZXNoTGluZS5zcGxpdCgnICcpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbWVzaFR5cGUgPSBtZXNoU3BhY2VTcGxpdEFycmF5WzBdOyAvL+OBqeOBruaDheWgseOCkuihqOOBmeOBi1xuICAgICAgICAgICAgICAgIGlmIChtZXNoVHlwZSA9PSAndicpIHtcbiAgICAgICAgICAgICAgICAgICAgLy/poILngrlcbiAgICAgICAgICAgICAgICAgICAgdmVydGljZXMucHVzaChwYXJzZUZsb2F0KG1lc2hTcGFjZVNwbGl0QXJyYXlbMV0pKTsgLy945bqn5qiZXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2VzLnB1c2gocGFyc2VGbG9hdChtZXNoU3BhY2VTcGxpdEFycmF5WzJdKSk7IC8veeW6p+aomVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCB6ID0gcGFyc2VGbG9hdChtZXNoU3BhY2VTcGxpdEFycmF5WzNdKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHogPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHogLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2hhaW5QaWVjZUxlbmd0aCAtIGNoYWluT2Zmc2V0KSAvIDIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2hhaW5QaWVjZUxlbmd0aCAtIGNoYWluT2Zmc2V0KSAvIDJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7IC8veuW6p+aomVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljZXMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB6ICsgY2hhaW5QaWVjZUxlbmd0aCAvIDIgKyAoY2hhaW5QaWVjZUxlbmd0aCAtIGNoYWluT2Zmc2V0KSAvIDJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7IC8veuW6p+aomVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtZXNoVHlwZSA9PSAnZicpIHtcbiAgICAgICAgICAgICAgICAgICAgLy/pnaLjga7mg4XloLFcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZjEgPSBtZXNoU3BhY2VTcGxpdEFycmF5WzFdLnNwbGl0KCcvJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGYyID0gbWVzaFNwYWNlU3BsaXRBcnJheVsyXS5zcGxpdCgnLycpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmMyA9IG1lc2hTcGFjZVNwbGl0QXJyYXlbM10uc3BsaXQoJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgdmVydGV4SW5kaWNlcy5wdXNoKHBhcnNlSW50KGYxWzBdKSAtIDEpOyAvL+mggueCueOCpOODs+ODh+ODg+OCr+OCuVxuICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhJbmRpY2VzLnB1c2gocGFyc2VJbnQoZjJbMF0pIC0gMSk7IC8v6aCC54K544Kk44Oz44OH44OD44Kv44K5XG4gICAgICAgICAgICAgICAgICAgIHZlcnRleEluZGljZXMucHVzaChwYXJzZUludChmM1swXSkgLSAxKTsgLy/poILngrnjgqTjg7Pjg4fjg4Pjgq/jgrlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgICAgICAgICBnZW9tZXRyeS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgJ3Bvc2l0aW9uJyxcbiAgICAgICAgICAgICAgICBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpLCAzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGdlb21ldHJ5LnNldEluZGV4KHZlcnRleEluZGljZXMpO1xuICAgICAgICAgICAgZ2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKTtcblxuICAgICAgICAgICAgdGhpcy5jaGFpbkdlb21ldHJ5ID0gZ2VvbWV0cnk7XG4gICAgICAgICAgICBjb25zdCBjaGFpbk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHtcbiAgICAgICAgICAgICAgICBjb2xvcjogMHg5OTk5OTksXG4gICAgICAgICAgICAgICAgZW1pc3NpdmU6IDB4MzMzMzMzLFxuICAgICAgICAgICAgICAgIHJvdWdobmVzczogMCxcbiAgICAgICAgICAgICAgICBtZXRhbG5lc3M6IDEsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGNoYWluID0gbmV3IFRIUkVFLk1lc2godGhpcy5jaGFpbkdlb21ldHJ5LCBjaGFpbk1hdGVyaWFsKTtcbiAgICAgICAgICAgIHRoaXMuY2hhaW5QaWVjZSA9IGNoYWluO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIOODgeOCp+ODvOODs+ODlOODvOOCueOCquODluOCuOOCp+OCr+ODiOS9nOaIkFxuICAgICAgICBjb25zdCBsb2FkR2VvbWV0cnlGcm9tT2JqRmlsZSA9IGFzeW5jIChmaWxlUGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm1lc2hTdHIgPSBhd2FpdCByZWFkRmlsZShmaWxlUGF0aCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IGxvYWRHZW9tZXRyeUZyb21PYmpGaWxlKCdjaGFpbi5vYmonKTtcbiAgICAgICAgICAgIHJlbG9hZENoYWluKCk7XG4gICAgICAgICAgICByZUNhbGNDaGFpbigpO1xuICAgICAgICB9KSgpO1xuXG4gICAgICAgIGNvbnN0IHJlQ2FsY0NoYWluID0gKCkgPT4ge1xuICAgICAgICAgICAgLy8g44Ot44O844OX44Gu6Kit5a6aXG4gICAgICAgICAgICAvLyDjg63jg7zjg5fou4zpgZPjgrXjg7Pjg5fjg6rjg7PjgrBcbiAgICAgICAgICAgIGNvbnN0IGNhbGNCID0gKGE6IG51bWJlciwgdjogVEhSRUUuVmVjdG9yMik6IG51bWJlciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVub21pbmF0b3IgPSB2LnkgLyAoMiAqIGEgKiBNYXRoLnNpbmgodi54IC8gKDIgKiBhKSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9XG4gICAgICAgICAgICAgICAgICAgIHYueCAvIDIgLSBhICogTWF0aC5sb2coZGVub21pbmF0b3IgKyBNYXRoLnNxcnQoZGVub21pbmF0b3IgKiogMiArIDEpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IGNhbGNDID0gKGE6IG51bWJlciwgYjogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSAtYSAqIE1hdGguY29zaCgtYiAvIGEpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBhMSA9XG4gICAgICAgICAgICAgICAgKGEgKlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtcHR5T2JqZWN0c1swXS5wb3NpdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgLmNsb25lKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kaXN0YW5jZVRvKHRoaXMuZW1wdHlPYmplY3RzWzFdLnBvc2l0aW9uKSkgL1xuICAgICAgICAgICAgICAgIE1hdGgubG9nKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtcHR5T2JqZWN0c1swXS5wb3NpdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgLmNsb25lKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kaXN0YW5jZVRvKHRoaXMuZW1wdHlPYmplY3RzWzFdLnBvc2l0aW9uKSAqIDEwXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHNhbXBsaW5nQ3VydmUgPSAoXG4gICAgICAgICAgICAgICAgcDE6IFRIUkVFLlZlY3RvcjMsXG4gICAgICAgICAgICAgICAgcDI6IFRIUkVFLlZlY3RvcjMsXG4gICAgICAgICAgICAgICAgdDogbnVtYmVyXG4gICAgICAgICAgICApOiBUSFJFRS5WZWN0b3IzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb25WZWN0b3IgPSBwMi5jbG9uZSgpLnN1YihwMSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uVVZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IyKGRpcmVjdGlvblZlY3Rvci54LCBkaXJlY3Rpb25WZWN0b3Iueik7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uU2l6ZSA9IGRpcmVjdGlvblVWZWN0b3IuZGlzdGFuY2VUbyhuZXcgVEhSRUUuVmVjdG9yMigwLCAwKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kUG9pbnQgPSBuZXcgVEhSRUUuVmVjdG9yMihkaXJlY3Rpb25TaXplLCBkaXJlY3Rpb25WZWN0b3IueSk7XG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IGNhbGNCKGExLCBlbmRQb2ludCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdSA9IGRpcmVjdGlvblNpemUgKiB0O1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBhMSAqIE1hdGguY29zaCgodSAtIGIpIC8gYTEpICsgY2FsY0MoYTEsIGIpICsgcDEueTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHA6IFRIUkVFLlZlY3RvcjIgPSBkaXJlY3Rpb25VVmVjdG9yLm5vcm1hbGl6ZSgpLm11bHRpcGx5U2NhbGFyKHUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdDogVEhSRUUuVmVjdG9yMyA9IG5ldyBUSFJFRS5WZWN0b3IzKHAueCArIHAxLngsIHYsIHAueSArIHAxLnopO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBzYW1wbGVQb2ludHM6IFRIUkVFLlZlY3RvcjNbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzYW1wbGluZ0NvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICBzYW1wbGVQb2ludHMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgc2FtcGxpbmdDdXJ2ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1wdHlPYmplY3RzWzBdLnBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbXB0eU9iamVjdHNbMV0ucG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBpIC8gc2FtcGxpbmdDb3VudFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g44OB44Kn44O844Oz44OU44O844K55q+O44Gu44OZ44Kv44OI44Or566X5a6aXG4gICAgICAgICAgICBjb25zdCBjaGFpblBpZWNlVmVjdG9yczogVEhSRUUuVmVjdG9yM1tdID0gW107XG5cbiAgICAgICAgICAgIGxldCBjdXJyZW50UG9zaXRpb24gPSB0aGlzLmVtcHR5T2JqZWN0c1swXS5wb3NpdGlvbi5jbG9uZSgpO1xuICAgICAgICAgICAgY2hhaW5QaWVjZVZlY3RvcnMucHVzaChjdXJyZW50UG9zaXRpb24pO1xuICAgICAgICAgICAgc2FtcGxlUG9pbnRzLmZvckVhY2goKHRhcmdldFBvc2l0aW9uOiBUSFJFRS5WZWN0b3IzLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gY3VycmVudFBvc2l0aW9uLmRpc3RhbmNlVG8odGFyZ2V0UG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA+PSBjaGFpblBpZWNlTGVuZ3RoIHx8IGluZGV4ID09PSBzYW1wbGluZ0NvdW50IC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyDlt67liIbjg5njgq/jg4jjg6vvvIjmlrnlkJEgw5cg6ZW344GV77yJXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRhcmdldFBvc2l0aW9uLmNsb25lKCkuc3ViKGN1cnJlbnRQb3NpdGlvbikubm9ybWFsaXplKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGRpcmVjdGlvbi5tdWx0aXBseVNjYWxhcihjaGFpblBpZWNlTGVuZ3RoKTsgLy8g5beu5YiG44OZ44Kv44OI44OrXG5cbiAgICAgICAgICAgICAgICAgICAgY2hhaW5QaWVjZVZlY3RvcnMucHVzaChvZmZzZXQpOyAvLyDlt67liIbjgpLoqJjpjLJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBvc2l0aW9uID0gY3VycmVudFBvc2l0aW9uLmNsb25lKCkuYWRkKG9mZnNldCk7IC8vIOasoeOBruaUr+eCueS9jee9ruOBuOmAsuOCgFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBnZW5lcmF0ZUNoYWluID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYWluUGllY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY2hhaW5Hcm91cC5jbGVhcigpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQb3NpdGlvbiA9IGNoYWluUGllY2VWZWN0b3JzWzBdLmNsb25lKCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcmFuZG9tQW5nbGVTdW0gPSAwO1xuICAgICAgICAgICAgICAgIGNoYWluUGllY2VWZWN0b3JzLmZvckVhY2goKHJlbGF0aXZlUG9zaXRpb24sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldENoYWluID0gdGhpcy5jaGFpblBpZWNlLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldENoYWluLmxvb2tBdChyZWxhdGl2ZVBvc2l0aW9uLmNsb25lKCkubm9ybWFsaXplKCkpO1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRDaGFpbi5yb3RhdGVaKFxuICAgICAgICAgICAgICAgICAgICAgICAgVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKGNoYWluQW5nbGVPZmZzZXQgKyByYW5kb21BbmdsZVN1bSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcmFuZG9tQW5nbGVTdW0gKz0gKE1hdGgucmFuZG9tKCkgKiAxMjAgLSA2MCkgKiBjaGFpbkFuZ2xlUmFuZG9tRmFjdG9yICsgOTA7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IGN1cnJlbnRQb3NpdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Q2hhaW4ucG9zaXRpb24uc2V0KHAueCwgcC55LCBwLnopO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhaW5Hcm91cC5hZGQodGFyZ2V0Q2hhaW4pO1xuXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQb3NpdGlvbiA9IGN1cnJlbnRQb3NpdGlvbi5jbG9uZSgpLmFkZChyZWxhdGl2ZVBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBnZW5lcmF0ZUNoYWluKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5jaGFpbkdyb3VwKTtcblxuICAgICAgICAvL+ODqeOCpOODiOOBruioreWumlxuICAgICAgICBjb25zdCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4MDAwMDAwKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcblxuICAgICAgICBjb25zdCBsaWdodDEgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweDU1NTU1NSwgMyk7XG4gICAgICAgIGxpZ2h0MS5wb3NpdGlvbi5zZXQoMCwgMjAwLCAwKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobGlnaHQxKTtcblxuICAgICAgICBjb25zdCBsaWdodDIgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweDU1NTU1NSwgMyk7XG4gICAgICAgIGxpZ2h0Mi5wb3NpdGlvbi5zZXQoMTAwLCAyMDAsIDEwMCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGxpZ2h0Mik7XG5cbiAgICAgICAgY29uc3QgbGlnaHQzID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHg1NTU1NTUsIDMpO1xuICAgICAgICBsaWdodDMucG9zaXRpb24uc2V0KC0xMDAsIC0yMDAsIC0xMDApO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChsaWdodDMpO1xuXG4gICAgICAgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp++8jOabtOaWsFxuICAgICAgICAvLyByZXFlc3RBbmltYXRpb25GcmFtZSDjgavjgojjgormrKHjg5Xjg6zjg7zjg6DjgpLlkbzjgbZcbiAgICAgICAgbGV0IHVwZGF0ZTogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlYWRGaWxlKHBhdGgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjb25zdCBsb2FkZXIgPSBuZXcgVEhSRUUuRmlsZUxvYWRlcigpO1xuICAgICAgICBsb2FkZXIubG9hZChwYXRoLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoJ3V0Zi04Jyk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVjb2RlZFN0cmluZyA9IGRlY29kZXIuZGVjb2RlKGRhdGEpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZGVjb2RlZFN0cmluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xuICAgICAgICBjb25zdCB2aWV3cG9ydCA9IGNvbnRhaW5lci5jcmVhdGVSZW5kZXJlckRPTShuZXcgVEhSRUUuVmVjdG9yMygyMCwgMS41LCAwKSk7XG4gICAgICAgIGNvbnN0IGRvbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aHJlZS1jb250YWluZXInKTtcbiAgICAgICAgaWYgKGRvbSkge1xuICAgICAgICAgICAgZG9tLmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG59KTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfdGhyZWVfZXhhbXBsZXNfanNtX2NvbnRyb2xzX09yYml0Q29udHJvbHNfanMtbm9kZV9tb2R1bGVzX3RocmVlX2V4YW1wbGVzLWM3MWE0OVwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==