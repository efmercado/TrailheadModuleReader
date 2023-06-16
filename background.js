var voices = [];
var msg = null;
var paused = false;

window.speechSynthesis.onvoiceschanged = function() {
  voices = window.speechSynthesis.getVoices();
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "start_reading") {
    msg = new SpeechSynthesisUtterance();
    msg.text = request.text;
    msg.rate = request.rate;
    msg.voice = voices[request.voiceIndex];

    window.speechSynthesis.cancel();  // Stop any ongoing speech
    window.speechSynthesis.speak(msg);
    paused = false;
  } else if (request.message === "toggle_pause") {
    if (paused) {
      window.speechSynthesis.resume();
      paused = false;
    } else {
      window.speechSynthesis.pause();
      paused = true;
    }
  }
});

