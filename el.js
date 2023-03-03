/* Fundamental function
   It has name for the tag
   It has callback for the manipulation etc */
function el(tag, cb) {
	let e = document.createElement(tag);
	if (cb) cb(e);
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

function elButton(caption, onClick, cb) {
	return el('button', b => {
		b.innerText = caption;
		b.onclick = onClick;
		if (cb) cb(b);
	});
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

function elSeq(...scenes) {
	let sceneId = 0;
	return elScene(api => {
		api.next = () => {
			sceneId += 1;
			if (sceneId >= scenes.length) return
			api.reload();
		}
		api.isLast = () => {
			return (sceneId + 1) >= scenes.length
		}
		if (sceneId >= scenes.length) return
		scenes[sceneId](api);
	})
}

function elSeqText(...texts) {
	let scenes = texts.map(t => api => {
		api.appendLn(elText(t))
		if (!api.isLast()) api.appendLn(elButton(">>", api.next))
	})
	return elSeq(...scenes)
}