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

// 캐러셀 공용 초기화 — 페이지에 있는 .carousel 요소를 전부 찾아 각각 동작시킵니다.
// (병원소개 사진 캐러셀, 홈 히어로 배너 등 여러 개를 같은 코드로 지원)
document.querySelectorAll('.carousel').forEach(function (root) {
  var track = root.querySelector('.carousel-track');
  var slides = Array.prototype.slice.call(root.querySelectorAll('.carousel-slide'));
  var dotsWrap = root.querySelector('.carousel-dots');
  var arrows = root.querySelector('.carousel-arrows');
  var prevBtn = root.querySelector('.carousel-arrow.prev');
  var nextBtn = root.querySelector('.carousel-arrow.next');
  var index = 0;

  if (slides.length <= 1) {
    // 사진이 한 장뿐이면 화살표·도트를 숨겨서 불필요한 조작 요소를 없앰
    if (dotsWrap) dotsWrap.style.display = 'none';
    if (arrows) arrows.style.display = 'none';
    return;
  }

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
    index = (i + slides.length) % slides.length;
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
});

// 홈 공지 팝업 — "오늘 하루 보지 않기" 체크 시 자정까지 다시 뜨지 않음
try {
  (function () {
    var overlay = document.getElementById('popup-overlay');
    if (!overlay) return;

    function todayStr() {
      var d = new Date();
      return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    }

    var boxes = Array.prototype.slice.call(overlay.querySelectorAll('.popup-box'));

    function closeBox(box) {
      box.remove();
      if (!overlay.querySelector('.popup-box')) overlay.style.display = 'none';
    }

    boxes.forEach(function (box) {
      var key = 'popup-hidden-' + box.getAttribute('data-popup-id');
      if (localStorage.getItem(key) === todayStr()) {
        box.remove();
        return;
      }
      box.querySelector('.popup-close').addEventListener('click', function () {
        closeBox(box);
      });
      box.querySelector('.popup-hide-today input').addEventListener('change', function (e) {
        if (e.target.checked) {
          localStorage.setItem(key, todayStr());
          closeBox(box);
        }
      });
    });

    // 보여줄 팝업 박스가 하나라도 남아있다면 오버레이를 켬
    if (overlay.querySelector('.popup-box')) {
      overlay.style.display = 'flex';
    }
  })();
} catch (e) {
  // localStorage 접근 제한 환경 대비
}

// 텍스트 복사/우클릭 방지 (효과는 제한적이며, 개발자도구로는 우회 가능함을 참고)
document.addEventListener('copy', function (e) { e.preventDefault(); });
document.addEventListener('cut', function (e) { e.preventDefault(); });
document.addEventListener('contextmenu', function (e) { e.preventDefault(); });