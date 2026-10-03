/* Arcade site: theme switch (system / light / dark) and copy buttons. Everything else (screenshots, icons, links) is
 * plain HTML written by src/pages.py, so without JS the page still reads fully, in the system theme. */
(function () {
	'use strict';
	var KEY = 'arcade-site-theme';
	var root = document.documentElement;
	var ICONS = {
		system: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/></svg>',
		light: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></g></svg>',
		dark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="currentColor"/></svg>',
	};
	var NEXT = { system: 'light', light: 'dark', dark: 'system' };
	function current() { var t = root.getAttribute('data-theme'); return t === 'light' || t === 'dark' ? t : 'system'; }
	function paint(btn) {
		var t = current();
		btn.innerHTML = ICONS[t];
		btn.setAttribute('aria-label', 'Colour theme: ' + t + '. Switch to ' + NEXT[t]);
		btn.title = 'Theme: ' + t;
	}
	Array.prototype.forEach.call(document.querySelectorAll('[data-theme-toggle]'), function (btn) {
		paint(btn);
		btn.addEventListener('click', function () {
			var t = NEXT[current()];
			if (t === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', t);
			try { if (t === 'system') localStorage.removeItem(KEY); else localStorage.setItem(KEY, t); } catch (e) { /* storage blocked */ }
			paint(btn);
		});
	});

	// copy buttons: copy the text of the element named by data-copy
	Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
		btn.addEventListener('click', function () {
			var el = document.getElementById(btn.getAttribute('data-copy'));
			if (!el) return;
			var text = el.textContent.trim();
			var label = btn.getAttribute('data-label') || btn.textContent;
			btn.setAttribute('data-label', label);
			var say = function (msg) { btn.textContent = msg; clearTimeout(btn._t); btn._t = setTimeout(function () { btn.textContent = label; }, 1800); };
			// fallback (no Clipboard API, or it was refused): select the text and try the legacy copy command; if even
			// that fails the address stays selected, ready for the system copy menu
			var fallback = function () {
				var r = document.createRange(); r.selectNodeContents(el);
				var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
				var copied = false;
				try { copied = document.execCommand('copy'); } catch (e) { /* not supported */ }
				say(copied ? 'Copied' : 'Selected');
			};
			try { navigator.clipboard.writeText(text).then(function () { say('Copied'); }, fallback); } catch (e) { fallback(); }
		});
	});

})();
