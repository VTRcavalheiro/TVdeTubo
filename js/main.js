document.addEventListener('DOMContentLoaded', () => {

  // --- Chat privado ---
  const chatButton = document.querySelector('button[aria-label="Chat privado"]');
  const privateChat = document.querySelector('.private-chat-window');
  const closeBtn = privateChat.querySelector('.chat-close');
  const minimizeBtn = privateChat.querySelector('.chat-minimize');

  if (chatButton && privateChat && closeBtn && minimizeBtn) {
    chatButton.addEventListener('click', (e) => {
      e.stopPropagation();
      privateChat.classList.remove('hidden');
      privateChat.classList.remove('minimized');
    });

    closeBtn.addEventListener('click', () => {
      privateChat.classList.add('hidden');
    });

    minimizeBtn.addEventListener('click', () => {
      privateChat.classList.toggle('minimized');
    });

    // Fecha se clicar fora (exceto no botão)
    document.addEventListener('click', (e) => {
      if (!privateChat.contains(e.target) && !chatButton.contains(e.target)) {
        privateChat.classList.add('hidden');
      }
    });
  }

  // --- Menu avatar e idioma ---
  const avatarBtn = document.querySelector('.avatar-button');
  const dropdown = document.querySelector('.dropdown');
  const langToggle = document.getElementById('language-toggle');
  const langList = document.getElementById('language-list');
  const selectedLang = document.getElementById('selected-language');

  avatarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
    langList.classList.remove('open');
  });

  langToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    langList.classList.toggle('open');
  });

  langList.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
      selectedLang.textContent = item.dataset.lang;
      langList.classList.remove('open');
    });
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('active');
    langList.classList.remove('open');
  });

  // --- Carrossel infinito com drag ---
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prevButton = document.querySelector('.carousel-btn.prev');
  const nextButton = document.querySelector('.carousel-btn.next');

  const slideWidth = slides[0].offsetWidth + 20; // largura + margin
  let currentIndex = 0;

  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID;

  function updateCarousel() {
    if (currentIndex < 0) currentIndex = slides.length - 1;
    if (currentIndex >= slides.length) currentIndex = 0;

    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });

    const moveX = -currentIndex * slideWidth;
    currentTranslate = moveX;
    prevTranslate = moveX;
    setPosition();
  }

  function setPosition() {
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  prevButton.addEventListener('click', () => {
    currentIndex--;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    currentIndex++;
    updateCarousel();
  });

  function dragStart(event) {
    isDragging = true;
    startX = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    track.classList.add('grabbing');
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100) currentIndex++;
    else if (movedBy > 100) currentIndex--;

    updateCarousel();
    track.classList.remove('grabbing');
  }

  function dragMove(event) {
    if (!isDragging) return;
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startX;
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function animation() {
    setPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  track.addEventListener('mousedown', dragStart);
  track.addEventListener('touchstart', dragStart);
  track.addEventListener('mouseup', dragEnd);
  track.addEventListener('mouseleave', dragEnd);
  track.addEventListener('touchend', dragEnd);
  track.addEventListener('mousemove', dragMove);
  track.addEventListener('touchmove', dragMove);

  updateCarousel();

  // --- Colapsar/Expandir o menu lateral ---
  const collapseBtn = document.querySelector('.collapse-toggle');
  const sideMenu = document.querySelector('.side-menu');

  if (collapseBtn && sideMenu) {
    collapseBtn.addEventListener('click', () => {
      sideMenu.classList.toggle('collapsed');
      collapseBtn.textContent = sideMenu.classList.contains('collapsed') ? '⮞' : '⮜';
    });
  }
});