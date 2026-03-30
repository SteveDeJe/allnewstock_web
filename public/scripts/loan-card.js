// 말풍선 위치 조정 기능
function adjustBubblePosition() {
  document.querySelectorAll('.ex-mark .bubble').forEach(function(bubble) {
    // 기본 위치
    bubble.style.left = 'calc(100% - 27px)';
    bubble.style.right = 'auto';
    bubble.style.transform = 'none';

    const rect = bubble.getBoundingClientRect();
    const padding = 8;

    // 브라우저 가로 크기 767px 이하에서는 우측에 고정
    if (window.innerWidth <= 767) {
      bubble.style.left = 'auto';
      bubble.style.right = '0';
      return;
    }

    // 브라우저 우측에 닿으면 좌측으로 이동
    if (rect.right > window.innerWidth - padding) {
      bubble.style.left = 'auto';
      bubble.style.right = '0';
    }
  });
}
window.addEventListener('resize', adjustBubblePosition);
window.addEventListener('DOMContentLoaded', adjustBubblePosition);

// 카드 플립 기능을 모바일에서도 작동하도록 구현
document.querySelectorAll('.card-inner-flip-up').forEach(function(card) {
  const cardFront = card.querySelector('.card-front');
  const cardBack = card.querySelector('.card-back');

  // 카드 앞면 클릭 시 뒷면으로 (한 개만 뒤집힘)
  cardFront.addEventListener('click', function(e) {
    document.querySelectorAll('.card-inner-flip-up.flipped').forEach(function(otherCard) {
      if (otherCard !== card) otherCard.classList.remove('flipped');
    });
    card.classList.add('flipped');
    e.stopPropagation();
  });

  // 카드 뒷면 클릭 시 앞면으로 복귀
  cardBack.addEventListener('click', function(e) {
    card.classList.remove('flipped');
    e.stopPropagation();
  });
  // cardBack.addEventListener('touchstart', function(e) {
  //   card.classList.remove('flipped');
  //   e.stopPropagation();
  // });

  // 카드 외 영역 클릭 시 복귀
  document.addEventListener('click', function(e) {
    if (card.classList.contains('flipped') && !card.contains(e.target)) {
      card.classList.remove('flipped');
    }
  });
});