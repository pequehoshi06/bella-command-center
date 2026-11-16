
/* =================================
   B.E.L.L.A. — VOICE SYSTEM
   Version 1.0
   ================================= */

window.BELLA_VOICE = {

  recognition: null,
  listening: false,

  // SISTEMA PARA HABLAR
  speak: function(message) {

    if (!("speechSynthesis" in window)) {
      alert("Tu navegador no admite voz.");
      return;
    }

    window.speechSynthesis.cancel();

    const voice = new SpeechSynthesisUtterance(message);

    voice.lang = "es-CL";
    voice.rate = 1;
    voice.pitch = 1.05;
    voice.volume = 1;

    const voices = window.speechSynthesis.getVoices();

    const spanishVoice = voices.find(v =>
      v.lang === "es-CL"
    ) || voices.find(v =>
      v.lang.startsWith("es")
    );

    if (spanishVoice) {
      voice.voice = spanishVoice;
    }

    window.speechSynthesis.speak(voice);
  },

  // SISTEMA PARA ESCUCHAR
  listen: function(callback) {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("El reconocimiento de voz no está disponible en este navegador.");
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
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.listening = true;
      console.log("B.E.L.L.A. está escuchando.");
    };

    this.recognition.onresult = (event) => {
      const message =
        event.results[0][0].transcript;

      console.log("Has dicho:", message);

      if (typeof callback === "function") {
        callback(message);
      }
    };

    this.recognition.onerror = (event) => {
      console.error("Error de voz:", event.error);
    };

    this.recognition.onend = () => {
      this.listening = false;
      console.log("Escucha finalizada.");
    };

    this.recognition.start();
  },

  // DETENER ESCUCHA
  stop: function() {

    if (this.recognition) {
      this.recognition.stop();
    }

    this.listening = false;
  },

  // DETENER VOZ
  silence: function() {
    window.speechSynthesis.cancel();
  }

};

console.log("B.E.L.L.A. Voice System inicializado.");
