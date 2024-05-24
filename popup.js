// popup.js
document.getElementById('addText').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: addTextToPage
      });
    });
  });
  
  function addTextToPage() {
    document.body.innerHTML += '<p>Added text by Chrome extension!</p>';
  }
  