//#region \0@oxc-project+runtime@0.127.0/helpers/checkPrivateRedeclaration.js
function e(e, t) {
	if (t.has(e)) throw TypeError("Cannot initialize the same private elements twice on an object");
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/classPrivateMethodInitSpec.js
function t(t, n) {
	e(t, n), n.add(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/classPrivateFieldInitSpec.js
function n(t, n, r) {
	e(t, n), n.set(t, r);
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/typeof.js
function r(e) {
	"@babel/helpers - typeof";
	return r = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, r(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/toPrimitive.js
function i(e, t) {
	if (r(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var i = n.call(e, t || "default");
		if (r(i) != "object") return i;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/toPropertyKey.js
function a(e) {
	var t = i(e, "string");
	return r(t) == "symbol" ? t : t + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/defineProperty.js
function o(e, t, n) {
	return (t = a(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/assertClassBrand.js
function s(e, t, n) {
	if (typeof e == "function" ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
	throw TypeError("Private element is not present on this object");
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/classPrivateFieldSet2.js
function c(e, t, n) {
	return e.set(s(e, t), n), n;
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/classPrivateFieldGet2.js
function l(e, t) {
	return e.get(s(e, t));
}
//#endregion
//#region ../../shared/players/common/facade.ts
var u = /* @__PURE__ */ new WeakMap(), d = /* @__PURE__ */ new WeakMap(), f = /* @__PURE__ */ new WeakMap(), p = /* @__PURE__ */ new WeakSet(), ee = class {
	constructor(e, r, i) {
		t(this, p), n(this, u, void 0), n(this, d, void 0), n(this, f, !1), o(this, "id", void 0), o(this, "play", void 0), o(this, "pause", void 0), o(this, "stop", void 0), o(this, "on", void 0), o(this, "destroy", void 0), o(this, "getNativeInstance", void 0), c(u, this, e), c(d, this, i), this.id = r, this.play = s(p, this, m).call(this, "play", () => l(u, this).play()), this.pause = s(p, this, m).call(this, "pause", () => l(u, this).pause()), this.stop = s(p, this, m).call(this, "stop", () => l(u, this).stop()), this.getNativeInstance = s(p, this, m).call(this, "getNativeInstance", () => l(u, this).getNativeInstance()), this.on = s(p, this, m).call(this, "on", (e, t) => {
			let n = l(u, this).on(e, t);
			return () => {
				l(f, this) || n();
			};
		}), this.destroy = () => {
			if (!l(f, this)) {
				c(f, this, !0);
				try {
					l(u, this).destroy();
				} finally {
					l(d, this)?.call(this);
				}
			}
		};
	}
	get type() {
		return l(u, this).type;
	}
};
function m(e, t) {
	return (...n) => {
		if (l(f, this)) throw Error(`[VideoPlayerFacade] Cannot call "${e}" on a destroyed player.`);
		return t(...n);
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@fandom+odyssey-tracking-client@1.2.1/node_modules/@fandom/odyssey-tracking-client/dist/index.js
function h() {
	return "1.2.1";
}
var te = "odyssey-tracking-client", ne = () => {
	var e;
	let t = globalThis;
	typeof t.window > "u" || (t.fandomOdysseyUtils ?? (t.fandomOdysseyUtils = {}), (e = t.fandomOdysseyUtils)[te] ?? (e[te] = { version: h() }));
}, re = () => {
	let e = window.fandomTrack ?? {};
	return Array.isArray(e.q) || (e.q = []), Array.isArray(e.cmd) || (e.cmd = []), (!e.registry || typeof e.registry != "object") && (e.registry = {}), window.fandomTrack = e, ne(), e;
}, ie = "shortlivedtrackingevent", ae = "trackingevent", oe = (e, t = {}, n = { requiresConsent: !0 }) => {
	if (e === ie) throw Error("shortlivedtrackingevent cannot be re-registered via buildBasicTrackingFunction, use buildShortlivedTrackingFunction instead.");
	if (e === ae) throw Error("trackingevent usage is discouraged, use shortlived or register your own custom event type in event catalog.");
	return (r) => {
		let i = re();
		i.registry[e] || i.cmd.push((t) => {
			if (typeof t.createAndRegisterBasicTracker != "function") throw Error("fandomTrack.createAndRegisterBasicTracker is not available");
			t.createAndRegisterBasicTracker(e, n);
		}), i.q.push({
			event: e,
			payload: {
				...t,
				...r
			}
		});
	};
}, se = function() {
	return se = Object.assign || function(e) {
		for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e;
	}, se.apply(this, arguments);
};
typeof window < "u" && window.top;
//#endregion
//#region ../../shared/utils/src/issue-breadcrumbs.ts
var ce = 20, le = [];
function g(e) {
	le.push({
		action: e,
		ts: typeof performance < "u" ? performance.now() : -1
	}), le.length > ce && le.shift();
}
function ue() {
	return le.map((e) => `${Math.round(e.ts)}ms:${e.action}`).join(" → ");
}
//#endregion
//#region ../../shared/utils/src/issue-tracking.ts
var de, fe, pe = "morpheus_performance", me = { requiresConsent: !1 }, he = {
	engine_version: "unknown",
	env: "unknown"
};
function ge(e) {
	he = e;
}
var _e, _ = [], ve, ye = 0, be = 64, xe = 250, Se = 40;
function Ce(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return Array.isArray(t.q) && Array.isArray(t.cmd) && typeof t.registry == "object" && t.registry !== null;
}
function we() {
	return typeof window < "u" && Ce(window.fandomTrack);
}
function Te(e) {
	_e ?? (_e = oe(pe, { category: "morpheus" }, me)), _e(e);
}
function Ee() {
	if (_.length === 0) return;
	let e = _;
	_ = [];
	for (let t of e) Te(t);
}
function De() {
	ve || (ve = setTimeout(() => {
		if (ve = void 0, _.length !== 0) {
			if (we() || ++ye >= Se) {
				try {
					Ee();
				} catch {}
				return;
			}
			De();
		}
	}, xe));
}
function v(e, t = {}) {
	try {
		if (t.error !== void 0 && Ae(t.error)) return;
		let n = t.error === void 0 ? void 0 : Me(t.error), r = t.error_type ?? n?.error_type, i = t.error_message ?? n?.error_message, a = {
			...he,
			component: "video-engine",
			action: "issue",
			issue_code: e.code,
			constant_name: e.constantName,
			issue_priority: e.priority
		};
		if (t.label && (a.label = t.label), r && (a.error_type = r), i && (a.error_message = je(i, 500)), t.player_type && (a.player_type = t.player_type), t.player_mode && (a.player_mode = t.player_mode), t.exp_bucket && (a.exp_bucket = t.exp_bucket), t.experiment_groups && (a.experiment_groups = t.experiment_groups), e.code.startsWith("U")) {
			let e = ue();
			e && (a.label = a.label ? `${a.label} | ${e}` : e);
		}
		we() ? (Ee(), Te(a)) : (_.push(a), _.length > be && _.shift(), De()), t.error !== void 0 && ke(t.error);
	} catch {}
}
var Oe = (de = globalThis)[fe = Symbol.for("morpheus.reportedErrors")] ?? (de[fe] = /* @__PURE__ */ new WeakSet());
function ke(e) {
	e instanceof Error && Oe.add(e);
}
function Ae(e) {
	return e instanceof Error && Oe.has(e);
}
function je(e, t) {
	return e.length > t ? e.slice(0, t) : e;
}
function Me(e) {
	return e instanceof Error ? {
		error_type: e.constructor.name || "Error",
		error_message: e.message
	} : {
		error_type: "NonError",
		error_message: String(e)
	};
}
var Ne = { get: (e) => {
	let t = ("; " + document.cookie).split("; " + e + "=");
	return t.length >= 2 ? t.pop().split(";").shift() : null;
} };
//#endregion
//#region ../../shared/utils/src/experiments.ts
function Pe(e, t) {
	let n = e.featureFlags?.get("icExperiments");
	return n ? n.includes(t) : !1;
}
var Fe = /^(?:v\d+-)?(\d{2})$/;
function Ie() {
	return Ne.get("exp_bucket")?.match(Fe)?.[1] ?? "";
}
function Le() {
	let e = globalThis.googletag?.pubads?.()?.getTargeting?.("experiment_groups");
	return Array.isArray(e) ? e.join(",") : "";
}
//#endregion
//#region ../../packages/contracts/src/issue-codes.ts
var y = /* @__PURE__ */ function(e) {
	return e.P1 = "P1", e.P2 = "P2", e.P3 = "P3", e.P4 = "P4", e;
}({}), Re = {
	code: "E001",
	constantName: "EngineBootstrapFailed",
	priority: y.P1,
	description: "Fatal error during engine bootstrap; runtime never initialized"
}, b = {
	code: "E002",
	constantName: "PluginHookExecutionFailed",
	priority: y.P2,
	description: "A plugin hook threw; isolated so other plugins continue"
}, ze = {
	code: "E003",
	constantName: "PlayerFactoryAttachConfigFailed",
	priority: y.P2,
	description: "factory.attachConfig() threw during factory registration"
}, Be = {
	code: "E004",
	constantName: "PlayerCreateFailed",
	priority: y.P2,
	description: "Player instance could not be created from the queued command"
}, Ve = {
	code: "E005",
	constantName: "ConfigInitializationFailed",
	priority: y.P2,
	description: "window.__morpheusConfig missing/invalid; engine cannot configure"
}, He = {
	code: "E006",
	constantName: "InstantConfigFetchFailed",
	priority: y.P3,
	description: "Instant Config (ICBM) flags could not be fetched"
}, Ue = {
	code: "E007",
	constantName: "TrackingFlushFailed",
	priority: y.P4,
	description: "FTL enqueue/flush threw while reporting telemetry"
}, We = {
	code: "E101",
	constantName: "PlayerScriptLoadFailed",
	priority: y.P2,
	description: "Vendor SDK/script/bundle failed to inject/load"
}, Ge = {
	code: "E102",
	constantName: "PlayerSetupFailed",
	priority: y.P2,
	description: "Adapter setup() / vendor init threw or rejected"
}, Ke = {
	code: "E103",
	constantName: "PlayerMountFailed",
	priority: y.P2,
	description: "Target container missing / DOM attach failed"
}, qe = {
	code: "E104",
	constantName: "PlayerReadyTimeout",
	priority: y.P3,
	description: "Player never signaled ready within budget"
}, Je = {
	code: "E105",
	constantName: "PlayerMediaLoadError",
	priority: y.P2,
	description: "Vendor media/network error (manifest 404, CORS, source unreachable)"
}, Ye = {
	code: "E106",
	constantName: "PlayerPlaybackFatalError",
	priority: y.P2,
	description: "Vendor fatal playback error (decode, unrecoverable buffer/DRM)"
}, x = {
	code: "E107",
	constantName: "PlayerDestroyFailed",
	priority: y.P3,
	description: "Teardown threw (facade isolates, still reported)"
}, Xe = {
	code: "E108",
	constantName: "AdCustomElementNotDefined",
	priority: y.P3,
	description: "Custom element wait budget exceeded; element never defined"
}, Ze = {
	code: "D001",
	constantName: "FandomTrackQueueUnavailable",
	priority: y.P3,
	description: "window.fandomTrack never appeared after cold-start poll window; buffered events dropped"
}, Qe = {
	code: "D002",
	constantName: "PluginWaitingTimeout",
	priority: y.P3,
	description: "onConfigLoaded plugin init exceeded timeout; bootstrap proceeded"
}, $e = {
	code: "D003",
	constantName: "PlayerFactoryNotRegistered",
	priority: y.P2,
	description: "Queue drain found no registered factory for requested player type"
}, et = {
	code: "D004",
	constantName: "InstantConfigLocalStorageError",
	priority: y.P3,
	description: "LocalStorage access error while reading/caching instant config"
}, tt = {
	code: "D005",
	constantName: "PerfMarkMissing",
	priority: y.P4,
	description: "No matching start/render mark when measuring a perf duration"
}, nt = {
	code: "D101",
	constantName: "PlayerMediaResolveMissing",
	priority: y.P3,
	description: "No mediaId / empty playlist / unresolved source; player skipped"
}, rt = {
	code: "D102",
	constantName: "PlayerFormatUnsupported",
	priority: y.P3,
	description: "Codec/format/DRM unsupported in env; fallback/skip"
}, it = {
	code: "D103",
	constantName: "PlayerAutoplayBlocked",
	priority: y.P4,
	description: "Browser blocked autoplay; degraded to muted / click-to-play"
}, at = {
	code: "D104",
	constantName: "PlayerRecoverableMediaError",
	priority: y.P4,
	description: "Vendor recoverable media error, auto-retried"
}, ot = {
	code: "D201",
	constantName: "AdConsentTimeout",
	priority: y.P3,
	description: "Consent listener timed out; ad plugin degraded"
}, S = {
	code: "D202",
	constantName: "AdSlotRequestRenderFailed",
	priority: y.P3,
	description: "requestRender failed for a slot; slot skipped"
}, st = {
	code: "D204",
	constantName: "BucketExperimentUnknownGroup",
	priority: y.P4,
	description: "setExperimentGroup received unrecognized group; defaulted to control"
}, ct = {
	code: "D205",
	constantName: "AdTagRefreshRenderFailed",
	priority: y.P3,
	description: "requestRender failed during an ad-request tag refresh; next ad keeps the previous tag"
}, C = {
	code: "U001",
	constantName: "UnexpectedRuntimeError",
	priority: y.P2,
	description: "Uncaught error with no specific issue code; indicates a gap in error handling"
}, lt = {
	code: "U002",
	constantName: "UnhandledPromiseRejection",
	priority: y.P2,
	description: "Unhandled promise rejection originating from Morpheus code"
};
new Map([
	[Re.code, Re],
	[b.code, b],
	[ze.code, ze],
	[Be.code, Be],
	[Ve.code, Ve],
	[He.code, He],
	[Ue.code, Ue],
	[We.code, We],
	[Ge.code, Ge],
	[Ke.code, Ke],
	[qe.code, qe],
	[Je.code, Je],
	[Ye.code, Ye],
	[x.code, x],
	[Xe.code, Xe],
	[Ze.code, Ze],
	[Qe.code, Qe],
	[$e.code, $e],
	[et.code, et],
	[tt.code, tt],
	[nt.code, nt],
	[rt.code, rt],
	[it.code, it],
	[at.code, at],
	[ot.code, ot],
	[S.code, S],
	[st.code, st],
	[ct.code, ct],
	[C.code, C],
	[lt.code, lt]
]);
var ut = { requiresConsent: !1 }, dt = {
	engine_version: "unknown",
	env: "unknown"
}, ft;
function pt(e) {
	dt = e;
}
function mt(e) {
	try {
		return e();
	} catch {
		return "";
	}
}
function ht() {
	if (ft) return ft;
	let e = {
		exp_bucket: mt(Ie),
		experiment_groups: mt(Le)
	};
	return e.experiment_groups && (ft = e), e;
}
var gt, w = [], _t, vt = 0, yt = 64, bt = 250, xt = 40;
function St(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return Array.isArray(t.q) && Array.isArray(t.cmd) && typeof t.registry == "object" && t.registry !== null;
}
function Ct() {
	return typeof window < "u" && St(window.fandomTrack);
}
function wt(e) {
	gt ?? (gt = oe("morpheus_performance", { category: "morpheus" }, ut)), gt(e);
}
function Tt() {
	if (w.length === 0) return;
	let e = w;
	w = [];
	for (let t of e) wt(t);
}
function Et() {
	_t || (_t = setTimeout(() => {
		if (_t = void 0, w.length !== 0) {
			if (Ct() || ++vt >= xt) {
				Ct() || v(Ze);
				try {
					Tt();
				} catch (e) {
					v(Ue, { error: e });
				}
				return;
			}
			Et();
		}
	}, bt));
}
function T(e) {
	try {
		let t = {
			...dt,
			...ht(),
			...e
		};
		if (Ct()) {
			Tt(), wt(t);
			return;
		}
		w.push(t), w.length > yt && w.shift(), Et();
	} catch {}
}
function E() {
	return typeof performance < "u" ? performance.now() : NaN;
}
function D(e) {
	let t = E() - e;
	return Number.isFinite(t) && t >= 0 ? t : -1;
}
//#endregion
//#region ../../shared/utils/src/logger.ts
var Dt = "morpheus_debug", O = !1;
function Ot(e) {
	O = e;
}
function kt() {
	return O;
}
function At(e = globalThis.location?.search ?? "") {
	let t = new URLSearchParams(e);
	if (!t.has("morpheus_debug")) return !1;
	let n = t.get(Dt);
	return n !== "false" && n !== "0";
}
function k(e) {
	let t = `[${e}]`;
	return {
		log: (...e) => {
			O && console.log(t, ...e);
		},
		info: (...e) => {
			O && console.info(t, ...e);
		},
		debug: (...e) => {
			O && console.debug(t, ...e);
		},
		warn: (...e) => {
			console.warn(t, ...e);
		},
		error: (...e) => {
			console.error(t, ...e);
		}
	};
}
//#endregion
//#region runtime/run-hook.ts
var jt = k("RunHook"), Mt = [];
function A(e, t, ...n) {
	g(`hook:${t}`);
	let r = [], i = [];
	for (let a of e) {
		let e = a.hooks[t];
		if (typeof e != "function") continue;
		let o = (e) => {
			r.push(a.name), jt.error(`Plugin "${a.name}" threw in hook "${t}":`, e), v(b, {
				label: `${a.name}:${t}`,
				error: e
			});
		}, s = Promise.resolve();
		try {
			s = Promise.resolve(e.call(a, ...n)).catch(o);
		} catch (e) {
			o(e);
		}
		i.push(s);
	}
	return kt() && Pt(t, n, r, i), i;
}
async function Nt(e, t, ...n) {
	g(`hook:${t}`);
	let r = [];
	for (let i of e) {
		let e = i.hooks[t];
		if (typeof e == "function") try {
			await e.call(i, ...n);
		} catch (e) {
			r.push(i.name), jt.error(`Plugin "${i.name}" threw in hook "${t}":`, e), v(b, {
				label: `${i.name}:${t}`,
				error: e
			});
		}
	}
	kt() && Pt(t, n, r, []);
}
function Pt(e, t, n, r) {
	let i = {
		time: typeof performance < "u" ? performance.now() : -1,
		name: e,
		params: t,
		failures: n
	};
	Promise.allSettled(r).then(() => Mt.push(i));
}
//#endregion
//#region runtime/create-runtime.ts
var Ft = "mve-player", It = "v16";
function Lt(e, t = []) {
	let n = k("CreateRuntime"), r = [];
	for (let i of t) try {
		i.setConfig?.(e), i.setPlugins(t), r.push(i);
	} catch (e) {
		n.error(`Plugin "${i.name}" threw in setPlugins(), skipping:`, e), v(b, {
			label: `${i.name}:setPlugins`,
			error: e
		});
	}
	let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	return {
		version: It,
		config: e,
		getPlugin(e) {
			return r.find((t) => t.name === e);
		},
		getPlugins() {
			return [...r];
		},
		registerPlayerFactory(t) {
			g(`factory:register:${t.type}`), i.has(t.type) && n.warn(`Player factory "${t.type}" is already registered; overwriting.`);
			try {
				t.attachConfig?.(e);
			} catch (e) {
				n.error(`Player factory "${t.type}" threw in attachConfig():`, e), v(ze, {
					player_type: t.type,
					error: e
				});
			}
			i.set(t.type, t);
		},
		async createPlayer(e, t, s) {
			g(`player:create:${e}`);
			let c = i.get(e);
			if (!c) throw v($e, { player_type: e }), Error(`[Morpheus] No player factory registered for type "${e}"`);
			let l = E(), u = {
				type: e,
				container: t,
				options: s
			};
			await Nt(r, "onBeforePlayerCreate", u);
			let d = (n) => {
				Nt(r, "onPlayerCreateFailed", {
					type: e,
					container: t,
					options: u.options,
					error: n
				});
			}, f;
			try {
				f = await c.create(t, u.options);
			} catch (t) {
				throw v(Be, {
					player_type: e,
					error: t
				}), d(t), t;
			}
			let p, m = {
				type: e,
				container: t
			}, h;
			try {
				h = Rt(t, e, o, n), zt(a, h);
			} catch (t) {
				try {
					f.destroy();
				} catch (t) {
					v(x, {
						player_type: e,
						error: t
					});
				}
				throw d(t), t;
			}
			return p = new ee(f, h, () => {
				g(`player:destroy:${e}`), n.debug(`Destroying player "${h}" (${e})`), t.classList.remove(Ft, `${Ft}--${e}`), a.get(h) === p && a.delete(h), Nt(r, "onAfterPlayerDestroy", m), t.replaceChildren();
			}), a.set(h, p), T({
				component: "video-engine",
				action: "player-created",
				duration_ms: D(l),
				label: e
			}), t.classList.add(Ft, `${Ft}--${e}`), Nt(r, "onAfterPlayerCreate", {
				type: e,
				container: t,
				player: p,
				options: u.options
			}), p;
		},
		getPlayers() {
			return [...a.values()];
		},
		findPlayer(e) {
			return a.get(e);
		}
	};
}
function Rt(e, t, n, r) {
	if (e.id) return e.id;
	let i = (n.get(t) ?? 0) + 1;
	n.set(t, i);
	let a = `${t}-${i}`;
	return r.warn(`Player container has no id; using fallback "${a}". Set container.id for stable, reusable player identifiers.`), a;
}
function zt(e, t) {
	if (e.has(t)) throw Error(`[Morpheus] Duplicate player id "${t}": a player with this id is already tracked. Destroy the existing player before creating a new one with the same id.`);
}
function Bt(e, t) {
	let n = e;
	for (let [r, ...i] of t) {
		let t = n[r];
		typeof t == "function" && t.apply(e, i);
	}
}
//#endregion
//#region runtime/initialize-plugins.ts
var Vt = k("InitializePlugins");
function Ht(e, t) {
	return e.filter((e) => {
		try {
			return e.isEnabled(t);
		} catch (t) {
			return Vt.error(`Plugin "${e.name}" threw in isEnabled():`, t), v(C, {
				label: `${e.name}:isEnabled`,
				error: t
			}), !1;
		}
	});
}
//#endregion
//#region ../../shared/instant-config/src/repository.ts
var Ut = {}, Wt = "icbm__";
function Gt(e) {
	if (e === "true" || e === "false") return e === "true";
	let t = parseInt(e, 10);
	if (e === `${t}`) return t;
	try {
		return JSON.parse(e);
	} catch {
		return e;
	}
}
function Kt(e, t) {
	let n = new URLSearchParams(t), r = [...n.keys()].filter((e) => e.startsWith(Wt) && n.get(e) !== null).reduce((e, t) => (e[t.slice(6)] = Gt(n.get(t)), e), {});
	return {
		...e,
		...r
	};
}
//#endregion
//#region ../../shared/instant-config/src/instant-config-service.ts
var qt = k("InstantConfig"), Jt = "instantConfigLoaded", Yt = 2e3, Xt = class {
	constructor() {
		o(this, "repository", { ...Ut });
	}
	async init(e) {
		let t = await Zt(e), n = {
			...Ut,
			...t
		};
		return this.repository = Kt(n, e.location?.search ?? ""), qt.info("initialized with", this.repository), this;
	}
	get(e, t) {
		return this.repository[e] ?? t;
	}
	getAll() {
		return { ...this.repository };
	}
	toJSON() {
		return this.getAll();
	}
};
function Zt(e) {
	return e.icbm?.config ? Promise.resolve(e.icbm.config) : new Promise((t) => {
		let n = () => {
			clearTimeout(r), t(e.icbm?.config ?? {});
		}, r = setTimeout(() => {
			e.removeEventListener(Jt, n), qt.warn("host did not provide instant-config in time; using defaults"), t({});
		}, Yt);
		e.addEventListener(Jt, n, { once: !0 });
	});
}
//#endregion
//#region runtime/initialize-instant-config.ts
var Qt = k("InstantConfig:bootstrap");
async function $t() {
	let e = globalThis.window;
	try {
		return await new Xt().init(e);
	} catch (e) {
		return Qt.error("failed to initialize instant-config; using defaults", e), v(He, { error: e }), new Xt();
	}
}
//#endregion
//#region runtime/attach-debug-info.ts
function en(e) {
	kt() && (e.debug = {
		version: e.version,
		config: e.config,
		activePlugins: e.getPlugins().map((e) => e.name)
	});
}
//#endregion
//#region runtime/constants.ts
var tn = 2e3, nn = /* @__PURE__ */ Object.assign({ "../config/default.ts": () => import("./default-BQtT_IEv.js") }), rn = k("LoadConfig");
async function an(e) {
	let t = "../config/default.ts", n = nn[e ? `../config/${e}/${e}.ts` : t] ?? nn[t];
	try {
		return (await n()).default;
	} catch (t) {
		rn.error("Could not load config for app", {
			app: e,
			error: t
		});
		let n = Error(`[VideoEngine] [LoadConfig] Could not load config for app: ${e}`, { cause: t });
		throw v(Ve, {
			label: e ?? "default",
			...Me(t),
			error: n
		}), n;
	}
}
//#endregion
//#region ../../shared/utils/src/geo.ts
var on = "ZZ", sn = {
	country: on,
	region: on,
	continent: on
};
function cn() {
	let e = window.fandomHost?.geo;
	if (e && e.country) return e;
	let t = Ne.get("Geo");
	if (t) try {
		return JSON.parse(decodeURIComponent(t));
	} catch {}
	return sn;
}
//#endregion
//#region ../../shared/utils/src/device.ts
var ln = new Set([
	"desktop",
	"smartphone",
	"tablet"
]);
function un(e) {
	return ln.has(e);
}
var dn = /Mobile|iPhone|Android|Silk|Kindle|Windows Phone|KFAPWI|(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i, fn = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i, pn = /iPad|Android(?!.*Mobile)/i;
function mn() {
	return yn(window.fandomHost?.device, window.navigator.userAgent);
}
function hn(e) {
	return e ?? mn();
}
function gn(e) {
	return hn(e) === "smartphone";
}
function _n(e) {
	return hn(e) === "tablet";
}
function vn(e) {
	return gn(e) || _n(e);
}
function yn(e, t = "") {
	return e && un(e) ? e : bn(t);
}
function bn(e) {
	return pn.test(e) ? "tablet" : dn.test(e) || fn.test(e.substring(0, 4)) ? "smartphone" : "desktop";
}
//#endregion
//#region runtime/build-page-context.ts
async function xn() {
	return {
		geo: cn(),
		device: mn()
	};
}
//#endregion
//#region runtime/initialize-config.ts
async function Sn(e) {
	let t = await an(), n = await xn(), r = { ...t.players };
	for (let [n, i] of Object.entries(e.players ?? {})) r[n] = {
		...t.players?.[n],
		...i
	};
	return {
		...t,
		...e,
		players: r,
		pageContext: n
	};
}
//#endregion
//#region ../../shared/plugins/morpheus-plugin/morpheus-plugin.ts
var Cn = /* @__PURE__ */ new WeakMap(), wn = /* @__PURE__ */ new WeakMap(), Tn = class {
	constructor(e) {
		o(this, "hooks", {}), o(this, "api", void 0), n(this, Cn, []), n(this, wn, void 0), this.pluginConfig = e;
	}
	isEnabled(e) {
		return this.pluginConfig.enabled !== !1;
	}
	setPlugins(e) {
		c(Cn, this, e);
	}
	setConfig(e) {
		c(wn, this, e);
	}
	useFeatureFlag(e, t) {
		return l(wn, this)?.featureFlags?.get(e) ?? t;
	}
	usePlugin(e) {
		return l(Cn, this).find((t) => t.name === e);
	}
	useExperiment(e) {
		return l(Cn, this).find((t) => t.experimentName === e.experimentName);
	}
}, En = "fandom-video-ad", Dn = k("FandomVideoAdPlugin");
function On(e) {
	let t = document.getElementById(e);
	return t && t.localName === "fandom-video-ad" ? t : null;
}
function kn(e, t) {
	let n = t.parentNode;
	if (!n) return Dn.warn(`Container has no parent; cannot create ad element for slot "${e}".`), null;
	let r = document.createElement(En);
	return r.id = e, n.insertBefore(r, t), r;
}
//#endregion
//#region ../../shared/plugins/fandom-video-ad/consents.ts
var An = null;
function jn(e, t) {
	return t.consentString !== e?.consentString || t.optOut !== e?.optOut;
}
function Mn() {
	return An || (window.fandomCmp?.allowed.ads ? Promise.resolve(!0) : (An = new Promise((e) => {
		let t = (n) => {
			(n.detail?.allowed.ads || window.fandomCmp?.allowed.ads) && (window.removeEventListener("fandomConsentUpdate", t), e(!0));
		};
		window.addEventListener("fandomConsentUpdate", t);
	}).finally(() => {
		An = null;
	}), An));
}
//#endregion
//#region ../../shared/plugins/fandom-video-ad/fandom-video-ad-plugin.ts
var Nn = 1e3, Pn = 5e3, Fn = 3;
function In(e, t) {
	let n = new URLSearchParams();
	t && n.set("player", t);
	let r = (e) => {
		if (e) for (let [t, r] of Object.entries(e)) r != null && n.set(t, Array.isArray(r) ? r.join(",") : r);
	};
	return e && (e.vpos && n.set("vpos", e.vpos), r(e.pageTargeting), r(e.slotTargeting)), n.toString() || void 0;
}
function Ln(e, t, n) {
	let r, i = new Promise((e, i) => {
		r = setTimeout(() => i(/* @__PURE__ */ Error(`${n} timed out after ${t}ms`)), t);
	});
	return Promise.race([e, i]).finally(() => clearTimeout(r));
}
var Rn = () => !!window.fandomCmp?.allowed.ads;
function zn(e) {
	try {
		return e.getNativeInstance(), !1;
	} catch {
		return !0;
	}
}
var j = /* @__PURE__ */ new WeakMap(), Bn = /* @__PURE__ */ new WeakMap(), M = /* @__PURE__ */ new WeakMap(), Vn = /* @__PURE__ */ new WeakMap(), Hn = /* @__PURE__ */ new WeakMap(), N = /* @__PURE__ */ new WeakSet(), Un = class extends Tn {
	constructor(e = {}) {
		super(e), t(this, N), o(this, "name", "FandomVideoAdPlugin"), n(this, j, k("FandomVideoAdPlugin")), n(this, Bn, /* @__PURE__ */ new WeakMap()), n(this, M, /* @__PURE__ */ new Map()), n(this, Vn, null), n(this, Hn, null), o(this, "hooks", {
			onRuntimeReady: async () => {
				s(N, this, Kn).call(this);
			},
			onBeforePlayerCreate: (e) => s(N, this, Gn).call(this, e),
			onAfterPlayerCreate: async (e) => s(N, this, Yn).call(this, e),
			onPlayerCreateFailed: async (e) => s(N, this, Qn).call(this, e),
			onAfterPlayerDestroy: async (e) => s(N, this, ar).call(this, e)
		});
	}
};
function Wn() {
	return this.pluginConfig.requestRenderTimeoutMs ?? Pn;
}
async function Gn(e) {
	let t = e.options, n = t.adSlotName;
	if (!n) return;
	let r = e.container;
	l(M, this).has(t) && l(j, this).warn(`options object reused by overlapping createPlayer calls for slot "${n}" — ad tag refresh tracks only the latest`), l(M, this).set(t, {
		container: r,
		options: t,
		slotName: n,
		resolveApplyAdTag: () => r.isConnected ? t.applyAdTag : void 0
	}), Rn() || (l(j, this).log(`ad request deferred for slot "${n}" — waiting for consent`), await Mn());
	let i = this.pluginConfig.whenDefinedTimeoutMs ?? Nn, a = Wn.call(s(N, this)), o;
	if (!await Promise.race([customElements.whenDefined("fandom-video-ad").then(() => (clearTimeout(o), !0)), new Promise((e) => {
		o = setTimeout(() => e(!1), i);
	})])) {
		l(j, this).warn(`"<${En}>" not defined within ${i}ms — playing without ads.`), v(Xe, { label: n });
		return;
	}
	let c = s(N, this, ir).call(this, n, e.container);
	if (!c) return;
	let u, d = null;
	try {
		[u, d] = await Ln(Promise.all([c.requestRender(), Promise.resolve().then(() => c.getAdUnitPath()).catch(() => null)]), a, "requestRender");
	} catch (e) {
		l(j, this).warn(`requestRender failed for slot "${n}":`, e), v(S, {
			label: n,
			error: e
		});
		return;
	}
	if (u.vastUrl) {
		t.adVastUrl = u.vastUrl, t.adUnitPath = d, t.adTargetingParams = In(u.vastParams, e.type);
		try {
			let e = c.getMonetizationTier();
			if (e != null) {
				let n = Number(e);
				Number.isFinite(n) && (t.adTier = n);
			}
		} catch {}
		t.adTier ?? (t.adTier = Fn), l(j, this).log(`slot "${n}" enriched: adTier=${t.adTier}, hasVastUrl=${!!t.adVastUrl}, adUnitPath=${t.adUnitPath ?? "none"}`);
	}
}
function Kn() {
	l(Hn, this) || (c(Vn, this, {
		consentString: window.fandomCmp?.consentString,
		optOut: window.fandomCmp?.optOut
	}), c(Hn, this, (e) => {
		s(N, this, qn).call(this, e).catch((e) => {
			l(j, this).warn("consent update handler failed:", e), v(C, {
				label: "FandomVideoAdPlugin:consentUpdate",
				error: e
			});
		});
	}), window.addEventListener("fandomConsentUpdate", l(Hn, this)));
}
async function qn(e) {
	let { consentString: t, optOut: n } = e.detail;
	jn(l(Vn, this), e.detail) && (c(Vn, this, {
		consentString: t,
		optOut: n
	}), l(j, this).log("consent change detected — triggering ad tag renewal"), await Promise.all(s(N, this, Jn).call(this).map((e) => s(N, this, Xn).call(this, e, "consent").catch(s(N, this, rr).call(this, "consent")))));
}
function Jn() {
	let e = /* @__PURE__ */ new Map();
	for (let t of l(M, this).values()) {
		if (t.player && zn(t.player)) continue;
		let n = e.get(t.container);
		(!n || t.player && !n.player) && e.set(t.container, t);
	}
	return [...e.values()];
}
function Yn({ container: e, player: t, options: n }) {
	let r = l(M, this).get(n);
	if (!(!r || r.player)) {
		if (zn(t)) {
			l(M, this).delete(n), l(j, this).log(`player for slot "${r.slotName}" destroyed before activation`);
			return;
		}
		r.player = t, r.resolveApplyAdTag() && (s(N, this, ir).call(this, r.slotName, e), t.on("adRequest", () => {
			s(N, this, Xn).call(this, r, "adRequest").catch(s(N, this, rr).call(this, "adRequest"));
		}));
	}
}
function Xn(e, t) {
	if (e.refreshInFlight) return t === "consent" && (e.consentRefreshPending = !0), Promise.resolve();
	g(`fandom-video-ad:refresh:${t}`);
	let n = s(N, this, Zn).call(this, e, t).finally(() => {
		e.refreshInFlight = void 0, e.consentRefreshPending && (e.consentRefreshPending = !1, s(N, this, Xn).call(this, e, "consent").catch(s(N, this, rr).call(this, "consent")));
	});
	return e.refreshInFlight = n, n;
}
async function Zn(e, t) {
	if (!s(N, this, $n).call(this, e)) return;
	let { slotName: n } = e, r = s(N, this, er).call(this, e, t);
	if (!r) return;
	if (!Rn()) {
		l(j, this).log(`ad tag ${t} refresh gated for slot "${n}" — consent not granted`);
		return;
	}
	let i = await s(N, this, tr).call(this, r, n, t), a = s(N, this, $n).call(this, e);
	!i || !a || !Rn() || await s(N, this, nr).call(this, a, i, n, t);
}
function Qn({ options: e }) {
	l(M, this).delete(e);
}
function $n(e) {
	if (l(M, this).get(e.options) === e && !(e.player && zn(e.player))) return e.resolveApplyAdTag();
}
function er(e, t) {
	let n = On(e.slotName);
	return n || t !== "consent" ? n : s(N, this, ir).call(this, e.slotName, e.container);
}
async function tr(e, t, n) {
	let r = Wn.call(s(N, this));
	try {
		return e.invalidateRender?.(), (await Ln(e.requestRender(), r, "requestRender")).vastUrl || void 0;
	} catch (e) {
		l(j, this).warn(`requestRender failed during ${n} refresh for slot "${t}":`, e), v(n === "adRequest" ? ct : S, {
			label: t,
			error: e
		});
		return;
	}
}
async function nr(e, t, n, r) {
	let i = Wn.call(s(N, this));
	try {
		await Ln(Promise.resolve(e(t)), i, "applyAdTag"), l(j, this).log(`ad tag refreshed for slot "${n}" after ${r}`);
	} catch (e) {
		l(j, this).warn(`applyAdTag failed during ${r} refresh for slot "${n}":`, e), v(C, {
			label: `FandomVideoAdPlugin:applyAdTag:${n}`,
			error: e
		});
	}
}
function rr(e) {
	return (t) => {
		l(j, this).warn(`${e} refresh failed:`, t), v(C, {
			label: `FandomVideoAdPlugin:${e}Refresh`,
			error: t
		});
	};
}
function ir(e, t) {
	let n = On(e);
	if (n) return n;
	let r = kn(e, t);
	return r ? (l(Bn, this).set(t, r), r) : null;
}
function ar({ container: e }) {
	let t = !1;
	for (let [n, r] of l(M, this)) r.container !== e || !r.player || (zn(r.player) ? l(M, this).delete(n) : t = !0);
	if (t) return;
	let n = l(Bn, this).get(e);
	n && (l(Bn, this).delete(e), n.isConnected && n.localName === "fandom-video-ad" && n.parentNode && n.remove());
}
//#endregion
//#region ../../shared/players/jwplayer/consts.ts
var P = "jwplayer", F = "jwplayer-dsr", or = "https://cdn.jwplayer.com/", sr = 1e4, I = "connatix", cr = 1e4, lr = {
	floating: "playerFloating",
	closed: "playerFloatingClosed",
	stopped: "playerFloatingStopped"
}, ur = .5, dr = 50, L = "mve-floating", fr = "mve-floating-close", pr = "mve-floating-close-container", mr = "mve-floating-close--ad", hr = ".jwplayer .jw-wrapper", gr = "cnx, [class*=\"cnx-\"]";
function _r(e, t) {
	let n = 0, r, i = () => {
		n = Date.now(), e();
	};
	return {
		run() {
			let e = t - (Date.now() - n);
			e <= 0 ? (r && (clearTimeout(r), r = void 0), i()) : r || (r = setTimeout(() => {
				r = void 0, i();
			}, e));
		},
		cancel() {
			r && clearTimeout(r), r = void 0;
		}
	};
}
var R = /* @__PURE__ */ new WeakMap(), z = /* @__PURE__ */ new WeakMap(), B = /* @__PURE__ */ new WeakMap(), vr = /* @__PURE__ */ new WeakMap(), V = /* @__PURE__ */ new WeakMap(), H = /* @__PURE__ */ new WeakMap(), U = /* @__PURE__ */ new WeakMap(), yr = /* @__PURE__ */ new WeakMap(), W = /* @__PURE__ */ new WeakMap(), br = /* @__PURE__ */ new WeakMap(), G = /* @__PURE__ */ new WeakMap(), xr = /* @__PURE__ */ new WeakMap(), Sr = /* @__PURE__ */ new WeakMap(), Cr = /* @__PURE__ */ new WeakMap(), K = /* @__PURE__ */ new WeakMap(), wr = /* @__PURE__ */ new WeakMap(), Tr = /* @__PURE__ */ new WeakMap(), Er = /* @__PURE__ */ new WeakMap(), Dr = /* @__PURE__ */ new WeakMap(), Or = /* @__PURE__ */ new WeakMap(), kr = /* @__PURE__ */ new WeakMap(), Ar = /* @__PURE__ */ new WeakMap(), q = /* @__PURE__ */ new WeakSet(), jr = /* @__PURE__ */ new WeakMap(), Mr = class {
	constructor(e) {
		t(this, q), n(this, R, void 0), n(this, z, void 0), n(this, B, void 0), n(this, vr, void 0), n(this, V, void 0), n(this, H, void 0), n(this, U, void 0), n(this, yr, _r(() => s(q, this, Fr).call(this), dr)), n(this, W, void 0), n(this, br, void 0), n(this, G, void 0), n(this, xr, void 0), n(this, Sr, !1), n(this, Cr, !0), n(this, K, !1), n(this, wr, !1), n(this, Tr, !1), n(this, Er, !1), n(this, Dr, () => l(yr, this).run()), n(this, Or, () => {
			c(Tr, this, !0), s(q, this, Ur).call(this, !1), l(K, this) && s(q, this, Hr).call(this);
		}), n(this, kr, () => {
			c(Tr, this, !0), s(q, this, Ur).call(this, !0), l(K, this) && s(q, this, Hr).call(this);
		}), n(this, Ar, () => s(q, this, Ur).call(this, !1)), n(this, jr, () => s(q, this, Br).call(this)), c(R, this, e.container), c(z, this, e.player), c(B, this, e.isMobile), c(vr, this, e.scrollThreshold), c(V, this, e.closeButtonIcon), c(H, this, e.logger);
	}
	start() {
		if (!l(Sr, this)) {
			if (typeof IntersectionObserver > "u") {
				l(H, this).warn("IntersectionObserver unavailable — floating disabled.");
				return;
			}
			if (!l(R, this).parentNode) {
				l(H, this).warn("Container is detached — floating disabled.");
				return;
			}
			if (c(U, this, new IntersectionObserver((e) => s(q, this, Nr).call(this, e), { threshold: ur })), l(U, this).observe(l(R, this)), l(B, this)) {
				let e = [
					l(z, this).on("play", l(Or, this)),
					l(z, this).on("adImpression", l(kr, this)),
					l(z, this).on("adPlay", l(kr, this)),
					l(z, this).on("adComplete", l(Ar, this)),
					l(z, this).on("adError", l(Ar, this))
				];
				c(xr, this, () => e.forEach((e) => e()));
			}
			window.addEventListener("scroll", l(Dr, this), { passive: !0 }), c(Sr, this, !0), s(q, this, Fr).call(this);
		}
	}
	destroy() {
		l(U, this)?.disconnect(), c(U, this, void 0), l(Sr, this) && window.removeEventListener("scroll", l(Dr, this)), l(yr, this).cancel(), l(xr, this)?.call(this), c(xr, this, void 0), s(q, this, Gr).call(this), l(K, this) && (l(G, this)?.classList.remove(L, s(q, this, Vr).call(this)), c(G, this, void 0), c(K, this, !1));
	}
};
function Nr(e) {
	let t = e[0];
	t && (c(Cr, this, typeof t.intersectionRatio == "number" ? t.intersectionRatio >= ur : t.isIntersecting), s(q, this, Fr).call(this));
}
function Pr() {
	return !!l(R, this).querySelector(hr) && !l(R, this).querySelector(gr);
}
function Fr() {
	l(wr, this) || (s(q, this, Pr).call(this) && !l(Cr, this) && window.scrollY > l(vr, this) ? s(q, this, Lr).call(this) : s(q, this, Rr).call(this, lr.stopped));
}
function Ir() {
	return l(R, this).querySelector("div");
}
function Lr() {
	if (l(K, this)) return;
	let e = s(q, this, Ir).call(this);
	e && (c(K, this, !0), c(G, this, e), e.classList.add(L, s(q, this, Vr).call(this)), (!l(B, this) || l(Tr, this)) && s(q, this, Hr).call(this), s(q, this, zr).call(this), s(q, this, Kr).call(this, lr.floating));
}
function Rr(e) {
	l(K, this) && (c(K, this, !1), l(G, this)?.classList.remove(L, s(q, this, Vr).call(this)), c(G, this, void 0), s(q, this, Gr).call(this), s(q, this, zr).call(this), s(q, this, Kr).call(this, e));
}
function zr() {
	window.dispatchEvent(new Event("resize"));
}
function Br() {
	c(wr, this, !0);
	try {
		l(z, this).pause();
	} catch {}
	s(q, this, Rr).call(this, lr.closed);
}
function Vr() {
	return `${L}--${l(B, this) ? "mobile" : "desktop"}`;
}
function Hr() {
	if (l(W, this)) return;
	let e = l(R, this).ownerDocument, t = e.createElement("button");
	if (t.type = "button", t.className = `${fr} ${fr}--${l(B, this) ? "mobile" : "desktop"}`, t.setAttribute("aria-label", "Close floating video"), l(V, this) ? t.innerHTML = l(V, this) : t.textContent = "×", t.addEventListener("click", l(jr, this)), l(B, this)) {
		let n = e.createElement("div");
		n.className = pr, n.appendChild(t), (l(R, this).parentElement ?? e.body).appendChild(n), c(br, this, n);
	} else {
		let e = l(G, this)?.firstElementChild;
		(e instanceof HTMLElement ? e : l(G, this))?.appendChild(t);
	}
	c(W, this, t), s(q, this, Wr).call(this);
}
function Ur(e) {
	l(Er, this) !== e && (c(Er, this, e), s(q, this, Wr).call(this));
}
function Wr() {
	l(W, this)?.classList.toggle(mr, l(B, this) && l(Er, this));
}
function Gr() {
	l(W, this) && (l(W, this).removeEventListener("click", l(jr, this)), l(W, this).remove(), c(W, this, void 0), l(br, this)?.remove(), c(br, this, void 0));
}
function Kr(e) {
	l(R, this).dispatchEvent(new CustomEvent(e, { bubbles: !0 }));
}
function qr(e, t) {
	let n = e?.scrollThresholds;
	return (t ? n?.mobile : n?.desktop) ?? (t ? 300 : 580);
}
//#endregion
//#region ../../shared/plugins/custom-floating/custom-floating-plugin.ts
var Jr = k("CustomFloatingPlugin"), Yr = /* @__PURE__ */ new WeakMap(), Xr = /* @__PURE__ */ new WeakMap(), Zr = /* @__PURE__ */ new WeakMap(), J = /* @__PURE__ */ new WeakMap(), Qr = /* @__PURE__ */ new WeakSet(), $r = class extends Tn {
	constructor(e = {}) {
		super(e), t(this, Qr), o(this, "name", "CustomFloatingPlugin"), n(this, Yr, void 0), n(this, Xr, void 0), n(this, Zr, void 0), n(this, J, /* @__PURE__ */ new WeakMap()), o(this, "hooks", {
			onConfigLoaded: async (e) => {
				c(Yr, this, e.pageContext?.device), c(Zr, this, e.players);
				let t = e.customFloating?.closeButtonIcon;
				c(Xr, this, typeof t == "string" ? t : void 0);
			},
			onAfterPlayerCreate: async (e) => {
				e.type === "jwplayer" && s(Qr, this, ei).call(this, e);
			},
			onAfterPlayerDestroy: async (e) => {
				let t = l(J, this).get(e.container);
				t && (l(J, this).delete(e.container), t.destroy());
			}
		});
	}
	isEnabled(e) {
		let t = e;
		return super.isEnabled(e) && t.customFloating?.enabled === !0;
	}
};
function ei(e) {
	l(J, this).get(e.container)?.destroy();
	let t = vn(l(Yr, this)), n = l(Zr, this)?.[e.type], r = typeof n == "object" && n ? n.customFloating : void 0, i = new Mr({
		container: e.container,
		player: e.player,
		isMobile: t,
		scrollThreshold: qr(r, t),
		closeButtonIcon: l(Xr, this),
		logger: Jr
	});
	l(J, this).set(e.container, i), i.start();
}
//#endregion
//#region ../../shared/plugins/bucket-experiment/types.ts
var ti = "control", ni = k("BucketExperimentPlugin"), ri = class extends Tn {
	constructor(e = {}) {
		super(e), o(this, "experimentName", void 0), o(this, "currentGroup", ti), this.experimentName = this.constructor.experimentName;
	}
	setExperimentGroup(e) {
		["control", ...this.variantNames].includes(e) ? this.currentGroup = e : (ni.warn(`Unknown experiment group "${e}" for ${this.experimentName}; defaulting to control`), v(st, { label: `${this.experimentName}:${e}` }), this.currentGroup = ti);
	}
	getDebugState() {
		return {
			experimentName: this.experimentName,
			currentGroup: this.currentGroup,
			variantNames: [...this.variantNames],
			codeDeletionDate: this.codeDeletionDate.toISOString()
		};
	}
};
o(ri, "experimentName", "missing");
//#endregion
//#region ../../shared/plugins/bucket-experiment/get-server-side-experiment.ts
var ii = /^sse-(?<experimentString>.+)$/, ai = /^(?<team>[a-zA-Z]+)-(?<ticketId>[0-9]+)-(?<mode>variant|control)-?(?<variant>[1-6])?$/;
function oi(e) {
	let t = e.toLowerCase().match(ai);
	if (!t?.groups) return;
	let { team: n, ticketId: r, mode: i, variant: a } = t.groups;
	if (i === "variant" && !a) return;
	let o = a ? `${i}${a}` : i;
	return {
		name: `${n}-${r}`,
		group: o
	};
}
function si() {
	let { classList: e } = document.documentElement;
	for (let t of e) {
		let e = t.toLowerCase().match(ii);
		if (e?.groups) return e.groups.experimentString;
	}
}
function ci() {
	let e = si();
	if (e) return oi(e);
}
//#endregion
//#region ../../shared/plugins/bucket-experiment/bucket-experiment-manager.ts
var li = k("BucketExperimentManager");
function ui() {
	return new URLSearchParams(globalThis.location?.search ?? "").get("force-sse");
}
var di = /* @__PURE__ */ new WeakMap(), fi = /* @__PURE__ */ new WeakSet(), pi = class {
	constructor(e, r) {
		t(this, fi), n(this, di, void 0);
		let i = s(fi, this, mi).call(this, r);
		if (!i) return;
		let a = s(fi, this, gi).call(this, e, i.name);
		if (!a || a.isEligible && !a.isEligible(r)) return;
		let o = new a({});
		o.setExperimentGroup(i.group), r.experiments ?? (r.experiments = {}), r.experiments[i.name] = o.currentGroup;
		try {
			o.adjustRuntimeConfig?.(r);
		} catch (e) {
			li.error(`adjustRuntimeConfig failed for ${i.name}:`, e), v(C, {
				label: `${i.name}:adjustRuntimeConfig`,
				error: e
			});
		}
		c(di, this, o);
	}
	getActivePlugin() {
		return l(di, this);
	}
};
function mi(e) {
	let t = ui();
	if (t) {
		let e = oi(t);
		if (e) return e;
	}
	return ci() || s(fi, this, hi).call(this, e);
}
function hi(e) {
	let t = e.experiments;
	if (!t) return;
	let [n, r] = Object.entries(t)[0] ?? [];
	if (!(!n || !r)) return {
		name: n,
		group: r
	};
}
function gi(e, t) {
	return Object.values(e).find((e) => e.experimentName === t);
}
//#endregion
//#region ../../shared/plugins/experiments/ExampleExperiment/example-experiment.ts
var _i = k("ExampleExperiment"), vi = class extends ri {
	constructor(...e) {
		super(...e), o(this, "name", "ExampleExperiment"), o(this, "variantNames", ["variant1", "variant2"]), o(this, "codeDeletionDate", /* @__PURE__ */ new Date("2045-08-01")), o(this, "hooks", { onRuntimeReady: async () => {
			_i.log("onRuntimeReady from an example experiment", { group: this.currentGroup });
		} });
	}
	isEnabled(e) {
		return super.isEnabled(e) && Pe(e, this.name);
	}
	adjustRuntimeConfig(e) {
		this.isEnabled(e) && (e.exampleFeatureEnabled = this.currentGroup === "variant1");
	}
};
o(vi, "experimentName", "fake-1234");
//#endregion
//#region ../../shared/plugins/bucket-experiment/index.ts
var yi = { ExampleExperiment: vi };
//#endregion
//#region runtime/load-plugins-list.ts
function bi(e) {
	let t = new pi(yi, e).getActivePlugin();
	return [
		...t ? [t] : [],
		new Un(),
		new $r()
	];
}
//#endregion
//#region ../../shared/players/define-player-factory.ts
function xi(e, t) {
	let n = {};
	return {
		type: e,
		attachConfig(t) {
			let r = t.players?.[e];
			if (r === void 0) {
				n = {};
				return;
			}
			if (typeof r != "object" || !r) {
				console.warn(`[${e}] config.players.${e} is not an object; ignoring.`), n = {};
				return;
			}
			n = r;
		},
		create: (e, r) => {
			for (let e of Object.keys(n)) {
				let t = n[e];
				t !== void 0 && (r[e] ?? (r[e] = t));
			}
			return t(e, r);
		}
	};
}
//#endregion
//#region ../../shared/players/common/ad-slot-registry.ts
var Si = /* @__PURE__ */ new Set();
function Ci(e, t) {
	if (Si.has(t)) throw Error(`[${e}] cannot create ${e} with ads — slot "${t}" is already reserved by another pending/live player`);
	Si.add(t);
}
function wi(e) {
	Si.delete(e);
}
//#endregion
//#region ../../shared/players/jwplayer/jwplayer-adapter.ts
var Y = /* @__PURE__ */ new WeakMap(), X = /* @__PURE__ */ new WeakMap(), Ti = /* @__PURE__ */ new WeakMap(), Ei = /* @__PURE__ */ new WeakSet(), Di = class {
	constructor(e, r) {
		t(this, Ei), o(this, "type", P), n(this, Y, /* @__PURE__ */ new Set()), n(this, X, () => {
			this.instance.off("idle", l(X, this)), s(Ei, this, Oi).call(this);
		}), n(this, Ti, () => {
			this.instance.off("idle", l(X, this)), this.instance.on("idle", l(X, this));
		}), this.instance = e, this.onDestroy = r, this.instance.on("idle", l(X, this)), this.instance.on("play", l(Ti, this));
	}
	getNativeInstance() {
		return this.instance;
	}
	play() {
		this.instance.play();
	}
	pause() {
		this.instance.pause();
	}
	stop() {
		this.instance.off("idle", l(X, this)), this.instance.stop(), this.instance.getState() === "idle" ? s(Ei, this, Oi).call(this) : this.instance.on("idle", l(X, this));
	}
	on(e, t) {
		let n = t;
		return e === "stop" ? (l(Y, this).add(n), () => {
			l(Y, this).delete(n);
		}) : (this.instance.on(e, n), () => this.instance.off(e, n));
	}
	destroy() {
		l(Y, this).clear(), this.instance.off("idle", l(X, this)), this.instance.off("play", l(Ti, this)), this.onDestroy();
	}
};
function Oi() {
	for (let e of l(Y, this)) try {
		e();
	} catch (e) {
		v(x, {
			player_type: P,
			error: e
		});
	}
}
//#endregion
//#region ../../shared/players/jwplayer/modes/partner.ts
var ki = /* @__PURE__ */ new Map();
function Ai(e, t) {
	ki.set(e, t);
}
function ji(e) {
	let t = window.jwDsrPartners?.[e]?.partner ?? "jwplayer", n = ki.get(t);
	if (!n) throw Error(`[${F}] No adapter registered for DSR partner "${t}". Register one with registerPartnerAdapter() or add support for this partner.`);
	return n;
}
Ai(P, Di);
//#endregion
//#region ../../shared/players/jwplayer/modes/dsr.ts
function Mi(e) {
	return (t) => {
		var n, r;
		let i = (n = window).jwDataStore ?? (n.jwDataStore = { custom: {} });
		i.custom ?? (i.custom = {}), (r = i.custom)[e] ?? (r[e] = {}), i.custom[e].preroll_ad_tag = t;
	};
}
var Ni = `${P}-dsr`, Pi = (e, t) => `${or}v2/sites/${e}/placements/${t}/embed.js`, Fi = {
	name: "dsr",
	async bootstrap(e, t) {
		let { siteId: n, placementId: r, playlistId: i, mediaId: a, adVastUrl: o, adTier: s, recommendationsPlaylistId: c, sponsoredPlaylistId: l } = t;
		if (g(`dsr:bootstrap:${r}`), t.applyAdTag ?? (t.applyAdTag = Mi(r)), !i && !a) {
			let e = /* @__PURE__ */ Error(`[${F}] At least one of \`playlistId\` or \`mediaId\` is required — without it the DSR bundle has nothing to play and aborts.`);
			throw v(nt, {
				player_type: P,
				player_mode: "dsr",
				label: r,
				error: e
			}), e;
		}
		let u = {};
		i && (u.playlist_id = i), a && (u.media_id = a), o && (u.preroll_ad_tag = o), s != null && Number.isFinite(s) && (u.tier = s), u.recommendations_playlist_id = c, l && (u.sponsored_playlist_id = l);
		let d = Object.keys(u), f;
		try {
			Ri(r, u);
			let t = `player_${r}`, i = document.getElementById(t);
			if (i && i !== e) throw Error(`[${F}] A DSR player for placement "${r}" is already mounted in another container. Re-use the existing container or provide a different placementId.`);
			e.id = t;
			let a = E(), o = (e) => T({
				component: Ni,
				action: e,
				duration_ms: D(a),
				label: Ni,
				placement_id: r
			});
			f = zi(e, Pi(n, r)), g("dsr:script-inject"), o("player-script-inject");
			let s = await Bi(r);
			g("dsr:placement-ready"), o("player-placement-ready"), await Ii(s, sr, r), g("dsr:player-ready"), o("player-ready");
			let c = ji(r);
			return {
				instance: s,
				script: f,
				destroyPlayer: () => {
					s.stop();
				},
				Adapter: c,
				cleanup: () => {
					Li(r, d), delete window.jwplacements, delete window.jwplacementsMap;
				}
			};
		} catch (e) {
			v(We, {
				player_type: P,
				player_mode: "dsr",
				label: r,
				error: e
			});
			try {
				f?.remove(), Li(r, d);
			} catch {}
			throw e;
		}
	}
};
function Ii(e, t, n) {
	return e.getState() == null ? new Promise((r, i) => {
		let a = setTimeout(() => {
			let e = /* @__PURE__ */ Error(`[${F}] Player did not emit 'ready' within ${t}ms — JW registered the placement but its underlying player never finished booting.`);
			v(qe, {
				player_type: P,
				player_mode: "dsr",
				label: n,
				error: e
			}), i(e);
		}, t);
		e.once("ready", () => {
			clearTimeout(a), r();
		});
	}) : Promise.resolve();
}
function Li(e, t) {
	let n = window.jwDataStore?.custom?.[e];
	if (n) {
		for (let e of t) delete n[e];
		Object.keys(n).length === 0 && delete window.jwDataStore.custom[e];
	}
}
function Ri(e, t) {
	var n;
	let r = (n = window).jwDataStore ?? (n.jwDataStore = { custom: {} });
	r.custom ?? (r.custom = {}), r.custom[e] = {
		...r.custom[e],
		...t
	};
}
function zi(e, t) {
	let n = e.querySelector(`script[src="${t}"]`);
	if (n) return n;
	let r = document.createElement("script");
	return r.src = t, r.async = !0, e.appendChild(r), r;
}
async function Bi(e) {
	let t = Date.now();
	for (; Date.now() - t < sr;) {
		let t = window.jwplacements?._getPlacementReadyPromise(e);
		if (t) return (await t).player;
		await new Promise((e) => setTimeout(e, 100));
	}
	throw Error(`[${F}] placement "${e}" did not become ready within ${sr}ms`);
}
//#endregion
//#region ../../shared/players/jwplayer/modes/index.ts
var Vi = /* @__PURE__ */ new Map();
function Hi(e) {
	Vi.set(e.name, {
		name: e.name,
		bootstrap: (t, n) => e.bootstrap(t, n)
	});
}
Hi(Fi);
function Ui(e) {
	let t = Vi.get(e);
	if (!t) throw Error(`[${P}] Unknown mode "${e}". Registered modes: ${[...Vi.keys()].join(", ") || "(none)"}`);
	return t;
}
//#endregion
//#region ../../shared/players/common/safe-instance.ts
function Wi(e, t, n) {
	let r = k(n);
	return new Proxy(e, { get(e, n, i) {
		if (typeof n == "string" && t.has(n)) return (...e) => {
			r.warn(`"${n}()" is blocked on the safe instance. Use VideoPlayer.destroy() instead to tear the player down cleanly.`);
		};
		let a = Reflect.get(e, n, i);
		return typeof a == "function" ? (...t) => {
			let n = a.apply(e, t);
			return n === e ? i : n;
		} : a;
	} });
}
//#endregion
//#region ../../shared/players/jwplayer/jwplayer.ts
var Gi = new Set(["remove"]), Ki = /* @__PURE__ */ new WeakMap(), qi = /* @__PURE__ */ new WeakMap(), Ji = /* @__PURE__ */ new WeakMap(), Yi = /* @__PURE__ */ new WeakMap(), Xi = /* @__PURE__ */ new WeakMap(), Zi = /* @__PURE__ */ new WeakMap(), Qi = /* @__PURE__ */ new WeakMap(), $i = /* @__PURE__ */ new WeakMap(), ea = class e {
	constructor(e, t, r, i = {}) {
		o(this, "type", P), n(this, Ki, void 0), n(this, qi, void 0), n(this, Ji, void 0), n(this, Yi, void 0), n(this, Xi, void 0), n(this, Zi, void 0), n(this, Qi, void 0), n(this, $i, !1), c(Ki, this, e), c(qi, this, t), c(Ji, this, Wi(t, Gi, P)), c(Xi, this, i.cleanup), c(Zi, this, i.destroyPlayer), c(Qi, this, i.onDestroy), c(Yi, this, new r(l(Ji, this), () => this.destroy()));
	}
	get adapter() {
		return l(Yi, this);
	}
	static async create(t, n, r) {
		let { instance: i, script: a, cleanup: o, destroyPlayer: s, Adapter: c } = await Ui(n.mode).bootstrap(t, n);
		return new e(a, i, c, {
			cleanup: o,
			destroyPlayer: s,
			onDestroy: r
		});
	}
	destroy() {
		if (!l($i, this)) {
			c($i, this, !0);
			try {
				l(Zi, this) ? l(Zi, this).call(this) : l(qi, this).remove();
			} catch (e) {
				v(x, {
					player_type: P,
					error: e
				});
			}
			l(Ki, this).remove();
			try {
				l(Xi, this)?.call(this);
			} catch (e) {
				v(C, {
					label: `${P}:cleanup`,
					player_type: P,
					error: e
				});
			}
			l(Qi, this)?.call(this);
		}
	}
}, ta = xi(P, async (e, t) => {
	let n = t.adSlotName;
	n && Ci(P, n);
	try {
		return (await ea.create(e, t, n ? () => wi(n) : void 0)).adapter;
	} catch (e) {
		throw n && wi(n), e;
	}
}), na = new Set(["destroy"]), ra = {
	play: "play",
	pause: "pause",
	stop: "stopped",
	complete: "videoCompleted100",
	error: "playError",
	adImpression: "adImpression",
	adPlay: "adPlay",
	adPause: "adPause",
	adComplete: "adCompleted100",
	adError: "adError",
	ready: "videoStarted"
}, Z = /* @__PURE__ */ new WeakMap(), ia = /* @__PURE__ */ new WeakMap(), aa = /* @__PURE__ */ new WeakMap(), oa = /* @__PURE__ */ new WeakMap(), sa = /* @__PURE__ */ new WeakMap(), ca = class {
	constructor(e, t, r) {
		o(this, "type", I), n(this, Z, void 0), n(this, ia, void 0), n(this, aa, void 0), n(this, oa, void 0), n(this, sa, !1), o(this, "play", () => {
			l(Z, this).play();
		}), o(this, "pause", () => {
			l(Z, this).pause();
		}), o(this, "stop", () => {
			l(Z, this).pause(), l(Z, this).setVideoPosition(0);
		}), o(this, "on", (e, t) => {
			let n = ra[e];
			return n && l(Z, this).on(n, t), () => {};
		}), o(this, "destroy", () => {
			if (!l(sa, this)) {
				c(sa, this, !0);
				try {
					l(Z, this).destroy();
				} catch (e) {
					v(x, {
						player_type: I,
						error: e
					});
				}
				l(aa, this).remove(), l(oa, this)?.call(this);
			}
		}), c(Z, this, e), c(ia, this, Wi(e, na, I)), c(aa, this, t), c(oa, this, r);
	}
	getNativeInstance() {
		return l(ia, this);
	}
}, la = (e) => (function(t) {
	if (!window.cnx) {
		window.cnx = {}, window.cnx.cmd = [];
		var n = t.createElement("iframe");
		n.src = "javascript:false", n.display = "none", n.onload = function() {
			var t = n.contentWindow.document, r = t.createElement("script");
			r.src = `//cd.connatix.com/connatix.player.js?cid=${e}`, r.setAttribute("async", "1"), r.setAttribute("type", "text/javascript"), t.body.appendChild(r);
		}, t.head.appendChild(n);
	}
})(document);
//#endregion
//#region ../../shared/players/connatix/render.ts
function ua(e, t, n) {
	window.cnx?.cmd?.push(function() {
		window.cnx?.(t).render(e, n);
	});
}
//#endregion
//#region ../../shared/players/connatix/resolve-geo-player-id.ts
function da(e) {
	if (!e || Object.keys(e).length === 0) return;
	let t = fa();
	if (t) return Object.entries(e).find(([e]) => e.toUpperCase() === t)?.[1];
}
function fa() {
	let e = cn()?.country;
	return typeof e == "string" && e ? e.toUpperCase() : void 0;
}
//#endregion
//#region ../../shared/players/connatix/connatix.ts
var pa = 0;
function ma(e) {
	return {
		renderId: `${e.renderId ?? "cnx"}-${++pa}`,
		playerId: e.playerId ?? ""
	};
}
function ha(e, t) {
	let n = {
		playerId: e,
		settings: t.adVastUrl ? {
			disableAdvertising: !1,
			advertising: { lineItems: [{
				id: e,
				url: t.adVastUrl
			}] }
		} : { disableAdvertising: !0 }
	};
	return t.mediaId && (n.mediaId = t.mediaId), t.playlistId && (n.playlistId = t.playlistId), n;
}
function ga(e, t) {
	return new Promise((n, r) => {
		let i = !1, a = setTimeout(() => {
			if (i) return;
			i = !0;
			let e = /* @__PURE__ */ Error(`[${I}] render timed out after ${cr}ms — SDK may not have loaded`);
			v(qe, {
				player_type: I,
				error: e
			}), r(e);
		}, cr);
		ua(e, t, (e, t) => {
			if (!i) if (i = !0, clearTimeout(a), e) {
				let t = /* @__PURE__ */ Error(`[${I}] ${e.type}: ${e.message}`);
				v(We, {
					player_type: I,
					error_type: e.type,
					error_message: e.message,
					error: t
				}), r(t);
			} else n(t);
		});
	});
}
function _a(e, t) {
	let n = {};
	t.adUnitPath && (n.path = t.adUnitPath), t.adTargetingParams && (n.custmac = t.adTargetingParams), Object.keys(n).length > 0 && e.setMacros(n);
}
var va = xi(I, async (e, t) => {
	let n = t.customerId;
	if (!n) throw Error(`[${I}] customerId is required — set it in window.__morpheusConfig.players.${I}.customerId`);
	let r = da(t.playerIdByGeo);
	r && (t.playerId = r);
	let { renderId: i, playerId: a } = ma(t);
	if (!a) {
		let e = /* @__PURE__ */ Error(`[${I}] playerId is required — set players.${I}.playerId in config or pass it directly`);
		throw v(nt, {
			player_type: I,
			error: e
		}), e;
	}
	let o = t.adSlotName;
	o && Ci(I, o);
	let s = E(), c = (e) => T({
		component: I,
		action: e,
		duration_ms: D(s),
		label: I
	}), l;
	try {
		la(n), c("player-script-inject"), l = document.createElement("div"), l.id = i, e.appendChild(l);
		let r = await ga(i, ha(a, t));
		return c("player-ready"), _a(r, t), new ca(r, l, o ? () => wi(o) : void 0);
	} catch (e) {
		throw l?.remove(), o && wi(o), e;
	}
}), ya = "v16";
function ba(e, t) {
	if (typeof t.env == "string" && t.env) return t.env;
	let n = e.fandomContext?.app?.env;
	return typeof n == "string" && n ? n : "unknown";
}
var xa = E(), Q = (e, t) => {
	g(`bootstrap:${e}`), T({
		component: "video-engine",
		action: e,
		duration_ms: D(xa),
		...t
	});
};
Ot(At()), window.addEventListener("unhandledrejection", (e) => {
	let t = e.reason, n = t instanceof Error ? t.message : String(t);
	!n.includes("[Morpheus]") && !n.includes("[jwplayer") && !n.includes("[VideoEngine]") || v(lt, { error: t });
});
var $ = k("VideoEngine"), Sa = window, Ca, wa;
Sa.MorpheusReady = new Promise((e, t) => {
	Ca = e, wa = t;
}), (async function(e) {
	$.log("bootstrap starting");
	let t = await Sn(e.__morpheusConfig ?? {}), n = {
		engine_version: ya,
		env: ba(e, t)
	};
	pt(n), ge(n), T({
		component: "video-engine",
		action: "script-execution-start",
		duration_ms: xa >= 0 ? xa : -1
	}), Q("config-fetch"), $.log("config initialized", t);
	let r = await $t();
	t.featureFlags = r, $.log("instant-config resolved", r.getAll());
	let i = Array.isArray(e.Morpheus) ? e.Morpheus : [], a = Ht(bi(t), t);
	Q("plugin-init"), $.log("active plugins", a.map((e) => e.name));
	let o = !1, s = Promise.allSettled(A(a, "onConfigLoaded", t)).then(() => {
		o = !0;
	});
	await Promise.race([s, new Promise((e) => setTimeout(e, tn))]), o || (Q("plugin-waiting-timeout"), v(Qe)), Q("config-loaded-hook");
	let c = Lt(t, a);
	Q("runtime-create"), en(c), A(a, "onRuntimeReady", c);
	let l = [ta, va];
	for (let e of l) c.registerPlayerFactory(e);
	Q("player-factory-register"), A(a, "onPlayersRegistered", c), e.Morpheus = c, Bt(c, i), Q("queue-drain"), A(a, "onQueueDrained"), Ca(c), A(a, "onInitializationEnded"), Q("bootstrap-complete", { active_plugins: a.map((e) => e.name) }), $.log("runtime ready", t);
})(Sa).catch((e) => {
	$.error("fatal init error:", e), v(Re, { error: e }), wa(e);
});
//#endregion
