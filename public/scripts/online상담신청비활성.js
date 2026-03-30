let check1 = 'N';//전체동의
let check2 = 'N';//필수 동의
let check3 = 'N';//마케팅 동의
let check4 = 'N';//3자 제공 동의

//아코디언 메뉴 접었다 펴기
function accordionMenu(){
  $(".que").click(function() {
    $(this).next(".anw").stop().slideToggle(300);
   $(this).toggleClass('on').siblings().removeClass('on');
   $(this).next(".anw").siblings(".anw").slideUp(300); // 1개씩 펼치기
  });
}

//체크박스 체크 박스 컨트롤
function allCheck() {
  // 1번 체크박스 변경 시
  $('#check1').change(function() {
      let isChecked = $(this).is(':checked');
      $('#check2, #check3, #check4').prop('checked', isChecked);
      check1 = isChecked ? 'Y' : 'N';
      check2 = isChecked ? 'Y' : 'N';
      check3 = isChecked ? 'Y' : 'N';
      check4 = isChecked ? 'Y' : 'N';
  });

  // 2, 3, 4번 체크박스 변경 시
  $('#check2, #check3, #check4').change(function() {
      let isChecked2 = $('#check2').is(':checked');
      let isChecked3 = $('#check3').is(':checked');
      let isChecked4 = $('#check4').is(':checked');

      let allChecked = isChecked2 && isChecked3 && isChecked4;

      $('#check1').prop('checked', allChecked);
      check1 = allChecked ? 'Y' : 'N';

      check2 = isChecked2 ? 'Y' : 'N';
      check3 = isChecked3 ? 'Y' : 'N';
      check4 = isChecked4 ? 'Y' : 'N';
  });
}

//상담신청 (수정됨)
function clickContactUs(){
  $('.req-btn').click(function() {
    // 1. 안내창 띄우기
    showAlert('상담 불가 안내', '현재 전화상담만 가능합니다.');
    
    // 2. 프로세스 중단 (이 아래의 코드는 실행되지 않음)
    return false;

    /* --- 기존 로직 주석 처리 ---
    let compid = globalVal.compId;
    let usernm = $('.online-name').val();
    let firstphon = $('.first-phon').val();
    let secondphon = $('.second-phon').val();
    let userphon = firstphon + secondphon;
    let stokasset = $('.user-asset').val();
    let email = $('.user-email').val();
    let calltime = $('.call-time').val();
    let wantloan = $('.loan-want').val();
    let inquitytext = $('.inquity-text').val();
    
    let httpnet = true;
    if(usernm == null || usernm == ''){
      showAlert('필수 사항 체크', '이름은 필수 사항입니다.');
      httpnet = false;
    }else if(secondphon == null || secondphon == ''){
      showAlert('필수 사항 체크', '전화번호는 필수 사항입니다.');
      httpnet = false;
    }else if(check2 === 'N'){
      showAlert('필수 사항 체크', '개인정보 수집 및 이용동의는 필수 사항입니다.');
      httpnet = false;
    }

    if(httpnet){
      let axos = CommServ.post("/api/insert/Online.setContactUs/action.json", { 
        'compId' : compid, 'msgTemplate':'M002', 'userNm': usernm, 'userPhon': userphon, 'stokAsset': stokasset,
        'eMail' : email, 'callTime' : calltime, 'wantLoan' : wantloan, 'inquirY' : inquitytext,
        'creditYn' : check2, 'marketingYn' : check3, 'creditShareYn' : check4});
      axos.then((response) => {
          if (response.status == 200) {
            const arrProdCount = response.data.responseVO.body.docs;
            adminSendMsg(arrProdCount[0].contactSeq);
            showAlert('상담 신청', '상담 신청이 완료 되었습니다.');
            $(".completion-btn").click(function() {
              setParamUrl('/index.html');
            });
          }
      }).catch((error) => {
          return false;
      });
    }
    ------------------------- */
  });
}

//약관조회 및 생성
function getRulesConts(termsType){
  let axos = CommServ.post("/api/select/Terms.getTermsView/action.json", { 'compId': globalVal.compId, 'termsType': termsType });
  axos.then((response) => {
      if (response.status == 200) {
          const arrcontList = response.data.responseVO.body.docs;
          arrcontList.forEach((terms) => {
                let targetIdx = '';
                if(termsType === 'T0001') targetIdx = '1';
                else if(termsType === 'T0002') targetIdx = '2';
                else if(termsType === 'T0003') targetIdx = '3';

                if(targetIdx !== ''){
                    $(`.online-titl-g${targetIdx}`).empty().append($('<h1>').html(terms.termsTitl));
                    $(`.online-sub-titl-g${targetIdx}`).empty().append($('<p>').html(terms.termsSubTitl));
                    $(`.online-conts-g${targetIdx}`).empty().append($('<div>').html(terms.termsConts));
                    $(`.online-marker-titl-g${targetIdx}`).empty().append($('<span>').html(terms.termsMarkerTitl));
                }
          })
      }
  }).catch((error) => {
      return false;
  });
}

$(document).ready(function () {
  getRulesConts('T0001');
  getRulesConts('T0002');
  getRulesConts('T0003');
  accordionMenu();
  if(typeof phonNum8 === 'function') {
      phonNum8('second-phon');
      phonNum8('loan-want');
  }
  allCheck();
  clickContactUs();
});