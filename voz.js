
/* =================================
   B.E.L.L.A. — VOICE SYSTEM
   Version 2.0
   ================================= */

window.BELLA_VOICE = {

  recognition: null,
  listening: false,
  selectedVoice: localStorage.getItem("bellaVoice") || "",
  rate: Number(localStorage.getItem("bellaRate")) || 1,
  pitch: Number(localStorage.getItem("bellaPitch")) || 1.05,

  getVoices: function() {
    return window.speechSynthesis.getVoices();
  },

  setVoice: function(name) {
    this.selectedVoice = name;
    localStorage.setItem("bellaVoice", name);
  },

  setRate: function(value) {
    this.rate = Number(value);
    localStorage.setItem("bellaRate", this.rate);
  },

  setPitch: function(value) {
    this.pitch = Number(value);
    localStorage.setItem("bellaPitch", this.pitch);
  },

  speak: function(message) {

    if (!("speechSynthesis" in window)) {
      alert("Tu navegador no admite voz.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "es-CL";
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = 1;

    const voices = this.getVoices();

    const selected = voices.find(
      v => v.name === this.selectedVoice
    );

    const spanish = voices.find(
      v => v.lang === "es-CL"
    ) || voices.find(
      v => v.lang.startsWith("es")
    );

    if (selected || spanish) {
      utterance.voice = selected || spanish;
    }

    window.speechSynthesis.speak(utterance);
  },

  listen: function(callback) {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("El reconocimiento de voz no está disponible.");
      return;
    }

    if (this.listening) {
      this.stop();
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = "es-CL";
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onstart = () => {
      this.listening = true;
    };

    this.recognition.onresult = (event) => {
      const message = event.results[0][0].transcript;

      if (typeof callback === "function") {
        callback(message);
      }
    };

    this.recognition.onerror = (event) => {
      console.error("Error de voz:", event.error);
    };

    this.recognition.onend = () => {
      this.listening = false;
    };

    this.recognition.start();
  },

  stop: function() {
    if (this.recognition) {
      this.recognition.stop();
    }
    this.listening = false;
  },

  silence: function() {
    window.speechSynthesis.cancel();
  }

};

console.log("B.E.L.L.A. Voice System 2.0 inicializado.");
