let pageCurrent = 1; // 페이지수
let youType = 'SHORTS'; //조회할 메뉴 타입
let maxPage = 1;//총 패이지수
let viewSize = '8';


// 메뉴 클릭 함수
function clickMenu(){
$('.tab-btn input').on('click', function() {
  pageCurrent = 1;
  $('.tab-btn input').removeClass('on');
  $(this).addClass('on');

  // 데이터 속성을 가져옴
  let menuType = $(this).data('menu-type');
  if(menuType === 0){
    // 쇼츠 버튼 클릭 시 동작
    viewSize = '8';
    $(".shorts-g").children().remove();
    youType = 'SHORTS';
    fnGetYtTotal();//총개수
    // console.log("쇼츠 버튼 클릭됨");
  }else if(menuType === 1) {
    // 동영상 버튼 클릭 시 동작
    viewSize = '6';
    $(".shorts-g").children().remove();
    youType = 'MOVIE';
    fnGetYtTotal();//총개수
    // console.log("동영상 버튼 클릭됨");
  }else{

  }
  // 리스트호출
  fnGetShortList();
});

}

//유튜브 정보 총개수
function fnGetYtTotal() {
  let axos = CommServ.post("/api/select/Yt.getYtTotalList/action.json", { 'compId': globalVal.compId , 'youType':youType });
  axos.then((response) => {
      if (response.status == 200) {
          const arrProdCount = response.data.responseVO.body.docs;
          let prodCount = arrProdCount[0].totalCount;//총개수
          maxPage = Math.ceil(prodCount/viewSize);
          // console.log('총페이지'+maxPage);
          moreBtnOnOff(pageCurrent);
      } else {
          return false;
      }
  }).catch((error) => {
      return false;
  });
}  

//쇼츠 정보 생성
function fnGetShortList() {
  let axos = CommServ.post("/api/select/Yt.getYtList/action.json", { 'compId': globalVal.compId, 'page': pageCurrent, 'viewSize':viewSize, 'youType':youType});
  axos.then((response) => {
      if (response.status == 200) {
        const arrYtList = response.data.responseVO.body.docs;
        if(youType == 'SHORTS'){
          //쇼츠 정보생성
          readHtml('/views/component/youtube-card.html').then((baseHtml) => {
            arrYtList.forEach((ytData) => {
              let $formattedHtml = $(baseHtml.formatMap(ytData));
              $formattedHtml.addClass('col-6 col-md-3');
               
              $(".shorts-g").append($formattedHtml);
            })
            pageCurrent++;
          }).catch((error) => {
                console.log("쇼츠 콘텐츠를 가져오지 못했습니다.");
          })
        }else{
          //유튜브 정보생성
          readHtml('/views/component/movie-card.html').then((baseHtml) => {
            
            arrYtList.forEach((ytData) => {
              $(".shorts-g").append(baseHtml.formatMap(ytData));
            })
            pageCurrent++;
          }).catch((error) => {
                console.log("유튜브 콘텐츠를 가져오지 못했습니다.");
          })
        }

      } else {
          return false;
      }
  }).catch((error) => {
      return false;
  });
}


$(document).ready(function () {
  //전체 개수
  fnGetYtTotal();
  //쇼츠리스트 생성
  fnGetShortList();
  //탭 클릭
  clickMenu();

  $(document).on("click","input[name='btn-more-then']", function(){
    fnGetShortList();
    //마지막페이지일 경우 더보기 버튼 가리기
    moreBtnOnOff(pageCurrent);

  });
});
