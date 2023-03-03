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
		span.stop = () => clearInterval(inum);
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

/* Create Sequence of texts when pushing the button 'Next' */
function elSeqText(fn) {
	let api = {};
	let buttonEl = null;
	let q = [];
	// API for build
	api.then = t => q.push(t);
	api.nextButton = b => {
		buttonEl = b;
	}

	return el("span", span => {
		// Call user defined api
		fn(api);

		// Add sub text
		elto(span, el("span", span2 => {
			// API for display
			span2.popText = () => {
				span2.innerText = q.splice(0, 1);
				// Remove button when list is empty
				if (q.length < 1) buttonEl.parentElement.removeChild(buttonEl);
			}

			// Prepare button for click actions
			buttonEl.onclick = () => span2.popText();

			// self call
			span2.popText();
		}))

		// Add button element
		if (buttonEl) {
			elto(span, elNext());
			elto(span, buttonEl);
		}
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

		fn(api);
	});
}