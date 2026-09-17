// FAQ 검색 필터 — 이 사이트에서 JS가 필요한 유일한 기능입니다.
// 아코디언(FAQ, 클러스터)과 모바일 메뉴는 <details>/<summary>와 체크박스 해크로
// 순수 HTML/CSS만으로 동작하며, 이 스크립트가 로드되지 않아도 사이트는 정상 작동합니다.
(function () {
  var input = document.getElementById('faq-search-input');
  if (!input) return; // FAQ 페이지가 아니면 아무것도 하지 않음

  var items = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));

  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();

    items.forEach(function (item) {
      var text = item.textContent.toLowerCase();
      var match = q === '' || text.indexOf(q) !== -1;
      item.style.display = match ? '' : 'none';
      if (q !== '' && match) {
        item.setAttribute('open', ''); // 검색어와 일치하면 답변까지 펼쳐서 보여줌
        var cluster = item.closest('.faq-cluster');
        if (cluster) cluster.setAttribute('open', '');
      }
      if (q === '') {
        item.removeAttribute('open');
      }
    });

    // 검색어가 있는데 클러스터 안에 보이는 항목이 하나도 없으면 클러스터 자체를 숨김
    document.querySelectorAll('.faq-cluster').forEach(function (cluster) {
      if (q === '') {
        cluster.style.display = '';
        return;
      }
      var visible = Array.prototype.slice.call(cluster.querySelectorAll('.faq-item'))
        .some(function (i) { return i.style.display !== 'none'; });
      cluster.style.display = visible ? '' : 'none';
    });
  });

  var form = input.closest('form');
  if (form) {
    form.addEventListener('submit', function (e) { e.preventDefault(); });
  }
})();

// 병원 둘러보기 캐러셀 — 사진 개수가 바뀌어도 도트 개수가 자동으로 맞춰집니다.
(function () {
  var root = document.getElementById('about-carousel');
  if (!root) return; // about.html이 아니면 아무것도 하지 않음

  var track = root.querySelector('.carousel-track');
  var slides = Array.prototype.slice.call(root.querySelectorAll('.carousel-slide'));
  var dotsWrap = root.querySelector('.carousel-dots');
  var prevBtn = root.querySelector('.carousel-arrow.prev');
  var nextBtn = root.querySelector('.carousel-arrow.next');
  var index = 0;

  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', (i + 1) + '번째 사진 보기');
    dot.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function render() {
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
  }
  function goTo(i) {
    index = (i + slides.length) % slides.length; // 양쪽 끝에서 순환
    render();
  }

  prevBtn.addEventListener('click', function () { goTo(index - 1); });
  nextBtn.addEventListener('click', function () { goTo(index + 1); });

  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  render();
})();
