/* Fundamental function
   It has name for the tag
   It has callback for the manipulation etc */
function el(tag, cb) {
	let e = document.createElement(tag);
	if (cb) cb(e);
	// Additional GLOBAL el API
	e.then = cb2 => { cb2(e); return e; }
	e.delete = () => {
		e.parentElement.removeChild(e)
	};
	return e;
}

const elNext = () => el("br");

// ==========================
// Combinative elements
// ==========================

function elto(src, el) {
	if (src.appendChild) {
		src.appendChild(el);
		return el;
	}
	return null;
}

// ============================
// Functional helpers for cb's
// ============================

function elSet(name, val) {
	return (el) => {
		el[name] = val;
	}
}

function elId(id) { return (el) => el.id = id; }
function elClass(c) { return (el) => el.className = c; }
function elStyle(name, val) { return (el) => el.style[name] = val; }
function elInner(val) { return (el) => el.innerHTML = val; }

// ============================
// Predefined elements
// ============================

function elButton(caption, onClick, cb) {
	return el('button', b => {
		b.innerHTML = caption;
		b.onclick = onClick;
		if (cb) cb(b);
	});
}

function elButtonR(caption, sceneFn) {
	return elScene(api => {
		api.append(elButton(caption, () => {
			api.change(sceneFn)
		}))
	})
}

function elText(text, cb) {
	return el("span", t => {
		t.innerHTML = text;
		if (cb) cb(t);
		// API
		t.setText = (txt) => {
			t.innerHTML = txt;
		}
	});
}

function elTimer(intervalMs, ontick) {
	return el("span", span => {
		let count = 0;
		let inum = 0;
		let isDead = false;

		// Living Function callback
		// If returns false - then timer will be destroyed
		let livingFunc = () => span.isConnected

		// Timer is paused or not
		// If true then timer will execute but will never call the ontick function
		let paused = false;

		// Interval
		span.start = () => {
			// Make sure we are not paused here
			paused = false;

			// Reassign span.start to not make it use again
			span.start = () => {};

			// Start timers
			inum = setInterval(() => {
				if (!livingFunc()) {
					// Call onFree method when timer removing
					if (span.onFree) span.onFree();
					// Remove the timer
					clearInterval(inum);
					// Set timer to be dead
					isDead = true;
				} else {
					// If not paused also
					if (!paused) {
						count += 1;
						ontick(span);
					}
				}
			}, intervalMs);

			// Return this timer (span element)
			return span;
		}

		// API
		span.count = () => count;

		span.stop = () => {
			// Do nothing if it already dead
			if (isDead) return;
			// Clear the timers
			clearInterval(inum);
			span.remove(); // Remove itself
			isDead = true; // Mark it dead
		}
		span.pause = flag => { paused = flag; }
		span.liveWhile = (cb) => { livingFunc = cb }
		span.dead = () => isDead;
	})
}

function elTimerOnce(intervalMs, ontimer) {
	return elTimer(intervalMs, span => {
		span.stop();
		ontimer();
	})
}

function elPrefixed(prefixText, t) {
	return el("span", e => {
		// API
		// set number
		e.setText = (n) => e.innerHTML = prefixText + n

		// self call
		e.setText(t);
	})
}

function elPrefixMultext(prefix, character, num) {
	function mul(t, n) {
		let s = "";
		for (let i = 0; i < n; i++) {
			s += t;
		}
		return s;
	}
	return el("span", e => {
		// API
		// set number
		e.setNum = (n) => e.innerText = prefix + mul(character, n)

		// self call
		e.setNum(num);
	})
}

function elScene(fn) {
	return el("span", sceneSpan => {
		// API
		let api = {};

		// Clear the scene
		api.clear = () => sceneSpan.innerHTML = "";

		// Add element to the scene
		api.append = el => elto(sceneSpan, el);
		api.appendLn = el => { let r = elto(sceneSpan, el); elto(sceneSpan, elNext()); return r; }

		// Remove this scene
		api.stop = () => sceneSpan.parentElement.removeChild(sceneSpan);

		// Adds a timer to the Scene
		api.timer = (ms, timerCb) => api.append(elTimer(ms, timerCb).start());

		// Return span element
		api.span = () => sceneSpan

		// Reload the scene
		// Will clear under the hood
		api.reload = () => {
			api.clear();
			fn(api);
		}

		// Change state function to another api call
		api.change = fn2 => {
			fn = fn2;
			api.reload();
		}

		// Call to itself
		api.reload();

		// Export api
		sceneSpan.api = api;
	});
}

function elSeq(countVar, ...scenes) {
	if (countVar.isNull()) countVar.set(0);
	return elScene(api => {
		api.next = () => {
			countVar.set(countVar.get() + 1);
			if (countVar.get() >= scenes.length) return
			api.reload();
		}
		api.isLast = () => {
			return (countVar.get() + 1) >= scenes.length
		}
		if (countVar.get() >= scenes.length) return
		scenes[countVar.get()](api);
	})
}

function elSeqText(countVar, ...texts) {
	let scenes = texts.map(t => api => {
		api.appendLn(elText(t))
		if (!api.isLast()) api.appendLn(elButton(">>", api.next))
	})
	return elSeq(countVar, ...scenes)
}

function elChoose(cb, ...variants) {
	return elScene(api => {
		// Add each element to a scene
		variants.forEach(variant => {
			api.append(elButton(variant[0], () => {
				api.change(api => cb(api, variant[1]));
			}));
		});
	});
}

function elInput(caption, cb) {
	return elScene(api => {
		// This function will change the scene after call to it
		// Used to be in onclick event stuff
		let applyChanges = () => {
			// Do nothing when empty
			if (inp.value.length < 1) return;
			// Emit value
			cb(inp.value);
			// Set new scene
			api.change(api => api.append(elText(inp.value)))
		}

		// Events
		let inp = el("input");
		inp.addEventListener('keypress', e => {
			if (e.key === 'Enter') {
				applyChanges();
				e.preventDefault();
			}
		});

		// Elements
		api.append(elText(caption))
		api.append(inp);
		api.append(elButton("OK", applyChanges));
	});
}

// Renders list elements by renderer
// renderer - function fn(id, val) -> element
//     accepts id and value from list
//     returns element to be added to DOM
function elList(values, renderer) {
	return elScene(api => {
		for (let i = 0; i < values.length; i++) {
			api.appendLn(renderer(i, values[i]));
		}
	});
}

// Makes element so user can reorder values on his own
// [!!] Changes list elements
function elOrder(values, renderer, cb) {
	let swap = (id1, id2) => {
		let tmp = values[id1];
		values[id1] = values[id2];
		values[id2] = tmp;
		cb(values);
	}
	let list = elList(
		values,
		(id, val) => el("span", span => { // custom renderer that support ordering
			// When button is pressed and order is changed we can update list by .api.reload()
			if (id !== 0) {
				elto(span, elButton("^", () => {
					swap(id, id - 1);
					list.api.reload();
				}));
			}
			elto(span, renderer(id, val));
			if (id !== values.length - 1) {
				elto(span, elButton("v", () => {
					swap(id, id + 1);
					list.api.reload();
				}));
			}
		})
	);
	return list;
}

// Collapser scene
function elCollapse(collapsedVar, caption, fn) {
	collapsedVar.init(true);

	// Changes collapsedVar state
	let collapseToggle = () => { collapsedVar.set(!collapsedVar.get) }

	return elScene(api => {
		let span = api.span();

		span.isCollapsed = () => collapsedVar.get();

		span.toggle = () => {
			collapseToggle();
			api.reload();
		}

		if (span.isCollapsed()) {
			api.append(elButton("[ + ] " + caption, span.toggle))
		} else {
			api.append(elButton("[ - ] " + caption, span.toggle))
			fn(api);
		}
	})
}

function elCountDown(count, ms, cb) {
	return elScene(api => {
		api.append(elText(count));
		if (count < 1) {
			return;
		}
		api.timer(ms, () => {
			count -= 1;
			cb(count);
			api.reload();
		});
	})
}


class ElVariable {
	constructor(getter, setter) {
		this.getter = getter;
		this.setter = setter;
		this.__event = null;
	}
	get() {
		return this.getter();
	}
	set(val) {
		if (this.__event) this.__event.emit(val);
		return this.setter(val)
	}
	isNull() {
		let val = this.get();
		return val === null || val === undefined
	}
	inital(val) {
		if (this.isNull()) this.set(val);
		return this.get();
	}
	event() {
		if (!this.__event) this.__event = elEvent();
		return this.__event;
	}
}

// will wrap variable to ElVariable
// If value is already an ElVariable then it will return as is
ElVariable.wrap = function (v) {
	if (v instanceof ElVariable) return v;
	// Set variable to local scope
	let val = v;
	return new ElVariable(() => val, n => { val = n; });
}

// will unwrap ElVariable and return it's value
// If value is NOT ElVariable then it will be returned as is
ElVariable.unwrap = function (v) {
	if (v instanceof ElVariable) return v.get();
	return v;
}

// Returns true if it's ElVariable
ElVariable.isVariable = function (v) {
	return (v instanceof ElVariable);
}

function elStorage(section, provider) {
	if (provider === undefined) provider = () => sessionStorage;
	let el = {};
	let secname = name => section + "." + name;
	el.set = (name, val) => provider().setItem(secname(name), JSON.stringify(val));
	el.get = (name) => JSON.parse(provider().getItem(secname(name)));
	el.variable = name => new ElVariable(() => el.get(name), v => el.set(name, v));
	return el;
}

elStorage.LOCAL = () => localStorage
elStorage.SESSION = () => sessionStorage
elStorage.CACHE = () => {
	let dat = {}
	return {
		getItem(name) { return dat[name]; },
		setItem(name, val) { dat[name] = val; }
	}
}


function elEvent() {
	let funcs = [];
	let el = {};
	el.connect = fn => {
		funcs.push(fn);
	}
	el.emit = dat => {
		funcs = funcs.filter(f => f(dat))
	}
	el.clear = funcs = [];
	// Will create Promise which connects to the event
	// On event emit it will call the Promise's ok(dat) function
	// Returns false (To kill event connection after that)
	el.wait = () => new Promise(ok => el.connect(dat => { ok(dat); return false; }));
	return el;
}

function elNamedScenes(nameVariable, scenesObj) {
	return elScene(api => {
		nameVariable.inital("main");
		api.reload = () => {
			api.clear();
			let name = nameVariable.get();
			let scene = scenesObj[name]
			if (scene) {
				scene(api);
			} else {
				api.appendLn(elText("[!!] Can't find scene: " + name));
			}
		}
		api.change = name => {
			nameVariable.set(name);
			api.reload();
		}
		api.change(nameVariable.get())
	})
}

class ElInterpolBuilder {
	constructor(line) {
		this.line = line; // ElAnimationLine
		this.frame_from = 1;
		this.frame_to = 1;
	}
	on(from, to) {
		this.frame_from = from;
		if (to === undefined) to = from + 1
		this.frame_to = to;
		return this;
	}
	from(...values) {
		this.fromValues = values;
		return this;
	}
	to(...values) {
		this.toValues = values;
		return this;
	}
	with(callback) {
		this.callback = callback;
		return this;
	}
	next(frameCount) {
		this.frame_from = this.frame_to;
		this.frame_to = this.frame_from + frameCount;
		return this;
	}
	func(func) {
		this.line.addFunction(this.frame_from, func);
		return this;
	}
	animate() {
		// We will accumulate all calls
		// Will set into this array new vales
		// And when last call will be executed, we execute: this.callback(...arr)
		let arr = [...this.fromValues]
		let callbackToUse = this.callback;
		for (let i = 0; i < this.fromValues.length; i++) {
			let id = i;
			let isLast = id == this.fromValues.length - 1
			this.line.addInterpol(this.frame_from, this.frame_to, this.fromValues[i], this.toValues[i], (f, val) => {
				arr[id] = val;
				if (isLast) {
					// Will call accumulated values
					callbackToUse(...arr);
				}
			});
		}
		this.fromValues = this.toValues;
		return this;
	}
}

// Animation line is control panel for creating animation
// Then it will be used in ElAnimationPlayer for playing
class ElAnimationLine {
	// Create animation line and specify how much frames will it have
	constructor() {
		// List of [frame, func]
		this.line = [];
		this.framesCount = 1;
	}

	// Checks frame number with max frames
	// If current number is bigger then adjusts "this.framesCount"
	_adjustFrameCount(frameNumber) {
		if (this.framesCount < frameNumber) this.framesCount = frameNumber;
	}

	// Add simple function call on frame arrive
	// Function will not receive anything
	addFunction(frame, func) {
		this._adjustFrameCount(frame);

		this.line.push([frame, func]);
	}

	// Add interpolation animation
	// Parameters:
	//     frame    - Frame to start
	//     endFrame - Frame to end
	//     fromVal  - Starting value
	//     toVal    - Ending value
	//     func     - Function which will receive:
	//         frame - frame which is currently playing
	//         value - interpolation value to be set (number)
	addInterpol(frame, endFrame, fromVal, toVal, func) {
		this._adjustFrameCount(endFrame);

		// Generate interpolation stuff
		let count = endFrame - frame;
		let partPerFrame = (toVal - fromVal) / count
		for (let i = 0; i <= count; i++) {
			// Here we dividing function calls up to small parts from start to end positions
			// We have partPerFrame - is interpolation small part of value which will be added each frame
			// Animation could consume a lot of RAM so better to not create large amount of frames
			this.line.push([frame + i, () => { // Push frame func
				let id = i;
				// Call function func(frame, value)
				func(frame + id, fromVal + (partPerFrame * id));
			}]);
		}
	}

	with(callback) { return new ElInterpolBuilder(this).with(callback); }

	getPlayer(repeat, onEnd) {
		return ElAnimationPlayer(this, repeat, onEnd)
	}
}

class ElAnimationPlayer {
	/**
	 * Create object based on animation line
	 * @param {ElAnimationLine} animLine Animation line to read all from
	 */
	constructor(animLine, repeat, onEnd) {
		/** @type {ElAnimationLine} */
		this.line = animLine;
		this.pos = 1;
		this.ended = false; // Will be true when animation ends (and it's not repeatable)
		this.repeat = repeat; // Make animation repeatable
		this.onEnd = onEnd; // Will call when animation ended or repeatet (receives this animation)
		this.paused = false; // WIll block step but will not return false.
	}

	// Play step by step. Use it in your timers
	// Returns true when it's able to play again
	// Returns false when it's not able to play again. 
	step() {
		// If pause we still return true
		// But do nothing until someone set 'this.paused' to false
		if (this.paused) return true;
		// Don't allow to play animation which is ended
		if (this.ended) return false;

		// Get funcs which is in current frame
		// ani[0] - frame position
		// ani[1] - function to be called without parameters
		let funcs = this.line.line.filter(ani => ani[0] == this.pos).map(ani => ani[1])

		// Call each function
		funcs.forEach(f => f());

		if (this.pos >= this.line.framesCount) {
			// Call callback onEnd
			this.onEnd(this);
			// Set to be ended if repeat is false
			if (this.repeat) {
				this.pos = 1;
			} else {
				this.ended = true;
			}
			return !this.ended;
		}

		this.pos += 1;

		return true;
	}
}

// Crate Timer element with animation features
// Receives:
//     fn - callback function with animation API
function elAnimation(fn) {
	let api = {};

	let onEnd = () => { };
	let doRepeat = false;
	let startingFrame = 1;
	let animationPerFrame = 50; // Default: 20 FPS
	let line = null;
	let doStartPaused = false;

	// API
	api.repeat = flag => doRepeat = flag;
	api.onEnd = cb => onEnd = cb;
	api.frame = n => startingFrame = n;
	api.time = ms => animationPerFrame = ms;
	api.fromLine = (l) => line = l;
	api.newLine = () => { let newLn = new ElAnimationLine(); line = newLn; return newLn; };
	api.paused = () => { doStartPaused = true; }

	// Call API func
	fn(api);

	if (!line) {
		console.error("elAnimation:", "ElAnimationLine is not set. Animation will not execute")
		// Fallback timer
		return elTimer(100, t => t.stop());
	}

	// Bootstraping player
	/** @type {ElAnimationPlayer} */
	let player = new ElAnimationPlayer(line, doRepeat, p => { if (onEnd) onEnd(p); });
	
	// If we want to start paused
	if (doStartPaused) player.paused = true;

	// Set starting frame
	player.pos = startingFrame;

	// Will execute in timer on current DOM element it returns
	// Timer will immediately start
	let timer = elTimer(animationPerFrame, t => {
		if (!player.step()) t.stop();
	}).start();

	// API for other elements
	timer.paused = (flag) => { player.paused = flag; }
	timer.frames = () => player.line.framesCount
	timer.getFrame = () => player.pos
	timer.setFrame = n => { player.pos = n; }
	timer.isPaused = () => player.paused;

	return timer;
}

function elFloating(elem, x, y) {
	return el('span', span => {
		// Set up the style properties
		span.style.position = "relative";
		span.style.left = x + "px";
		span.style.top = y + "px";
		span.style.transition = "100ms";

		// Position setter
		let setPosEl = (newX, newY) => {
			span.style.left = newX + "px";
			span.style.top = newY + "px";
			x = newX;
			y = newY;
		}

		// Add our element
		elto(span, elem);

		let newAni = () => elAnimation(api => {
			api.newLine().with(val => span.style.top = val + "px")
				.on(5, 10).from(y).to(y + 15).animate()
				.next(5).animate() // Wait 5 frames
				.next(5).to(y).animate(); // Move back
			api.time(50);
			api.repeat(true);
		});

		// Add animation
		let ani = elto(span, newAni());

		// API
		span.getPos = () => ({ x, y });
		span.setPos = (posX, posY) => {
			ani.stop();
			setPosEl(posX, posY);
			ani = elto(span, newAni());
		}
		span.floating = flag => ani.paused(!flag);
		span.elem = () => elem;
		span.absolute = flag => span.style.position = flag ? "absolute" : "relative";
	});
}

let elDiv = cb => el("div", cb);

function elAudio(fn) {
	let api = {};
	return el('span', span => {

		/** @type {Audio} */
		let aud = elto(span, new Audio());

		let secondEvents = [];
		let onErr = null;

		// API setup
		api.src = s => {
			// When changin the surce, we clearing second events
			secondEvents = [];
			if (!api.playing()) {
				aud.src = s;
			}
		}
		api.loop = flag => { aud.loop = flag; }
		api.volume = v => { aud.volume = v; }
		api.time = n => { aud.currentTime = n; }
		api.play = aud.play.bind(aud);
		api.pause = aud.pause.bind(aud);
		api.stop = () => { api.pause(); api.time(0); }
		api.onSecond = (sec, fn) => secondEvents.push([sec, fn]);
		api.playing = () => !aud.paused;
		api.audio = () => aud;
		api.onEnd = f => { aud.onended = f; }
		api.onErr = f => { onErr = f; }
		api.duration = () => aud.duration;
		api.pos = () => aud.currentTime;

		// Make 1.234 number looks like 1.2
		// (num + Number.EPSILON) * 100) / 100
		let dec = n => Math.trunc(n * 10) / 10

		// This function will build beats using adding callbacks each n seconds
		api.onBeat = (bpm, f) => {
			// Get beats per second
			let bps = (bpm / 60)

			// Get how many seconds each beat has
			let secondsPerBeat = 1 / bps

			// Do not wrong values
			if (secondsPerBeat < 0.1) {
				console.error("Wrong BPM, will not add onBeat callback", secondsPerBeat, "BPM: ", bpm, "BPS: ", bps);
				return;
			}

			// Setting up the onBeat callbacks
			// It will work only for songs around 5 mins
			for (let i = 0; i < 600; i += secondsPerBeat) {
				api.onSecond(dec(i), f);
			};
		}

		// Difference between the seconds counter values
		// If it will be too big (> 0.1) then we will run missed events
		let previousSecondsTime = 0.1;

		// Get onSecond events and execute them
		// s[0] - second number
		// s[1] - function callback (no args)
		// Will run each callback here
		let executeBetween = (fromSec, toSec) => secondEvents
			.filter(s => dec(s[0]) >= fromSec && dec(s[0]) <= toSec)
			.map(s => s[1])
			.forEach(cb => cb());

		// Timer which processes second events
		let timer = elto(span, elTimer(100, t => {
			// Do nothing to paused audio
			if (aud.paused) return;

			// If len of secondEvents is 0 then do nothing
			if (secondEvents.length < 1) return;

			// Calculate differences between before-time and after
			// If it too big then we missing couple events
			let differenceBetweenLast = dec(aud.currentTime - previousSecondsTime)
			if (differenceBetweenLast > 0.1) {
				// When there is difference, then we should not forget anything
				let prev = dec(aud.currentTime - differenceBetweenLast + 0.1)
				let now = dec(aud.currentTime);
				executeBetween(prev, now);
			} else if (differenceBetweenLast == 0) {
				// When difference between past is zero (Twice), then we do nothing here
				// We don't need to repeat stuff twice
			} else {
				// Execute events in current time
				executeBetween(dec(aud.currentTime), dec(aud.currentTime));
			}

			// Update previousSecondsTime variable for the future analyses
			previousSecondsTime = dec(aud.currentTime);


		}).start());
		timer.api = () => api;
		timer.onFree = () => {
			// Free up the memory from Audio
			api.stop();
			aud.remove();
		}

		// Call
		try { fn(api) } catch (e) { if (onErr) onErr(e); else throw e; }

		span.api = () => api;
	});
}