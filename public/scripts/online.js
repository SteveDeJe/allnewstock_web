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
      // console.log('1번 체크박스:', check1, '2번 체크박스:', check2, '3번 체크박스:', check3, '4번 체크박스:', check4);
  });

  // 2, 3, 4번 체크박스 변경 시
  $('#check2, #check3, #check4').change(function() {
      let isChecked2 = $('#check2').is(':checked');
      let isChecked3 = $('#check3').is(':checked');
      let isChecked4 = $('#check4').is(':checked');

      // 모든 체크박스가 체크되어 있는지 확인
      let allChecked = isChecked2 && isChecked3 && isChecked4;

      // 1번 체크박스 상태 변경
      $('#check1').prop('checked', allChecked);
      check1 = allChecked ? 'Y' : 'N';

      // 각 체크박스 개별 값 설정
      check2 = isChecked2 ? 'Y' : 'N';
      check3 = isChecked3 ? 'Y' : 'N';
      check4 = isChecked4 ? 'Y' : 'N';

      // console.log('1번 체크박스:', check1, '2번 체크박스:', check2, '3번 체크박스:', check3, '4번 체크박스:', check4);
  });
}

//상담신청
function clickContactUs(){
  $('.req-btn').click(function() {
    //입력정보
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
      //디비 저장 및 관리자 텔레그램 발송            
    // console.log(
    //   "회사아이디",compid,
    //   "이름:", usernm, 
    //   "핸드폰:", userphon, 
    //   "자산:", stokasset, 
    //   "이메일:", email, 
    //   "연락 가능 시간:", calltime, 
    //   "대출 희망 금액:", wantloan, 
    //   "문의사항:", inquitytext,
    //   '1번 체크박스:', check1, 
    //   '2번 체크박스:', check2, 
    //   '3번 체크박스:', check3, 
    //   '4번 체크박스:', check4);
      let axos = CommServ.post("/api/insert/Online.setContactUs/action.json", { 
        'compId' : compid, 'msgTemplate':'M002', 'userNm': usernm, 'userPhon': userphon, 'stokAsset': stokasset,
        'eMail' : email, 'callTime' : calltime, 'wantLoan' : wantloan, 'inquirY' : inquitytext,
        'creditYn' : check2, 'marketingYn' : check3, 'creditShareYn' : check4});
      axos.then((response) => {
          if (response.status == 200) {
            const arrProdCount = response.data.responseVO.body.docs;
            //시퀀스 넘버 담아서 텔레그렘 메시지 전송
            adminSendMsg(arrProdCount[0].contactSeq);
            showAlert('상담 신청', '상담 신청이 완료 되었습니다.');
            showAlert('상담 신청', '상담 신청이 완료 되었습니다.');
              $(".completion-btn").click(function() {
                setParamUrl('/index.html');
                });
          } else {
              return false;
          }
      }).catch((error) => {
          return false;
      });
    }else{
      
    }
  });
}


//약관조회 및 생성
function getRulesConts(termsType){
  let axos = CommServ.post("/api/select/Terms.getTermsView/action.json", { 'compId': globalVal.compId, 'termsType': termsType });
  axos.then((response) => {
      if (response.status == 200) {
          const arrcontList = response.data.responseVO.body.docs;
              
          arrcontList.forEach((terms) => {
                switch(termsType){
                  case 'T0001':
                    $(".online-titl-g1").children().remove();
                    $(".online-titl-g1").append($('<h1>').html(terms.termsTitl));
                    $(".online-sub-titl-g1").children().remove();
                    $(".online-sub-titl-g1").append($('<p>').html(terms.termsSubTitl));
                    $(".online-conts-g1").children().remove();
                    $(".online-conts-g1").append($('<div>').html(terms.termsConts));
                    $(".online-marker-titl-g1").children().remove();
                    $(".online-marker-titl-g1").append($('<span>').html(terms.termsMarkerTitl));
                    break;
                  case 'T0002':
                    $(".online-titl-g2").children().remove();
                    $(".online-titl-g2").append($('<h1>').html(terms.termsTitl));
                    $(".online-sub-titl-g2").children().remove();
                    $(".online-sub-titl-g2").append($('<p>').html(terms.termsSubTitl));
                    $(".online-conts-g2").children().remove();
                    $(".online-conts-g2").append($('<div>').html(terms.termsConts));
                    $(".online-marker-titl-g2").children().remove();
                    $(".online-marker-titl-g2").append($('<span>').html(terms.termsMarkerTitl));
                    break;
                  case 'T0003':
                    $(".online-titl-g3").children().remove();
                    $(".online-titl-g3").append($('<h1>').html(terms.termsTitl));
                    $(".online-sub-titl-g3").children().remove();
                    $(".online-sub-titl-g3").append($('<p>').html(terms.termsSubTitl));
                    $(".online-conts-g3").children().remove();
                    $(".online-conts-g3").append($('<div>').html(terms.termsConts));
                    $(".online-marker-titl-g3").children().remove();
                    $(".online-marker-titl-g3").append($('<span>').html(terms.termsMarkerTitl));
                    break;
                  default:
                    break;
                }
              })
      } else {
          return false;
      }
  }).catch((error) => {
      return false;
  });
}


$(document).ready(function () {
  getRulesConts('T0001');
  getRulesConts('T0002');
  getRulesConts('T0003');
  //아코디언메뉴 접었다 펴기
  accordionMenu();
  //핸드폰번호 8개로 한정
  phonNum8('second-phon');
  phonNum8('loan-want');
  //체크박스
  allCheck();
  //신청버튼
  clickContactUs();
  
});
