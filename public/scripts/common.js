const globalVal = {
    compId : 'C0001',
  };

const globalCollNum = {
    TYPE : '',
    NM : '경제',
    PHONE: '1600-8571'
  };

const includeHTML = () => {
    var z, i, elmnt, file, xhttp, attrScript;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }

        attrScript = elmnt.getAttribute("include-script");
        if (attrScript) {
            var scriptTag = document.createElement("script");
            scriptTag.src = attrScript;
            elmnt.appendChild(scriptTag);
            elmnt.removeAttribute("include-script");
        }

    }
}

// document.addEventListener("DOMContentLoaded", () => {
//     includeHTML();
// });

$(document).ready(()=>{
    includeHTML();
})


const CommServ = {

    post: (Url, parameters, configs) => {
        const defConfig = {
            timeout: 2000,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }

        if (parameters == null) parameters = {};
        const sendHeader = Object.assign({}, defConfig, configs);
        return axios.post(Url, parameters, sendHeader);

    }
}


if (!String.prototype.formatMap) {
    String.prototype.formatMap = function (map) {
        let newVal = this.toString();

        // 현재 문자열에서 ${...} 를 추출해서 Map 에서 찾아서 매칭 
        const arrMatch = newVal.match(/\$\{.*?\}/g);
        arrMatch.forEach((item) => {
            const propNm = item.substring(2, item.length - 1);
            const regex = new RegExp("\\" + item, "g");
            if (map.hasOwnProperty(propNm)) {
                const regex = new RegExp("\\" + item, "g");
                newVal = newVal.replace(regex, map[propNm]);
            } else {
                newVal = newVal.replace(regex, '');
            }


        });

        // Map 에서 찾아서 ${ABCD} 로 문자열에서 찾아서 매칭. 
        // let arrKeys = Object.keys(map);
        // arrKeys.forEach((item) => {
        //     const regex = new RegExp("\\${" + item + "}", 'g');
        //     newVal = newVal.replace(regex, map[item]);
        // })

        return newVal;
    }
}


const readHtml = async (htmlfile) => {
    const response = await fetch(htmlfile);
    const htmlData = await response.text(); // 응답 본문을 텍스트 문자열로 변환
    return htmlData; // 템플릿 HTML 데이터 반환
}

// 버튼 클릭 시 페이지 최상단으로 이동
function scrollToTop() {
    window.scrollTo(0, 0);
}

//위로 버튼 스크롤시 나오게
function scrollOnOff(){
    $('.scrollToTopBtn').hide();
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
            $('.scrollToTopBtn').fadeIn();
       } else {
            $('.scrollToTopBtn').fadeOut();
       }
  });
}

//더보기 버튼 on/off
function moreBtnOnOff(getPageCurrent){
  console.log("더보기 접근");
  console.log("현페이지" + getPageCurrent);
    if(maxPage === 1){
      console.log("총패이지 1개");
      $("input[name='btn-more-then']").addClass('d-none');
    }else if(maxPage === getPageCurrent){
      console.log("총패이지 가"+getPageCurrent);
      $("input[name='btn-more-then']").addClass('d-none');
    }else{
      $("input[name='btn-more-then']").removeClass('d-none');
      $("input[name='btn-more-then']").addClass('d-block');
    }
  }

  //텔레그램 메시지 보네기
  function adminSendMsg(contactSeq){
    return;
    let axos = CommServ.post("/api/action/sendmessage/action.json", {"contact_seq" : contactSeq , "prepend" : "", "append" : ""});
        //contact_seq = 유저시퀀스번호 , prepend = 메시지선행삽입문구, append메시지후행삽입문구
        axos.then((response) => {
          if (response.status == 200) {
            //텔레그렘 메시지 전송
            const arrProdCount = response.data.responseVO.body.docs;
            console.log("메시지 리턴"+arrProdCount);//리턴받은것 확인
          } else {
              return false;
          }
      }).catch((error) => {
          return false;
      });


    // location.reload();
  }

  //핸드폰번호 8자리만
  function phonNum8(classNm){
    $('.'+classNm).on('keydown', function(e) {
      const key = e.which || e.keyCode;
                const input = $(this).val();

                // 숫자 키 (0-9)의 ASCII 코드 범위: 48-57
                const isNumber = key >= 48 && key <= 57;
                
                // 숫자 패드 키 (0-9)의 ASCII 코드 범위: 96-105
                const isNumpadNumber = key >= 96 && key <= 105;

                // 제어 키 (Backspace, Delete, 화살표 키, Tab 등) 허용
                const controlKeys = [8, 46, 37, 39, 9];


                if(classNm == 'loan-want'){
                  if (!isNumber && !isNumpadNumber && !controlKeys.includes(key)) {
                    e.preventDefault(); // 숫자와 제어 키가 아닌 경우 입력 방지
                  }
                }else{
                  // 입력 길이가 8자를 초과하면 입력 방지
                  if (input.length >= 8 && !controlKeys.includes(key)) {
                    e.preventDefault();
                  }
                  if (!isNumber && !isNumpadNumber && !controlKeys.includes(key)) {
                    e.preventDefault();
                  }
                }
            });

            $('.'+classNm).on('input', function() {
                const input = $(this).val();
                const regex = /^\d*$/; // 숫자만 허용하는 정규 표현식

                if (!regex.test(input)) {
                    $(this).val(input.replace(/\D/g, '')); // 숫자가 아닌 문자는 제거
                }
            });
  }


  //약관 표기 날짜 포멧
function formatDate(dateStr) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    // "YYYY년 MM월 DD일" 형식으로 반환
    return `${year}년 ${month}월 ${day}일`;
  }
  
  //약관 조회 날짜 포멧 
  function formatToCompactDate(dateStr) {
    // 입력 형식: "YYYY년 MM월 DD일"
    const dateParts = dateStr.match(/(\d{4})년 (\d{2})월 (\d{2})일/);
    
    if (dateParts) {
      const year = dateParts[1];
      const month = dateParts[2];
      const day = dateParts[3];
      
      // "YYYYMMDD" 형식으로 반환
      return `${year}${month}${day}`;
    } else {
      // 유효하지 않은 형식의 경우
      console.error("날짜 형식이 맞지않습니다");
      return null;
    }
  }

  
//약관 개정일 조회
function getContsDay(termsType){
    let axos = CommServ.post("/api/select/Terms.getRulesDay/action.json", { 'compId': globalVal.compId, 'termsType': termsType });
    axos.then((response) => {
        if (response.status == 200) {
            const arrRulList = response.data.responseVO.body.docs;
                
               $(".rules-his").children().remove();
               arrRulList.forEach((terms) => {
                  const formattedDate = formatDate(terms.aplyDt);
                $(".rules-his").append($('<option>').html(formattedDate));
                })
                //셀렉트된 날짜 확인
                let getSeldayt = getSelectedText();
                //날짜에맞는 약관 불러오기
                getConts(termsType, formatToCompactDate(getSeldayt));
        } else {
            return false;
        }
    }).catch((error) => {
        return false;
    });
  }
  
  //약관 정보 조회
  function getConts(termsType, aplyDt){
    let axos = CommServ.post("/api/select/Terms.getTerms/action.json", { 'compId': globalVal.compId, 'termsType': termsType, 'aplyDt' : aplyDt });
    axos.then((response) => {
        if (response.status == 200) {
            const arrYtList = response.data.responseVO.body.docs;
               $(".txt-box").children().remove();
                arrYtList.forEach((terms) => {
                $(".txt-box").append($('<div>').html(terms.termsConts));
                })
        } else {
            return false;
        }
    }).catch((error) => {
        return false;
    });
  }
  
  //약관 개정일 날자 선택
  function getSelectedText() {
    let selectedOption = $(".rules-his option:selected");
    let selectedText = selectedOption.text();
    return selectedText;
  }

  //매체사 data 받아오기
  function getGlobalCollNumData(type){
    let axos = CommServ.post("/api/select/Agency.getAgencyData/action.json", {'compId': globalVal.compId, 'agencyType': type });
    axos.then((response) => {
        if (response.status == 200) {
            const arrAgencyList = response.data.responseVO.body.docs;
            if (arrAgencyList.length > 0) {
              globalCollNum.NM = arrAgencyList[0].agencyNm;
              globalCollNum.PHONE = arrAgencyList[0].phonNum;
              $(".agency-tell-num").text(globalCollNum.PHONE);
              $(".tel-num").prop('href', "tel:"+globalCollNum.PHONE);
          } else {
              console.log("받아온 매체사 데이터가 없습니다.");
          }
      } else {
          console.error("서버 응답 에러:", response.status, response.statusText);
          return false;
        }
    }).catch((error) => {
        return false;
    });
  }

  //매체사 파라미터값 받기
  function getParamUrl(){
    console.log("입장");
        // URLSearchParams 객체를 사용하여 쿼리 파라미터를 추출
        const urlParams = new URLSearchParams(window.location.search);
        let params = {};

        // 모든 파라미터
        urlParams.forEach((value, key) => {
            params[key] = value;
        });

        const agency = params.agency;
        //매체사 파라미터 있을경우
        if(agency){
            globalCollNum.TYPE = agency;
            getGlobalCollNumData(agency);
            console.log("코드파람 : "+globalCollNum.TYPE + " ,번호 : "+globalCollNum.PHONE + " ,이름 : "+ globalCollNum.NM);

        }else{
            console.log('매체사 없음');
        }

    }

  //매체사 파라미터값 넣어서 url 만들기
  function setParamUrl(baseHtml){
      
      let newUrl;

      if(globalCollNum.TYPE === ''){
        //파라미터 없음
        newUrl = `${baseHtml}`;
        window.location.href = newUrl;
      }else{
        // 파라미터 추가
        const params = new URLSearchParams();
        params.append('agency', globalCollNum.TYPE);
        newUrl = `${baseHtml}?${params.toString()}`;
        window.location.href = newUrl;
      }
      console.log("만들어진 URL"+newUrl);
      // 링크에 URL 설정
      // $('.paramLink').href = newUrl;
      return newUrl;
  }

    // 알럿
  function showAlert(title, message) {
    document.getElementById('alertTitle').innerText = title;
    document.getElementById('alertMessage').innerText = message;
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('customAlert').style.display = 'block';
  }

  function closeAlert() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('customAlert').style.display = 'none';
  }

  function completionAlert() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('customAlert').style.display = 'none';
  }

  $(document).ready(function () {
    //commonjs 에있는 최상단으로 가는버튼 기능
    scrollOnOff();
  });