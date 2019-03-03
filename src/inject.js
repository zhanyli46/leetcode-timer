var CONTAINER_CLASS = 'btns__1OeZ';
var TIME = 0;
var DELTA = 1;
var TIMEHANDLE = undefined;

window.addEventListener("load", function() {
  var callback = inject;
  waitUntilJSLoaded(callback);
}, false);

function waitUntilJSLoaded(callback) {
  var jsCheck = setInterval(jsCheckFinished, 200);
  var container = [];
  function jsCheckFinished() {
    container = document.getElementsByClassName(CONTAINER_CLASS);
    if (container.length != 0) {
        clearInterval (jsCheck);
        callback(container[0]);
    }
  }
}

function inject(container) {
  var clock = createClock(container);
  container.insertBefore(clock, container.firstChild);
};

function createClock(parent) {
  var clock = document.createElement('div');
  var clockStyles = {
    'height': parent.offsetHeight + 'px',
    'width': '100%',
    'display': 'flex',
    'justifyContent': 'center'
  };
  clock.id = 'lc_clock';
  setStyle(clock, clockStyles);
  var modeSelector = createModeSelector(clock);
  var clockScreen = createClockScreen(clock);
  var controlPanel = createControlPanel(clock);
  clock.appendChild(modeSelector);
  clock.appendChild(clockScreen);
  clock.appendChild(controlPanel);
  return clock;
}

function createModeSelector(parent) {
  var modeSelector = document.createElement('div');
  modeSelector.id = 'lc_mode_selector';
  modeSelectorStyle = {
    'height': '100%',
    'width': '42px',
    'padding': '0px 6px'
  };
  setStyle(modeSelector, modeSelectorStyle);

  var paddingVertical = ((parseInt(parent.style.height) - 24) / 2) + 'px';
  var iconStyles = {
    'opacity': '0.46',
    'position': 'relative',
    'padding': paddingVertical + ' 3px'
  };
  var stopwatchIcon = document.createElement('img');
  var timerIcon = document.createElement('img');

  stopwatchIcon.src = chrome.runtime.getURL('assets/stopwatch.png');
  stopwatchIcon.id = 'lc_stopwatch_icon';
  timerIcon.src = chrome.runtime.getURL('assets/timer.png');
  timerIcon.id = 'lc_timer_icon';

  stopwatchIcon.onclick = function() {
    if (modeSelector.getAttribute('mode') === 'stopwatch') {
      elementTranslate(modeSelector, 0, -32);
      modeSelector.setAttribute('mode', 'timer');
      DELTA = -1;
    }
  };
  timerIcon.onclick = function() {
    if (modeSelector.getAttribute('mode') === 'timer') {
      elementTranslate(modeSelector, -32, 0);
      modeSelector.setAttribute('mode', 'stopwatch');
    }
    DELTA = 1;
  };

  setStyle([timerIcon, stopwatchIcon], iconStyles);

  modeSelector.setAttribute('mode', 'stopwatch');
  modeSelector.appendChild(stopwatchIcon);
  modeSelector.appendChild(timerIcon);
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

  var segmentOnHover = function() {
    // todo
  }

  var segHours = document.createElement('span');
  segHours.id = 'lc_clock_segment_hr';
  var segMinutes = document.createElement('span');
  segMinutes.id = 'lc_clock_segment_min';
  var segSeconds = document.createElement('span');
  segSeconds.id = 'lc_clock_segment_sec';
  var segDelim1 = document.createElement('span');
  var segDelim2 = document.createElement('span');
  var segmentStyles = {
    'fontSize': '16px',
    'padding': '0 1px'
  };
  setStyle([segHours, segMinutes, segSeconds, segDelim1, segDelim2], segmentStyles);
  segHours.innerText = '00';
  segMinutes.innerText = '00';
  segSeconds.innerText = '00';
  segDelim1.innerText = ':';
  segDelim2.innerText = ':';

  segHours.onmouseover = segmentOnHover;
  segMinutes.onmouseover = segmentOnHover;
  segSeconds.onmouseover = segmentOnHover;

  clockScreen.appendChild(segHours);
  clockScreen.appendChild(segDelim1);
  clockScreen.appendChild(segMinutes);
  clockScreen.appendChild(segDelim2);
  clockScreen.appendChild(segSeconds);
  return clockScreen;
}

function createControlPanel() {
  var controlPanel = document.createElement('div');
  controlPanel.id = 'lc_control_panel';
  var tick = function() {
    if ((TIME === 0 && DELTA === -1) || (TIME === 359999 && DELTA === 1)) {
      clearInterval(TIMEHANDLE);
      TIMEHANDLE = undefined;
      return;
    }
    TIME += DELTA;
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

  var controlPanelStyles = {
    'height': '100%',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'flex-start',
    'padding': '0px 6px'
  };
  setStyle(controlPanel, controlPanelStyles);

  var startButton = document.createElement('button');
  startButton.id = 'lc_control_start';
  var startImg = document.createElement('img');
  startImg.src = chrome.runtime.getURL('assets/start.png');
  startButton.appendChild(startImg);
  var pauseButton = document.createElement('button');
  pauseButton.id = 'lc_control_pause';
  var pauseImg = document.createElement('img');
  pauseImg.src = chrome.runtime.getURL('assets/pause.png');
  pauseButton.appendChild(pauseImg);
  var resetButton = document.createElement('button');
  resetButton.id = 'lc_control_reset';
  var resetImg = document.createElement('img');
  resetImg.src = chrome.runtime.getURL('assets/reset.png');
  resetButton.appendChild(resetImg);

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
    DELTA = 0;
    clearInterval(TIMEHANDLE);
    TIMEHANDLE = undefined;
    clear();
  }

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
  var imgStyles = {
    'padding': '8px 0'
  }
  setStyle([startImg, pauseImg, resetImg], imgStyles);
  setStyle([startButton, pauseButton, resetButton], buttonStyles);

  controlPanel.appendChild(startButton);
  controlPanel.appendChild(pauseButton);
  controlPanel.appendChild(resetButton);
  return controlPanel;
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
