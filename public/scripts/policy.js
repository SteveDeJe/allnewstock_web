$(document).ready(function () {
  //개정일 받아오기
  getContsDay('T0004');
  $(".rules-his").change(function() {
    let getSeldayt = getSelectedText();
    //날짜에맞는 약관 불러오기
    getConts('T0004', formatToCompactDate(getSeldayt));
  });
});