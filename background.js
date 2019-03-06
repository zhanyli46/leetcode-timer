chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({
    easy: {hr: '00', min: '15', sec: '00'},
    medium: {hr: '00', min: '30', sec: '00'},
    hard: {hr: '00', min: '45', sec: '00'}
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
