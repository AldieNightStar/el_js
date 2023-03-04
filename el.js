/* Fundamental function
   It has name for the tag
   It has callback for the manipulation etc */
function el(tag, cb) {
	let e = document.createElement(tag);
	if (cb) cb(e);
	// Additional GLOBAL el API
	e.then = cb2 => cb2(e);
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
		b.innerText = caption;
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
		t.innerText = text;
		if (cb) cb(t);
		// API
		t.setText = (t) => {
			t.innerText = t;
		}
	});
}

function elTimer(intervalMs, ontick) {
	return el("span", span => {
		let count = 0;
		let inum = 0;

		// Interval
		inum = setInterval(() => {
			count += 1;
			if (!span.isConnected) {
				clearInterval(inum);
			} else {
				ontick(span);
			}
		}, intervalMs);

		// API
		span.count = () => count;
		span.stop = () => {
			clearInterval(inum);
			span.parentElement.removeChild(span); // Remove itself
		}
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
		e.setNum = (n) => e.innerText = prefixText + n

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
		api.appendLn = el => { elto(sceneSpan, el); elto(sceneSpan, elNext()); }

		// Remove this scene
		api.stop = () => sceneSpan.parentElement.removeChild(sceneSpan);

		// Adds a timer to the Scene
		api.timer = (ms, timerCb) => api.append(elTimer(ms, timerCb));

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


// Makes element so user can reorder values on his own
function elOrder(cb, ...elems) {
	return elScene(api => {
		let swap = (id1, id2) => {
			let tmp = elems[id1];
			elems[id1] = elems[id2];
			elems[id2] = tmp;
		}
		for (let i = 0; i < elems.length; i++) {
			let elem = elems[i];
			let currentId = i;
			api.append(elButton("^", () => {
				if (currentId === 0) return;
				swap(currentId, currentId - 1);
				cb(elems);
				api.reload();
			}));
			api.append(elButton("v", () => {
				if (currentId === elems.length - 1) return;
				swap(currentId, currentId + 1);
				cb(elems);
				api.reload();
			}));
			api.appendLn(elem);
		}
	});
}

// Collapser scene
function elCollapse(caption, fn) {
	let collapse = true;
	let collapseToggle = () => { collapse = !collapse }

	return elScene(api => {
		let span = api.span();

		span.isCollapsed = () => collapse;

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

(function() {
	class Variable {
		constructor(getter, setter) {
			this.getter = getter;
			this.setter = setter;
		}
		get() {
			return this.getter();
		}
		set(val) {
			return this.setter(val)
		}
		isNull() {
			let val = this.get();
			return val === null || val === undefined
		}
	}

	function elStorage(section, provider) {
		if (provider === undefined) provider = () => sessionStorage;
		return el("span", el => {
			let secname = name => section + "." + name;
			el.set = (name, val) => provider().setItem(secname(name), JSON.stringify(val));
			el.get = (name) => JSON.parse(provider().getItem(secname(name)));
			el.variable = name => new Variable(() => el.get(name), v => el.set(name, v));
		})
	}
	window.elStorage = elStorage;

	elStorage.LOCAL = () => localStorage
	elStorage.SESSION = () => sessionStorage
	elStorage.CACHE = () => {
		let dat = {}
		return {
			getItem(name) { return dat[name]; },
			setItem(name, val) { dat[name] = val; }
		}
	}
})()

function elEvent() {
	let funcs = [];
	return el("span", el => {
		el.connect = fn => {
			funcs.push(fn);
		}
		el.emit = dat => {
			funcs = funcs.filter(f => f(dat))
		}
		el.clear = funcs = [];
	});
}

function elNamedScenes(nameVariable, scenesObj) {
	return elScene(api => {
		if (nameVariable.isNull()) {
			nameVariable.set("main");
		}
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