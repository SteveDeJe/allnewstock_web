console.log("Start Header Script!");

function mNavMenu(){
  //모바일
  $(".m-navbar").show();
  $(".t-navbar").hide();
}

function tNavMenu(){
  //테블릿 메뉴
  $(".t-navbar").show();
  $(".m-navbar").hide();
}

function pcNavMenu(){
  //테블릿 모바일 메뉴 제거
  $(".m-navbar").hide();
  $(".t-navbar").hide();
}

function headMenu() {
  let screenWidth = $(window).width();
  //모바일
  if (screenWidth < 768) {
    mNavMenu();
  //테블릿
  } else if (screenWidth >= 768 && screenWidth < 1200) {
    tNavMenu();
  //PC
  } else {
    pcNavMenu();
  }
}

$(document).ready(function (){
  headMenu();
  $(window).resize(function () {
    headMenu();
  });

  $(".nav-item.dropdown .nav-link").click(function(e) {
    e.preventDefault(); // 기본 링크 동작 방지
    $(this).siblings(".submenu").slideToggle();
});

  // 페이지 외부 클릭 시 하위 메뉴 닫기
  $(document).click(function(event) {
    if (!$(event.target).closest('.nav-item.dropdown').length) {
        $('.submenu').slideUp();
    }
});
});

// 250722 > 추가
function scrollToSection(selector, event) {
  if (event) event.preventDefault();

  // 메인 페이지가 아니면 메인 페이지로 이동 (해시 사용)
  const isMain =
    location.pathname === '/' ||
    location.pathname.endsWith('/index.html');
  if (!isMain) {
    // selector가 .stock-loan이면 #stock-loan으로 변환
    const hash = selector.startsWith('.') ? '#' + selector.slice(1) : selector;
    location.href = '/index.html' + hash;
    return;
  }

  // 모바일 및 태블릿 환경에서 오프캔버스 메뉴 닫기
  if (window.innerWidth <= 1199) {
    const offcanvas = document.querySelector('.offcanvas');
    if (offcanvas && typeof bootstrap !== 'undefined') {
      const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvas);
      bsOffcanvas.hide();
      // 오프캔버스 닫힌 후 스크롤 (약간의 지연)
      setTimeout(function() {
        const el = document.querySelector(selector);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 350);
      return;
    }
  }
  // PC에서는 바로 스크롤
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// 메인 페이지에서 해시로 진입 시 자동 스크롤
document.addEventListener('DOMContentLoaded', function() {
  if (location.hash) {
    const el = document.querySelector(location.hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
});