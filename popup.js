/* populate time setter */
loadDefaultTime();

/* bind event handlers */
var segments = document.getElementsByClassName('time_set');
for (var seg of segments) {
  seg.onmousewheel = segmentOnScroll;
}
document.getElementById('btn_accept').onclick = acceptOnClick;
document.getElementById('btn_cancel').onclick = cancelOnClick;

/* helper functions */
function loadDefaultTime() {
  chrome.storage.sync.get(['easy', 'medium', 'hard'], function(result) {
    var diff = ['easy', 'medium', 'hard'];
    var seg = ['hr', 'min', 'sec'];
    for (var d of diff) {
      for (var s of seg) {
        document.getElementById(`time_${d}_${s}`).innerText = result[d][s];
      }
    }
  });
}

/* event handlers */
function segmentOnScroll(e) {
  var dlt = e.deltaY < 0 ? 1 : -1;
  var lobound = 0;
  var hibound = this.id.includes('hr') ? 99 : 59;
  var cur = parseInt(this.innerText);
  var next = cur + dlt;
  if (next >= lobound && next <= hibound) {
    this.innerText = next.toString().padStart(2, '0');
  }
}

function acceptOnClick() {
  var diff = ['easy', 'medium', 'hard'];
  var seg = ['hr', 'min', 'sec'];
  var data = {};
  for (var d of diff) {
    data[d] = {};
    for (var s of seg) {
      data[d][s] = document.getElementById(`time_${d}_${s}`).innerText;
    }
  }
  chrome.storage.sync.set(data);
}

function cancelOnClick() {
  loadDefaultTime();
}
