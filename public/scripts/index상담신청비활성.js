const pcBnrItemCun = 3;
let check1 = isChecked = 'N';
let check2 = isChecked = 'N';
let check3 = isChecked = 'N';
let check4 = isChecked = 'N';

// 응답 대기용 
async function fnGetNews_Async() {
    const axos = CommServ.post("/api/select/Webcrawling.selectFinanceNews/action.json", null);
    await axos.then((response) => {
        if (response.status == 200 && response.data['RSLT_CD'] == "9000") {
            return false;
        } else {
            return true;
        }
    }).catch((error) => {
        return false;
    });
}

// 백그라운드용 
function fnGetNews() {

    let axos = CommServ.post("/api/select/Webcrawling.selectFinanceNews/action.json", { 'page': '1', 'viewSize': '8' });
    axos.then((response) => {
        if (response.status == 200) {
            const arrNews = response.data.responseVO.body.docs;

            readHtml('/views/component/news-card.html').then(
                function (htmlData) {
                    $("#newsContainer").children().remove();
                    arrNews.forEach((newsData) => {
                        $("#newsContainer").append(htmlData.formatMap(newsData));
                    })
                }, function (error) {

                }
            )

        } else {
            return false;
        }
    }).catch((error) => {
        return false;
    });
}

// 250723 > 수정
function mClassChangeCss() {
    //모바일 스탁론 상품안내 리스트 ON
    $(".loan-item-PC").hide();
    $(".loan-item-MOBILE").show();
}

function tClassChangeCss() {
    // PC(태블릿)스탁론 상품안내 리스트 ON
    $(".loan-item-MOBILE").hide();
    $(".loan-item-PC").show();

    //테블릿 여백삭제
    if ($(".indx-container").hasClass("container")) {
        $(".indx-container").removeClass("container");
        $(".indx-container").addClass("container-full");

    } else {
        $(".indx-container").addClass("container-full");
    };
}

function pcClassChangeCss() {
    //컨테이너 pc에 맞게 변경
    if ($(".indx-container").hasClass("container-full")) {
        $(".indx-container").removeClass("container-full");
        $(".indx-container").addClass("container");

    } else {
        $(".indx-container").addClass("container");
    }

    // PC(태블릿)스탁론 상품안내 리스트 ONㅅㄷㄴㅅ.ㅗ싀
    $(".loan-item-MOBILE").hide();
    $(".loan-item-PC").show();
}
// 250723 > end

//사이즈별 스와이퍼 엘리먼츠 on/off 제어
function initSwiper() {

    let screenWidth = $(window).width();
    //모바일
    if (screenWidth < 768) {
        mClassChangeCss();
    //테블릿
    } else if (screenWidth >= 768 && screenWidth < 1199) {
        tClassChangeCss();
    //PC
    } else {
        pcClassChangeCss();
    }
}

//모바일 테블릿 스와이퍼
function mtBnrSwiper() {
    let swiper = new Swiper(".m-Swiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,//사용자 조작시 오토플레이 정지
        },
        breakpoints: {
            "@0.00": {//화면크기가 0px 이상일때
                slidesPerView: 1.1,
                spaceBetween: 20,
                pagination: {
                    el: ".m-swiper-pagination",
                    type: "fraction",

                },
            },
            "@0.768": {//화면크기가 768px 이상일때
                slidesPerView: 3,
                spaceBetween: 20,
                pagination: {
                    el: "",
                    type: "fraction",
                },
            },
        },
    });
}

//pc스와이퍼
function pcBnrSwiper() {
    let pcSwiper = new Swiper(".pc-Swiper", {
        slidesPerView: 1,
        spaceBetween: 100,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
        
}


//베스트 스와이퍼
function bestSwiper() {
    //베스트 스탁론 스와이퍼
    let mBestswiper = new Swiper(".m-best-Swiper", {
        slidesPerView: 1.5,//보여질 개수
        spaceBetween: 20,//콘텐츠 사이값
        loop: true,      //무한루프 여부
        autoplay: {
            delay: 5000, // 5000ms = 5초
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            type: "progressbar",
        },
    });
}

//유튜브 스와이퍼
function tubeSwiper() {
    let ytuSwiper = new Swiper(".tube-swiper", {
        slidesPerView: 4.8,
        spaceBetween: 20,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 2000,
        },
        breakpoints: {
            "@0.00": {//화면크기가 0px 이상일때
                slidesPerView: 1.4,
                spaceBetween: 20,
            },
            "@0.768": {//화면크기가 768px 이상일때
                slidesPerView: 3.8,
                spaceBetween: 20,
            },
            "@1.200": {//화면크기가 1200px 이상일때
                slidesPerView: 4.8,
                spaceBetween: 20,
            },
        },
    });
}

//쇼츠 정보 생성
function fnGetYtInfo() {
    let axos = CommServ.post("/api/select/Yt.getYtList/action.json", { 'compId': globalVal.compId, "mainYn": "Y" });
    axos.then((response) => {
        if (response.status == 200) {
            const arrYtList = response.data.responseVO.body.docs;
            readHtml('views/component/youtube-card.html').then((baseHtml) => {
                $(".shorts-swiper").children().remove();
                arrYtList.forEach((ytData) => {//쇼츠 카드 생성
                    $(".shorts-swiper").append(baseHtml.formatMap(ytData));
                })
            }).catch((error) => {
                console.log("유튜브 콘텐츠를 가져오지 못했습니다.");
            }).finally(() => {
                tubeSwiper();
            })

        } else {
            return false;
        }
    }).catch((error) => {
        return false;
    });
}

//베너 정보 가져와 카드생성
function fnGetBnrInfo() {
    let axos = CommServ.post("/api/select/Bnr.getBnrList/action.json", { 'compId': globalVal.compId, "bnrType": "MAIN" });
    axos.then((response) => {
        if (response.status == 200) {
            const arrbnrList = response.data.responseVO.body.docs;

            // arrbnrList의 길이가 3의 배수가 아닌 경우, 필요한 만큼 추가하여 arrbnrListExtended를 생성
            let arrbnrListExtended = [...arrbnrList]; // 초기화
            let addBnrCun = Math.round(arrbnrListExtended.length / pcBnrItemCun);




            // console.log("뭔가 마음에안듬... for로변경해보기");  수정 하기
            if (arrbnrListExtended.length % pcBnrItemCun !== 0) {
                if (Math.round(arrbnrListExtended.length / pcBnrItemCun) == 2) {
                    arrbnrListExtended.push(arrbnrList[0]);
                } else if (Math.round(arrbnrListExtended.length / pcBnrItemCun) == 1) {
                    arrbnrListExtended.push(arrbnrList[0]);
                    arrbnrListExtended.push(arrbnrList[1]);
                } else {
                    console.log("베너 생성값을 확인해주세요");
                }
            }

            //pc 배너
            let repeatedcnt = Math.ceil(arrbnrListExtended.length / 3) - 1;
            readHtml('views/component/pc-main-bnr-card.html').then((baseHtml) => {
                $(".pc-bnr-g").children().remove();
                for (let i = 0; i <= repeatedcnt; i++) {
                    let swiperDiv = document.createElement('div');
                    swiperDiv.className = 'swiper-slide row';

                    for (let j = 0; j < 3; j++) {
                        let index = (i * 3) + j;
                        if (index < arrbnrListExtended.length) {
                            let bnrData = arrbnrListExtended[index];
                            bnrData['num'] = index % 3 == 0 ? 6 : 3;
                            let cardHtml = baseHtml.formatMap(bnrData);
                            $(swiperDiv).append(cardHtml);
                        }
                    }

                    $(".pc-bnr-g").append(swiperDiv);
                    //전화번호가 들어올경우 파라미터값으로 변경
                    $(".agency-tell-num").text(globalCollNum.PHONE);

                }

            }).catch((error) => {
                console.log("PC 배너정보를 가져오지 못했습니다.");
            }).finally(() => {
                pcBnrSwiper();
            })

            //모바일 배너
            readHtml('views/component/m-main-bnr-card.html').then((baseHtml) => {
                $(".m-bnr-g").children().remove();
                arrbnrListExtended.forEach((bnrData) => {
                    $(".m-bnr-g").append(baseHtml.formatMap(bnrData));
                    //전화번호가 들어올경우 파라미터값으로 변경
                    $(".agency-tell-num").text(globalCollNum.PHONE);
                })
            }).catch((error) => {
                console.log("모바일 배너정보를 가져오지 못했습니다.");
            }).finally(() => {
                mtBnrSwiper();
            })
        } else {
            return false;
        }
    }).catch((error) => {
        return false;
    });
}

//상품 정보 가져와 카드생성
function fnGetProdInfo() {
    let axos = CommServ.post("/api/select/Prod.getMainProdList/action.json", { 'compId': globalVal.compId, 'mainYn': "Y", 'rimit': 8 });
    axos.then((response) => {
        if (response.status == 200) {
            const arrProdList = response.data.responseVO.body.docs;
            //pc 카드생성
            readHtml('views/component/pc-best-stok-card.html').then((baseHtml) => {
                $(".best-item-g").children().remove();
                arrProdList.forEach((prodData, index) => {
                    // $(".best-item-g").append(baseHtml.formatMap(prodData));

                    // $(".m-best-item-g").append(cardHtml);
                    prodData.idx = ++index;

                    let cardHtml = $(baseHtml.formatMap(prodData));

                    //마커 온오프 설정
                    if (prodData.focusMarker === 'N') {
                        cardHtml.find('.focus-img').hide();
                    } else {
                        cardHtml.find('.focus-img').show();
                        cardHtml.find('.focus-g').addClass('text-red');
                    }

                    if (prodData.losscutMarker === 'N') {
                        cardHtml.find('.losscut-img').hide();
                    } else {
                        cardHtml.find('.losscut-img').show();
                        cardHtml.find('.losscut-g').addClass('text-red');
                    }

                    if (prodData.atmMarker === 'N') {
                        cardHtml.find('.atm-img').hide();
                    } else {
                        cardHtml.find('.atm-img').show();
                        cardHtml.find('.atm-g').addClass('text-red');
                    }

                    if (prodData.monthMarker === 'N') {
                        cardHtml.find('.month-img').hide();
                    } else {
                        cardHtml.find('.month-img').show();
                        cardHtml.find('.month-g').addClass('text-red');
                    }

                    $(".best-item-g").append(cardHtml);
                })

            }).catch((error) => {
                console.log("pc용 데이터를 가져오지 못했습니다");
            })
            //모바일 카드생성
            readHtml('views/component/m-best-stok-card.html').then((baseHtml) => {
                $(".m-best-item-g").children().remove();
                if (arrProdList)
                    arrProdList.forEach((prodData, index) => {

                        prodData.idx = ++index;

                        let cardHtml = $(baseHtml.formatMap(prodData));

                        if (prodData.focusMarker === 'N') {
                            cardHtml.find('.focus-img').hide();
                        } else {
                            cardHtml.find('.focus-img').show();
                            cardHtml.find('.focus-g').addClass('text-red');
                        }

                        if (prodData.losscutMarker === 'N') {
                            cardHtml.find('.losscut-img').hide();
                        } else {
                            cardHtml.find('.losscut-img').show();
                            cardHtml.find('.losscut-g').addClass('text-red');
                        }

                        if (prodData.atmMarker === 'N') {
                            cardHtml.find('.atm-img').hide();
                        } else {
                            cardHtml.find('.atm-img').show();
                            cardHtml.find('.atm-g').addClass('text-red');
                        }

                        if (prodData.monthMarker === 'N') {
                            cardHtml.find('.month-img').hide();
                        } else {
                            cardHtml.find('.month-img').show();
                            cardHtml.find('.month-g').addClass('text-red');
                        }

                        $(".m-best-item-g").append(cardHtml);

                        // $(".m-best-item-g").append(baseHtml.formatMap(prodData));
                    })
            }).catch((error) => {
                console.log("모바일용 데이터를 가져오지 못했습니다");
            }).finally(() => {
                bestSwiper();
            })


        } else {
            return false;
        }
    }).catch((error) => {
        return false;
    });
}

//상품 정보 가져와 카드생성
function fnGetProdInfoNew() {
    let axos = CommServ.post("/api/select/Prod.getMainProdList2/action.json", { 'compId': globalVal.compId });
    axos.then((response) => {
        if (response.status == 200) {
            const arrProdList = response.data.responseVO.body.docs;
            //pc 카드생성
            readHtml('views/component/pc-main-prod-card.html').then((baseHtml) => {
                $(".loan-item-PC").children().remove();
                arrProdList.forEach((prodData) => {
                    let cardHtml = $(baseHtml.formatMap(prodData));
                    
                    if (prodData.refTextYn === 'N') {
                        cardHtml.find('.ex-mark').hide();
                    } else {
                        cardHtml.find('.ex-mark').show();
                    }

                    if (prodData.prodRank === 'R0001') {
                        cardHtml.find('.state').attr("src", "assets/loan/icon_rank-up.svg");
                    } else if (prodData.prodRank === 'R0002') {
                        cardHtml.find('.state').attr("src", "assets/loan/icon_rank-down.svg");
                    } else {
                        cardHtml.find('.state').attr("src", "assets/loan/icon_no-change.svg");
                    }

                    if (prodData.stkCodeYn === 'N') {
                        cardHtml.find('.bank').hide();
                    } else {
                        cardHtml.find('.bank').show();
                    }

                    $(".loan-item-PC").append(cardHtml);
                })

            }).catch((error) => {
                console.log("pc용 데이터를 가져오지 못했습니다");
            })

            //mobile 카드생성
            readHtml('views/component/mobile-main-prod-card.html').then((baseHtml) => {
                $(".loan-item-MOBILE").children().remove();
                arrProdList.forEach((prodData) => {
                    let cardHtml = $(baseHtml.formatMap(prodData));
                    
                    if (prodData.refTextYn === 'N') {
                        cardHtml.find('.ex-mark img, .bubble').hide();
                    } else {
                        cardHtml.find('.ex-mark img, .bubble').show();
                    }

                    if (prodData.prodRank === 'R0001') {
                        cardHtml.find('.state').attr("src", "assets/loan/icon_rank-up.svg");
                    } else if (prodData.prodRank === 'R0002') {
                        cardHtml.find('.state').attr("src", "assets/loan/icon_rank-down.svg");
                    } else {
                        cardHtml.find('.state').attr("src", "assets/loan/icon_no-change.svg");
                    }

                    if (prodData.stkCodeYn === 'N') {
                        cardHtml.find('.bank').hide();
                    } else {
                        cardHtml.find('.bank').show();
                    }

                    $(".loan-item-MOBILE").append(cardHtml);
                })

            }).catch((error) => {
                console.log("mobile용 데이터를 가져오지 못했습니다");
            })

        } else {
            return false;
        }
    }).catch((error) => {
        return false;
    });
}

//상담신청 (수정됨)
function clickContactUs(){
    $('.pop-req-btn').click(function() {
      // 1. 안내창 띄우기 및 중단
      showAlert('상담 불가 안내', '현재 전화상담만 가능합니다.');
      return false;

      /* --- 기존 로직 ---
      //입력정보
      let compid = globalVal.compId;
      let usernm = $('.online-name').val();
      let firstphon = $('.first-phon').val();
      let secondphon = $('.second-phon').val();
      let userphon = firstphon + secondphon;
      let stokasset = $('.user-asset').val();
      let email = $('.user-email').val();
      let calltime = $('.call-time').val();
      let wantloan = $('.want-loan').val();
      let inquitytext = $('.inquity-text').val();

      if(check2 === 'N'){
        showAlert('필수 사항 체크', '개인정보 수집 및 이용동의는 필수 사항입니다.');
        return false;
      }

      let axos = CommServ.post("/api/insert/Online.setContactUs/action.json", { 
        'compId' : compid, 'msgTemplate':'M001', 'userNm': usernm, 'userPhon': userphon, 'stokAsset': stokasset,
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
      */
    });
  }

//이름, 전환번호 체크
function checkModal() {
    let usernm = $('.online-name').val();
    let secondphon = $('.second-phon').val();
    if(usernm == null || usernm == ''){
        showAlert('필수 사항 체크', '이름은 필수 사항입니다.');
        return false;
      }
      if(secondphon == null || secondphon == ''){
        showAlert('필수 사항 체크', '전화번호는 필수 사항입니다.');
        return false;
      }
      return true;
  }
  //모달 실행
  function showModal(){
    $('.contact-us-btn2').on('click', function(event) {
        event.preventDefault(); // 기본 동작을 막음
        
        if (checkModal()) {
          // 조건이 충족되면 모달을 표시
          $('#rulesModal').modal('show');
        }
        return true;
      });
  }


//다이얼로그 기능
function popupRules(){
// 모달메인 클릭 시
    // 약관보기 버튼 클릭 시
    $('.slideButton').on('click', function() {
        if($(this).hasClass('rules1')){
            getRulesConts('T0001');
        }else if($(this).hasClass('rules2')){
            getRulesConts('T0002');
        }else if($(this).hasClass('rules3')){
            getRulesConts('T0003');
        }else{
            console.log('약관팝업확인요망');
        }

        $('.modal-content').scrollTop(0);

        $('#slideInDiv').css('display', 'block');
        setTimeout(function() {
            $('#slideInDiv').addClass('show');
        }, 10); // display: block이 적용되기 위한 약간의 지연
        });

        // 약관 닫기 버튼 클릭 시
        $('.closeSlideButton').on('click', function() {
        $('#slideInDiv').removeClass('show');
        setTimeout(function() {
            $('#slideInDiv').css('display', 'none');
        }, 500); // 슬라이드 애니메이션 시간과 일치하도록 지연
        });

        // 모달이 숨겨질 때
        $('#rulesModal').on('hidden.bs.modal', function() {
        if ($('#slideInDiv').hasClass('show')) {
            $('#slideInDiv').removeClass('show');
            setTimeout(function() {
            $('#slideInDiv').css('display', 'none');
            }, 500); // 슬라이드 애니메이션 시간과 일치하도록 지연
        }
        });
}

//체크박스 체크 박스 컨트롤
function allCheck() {
    // 1번 체크박스 변경 시
    $('#main-check1').change(function() {
        let isChecked = $(this).is(':checked');
        $('#main-check2, #main-check3, #main-check4').prop('checked', isChecked);
        check1 = isChecked ? 'Y' : 'N';
        check2 = isChecked ? 'Y' : 'N';
        check3 = isChecked ? 'Y' : 'N';
        check4 = isChecked ? 'Y' : 'N';
    });
  
    // 2, 3, 4번 체크박스 변경 시
    $('#main-check2, #main-check3, #main-check4').change(function() {
        let isChecked2 = $('#main-check2').is(':checked');
        let isChecked3 = $('#main-check3').is(':checked');
        let isChecked4 = $('#main-check4').is(':checked');
  
        // 모든 체크박스가 체크되어 있는지 확인
        let allChecked = isChecked2 && isChecked3 && isChecked4;
  
        // 1번 체크박스 상태 변경
        $('#main-check1').prop('checked', allChecked);
        check1 = allChecked ? 'Y' : 'N';
  
        // 각 체크박스 개별 값 설정
        check2 = isChecked2 ? 'Y' : 'N';
        check3 = isChecked3 ? 'Y' : 'N';
        check4 = isChecked4 ? 'Y' : 'N';
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
                      $(".online-titl").children().remove();
                      $(".online-titl").append($('<h1>').html(terms.termsTitl));
                      $(".online-sub-titl-g1").children().remove();
                      $(".online-sub-titl-g1").append($('<p>').html(terms.termsSubTitl));
                      $(".online-conts").children().remove();
                      $(".online-conts").append($('<div>').html(terms.termsConts));
                      $(".online-marker-titl-g1").children().remove();
                      $(".online-marker-titl-g1").append($('<span>').html(terms.termsMarkerTitl));
                      break;
                    case 'T0002':
                      $(".online-titl-g2").children().remove();
                      $(".online-titl-g2").append($('<h1>').html(terms.termsTitl));
                      $(".online-titl").children().remove();
                      $(".online-titl").append($('<h1>').html(terms.termsTitl));
                      $(".online-sub-titl-g2").children().remove();
                      $(".online-sub-titl-g2").append($('<p>').html(terms.termsSubTitl));
                      $(".online-conts").children().remove();
                      $(".online-conts").append($('<div>').html(terms.termsConts));
                      $(".online-marker-titl-g2").children().remove();
                      $(".online-marker-titl-g2").append($('<span>').html(terms.termsMarkerTitl));
                      break;
                    case 'T0003':
                      $(".online-titl-g3").children().remove();
                      $(".online-titl-g3").append($('<h1>').html(terms.termsTitl));
                      $(".online-titl").children().remove();
                      $(".online-titl").append($('<h1>').html(terms.termsTitl));
                      $(".online-sub-titl-g3").children().remove();
                      $(".online-sub-titl-g3").append($('<p>').html(terms.termsSubTitl));
                      $(".online-conts").children().remove();
                      $(".online-conts").append($('<div>').html(terms.termsConts));
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
    showModal();
    fnGetNews();
    fnGetYtInfo();
    fnGetBnrInfo();
    fnGetProdInfo();
    fnGetProdInfoNew();
    initSwiper();
    phonNum8('second-phon');
    popupRules();
    allCheck();
    getRulesConts('T0001');
    getRulesConts('T0002');
    getRulesConts('T0003');
    clickContactUs();
    $(window).resize(function () {
        initSwiper();
    });
});

// 250725 > 추가
document.addEventListener('DOMContentLoaded', function() {
  if (location.hash) {
    let selector = location.hash;
    if (selector.startsWith('#') && document.querySelector(selector) === null) {
      selector = '.' + selector.slice(1);
    }
    const el = document.querySelector(selector);
    if (el) {
      setTimeout(function() {
        el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
});