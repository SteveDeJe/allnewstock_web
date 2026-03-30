let pageCurrent = 1; //페이지
let clickBtnEl ;//클릭된 메뉴세부 확인
let prodMenuTopBtn = 0; //0= 증권사별 클릭 1=유형별 클릭
let maxPage ; //최대 페이지수
let rank =1; // 아이템 순위 전역으로쓰면 나중에 꼬일가능성이 있는데 더좋은방법이 있을까고민

//상품 정보 총개수
function fnGetProdTotal(stkCode, cdVal) {
  let axos = CommServ.post("/api/select/Prod.getProdCount/action.json", { 'compId': globalVal.compId , 'page': pageCurrent, 'viewSize':'10', 'type': "STOCK", 'prmaStkCode': stkCode, 'prmacdVal': cdVal});
  axos.then((response) => {
      if (response.status == 200) {
          const arrProdCount = response.data.responseVO.body.docs;
          let prodCount = arrProdCount[0].totalCount;//총개수
          maxPage = Math.ceil(prodCount/10);
          // console.log('총페이지'+maxPage);
          moreBtnOnOff(pageCurrent);
      } else {
          return false;
      }
  }).catch((error) => {
      return false;
  });
  
}


//상품 정보 가져와 카드생성
function fnGetProdInfo(stkCode, cdVal) {
  let axos = CommServ.post("/api/select/Prod.getProdList/action.json", { 'compId': globalVal.compId , 'page': pageCurrent, 'viewSize':'10', 'type': "STOCK", 'prmaStkCode': stkCode, 'prmacdVal': cdVal});
  axos.then((response) => {
      if (response.status == 200) {
          const arrProdList = response.data.responseVO.body.docs;
          //pc, 테블릿 카드생성
          readHtml('/views/component/loan-card.html').then((baseHtml) =>{
              arrProdList.forEach((prodData) => {
                  // console.log(prodData);
                prodData.rankidx =  rank++;

                let cardHtml = $(baseHtml.formatMap(prodData));
                

                //마커 온오프 설정
                if (prodData.hasOwnProperty('focusMarker') && prodData.focusMarker === 'Y') {
                    cardHtml.find('.focus-img').show();
                    cardHtml.find('.focus-g').addClass('text-red');
                } else {
                    cardHtml.find('.focus-img').hide();
                }
    
                if (prodData.hasOwnProperty('losscutMarker') && prodData.losscutMarker === 'Y') {
                    cardHtml.find('.losscut-img').show();
                    cardHtml.find('.losscut-g').addClass('text-red');
                } else {
                    cardHtml.find('.losscut-img').hide();
                }
    
                if (prodData.hasOwnProperty('atmMarker') && prodData.atmMarker === 'Y') {
                    cardHtml.find('.atm-img').show();
                    cardHtml.find('.atm-g').addClass('text-red');
                } else {
                  cardHtml.find('.atm-img').hide();
                }
    
                if (prodData.hasOwnProperty('monthMarker') && prodData.monthMarker === 'Y') {
                    cardHtml.find('.month-img').show();
                    cardHtml.find('.month-g').addClass('text-red');
                } else {
                  cardHtml.find('.month-img').hide();
                }

                $(".loan-g").append(cardHtml); 
              })
              
          }).catch((error)=>{
              console.log("pc용 데이터를 가져오지 못했습니다");
          })

        

      } else {
          return false;
      }
  }).catch((error) => {
      return false;
  });
  
}


//유형별 메뉴 생성
function getTypeMenu(){
  let axos = CommServ.post("/api/select/CommonCode.getCommonCode/action.json", { 'compId': globalVal.compId, 'parentId': 'PROD_TYPE'});
  axos.then((response) => {
      if (response.status == 200) {
          const arrYtList = response.data.responseVO.body.docs;
              $(".loan-in-menu").children().remove();
              //전체 메뉴 생성
              const allMenu = $('<li><input id="all-menu" class="on" type="button" value="전체" onclick="typeMenuClick(this.value)" /></li>');
              $('.loan-in-menu').append(allMenu);
              arrYtList.forEach((loanType) => {//유형별 메뉴 생성
                const stokTypeMenu = $(`<li><input type="button" value="${loanType.cdNm}" onclick="typeMenuClick('${loanType.cdVal}')" /></li>`);
                  $(".loan-in-menu").append(stokTypeMenu);
              })


      } else {
          return false;
      }
  }).catch((error) => {
      return false;
  });
}

//증권사 메뉴 생성
function getStkCompMenu(){
  let axos = CommServ.post("/api/select/Prod.getCompNmList/action.json", { 'compId': globalVal.compId, 'type': "STOCK" });
  axos.then((response) => {
      if (response.status == 200) {
          const arrYtList = response.data.responseVO.body.docs;
              $(".loan-in-menu").children().remove();
              //전체 메뉴 생성
              const allMenu = $('<li><input id="all-menu" class="on" type="button" value="전체" onclick="stkMenuClick(this.value)" /></li>');
              $('.loan-in-menu').append(allMenu);
              arrYtList.forEach((stkComp) => {//증권사 메뉴 생성
                const stokCompMenu = $(`<li><input  type="button" value="${stkComp.menuNm}" onclick="stkMenuClick('${stkComp.stkCode}')" /></li>`);
                  $(".loan-in-menu").append(stokCompMenu);
              })
      } else {
          return false;
      }
  }).catch((error) => {
      return false;
  });
}

//리스트 초기화
function fnInitializList(){
  rank = 1;
  pageCurrent = 1;
  fnGetProdTotal();//전체개수 가져오기
  $('.loan-g').children().remove();
  clickBtnEl = null;
  fnGetProdInfo();//상품정보 만들기
}

//증권사&유형별 메뉴 생성
function clickTypeMenu(idValue){
  if(idValue === 'stk-comp-btn'){
    //증권사별 버튼 오프 및 유형별 메뉴 생성
    $('#stk-type-btn').addClass('on');
    $(`#${idValue}`).removeClass('on');
    //유형별 메뉴 생성
    prodMenuTopBtn = 1;//유형별
    getTypeMenu();
    fnInitializList();
  }else if(idValue === 'stk-type-btn'){
    $('#stk-comp-btn').addClass('on');
    $(`#${idValue}`).removeClass('on');
    //증권사별 메뉴 생성
    prodMenuTopBtn = 0;//증권사별
    getStkCompMenu();
    fnInitializList();
  }
}

//증권사별 하위 메뉴 클릭 파라미터값의 위치떄문에 너무 비슷한 함수를 2개만들었는데 이게맞는가?
function stkMenuClick(stkCode){
  if(stkCode == '전체'){
    //전체클릭
    $('.loan-g').children().remove();
    fnInitializList();

  }else{
    rank = 1;
    pageCurrent = 1;
    fnGetProdTotal(stkCode, null);
    $('.loan-g').children().remove();
    fnGetProdInfo(stkCode, null);
    clickBtnEl = stkCode;
  }
}

//유형별 하위 메뉴 클릭 파라미터값의 위치떄문에 너무 비슷한 함수를 2개만들었는데 이게맞는가?
function typeMenuClick(cdVal){
  if(cdVal == '전체'){
    //전체클릭
    $('.loan-g').children().remove();
    fnInitializList();
  }else{
    rank = 1;
    pageCurrent = 1;
    fnGetProdTotal(null, cdVal);
    $('.loan-g').children().remove();
    fnGetProdInfo(null, cdVal);
    clickBtnEl = cdVal;
  }
}



$(document).ready(function () {
  // console.log("laon DOM 준비 완료!");
  //상품정보 초기설정
  fnInitializList();
  //초기 메뉴 생성
  getStkCompMenu();

   // 동적으로 생성된 경우 on을 붙여야됨 클릭된 메뉴 하이라이트
  $(document).on('click', '.loan-in-menu li input', function() {
    $('.loan-in-menu li input').removeClass('on');
    $(this).addClass('on');
  });

  //더보기 클릭
  $(document).on("click","input[name='btn-more-then']", function(){
    pageCurrent++;
    //마지막페이지일 경우 더보기 버튼 가리기
    moreBtnOnOff(pageCurrent);

    if(prodMenuTopBtn === 0){
      //증권사별 클릭
      fnGetProdInfo(clickBtnEl, null);
    }else{
      //유형별 클릭
      fnGetProdInfo(null, clickBtnEl);
    }
  });
});
