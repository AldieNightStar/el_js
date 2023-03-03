/*
	EL.JS
	by HaxiDenti
	=========================

	* You can create elements with: el(tag, cb)
	* You can add them to existing elements with: elto(elem, el(...))
	* You can use predefined components like: elButton("Caption", onclick, cb)

	* cb - means that this will call after blank element creation. So all the parameters you make yourself

	* Defined components:

	-- Button
	---------------------
		// Create button element with onClick stuff
		// and optional 'cb' to add additional elements
		let b = elButton(caption, onClick, cb)

	-- Text Label
	---------------------
		// Create text element
		let t = elText(text, cb);

		// Set new text to it
		t.setText(text)

	-- Timer Element
	---------------------
		// Create timer element
		// ontick - calls everytick
		// will stop if element is disconnected from DOM
		let t = elTimer(intervalMs, ontick)

		// Retunrs how many ticks were happen
		t.count()

		// Stops the timer
		t.stop()

	-- Prefixed Text element
	-------------------------
		// Created prefixed text/number
		let t = elPrefixed("Life: ", 32)

		// Update text (Prefix will leave as is)
		t.setText(t);

	-- Multitext Element
	-------------------------
		// Creates multiplied text according to a given number
		// prefix    - used to prefix the multitext
		// character - used to be multiplied by 'num'
		let t = elPrefixMultext(prefix, character, num)

		// Remultiply text. Change count of symbols
		t.setNum(10)
*/


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
		return true;
	}
	return false;
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
function elSeq(fn) {
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