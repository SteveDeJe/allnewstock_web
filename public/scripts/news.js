let pageCurrent = 1; // 페이지수
let maxPage ; //최대 페이지수

//뉴스 정보 총개수
function fnGetNewsTotal() {
  let axos = CommServ.post("/api/select/Webcrawling.selectFinanceNewsTotal/action.json", { 'page': '1'});
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


function fnGetNews() {
  let axos = CommServ.post("/api/select/Webcrawling.selectFinanceNews/action.json", { 'page': pageCurrent, 'viewSize': '10' });
  axos.then((response) => {
      if (response.status == 200) {
          const arrNewsList = response.data.responseVO.body.docs;
          pageCurrent++;
          readHtml('/views/component/news-card.html').then((baseHtml) => {
              arrNewsList.forEach((newsData) => {
                let $formattedHtml = $(baseHtml.formatMap(newsData));
                $formattedHtml.removeClass('col-md-6');  
                $('.news-g').append($formattedHtml);
              })
          }).catch((error) => {
              console.log("뉴스 콘텐츠를 가져오지 못했습니다.");
          });

      } else {
          return false;
      }
  }).catch((error) => {
      return false;
  });
}


$(document).ready(function () {
  //전체 개수 확인
  fnGetNewsTotal();
  //콘텐츠 지우기
  $("news-g").children().remove();
  //뉴스콘텐츠 생성
  fnGetNews();

  $(document).on("click","input[name='btn-more-then']", function(){
    //다음 목록 가져오기
    fnGetNews();
    //마지막페이지일 경우 더보기 버튼 가리기
    moreBtnOnOff(pageCurrent);

  });
});