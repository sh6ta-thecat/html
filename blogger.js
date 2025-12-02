 // Variables globales
    let speechSynthesis = window.speechSynthesis;
    let currentUtterance = null;
    let isPlaying = false;
    let speechRate = 1.0;
    let selectedVoice = null;
    
    // Inicializar sistema de texto a voz
    function initSpeechSystem() {
      if (!('speechSynthesis' in window)) {
        console.warn('Web Speech API no está disponible en este navegador');
        return;
      }
      
      // Cargar voces disponibles
      const loadVoicesInterval = setInterval(() => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          clearInterval(loadVoicesInterval);
          
          const voiceSelect = document.getElementById('voiceSelect');
          if (voiceSelect) {
            voiceSelect.innerHTML = '<option value="">Voz predeterminada</option>';
            
            voices.forEach((voice, index) => {
              const option = document.createElement('option');
              option.value = index;
              option.textContent = `${voice.name} (${voice.lang})`;
              voiceSelect.appendChild(option);
              
              // Seleccionar voz en español por defecto
              if (voice.lang.startsWith('es-') && !selectedVoice) {
                selectedVoice = voice;
                option.selected = true;
              }
            });
            
            if (!selectedVoice && voices.length > 0) {
              selectedVoice = voices[0];
            }
          }
        }
      }, 100);
      
      // Event listeners para controles de voz
      const playBtn = document.getElementById('playBtn');
      const pauseBtn = document.getElementById('pauseBtn');
      const stopBtn = document.getElementById('stopBtn');
      const closeBtn = document.getElementById('closeListen');
      const startBtn = document.getElementById('startListeningBtn');
      
      if (playBtn) playBtn.addEventListener('click', resumeSpeech);
      if (pauseBtn) pauseBtn.addEventListener('click', pauseSpeech);
      if (stopBtn) stopBtn.addEventListener('click', stopSpeech);
      if (closeBtn) closeBtn.addEventListener('click', closeWidget);
      if (startBtn) startBtn.addEventListener('click', toggleMainListen);
      
      // Controles de velocidad
      const slowerBtn = document.getElementById('slowerBtn');
      const fasterBtn = document.getElementById('fasterBtn');
      
      if (slowerBtn) slowerBtn.addEventListener('click', () => changeSpeechRate(-0.1));
      if (fasterBtn) fasterBtn.addEventListener('click', () => changeSpeechRate(0.1));
      
      // Selector de voz
      const voiceSelect = document.getElementById('voiceSelect');
      if (voiceSelect) {
        voiceSelect.addEventListener('change', function() {
          const voices = speechSynthesis.getVoices();
          const selectedIndex = parseInt(this.value);
          selectedVoice = isNaN(selectedIndex) ? null : voices[selectedIndex];
        });
      }
    }
    
    // Función para iniciar escucha de un artículo
    function startListening(articleId) {
      const widget = document.getElementById('listenWidget');
      const currentArticle = document.getElementById('currentArticle');
      const articleTitle = document.querySelector('.article-title') || document.querySelector('h1');
      
      if (widget && currentArticle) {
        widget.style.display = 'flex';
        currentArticle.textContent = `Escuchando: ${articleTitle ? articleTitle.textContent.substring(0, 40) : 'Artículo'}...`;
        
        // Iniciar síntesis de voz
        if (speechSynthesis && articleTitle) {
          speakText(articleTitle.textContent);
        }
      }
    }
    
    // Función para hablar texto
    function speakText(text) {
      if (!speechSynthesis) return;
      
      stopSpeech(); // Detener cualquier reproducción anterior
      
      currentUtterance = new SpeechSynthesisUtterance(text);
      currentUtterance.rate = speechRate;
      currentUtterance.voice = selectedVoice;
      currentUtterance.lang = 'es-ES';
      
      currentUtterance.onstart = function() {
        isPlaying = true;
        updatePlayPauseButtons();
      };
      
      currentUtterance.onend = function() {
        isPlaying = false;
        updatePlayPauseButtons();
      };
      
      speechSynthesis.speak(currentUtterance);
    }
    
    // Funciones de control de reproducción
    function resumeSpeech() {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
        isPlaying = true;
        updatePlayPauseButtons();
      }
    }
    
    function pauseSpeech() {
      if (speechSynthesis.speaking) {
        speechSynthesis.pause();
        isPlaying = false;
        updatePlayPauseButtons();
      }
    }
    
    function stopSpeech() {
      if (speechSynthesis.speaking || speechSynthesis.paused) {
        speechSynthesis.cancel();
        isPlaying = false;
        updatePlayPauseButtons();
      }
    }
    
    function toggleMainListen() {
      const startBtn = document.getElementById('startListeningBtn');
      if (isPlaying) {
        pauseSpeech();
        startBtn.classList.remove('playing');
      } else {
        startListening('current');
        startBtn.classList.add('playing');
      }
    }
    
    function closeWidget() {
      const widget = document.getElementById('listenWidget');
      stopSpeech();
      if (widget) widget.style.display = 'none';
      
      const startBtn = document.getElementById('startListeningBtn');
      if (startBtn) startBtn.classList.remove('playing');
    }
    
    function changeSpeechRate(delta) {
      speechRate = Math.max(0.5, Math.min(2.0, speechRate + delta));
      
      const currentRateEl = document.getElementById('currentRate');
      if (currentRateEl) {
        currentRateEl.textContent = speechRate.toFixed(1) + 'x';
      }
      
      if (currentUtterance) {
        currentUtterance.rate = speechRate;
      }
    }
    
    function updatePlayPauseButtons() {
      const playBtn = document.getElementById('playBtn');
      const pauseBtn = document.getElementById('pauseBtn');
      
      if (playBtn && pauseBtn) {
        playBtn.style.display = isPlaying ? 'none' : 'flex';
        pauseBtn.style.display = isPlaying ? 'flex' : 'none';
      }
    }
    
    // Inicializar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
      initSpeechSystem();
      
      // Navegación suave para enlaces internos
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href !== '#') {
            const targetElement = document.querySelector(href);
            if (targetElement) {
              e.preventDefault();
              window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
              });
            }
          }
        });
      });
      
      // Ajustar posición del widget al hacer scroll
      const listenWidget = document.getElementById('listenWidget');
      if (listenWidget) {
        window.addEventListener('scroll', function() {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollTop > 100) {
            listenWidget.classList.add('scrolled');
          } else {
            listenWidget.classList.remove('scrolled');
          }
        });
      }
      
      // Sistema de filtros de categoría
      document.querySelectorAll('.category-filter').forEach(filter => {
        filter.addEventListener('click', function(e) {
          e.preventDefault();
          document.querySelectorAll('.category-filter').forEach(f => {
            f.classList.remove('active');
          });
          this.classList.add('active');
        });
      });
    });
