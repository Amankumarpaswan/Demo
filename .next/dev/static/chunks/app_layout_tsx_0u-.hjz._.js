(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const DisableFeatures = ()=>{
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DisableFeatures.useEffect": ()=>{
            const preventPinchZoom = {
                "DisableFeatures.useEffect.preventPinchZoom": (e)=>{
                    if (e.touches.length > 1) {
                        e.preventDefault();
                    }
                }
            }["DisableFeatures.useEffect.preventPinchZoom"];
            document.addEventListener('touchstart', preventPinchZoom, {
                passive: false
            });
            const preventKeyboardZoom = {
                "DisableFeatures.useEffect.preventKeyboardZoom": (e)=>{
                    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
                        e.preventDefault();
                    }
                }
            }["DisableFeatures.useEffect.preventKeyboardZoom"];
            document.addEventListener('keydown', preventKeyboardZoom);
            const preventScrollZoom = {
                "DisableFeatures.useEffect.preventScrollZoom": (e)=>{
                    if (e.ctrlKey) {
                        e.preventDefault();
                    }
                }
            }["DisableFeatures.useEffect.preventScrollZoom"];
            document.addEventListener('wheel', preventScrollZoom, {
                passive: false
            });
            const preventCopy = {
                "DisableFeatures.useEffect.preventCopy": (e)=>{
                    e.preventDefault();
                }
            }["DisableFeatures.useEffect.preventCopy"];
            document.addEventListener('copy', preventCopy);
            document.addEventListener('cut', preventCopy);
            const preventContextMenu = {
                "DisableFeatures.useEffect.preventContextMenu": (e)=>{
                    e.preventDefault();
                }
            }["DisableFeatures.useEffect.preventContextMenu"];
            document.addEventListener('contextmenu', preventContextMenu);
            const preventDevTools = {
                "DisableFeatures.useEffect.preventDevTools": (e)=>{
                    if (e.key === 'F12') {
                        e.preventDefault();
                        return false;
                    }
                    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
                        e.preventDefault();
                        return false;
                    }
                    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
                        e.preventDefault();
                        return false;
                    }
                    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                        e.preventDefault();
                        return false;
                    }
                    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                        e.preventDefault();
                        return false;
                    }
                    if (e.metaKey && e.altKey && e.key === 'u') {
                        e.preventDefault();
                        return false;
                    }
                }
            }["DisableFeatures.useEffect.preventDevTools"];
            document.addEventListener('keydown', preventDevTools);
            return ({
                "DisableFeatures.useEffect": ()=>{
                    document.removeEventListener('touchstart', preventPinchZoom);
                    document.removeEventListener('keydown', preventKeyboardZoom);
                    document.removeEventListener('wheel', preventScrollZoom);
                    document.removeEventListener('copy', preventCopy);
                    document.removeEventListener('cut', preventCopy);
                    document.removeEventListener('contextmenu', preventContextMenu);
                    document.removeEventListener('keydown', preventDevTools);
                }
            })["DisableFeatures.useEffect"];
        }
    }["DisableFeatures.useEffect"], []);
    return null;
};
_s(DisableFeatures, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = DisableFeatures;
function RootLayout({ children }) {
    _s1();
    const bgCanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fgCanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RootLayout.useEffect": ()=>{
            const initStarSystem = {
                "RootLayout.useEffect.initStarSystem": (canvas)=>{
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    const setSize = {
                        "RootLayout.useEffect.initStarSystem.setSize": ()=>{
                            canvas.width = window.innerWidth;
                            canvas.height = window.innerHeight;
                        }
                    }["RootLayout.useEffect.initStarSystem.setSize"];
                    setSize();
                    window.addEventListener('resize', setSize);
                    const stars = [];
                    class StarParticle {
                        x;
                        y;
                        size;
                        opacity;
                        fadeDirection;
                        constructor(){
                            this.x = Math.random() * canvas.width;
                            this.y = Math.random() * canvas.height;
                            this.size = Math.random() * 2 + 1;
                            this.opacity = 0;
                            this.fadeDirection = 'IN';
                        }
                        update() {
                            if (this.fadeDirection === 'IN') {
                                this.opacity += 0.01;
                                if (this.opacity >= 0.8) this.fadeDirection = 'OUT';
                            } else {
                                this.opacity -= 0.01;
                            }
                        }
                        draw() {
                            if (!ctx) return;
                            ctx.save();
                            ctx.translate(this.x, this.y);
                            ctx.beginPath();
                            const s = this.size;
                            ctx.moveTo(0, -s);
                            ctx.quadraticCurveTo(0, 0, s, 0);
                            ctx.quadraticCurveTo(0, 0, 0, s);
                            ctx.quadraticCurveTo(0, 0, -s, 0);
                            ctx.quadraticCurveTo(0, 0, 0, -s);
                            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.opacity)})`;
                            ctx.shadowBlur = 4;
                            ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
                            ctx.fill();
                            ctx.restore();
                        }
                    }
                    let animId;
                    const animate = {
                        "RootLayout.useEffect.initStarSystem.animate": ()=>{
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            if (Math.random() < 0.05) stars.push(new StarParticle());
                            for(let i = stars.length - 1; i >= 0; i--){
                                const s = stars[i];
                                s.update();
                                s.draw();
                                if (s.opacity <= 0 && s.fadeDirection === 'OUT') stars.splice(i, 1);
                            }
                            animId = requestAnimationFrame(animate);
                        }
                    }["RootLayout.useEffect.initStarSystem.animate"];
                    animate();
                    return ({
                        "RootLayout.useEffect.initStarSystem": ()=>{
                            window.removeEventListener('resize', setSize);
                            cancelAnimationFrame(animId);
                        }
                    })["RootLayout.useEffect.initStarSystem"];
                }
            }["RootLayout.useEffect.initStarSystem"];
            const cleanupBg = bgCanvasRef.current ? initStarSystem(bgCanvasRef.current) : undefined;
            const cleanupFg = fgCanvasRef.current ? initStarSystem(fgCanvasRef.current) : undefined;
            return ({
                "RootLayout.useEffect": ()=>{
                    if (cleanupBg) cleanupBg();
                    if (cleanupFg) cleanupFg();
                }
            })["RootLayout.useEffect"];
        }
    }["RootLayout.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "en",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("head", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                }, void 0, false, {
                    fileName: "[project]/app/layout.tsx",
                    lineNumber: 164,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/layout.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
                className: "antialiased text-[#fae8e8] overflow-hidden select-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DisableFeatures, {}, void 0, false, {
                        fileName: "[project]/app/layout.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 w-full h-full pointer-events-none z-[-1]",
                        style: {
                            backgroundColor: '#320B0B',
                            backgroundImage: `
              radial-gradient(circle at 0% 0%, rgba(255, 80, 80, 0.25) 0%, rgba(120, 20, 20, 0.1) 40%, transparent 60%),
              radial-gradient(circle at 100% 100%, rgba(255, 215, 0, 0.15) 0%, rgba(120, 80, 0, 0.1) 40%, transparent 60%)
            `,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                            ref: bgCanvasRef,
                            className: "absolute inset-0 w-full h-full"
                        }, void 0, false, {
                            fileName: "[project]/app/layout.tsx",
                            lineNumber: 185,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/layout.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-0 w-full h-full",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/app/layout.tsx",
                        lineNumber: 188,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                        ref: fgCanvasRef,
                        className: "fixed inset-0 w-full h-full pointer-events-none z-50"
                    }, void 0, false, {
                        fileName: "[project]/app/layout.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/layout.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/layout.tsx",
        lineNumber: 162,
        columnNumber: 5
    }, this);
}
_s1(RootLayout, "5T5tEUAQ9Ocvu3rzw853Dls9F0E=");
_c1 = RootLayout;
var _c, _c1;
__turbopack_context__.k.register(_c, "DisableFeatures");
__turbopack_context__.k.register(_c1, "RootLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_layout_tsx_0u-.hjz._.js.map