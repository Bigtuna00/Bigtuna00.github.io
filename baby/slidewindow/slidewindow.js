/*
	Lightweight Image Viewer For Your Website
	Copyright © 2010 Yury Plashenkov
	http://www.plashenkov.com/
*/

currPath = '';
overlayOpacity = 75;
strPrev = 'Previous Image';
strNext = 'Next Image';
strClose = 'Close';
strImgOf = 'Image %1 of %2';

function setWndSize(w, h) {
	var el = document.getElementById('wnd');
	el.style.width = w + 20 * 2 + 'px';
	el.style.height = h + 20 * 2 + 10 + 40 + 'px';
	el.style.marginLeft = -parseInt(el.style.width) / 2 + 'px';
	el.style.marginTop = -parseInt(el.style.height) / 2 + 'px';
	el = document.getElementById('imgTable');
	el.style.width = w + 'px';
	el.style.height = h + 'px';
}

function clientSize() {
	var d = document;
	return [(!d.compatMode || d.compatMode == 'CSS1Compat') && d.documentElement && d.documentElement.clientWidth || d.body && d.body.clientWidth,
		(!d.compatMode || d.compatMode == 'CSS1Compat') && d.documentElement && d.documentElement.clientHeight || d.body && d.body.clientHeight];
}

function scrollSize() {
	var d = document;
	return [d.body && d.body.scrollWidth || d.documentElement && d.documentElement.scrollWidth,
		d.body && d.body.scrollHeight || d.documentElement && d.documentElement.scrollHeight];
}

function scrollOffset() {
	var d = document;
	return [d.documentElement && d.documentElement.scrollLeft || d.body && d.body.scrollLeft,
		d.documentElement && d.documentElement.scrollTop || d.body && d.body.scrollTop];
}

function setWndPos(show) {
	var el = document.getElementById('wnd');
	if (show) {
		var cl = clientSize(), sc = scrollOffset();
		el.style.left = cl[0] / 2 + sc[0] + 'px';
		el.style.top = cl[1] / 2 + sc[1] + 'px';
	}
	else {
		el.style.left = -parseInt(el.style.width) + 'px';
		el.style.top = -parseInt(el.style.height) + 'px';
	}
}

var imgArea = null, imgLoad = null, imgMain = null, images = null, titles = null, index = 0;

function reloadImg() {
	if (images == null || index < 0 || index >= images.length) return;

	var el = document.getElementById('btnPrev');
	if (index > 0) {
		el.src = currPath + 'prev.png';
		el.style.cursor = 'pointer';
	}
	else {
		el.src = currPath + 'prev_disabled.png';
		el.style.cursor = 'auto';
	}
	el = document.getElementById('btnNext');
	if (index < images.length - 1) {
		el.src = currPath + 'next.png';
		el.style.cursor = 'pointer';
	}
	else {
		el.src = currPath + 'next_disabled.png';
		el.style.cursor = 'auto';
	}

	if (imgArea.lastChild == imgMain) {
		imgArea.removeChild(imgMain);
		imgArea.appendChild(imgLoad);
	}
	imgMain.onload = function() {
		if (imgArea.lastChild == imgLoad) {
			imgArea.removeChild(imgLoad);
			setWndSize(imgMain.width, imgMain.height);
			imgArea.appendChild(imgMain);
		};
	}
	imgMain.src = '';
	imgMain.src = images[index];

	el = document.getElementById('imgNum');
	el.innerHTML = strImgOf.replace('%1', index + 1).replace('%2', images.length);

	el = document.getElementById('imgTitle');
	if (titles != null && index >= 0 && index < titles.length) el.innerHTML = titles[index];
	else el.innerHTML = '';
}

function changeImg(next) {
	if (images == null) return;
	if (next) {
		if (index < images.length - 1) {
			index++;
			reloadImg();
		}
	}
	else if (index > 0) {
		index--;
		reloadImg();
	}
}

var modalWnd = null;

function showSlideWindow(link, w, h) {
	if (modalWnd == null) return true;

	var el = document.getElementById('overlay');
	if (overlayOpacity > 0) {
		el.style.opacity = overlayOpacity / 100;
		el.style.filter = 'alpha(opacity=' + overlayOpacity + ')';
		var cl = clientSize(), sc = scrollSize();
		el.style.width = Math.max(cl[0], sc[0]) + 'px';
		el.style.height = Math.max(cl[1], sc[1]) + 'px';
	}
	if (w && h) setWndSize(w, h);
	setWndPos(true);
	modalWnd.style.visibility = 'visible';

	var keyEvent = function(ev) {
		if (!ev) ev = window.event;
		switch (ev.keyCode) {
			case 32: // space
			case 34: // page down
			case 39: // arrow right
			case 40: // arrow down
				changeImg(true);
				return false;
			case 8:  // backspace
			case 33: // page up
			case 37: // arrow left
			case 38: // arrow up
				changeImg(false);
				return false;
			case 27: // esc
				hideSlideWindow();
				return false;
		}
		return true;
	}
	if (window.opera) document.onkeypress = keyEvent;
	else document.onkeydown = keyEvent;

	images = [];
	titles = [];
	var links = link.parentNode.getElementsByTagName('a'), s = '', k;
	for (var i = 0; i < links.length; i++) {
		if (links[i].className.indexOf('viewable') != -1) {
			images[images.length] = links[i].href;
			k = links[i].innerHTML.indexOf('<!--');
			if (k != -1) {
				s = links[i].innerHTML.substring(k + 4);
				k = s.indexOf('-->');
				if (k != -1) s = s.substring(0, k);
			}
			titles[titles.length] = s;
		}
		if (links[i] == link) index = i;
	}

	reloadImg();
	return false;
}

function hideSlideWindow() {
	if (modalWnd == null) return;

	if (window.opera) document.onkeypress = null;
	else document.onkeydown = null;

	modalWnd.style.visibility = 'hidden';
	setWndPos(false);
	var el = document.getElementById('overlay');
	el.style.width = 0;
	el.style.height = 0;
}

function onLoad() {
	var ltIE7 = navigator.appVersion.indexOf('MSIE') != -1 && parseFloat(navigator.appVersion.split('MSIE')[1]) < 7;

	var head = document.getElementsByTagName('head')[0];
	var lnk = document.createElement('link');
	lnk.setAttribute('type', 'text/css');
	lnk.setAttribute('rel', 'stylesheet');
	lnk.setAttribute('href', currPath + 'slidewindow.css');
	head.appendChild(lnk);

	var styleText;
	if (ltIE7) {
		var before = " { filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + currPath;
		var after = ".png', sizingMethod='scale') } ";
		styleText = '#tl' + before + 'tl' + after + '#tc' + before + 'tc' + after + '#tr' + before + 'tr' + after + '#ml' + before + 'ml' + after + '#mr' + before + 'mr' + after + '#bl' + before + 'bl' + after + '#bc' + before + 'bc' + after + '#br' + before + 'br' + after;
	}
	else styleText = '#tl { background: url(' + currPath + 'r-corners.png) 0 0 } #tc { background: url(' + currPath + 'r-horz.png) 0 0 } #tr { background: url(' + currPath + 'r-corners.png) 100% 0 } #ml { background: url(' + currPath + 'r-vert.png) 0 0 } #mr { background: url(' + currPath + 'r-vert.png) 100% 0 } #bl { background: url(' + currPath + 'r-corners.png) 0 100% } #bc { background: url(' + currPath + 'r-horz.png) 0 100% } #br { background: url(' + currPath + 'r-corners.png) 100% 100% }';
	var st = document.createElement('style');
	st.setAttribute('type', 'text/css');
	head.appendChild(st);
	if (st.styleSheet) st.styleSheet.cssText = styleText;
	else st.appendChild(document.createTextNode(styleText));

	if (ltIE7) {
		new Image().src = currPath + 'tl.png';
		new Image().src = currPath + 'tc.png';
		new Image().src = currPath + 'tr.png';
		new Image().src = currPath + 'ml.png';
		new Image().src = currPath + 'mr.png';
		new Image().src = currPath + 'bl.png';
		new Image().src = currPath + 'bc.png';
		new Image().src = currPath + 'br.png';
	}
	else {
		new Image().src = currPath + 'r-corners.png';
		new Image().src = currPath + 'r-horz.png';
		new Image().src = currPath + 'r-vert.png';
	}

	new Image().src = currPath + 'loading.gif';
	new Image().src = currPath + 'prev.png';
	new Image().src = currPath + 'next.png';
	new Image().src = currPath + 'prev_disabled.png';
	new Image().src = currPath + 'next_disabled.png';
	new Image().src = currPath + 'close.png';

	modalWnd = document.createElement('div');
	modalWnd.style.visibility = 'hidden';
	modalWnd.innerHTML = '<div id="overlay" onclick="hideSlideWindow()"></div><table cellpadding="0" cellspacing="0" id="wnd"><tr><td id="tl"></td><td id="tc"></td><td id="tr"></td></tr><tr><td id="ml" rowspan="3"></td><td class="mc"><table cellpadding="0" cellspacing="0" id="imgTable"><tr><td align="center" id="imgArea"></td></tr></table></td><td id="mr" rowspan="3"></td></tr><tr><td class="mc" height="10"></td></tr><tr><td class="mc" height="40"><table cellpadding="0" cellspacing="0" width="100%" height="100%"><tr><td align="left" nowrap><img src="' + currPath + 'prev.png" width="58" height="22" alt="' + strPrev + '" id="btnPrev" onclick="changeImg(false)"><img src="' + currPath + 'next.png" width="58" height="22" alt="' + strNext + '" id="btnNext" onclick="changeImg(true)"></td><td align="center"><div id="imgNum"></div><div id="imgTitle"></div></td><td align="right"><img src="' + currPath + 'close.png" width="66" height="22" alt="' + strClose + '" style="cursor: pointer" onclick="hideSlideWindow()"></td></tr></table></td></tr><tr><td id="bl"></td><td id="bc"></td><td id="br"></td></tr></table>';
	document.body.appendChild(modalWnd);
	setWndSize(400, 300);
	setWndPos(false);

	imgArea = document.getElementById('imgArea');
	imgLoad = document.createElement('img');
	imgLoad.src = currPath + 'loading.gif';
	imgArea.appendChild(imgLoad);
	imgMain = document.createElement('img');
}

if (window.addEventListener) window.addEventListener('load', onLoad, false);
else if (window.attachEvent) window.attachEvent('onload', onLoad);
else if (window.onload) {
	var oldLoad = window.onload;
	window.onload = function() {
		oldLoad();
		onLoad();
	}
}
else window.onload = onLoad;