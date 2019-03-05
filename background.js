chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({
    easy: {hr: 0, min: 15, sec: 0},
    medium: {hr: 0, min: 30, sec: 0},
    hard: {hr: 0, min: 45, sec: 0}
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'leetcode.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
