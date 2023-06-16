var voices = [];
var voiceDropdown = document.getElementById('voices');

// Populate the voice selection dropdown
window.speechSynthesis.onvoiceschanged = function() {
  voices = window.speechSynthesis.getVoices();
  voices.forEach(function(voice, index) {
    var option = document.createElement('option');
    option.value = index;
    option.textContent = voice.name;
    voiceDropdown.appendChild(option);
  });
}

document.getElementById('read').addEventListener('click', function() {
  var rate = document.getElementById('rate').value;
  var selectedVoiceIndex = voiceDropdown.value;

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code: `
        var fullText = document.querySelector("#th-unit-content > div > article").innerText;
        var selection = window.getSelection();
        var textToRead;

        if (selection.rangeCount > 0) {
          var selectedText = selection.toString();
          var startIndex = fullText.indexOf(selectedText);
          if (startIndex !== -1) {
            textToRead = fullText.slice(startIndex);
          }
        } else {
          textToRead = fullText;
        }

        textToRead;
      `
    }, function(result) {
      if (result[0]) {
        chrome.runtime.sendMessage({message: "start_reading", text: result[0], rate: rate, voiceIndex: selectedVoiceIndex}, function(response) {});
      }
    });
  });
});

document.getElementById('pause').addEventListener('click', function() {
  chrome.runtime.sendMessage({message: "toggle_pause"}, function(response) {});
});

document.getElementById('rate').addEventListener('input', function() {
  document.getElementById('rate-value').textContent = this.value;
});
