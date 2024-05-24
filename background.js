// // background.js

// // Listen for when the extension icon is clicked
// chrome.action.onClicked.addListener((tab) => {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       function: addTextToPage
//     });
//   });
  
//   // Function to add text to the page
//   function addTextToPage() {
//     document.body.innerHTML += '<p>Added text by Chrome extension!</p>';
//   }
  
//   // Listen for messages from other parts of the extension
//   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.message === 'sayHello') {
//       console.log('Hello from background script!');
//       sendResponse({ response: 'Hello from background script!' });
//     }
//   });
  