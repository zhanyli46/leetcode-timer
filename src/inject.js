var CONTAINER_CLASS = 'btns__1OeZ';
var TIME = 0;
var TIMEHANDLE = undefined;

/* helper functions */
function setStyle(obj, styles) {
  if (obj.constructor !== Array) {
    obj = [obj];
  }
  for (var elem of obj) {
    for (var index in styles) {
        elem.style[index] = styles[index];
    }
  }
  return obj;
}

function appendChildren(parent, children) {
  for (var i = 0; i < children.length; i++) {
    parent.appendChild(children[i]);
  }
}

function elementTranslate(elem, y1, y2) {
  elem.animate([
    { transform: 'translate3D(0, ' + y1 + 'px, 0)' },
    { transform: 'translate3D(0, ' + y2 + 'px, 0)' }
  ], {
    duration: 300,
    fill: 'forwards',
    easing: 'ease-in-out'
  });
}


window.addEventListener("load", function() {
  var callback = injectLcClock;
  waitUntilJSLoaded(callback);
}, false);

function waitUntilJSLoaded(callback) {
  var jsCheck = setInterval(jsCheckFinished, 200);
  var container = [];
  function jsCheckFinished() {
    container = document.getElementsByClassName(CONTAINER_CLASS);
    if (container.length != 0) {
        clearInterval(jsCheck);
        callback(container[0]);
    }
  }
}

function injectLcClock(container) {
  var clock = createClock(container);
  container.insertBefore(clock, container.firstChild);
};

function createClock(parent) {
  var clock = document.createElement('div');
  clock.id = 'lc_clock';
  var clockStyles = {
    'height': parent.offsetHeight + 'px',
    'width': '100%',
    'display': 'flex',
    'justifyContent': 'center'
  };
  setStyle(clock, clockStyles);
  var modeSelector = createModeSelector(clock);
  var clockScreen = createClockScreen(clock);
  var controlPanel = createControlPanel(clock);
  appendChildren(clock, [modeSelector, clockScreen, controlPanel]);
  return clock;
}

function createModeSelector(parent) {
  var modeSelector = document.createElement('div');
  modeSelector.id = 'lc_mode_selector';
  modeSelector.setAttribute('mode', 'timer');
  modeSelectorStyle = {
    'height': '100%',
    'width': '42px',
    'padding': '0px 6px'
  };
  setStyle(modeSelector, modeSelectorStyle);


  var timerIcon = document.createElement('img');
  timerIcon.src = chrome.runtime.getURL('assets/timer.png');
  timerIcon.id = 'lc_timer_icon';
  var stopwatchIcon = document.createElement('img');
  stopwatchIcon.src = chrome.runtime.getURL('assets/stopwatch.png');
  stopwatchIcon.id = 'lc_stopwatch_icon';
  var paddingVertical = ((parseInt(parent.style.height) - 24) / 2) + 'px';
  var iconStyles = {
    'opacity': '0.46',
    'position': 'relative',
    'padding': paddingVertical + ' 3px'
  };
  setStyle([timerIcon, stopwatchIcon], iconStyles);

  timerIcon.onclick = function() {
    if (modeSelector.getAttribute('mode') === 'timer') {
      elementTranslate(modeSelector, 0, -32);
      modeSelector.setAttribute('mode', 'stopwatch');
    }
  };
  stopwatchIcon.onclick = function() {
    if (modeSelector.getAttribute('mode') === 'stopwatch') {
      elementTranslate(modeSelector, 0, -32);
      modeSelector.setAttribute('mode', 'timer');
    }
  };

  appendChildren(modeSelector, [timerIcon, stopwatchIcon]);
  return modeSelector;
}

function createClockScreen() {
  var clockScreen = document.createElement('div');
  clockScreen.id = 'lc_clock_screen';
  var clockScreenStyles = {
    'height': '100%',
    'padding': '0px 6px',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center'
  };
  setStyle(clockScreen, clockScreenStyles);

  var segHours = document.createElement('span');
  var segMinutes = document.createElement('span');
  var segSeconds = document.createElement('span');
  var segDelim1 = document.createElement('span');
  var segDelim2 = document.createElement('span');
  var diff_time = {'easy': [0, 15, 0], 'medium': [0, 30, 0], 'hard': [0, 45, 0]};
  var diff = document.querySelector('div[diff]').getAttribute('diff');
  segHours.id = 'lc_clock_segment_hr';
  segMinutes.id = 'lc_clock_segment_min';
  segSeconds.id = 'lc_clock_segment_sec';
  segHours.innerText = diff_time[diff][0].toString().padStart(2, '0');
  segMinutes.innerText = diff_time[diff][1].toString().padStart(2, '0');
  segSeconds.innerText = diff_time[diff][2].toString().padStart(2, '0');
  TIME = diff_time[diff][0] * 3600 + diff_time[diff][1] * 60 + diff_time[diff][2];
  segDelim1.innerText = ':';
  segDelim2.innerText = ':';

  var segmentStyles = {
    'fontSize': '16px',
    'padding': '0 1px',
    'opacity': '1.0',
    'transition': 'all 150ms'
  };
  setStyle([segHours, segMinutes, segSeconds, segDelim1, segDelim2], segmentStyles);

  var segmentOnHover = function() {
    this.style.opacity = 0.46;
    this.style.filter = 'drop-shadow(0 0 1px rgba(0, 0, 0, 0.4))';
  }
  var segmentOnOut = function() {
    this.style.opacity = 1.0;
    this.style.filter = '';
  }
  var segmentOnScroll = function(e) {
    var dlt = e.deltaY < 0 ? 1 : -1;
    var t = {'lc_clock_segment_hr': 3600, 'lc_clock_segment_min': 60, 'lc_clock_segment_sec': 1};
    var newTime = TIME + dlt * t[this.getAttribute('id')];
    if (newTime >= 0 && newTime <= 359999) {
      TIME = newTime;
      var hr = Math.floor(TIME / 3600);
      var min = Math.floor((TIME - (3600 * hr)) / 60);
      var sec = TIME % 60;
      document.getElementById('lc_clock_segment_hr').innerText = hr.toString().padStart(2, '0');
      document.getElementById('lc_clock_segment_min').innerText = min.toString().padStart(2, '0');
      document.getElementById('lc_clock_segment_sec').innerText = sec.toString().padStart(2, '0');
    }
  }

  segHours.onmouseover = segmentOnHover;
  segHours.onmouseout = segmentOnOut;
  segHours.onmousewheel = segmentOnScroll;
  segMinutes.onmouseover = segmentOnHover;
  segMinutes.onmouseout = segmentOnOut;
  segMinutes.onmousewheel = segmentOnScroll;
  segSeconds.onmouseover = segmentOnHover;
  segSeconds.onmouseout = segmentOnOut;
  segSeconds.onmousewheel = segmentOnScroll;

  appendChildren(clockScreen, [segHours, segDelim1, segMinutes, segDelim2, segSeconds]);
  return clockScreen;
}

function createControlPanel() {
  var controlPanel = document.createElement('div');
  controlPanel.id = 'lc_control_panel';

  var controlPanelStyles = {
    'height': '100%',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'flex-start',
    'padding': '0px 6px'
  };
  setStyle(controlPanel, controlPanelStyles);

  var startButton = document.createElement('button');
  var pauseButton = document.createElement('button');
  var resetButton = document.createElement('button');
  startButton.id = 'lc_control_start';
  pauseButton.id = 'lc_control_pause';
  resetButton.id = 'lc_control_reset';

  var buttonStyles = {
    'height': '100%',
    'border': '0',
    'margin': '0',
    'padding': '0px 4px',
    'backgroundColor': 'rgba(0, 0, 0, 0)',
    'opacity': '0.46',
    'outline': 'none',
    'transition': 'all 150ms'
  };
  setStyle([startButton, pauseButton, resetButton], buttonStyles);

  var startImg = document.createElement('img');
  var pauseImg = document.createElement('img');
  var resetImg = document.createElement('img');
  startImg.src = chrome.runtime.getURL('assets/start.png');
  pauseImg.src = chrome.runtime.getURL('assets/pause.png');
  resetImg.src = chrome.runtime.getURL('assets/reset.png');
  var imgStyles = {
    'padding': '8px 0'
  }
  setStyle([startImg, pauseImg, resetImg], imgStyles);

  startButton.appendChild(startImg);
  pauseButton.appendChild(pauseImg);
  resetButton.appendChild(resetImg);

  var tick = function() {
    var dlt = document.getElementById('lc_mode_selector').getAttribute('mode') === 'timer' ? -1 : 1;
    if ((TIME === 0 && dlt === -1) || (TIME === 359999 && dlt === 1)) {
      clearInterval(TIMEHANDLE);
      TIMEHANDLE = undefined;
      return;
    }
    TIME += dlt;
    var hr = Math.floor(TIME / 3600);
    var min = Math.floor((TIME - (3600 * hr)) / 60);
    var sec = TIME % 60;
    document.getElementById('lc_clock_segment_hr').innerText = hr.toString().padStart(2, '0');
    document.getElementById('lc_clock_segment_min').innerText = min.toString().padStart(2, '0');
    document.getElementById('lc_clock_segment_sec').innerText = sec.toString().padStart(2, '0');
  }
  var clear = function() {
    document.getElementById('lc_clock_segment_hr').innerText = '00';
    document.getElementById('lc_clock_segment_min').innerText = '00';
    document.getElementById('lc_clock_segment_sec').innerText = '00';
  }

  var buttonOnHover = function() {
    this.style.opacity = 0.72;
    this.style.filter = 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.23))';
  }
  var buttonOnOut = function() {
    this.style.opacity = 0.46;
    this.style.filter = '';
  }

  startButton.onmouseover = buttonOnHover;
  startButton.onmouseout = buttonOnOut;
  startButton.onclick = function() {
    var hr = document.getElementById('lc_clock_segment_hr').innerText;
    var min = document.getElementById('lc_clock_segment_min').innerText;
    var sec = document.getElementById('lc_clock_segment_sec').innerText;
    TIME = parseInt(hr) * 3600 + parseInt(min) * 60 + parseInt(sec);
    if (TIMEHANDLE === undefined)
      TIMEHANDLE = window.setInterval(tick, 1000);
  }
  pauseButton.onmouseover = buttonOnHover;
  pauseButton.onmouseout = buttonOnOut;
  pauseButton.onclick = function() {
    clearInterval(TIMEHANDLE);
    TIMEHANDLE = undefined;
  }

  resetButton.onmouseover = buttonOnHover;
  resetButton.onmouseout = buttonOnOut;
  resetButton.onclick = function() {
    TIME = 0;
    clearInterval(TIMEHANDLE);
    TIMEHANDLE = undefined;
    clear();
  }

  appendChildren(controlPanel, [startButton, pauseButton, resetButton]);
  return controlPanel;
}
