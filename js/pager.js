/* Tablets & phones: swipe up at the bottom of a page to move to the next page.
   Computers keep using the menu / quick links. */
(function () {
  var pages = [
    { file: 'index.html', name: 'About' },
    { file: 'about.html', name: 'Services' },
    { file: 'services.html', name: 'Training' },
    { file: 'training.html', name: 'Contact' }
  ];
  var next = null;
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (here === '' || here.indexOf('.') === -1) here = 'index.html';
  for (var i = 0; i < pages.length; i++) {
    if (pages[i].file === here) { next = { file: pages[i + 1] ? pages[i + 1].file : 'contact.html', name: pages[i].name }; break; }
  }
  if (!next) return;

  var mq = window.matchMedia('(max-width: 1100px)');
  var bottom = document.querySelector('.footer-bottom');
  if (bottom) {
    var a = document.createElement('a');
    a.className = 'next-hint';
    a.href = next.file;
    a.innerHTML = 'Swipe up or tap for next page: <strong>' + next.name + '</strong> <i class="fas fa-arrow-right"></i>';
    bottom.insertBefore(a, bottom.firstChild);
  }

  function atBottom() {
    return window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 3;
  }

  var sx = 0, sy = 0, armed = false, going = false;
  document.addEventListener('touchstart', function (e) {
    if (!mq.matches || going) return;
    armed = atBottom();
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    if (!armed || going || !mq.matches) return;
    armed = false;
    var dx = e.changedTouches[0].clientX - sx;
    var dy = e.changedTouches[0].clientY - sy;
    if (dy < -90 && Math.abs(dy) > Math.abs(dx) * 1.5) {
      going = true;
      document.body.style.transition = 'opacity .25s ease, transform .25s ease';
      document.body.style.opacity = '0';
      document.body.style.transform = 'translateY(-16px)';
      setTimeout(function () { location.href = next.file; }, 220);
    }
  }, { passive: true });

  /* Coming back with the browser's back button: show the page again */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { going = false; document.body.style.opacity = ''; document.body.style.transform = ''; }
  });
})();
