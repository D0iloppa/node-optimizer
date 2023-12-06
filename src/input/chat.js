
let chatVar = {
    waitMsg :[
        "잠시만 기다려주세요, 답변을 찾고 있습니다!",
        "반갑습니다! 곧 답변을 드리겠습니다.",
        "고민해보고 있습니다. 조금만 기다려주세요!",
        "조금만 기다려주세요, 최선의 답변을 찾고 있습니다.",
        "고민 중입니다. 곧 답변을 드리겠습니다.",
    ] ,
    rcmdtn_data_type:[
        "str",
        "java",
        "js"
    ],
    isFirst:true,
    isAnswering:false,
    chatXhr:null,
    srch_mng_grp_sn:-1,
    lastQid:-1,
    lastQuery:false,
    lastTokens : []
};
let session_userid = '';
//dcmt READY
$(function(){
let grp_sn = $("#srch_mng_grp_sn").val();
//chatInit(grp_sn);
session_userid = $('#session_userid').val();
})

/**
* 채팅방 init
* 그룹 아이디 없는 경우 : new chat
* 그룹 아이디 존재하는 경우 : 기존 채팅 이력 로딩
* @param srch_mng_grp_sn
* @returns
*/
function chatInit(srch_mng_grp_sn){
if(srch_mng_grp_sn)
    chatVar.srch_mng_grp_sn = srch_mng_grp_sn;

let query = $('#query').val();

if(chatVar.srch_mng_grp_sn == -1 && chatVar.isFirst){		//채팅방 처음 생성
    if(query!==null && query!==undefined && query!=='')
        sendMsg();
    /*if(initQuery != null){		//입력값이 있으면 해당 값으로 send. 아니면 아무것도 안함.
        $('#query').val(initQuery);
        const initChk = $('#query').val();
        if(!!initChk) sendMsg();
    }*/
}else{							//기존 채팅방 로드
    console.log("기존 채팅방 로드" + srch_mng_grp_sn);
    selectChatHistory(srch_mng_grp_sn);
}

chatVar.isFirst = false;
}


function chatClearBtn(){
Swal.fire({
       title: '채팅 내역을 삭제하시겠습니까?',
       text: '삭제된 내역은 다시 되돌릴수 없습니다.',
       icon: 'warning',
       showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
       //confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
       confirmButtonColor: '#d33', // confrim 버튼 색깔 지정
       // cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
       confirmButtonText: '삭제', // confirm 버튼 텍스트 지정
       cancelButtonText: '취소', // cancel 버튼 텍스트 지정
       // reverseButtons: false, // 버튼 순서 거꾸로
    }).then(result => {
       if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
          clearChat();
       }
    });
}

/**
* 채팅 초기화 
* @returns
*/
function clearChat(){
var inputField = document.getElementById("query");
inputField.value = "";
initChatVar();
$(".chatListUl").html('');
Swal.fire('삭제되었습니다.', '', 'success');
}

function newChat(){
$('#chatTab #chat-room #chatList').html('');
$('#menuOpen').css('display','block');
$('#sysControlShow').css('display','none');
$('#intro').css('display','block');
$('#chatTab').css('display','none');
$('.chatListDiv li').removeClass('b-link--click');
initChatVar();
}
function initChatVar(){
serverResponseCnt = 0;

// 요청이 존재하는 경우 취소하기	
if(chatVar?.chatXhr){
    console.error("답변을 취소합니다.");
    chatVar.chatXhr.abort();
    chatVar.chatXhr = null;
}

chatVar = {
        waitMsg :[
            "잠시만 기다려주세요, 답변을 찾고 있습니다!",
            "반갑습니다! 곧 답변을 드리겠습니다.",
            "고민해보고 있습니다. 조금만 기다려주세요!",
            "조금만 기다려주세요, 최선의 답변을 찾고 있습니다.",
            "고민 중입니다. 곧 답변을 드리겠습니다.",
        ] ,
        rcmdtn_data_type:[
            "str",
            "java",
            "js"
        ],
        isFirst:true,
        isAnswering:false,
        chatXhr:null,
        srch_mng_grp_sn:-1,
        lastQid:-1,
        lastQuery:false,
        lastTokens : []
    };
}
function firstAction(){
$('#menuOpen').css('display','block');
$('#sysControlShow').css('display','none');
$('#intro').css('display','none');
$('#chatTab').css('display','block');
chatVar.isFirst = false;
}
function getChatHistory(srch_mng_grp_sn){
$('#chatTab #chat-room #chatList').html('');
$('#menuOpen').css('display','block');
$('#sysControlShow').css('display','none');
$('#intro').css('display','none');
$('#chatTab').css('display','block');
$('.chatListDiv li').removeClass('b-link--click');
$(`#chatRoom${srch_mng_grp_sn}`).addClass('b-link--click');
chatVar.isFirst = false;
chatVar.srch_mng_grp_sn = srch_mng_grp_sn;
selectChatHistory(srch_mng_grp_sn);
}

/**
* 
* @param msg : 메시지
* @param paramObject
* @param q_sn
* @returns
*/
function sendMsg_v2(chatData){


const { msg , paramObject , qId} = chatData;


let inputMsg = msg || $('#query').val();

chatVar.chatXhr = $.ajax({
    type: 'POST',
    url: './chat_v2.do',
    data: {
        "qId" : qId || null,
        "query" : inputMsg,
        "lastQid" : chatVar.lastQid,
        "lastTokens" : chatVar.lastTokens,
        "lastQuery" : chatVar.lastQuery,
        "paramObject" : JSON.stringify(paramObject)
    },
    success: function(data) {
        const {fnList} = data;
        console.log("추출 함수 리스트",fnList);
    },
    error: function(err){
        console.error(err);
    }
});
}





/**
* 
* @param msg : 검색어
* @param paramObject : 질의문 외에 추가적으로넘길 파라미터 맵
* @param q_sn : 질의문 아이디를 직접적으로 접근하는 경우
* @returns
*/
function sendMsg(msg, paramObject, q_sn){

if(!paramObject)
    paramObject = {};

$("#query").attr("placeholder", "");
    
if(chatVar.isAnswering){
    toastr.info('답변중에는 채팅을 할 수 없습니다.');
    return false;
}

let inputMsg = msg || $('#query').val();

if(!inputMsg){
    toastr.info('메시지를 입력해주세요')
    return false;
}

if(chatVar.isFirst){
    firstAction();
}

openTab('/common/home',0,'AI CHAT','AI CHAT')

// chat("client" , inputMsg);
chat({
         msgFrom : "client",
         msg	: inputMsg
 });


// 채팅창 클리어
$("input[name='query']").val("");

const waitMsg = chatVar.waitMsg[Math.floor(Math.random() * chatVar.waitMsg.length)];
//chat("server_wait" , waitMsg);
 chat({
         msgFrom : "server_wait",
         msg	: waitMsg
 });

let searchDate = getDateParameter(inputMsg)
// inputMsg = searchDate.filteredSentence;
paramObject.searchDate = searchDate;

chatVar.isAnswering = true;
// 서버로 메세지 전송
chatVar.chatXhr = $.ajax({
    type: 'POST',
    //url: './chat.do',
    url: './chat_v2.do',
    //async:false,
    data: {
        "qId" : q_sn || null,
        "srch_mng_grp_sn" : chatVar.srch_mng_grp_sn,
        "query" : inputMsg,
        "lastQid" : chatVar.lastQid,
        "lastTokens" : chatVar.lastTokens,
        "lastQuery" : chatVar.lastQuery,
        "paramObject" : JSON.stringify(paramObject)
    },
    success: function(data) {
        // if(data.createChatRoom!=null) getChatHistoryList();
        const paramObj = data.paramObject;
        let result = data.chat_result;
        result.params = data.params;
        
        const {
                qId,
                query,
                answer,
                score,
                rcmdtn_type,
                tokens,
                rcmdtn_data_type,
                srch_mng_grp_sn,
                functions,
        } = result;

        let domainParam = domain_context; 
        // getDomainParamList(result.params);
        
        
        
        
        chatVar.srch_mng_grp_sn = srch_mng_grp_sn;
        $('.chatListDiv li').removeClass('b-link--click');
        $(`#chatRoom${srch_mng_grp_sn}`).addClass('b-link--click');
        
        // 마지막 질의문 매핑
        if(qId){
            chatVar.lastQid = qId;
            chatVar.lastTokens = tokens.join("@");
            chatVar.lastQuery = query;
            console.log(`id:${qId} , type:${rcmdtn_type} , query:${query} , type:${chatVar.rcmdtn_data_type[rcmdtn_data_type]}, answer:${answer} , score:${score}`);
        }else{ // 적절한 답변 없는 경우,
            chatVar.lastQid = -1;
            chatVar.lastTokens = "";
            chatVar.lastQuery = inputMsg;
            console.log(`history dive clear | id:${qId} , type:${rcmdtn_type} , query:${query} , type:${chatVar.rcmdtn_data_type[rcmdtn_data_type]}, answer:${answer} , score:${score}`);
        }
        
        
        
        
        result.query = inputMsg;
        result.searchDate = searchDate;
        result.domainParam = domainParam;
        chat_response(result, paramObj , functions);
    },
    error: function(err){
        console.error(err);
    }
});
}

/**
* 함수 실행
* 실행 우선순위 1. js , 2. java
* @param __data 객체
* @returns
*/
function executeFn(_data){

/*
try {
    //const data = JSON.parse(_data);
    
    
} catch (e) {
    console.error("Failed to parse JSON: ", _data, e);
    return;
}
*/

if(chatVar.isAnswering) {
    toastr.info('답변중에는 채팅을 할 수 없습니다.');
    return;
}


const {fnName , qId , qstn } = _data;
_data.fnChat = true;

if (typeof window[fnName] === 'function'){
    /*
    chat({
        msgFrom:"client",
        msg:qstn
    });
    
    try{
        let result = window[fnName](_data);
    }catch(err){
        console.error("executeFn",err);
        return;
    }
    */
    
    sendMsg(qstn);		
    
    
    
    
    
    return;
}else{
    // java 함수 실행
    
    console.log(qId , qstn);
    
    
    $.ajax({
        type: 'POST',
        url: `./chat/${fnName}`,
        async:false,
        data: { 
            "qId" : qId,
            "query" : qstn
        },
        success: async function(data) {
            // 클라이언트 질문 처리

            chat({
                 msgFrom : "client",
                 msg	 : qstn
            });
            
            
            console.log(data);
            
            let msg = data.msg || "no answer";
            
            // serverResponseCnt++;
            let btns = await getFunctions(qId,qstn);
            
            chatVar.isAnswering = true;
            chat({
                 msgFrom : "server",
                 msg	 : msg.replaceAll('\n','<br>'),
                 fnChat : true,
                 btns : btns
            });
        },
        error: function(xhr, status, error) {
            console.error(fnName,'함수가 선언되지 않아 실행 불가');
            
            
            const _url = url;
            
             if (xhr.status === 404) {
                 // 컨트롤러 목적지가 존재하지 않는 경우에 대한 처리
                    console.error("Controller not found");
                    var chatParam ={
                             msgFrom : "err",
                             msg	: "Controller not found",
                             changeFlag : true
                     };
                     chat(chatParam);
                    // catchAll(chatData,query);
                 } else {
                  // 기타 예외 처리
                    console.error("Unexpected error occurred:", error);
                    var chatParam ={
                             msgFrom : "err",
                             msg	: "에러발생",
                             changeFlag : true
                     };
                     chat(chatParam);
                    // chat("err" , "에러발생" , true);
                }
        }
    });
    
}
    
}

/**
* 채팅 결과에 의한 response
* @param chatData : sendMsg 결과 데이터
* @param paramObj : 파라미터 오브젝트
* @param fnList : 최소단위 함수 리스트
* @returns
*/
function chat_response(chatData, paramObj , fnList){

console.log("chat_response","param",paramObj);
console.log("chat_response","functions",fnList);

// 변수해체
let searchDate = chatData.searchDate;
const { rcmdtn_data_type, query , answer , params, domainParam} = chatData;
const type = chatVar.rcmdtn_data_type[rcmdtn_data_type] || "str";


const _queryDomain = getDomainParamList(params);
const searchDate_v2 = params?.searchDate_v2 || null;

console.log("쿼리 상 도메인",_queryDomain);
console.log("searchDate_v2" , searchDate_v2);

if(_queryDomain){
    const chk = checkDomain(_queryDomain);
    if(chk) {
        console.log("도메인이 다릅니다.");
        
        
        const _msg = `
            현재 선택된 도메인은 [ <span class='fBold'> ${domain_context.getDomainNm()} </span>] 입니다. <br>
            MBUSTER MANAGER는 현재 선택된 도메인 기준으로 데이터를 조회합니다.<br>
            <br>
            [<span class='fBold'>${_queryDomain.dmn_nm_list[0]}</span>] 도메인과 관련된 조회를 원하시면 <br> 
            상단의 도메인 선택영역에서 도메인을 변경해주세요
        `;
        
        return chat({
             msgFrom : "server",
             msg	: _msg
        });
    }
}

let _searchDate = {};


// java에서 추출한 날짜관련 파라미터가 존재하는 경우, searchDate 오버라이딩
/*
if(params){
    _searchDate = getSearchDate(params);
    if(searchDate){
        
        const parseFrom = JSON.parse(_searchDate?.from || "{}");
        const parseTo = JSON.parse(_searchDate?.to || "{}");
        
        if(!searchDate.search_from){
            searchDate.search_from = parseFrom?.date;
        }
        if(!searchDate.search_to){
            searchDate.search_to = parseTo?.date;
        }
            
    }
}
*/


if(searchDate_v2){
    let parseSd = JSON.parse(searchDate_v2);
    searchDate.search_from = parseSd.search_from.date;
    searchDate.search_to = parseSd.search_to.date;
}

console.log(searchDate);


let relateQstn_list = [];
let fnObjList = [];

$.ajax({
    type: 'POST',
    url: "./getRelateChat",
    async:false,
    data: { 
        "qId" : parseInt(chatData.qId || 0)
    },
    success: function(data) {
        const originFn = answer;
        let tmpList = data.list || [];
        const sameFn = tmpList.find(i => i.answer == originFn);
        
        // sameFn을 맨 앞으로 이동
        if (sameFn) {
            sameFn.sameFn = true;
            tmpList = [sameFn, ...tmpList.filter(i => i !== sameFn)];
        }

        relateQstn_list = tmpList;
    },
    error: function(xhr, status, error) {
        console.error(error);
    }
});



let btns = '';


let _fnSet = [answer];
let _fnQSet = [query];

for(let idx in relateQstn_list){
    const {qId , query , answer , required_param , keyword , sameFn} = relateQstn_list[idx];
    console.log(relateQstn_list[idx])

    //let btn =`<button class="button-ai" onclick="sendMsg('${query}',null,${qId})">${query}</button> `;
    //let btn = `<button class="button-ai" fnName="${answer}">${query}</button> `;
    let btn =`<button class="button-ai button-combine ${sameFn?'sameFn' : ''}" fnQ="${query}" fnName="${answer}" onclick="sendMsg('${query}',null,${qId})">${keyword || query}</button> `;
    /*if((params.ip!==null && required_param===1) || required_param===0){
        let btn =`<button class="button-ai button-combine" fnName="${answer}" onclick='sendMsg('${query}',null,${qId})'>${query}</button> `;
        btns += btn;
    }*/
    btns += btn;
    _fnSet.push(answer);
    _fnQSet.push(query);
}
btns += (relateQstn_list.length>0) ? '<br>' : ''; 
// 중복제거
_fnSet  = [ ...new Set(_fnSet) ];
_fnQSet = [ ...new Set(_fnQSet) ];

let fnBtn = '';	
if(fnList){
    // 중복방지
    console.log(answer);

    let btnArr = []; // 정렬
    for(let idx in fnList){
        const fn_qstn = fnList[idx].split("@");
        let _fnParam = {
                fnName : fn_qstn[0] ,
                qId : fn_qstn[1],
                query :fn_qstn[2],
                qstn : fn_qstn[2],
                required_param : fn_qstn[3],
                keyword : fn_qstn[4]
        };
        
         // 함수명 기준으로 중복제거
        if(_fnSet.includes(fn_qstn[0])) continue;
        //else _fnSet.push(fn_qstn[0]);
        
        
        // 질의문 기준으로 중복제거
        if(_fnQSet.includes(fn_qstn[2])) continue;
        else if(relateQstn_list.find(i => i.qId == fn_qstn[1])) continue;
        // else if(_fnParam?.required_param == 1) continue
        else {
            _fnSet.push(fn_qstn[0]);
            _fnQSet.push(fn_qstn[2]);
        }
        
        
        /*
        if((params.ip!==null && _fnParam.required_param===1) || _fnParam.required_param===0){
            let btn =`<button class="button-ai button-combine" fnName="${fn_qstn[0]}" onclick='executeFn(${JSON.stringify(_fnParam)})'>${_fnParam.qstn}</button> `;
            // let btn =`<button class="button-ai" fnName="${fn_qstn[0]}">${_fnParam.qstn}</button> `;
            btns += btn;
        }
        */
        
        let btn =`<button class="button-ai button-combine" fnQ="${_fnParam.qstn}" fnName="${fn_qstn[0]}" onclick='executeFn(${JSON.stringify(_fnParam)})'>${ (_fnParam.keyword) ? _fnParam.keyword :  _fnParam.qstn}</button> `;
        let btnObj = {};
        btnObj[_fnParam.qstn] = btn;
        btnArr.push(btnObj);
        // btns += btn;
    }
    
    // 정렬
    btnArr.sort(function(a, b) {
          const keyA = Object.keys(a)[0];
          const keyB = Object.keys(b)[0];
          return keyA.localeCompare(keyB);
    });
    
    for(let idx in btnArr){
        const btn = Object.values(btnArr[idx])[0];
        btns += btn;
    }
    
}



switch(type.toUpperCase()){
    case "STR":
        let msg = (!answer || answer=="-") ? 
                noAnswer(query) : answer;
        console.log('연관질문',relateQstn_list);
        console.log('추출함수',fnList);


        chat({
                 msgFrom : "server",
                 msg	: msg,
                 btns : btns
         });
            
        // chat("server" , msg);
        break;
    case "JAVA":
        let goalUrl = answer ? answer : "catchAll";
        let goalUrls = goalUrl.split(",");
        for(var idx in goalUrls){
            const url = goalUrls[idx];
            // lazyload : server-wait 출력 이후, 응답결과로 change
            chatJavaFuncExec({
                lazyload : true,
                url : url,
                qId : chatData.qId,
                query : query,
                paramObject : paramObj,
                btns,
                relateQstn_list,
                fnList
            });
        }
        break;
    case "JS" :
        // lazyload : server-wait 출력 이후, 응답결과로 change
        chatJsFuncExec({
            lazyload : true,
            answer  : answer, 
            qId : chatData.qId , 
            query : query , 
            params : params , 
            btns: btns,
            searchDate:searchDate,
            domainParam:domainParam
        });
        break;
}
}



function checkDomain(queryDomain){
const currentDomain = domain_context;
const {dmn_sn_list} = queryDomain;

if(!dmn_sn_list || dmn_sn_list.length<1){
    return false;
}



let diff = false;
currentDomain.dmn_sn_list.forEach( dmn_sn => {
    diff = !(dmn_sn_list.includes(dmn_sn));
});

return diff;


}




/*
* 
* @param args : 실행에 필요한 args
* @param lazyload : server-wait 출력 이후, 응답결과로 change
*/
function chatJavaFuncExec(args){

const { lazyload = false, url , qId , query , paramObject , btns, relateQstn_list, fnList} = args;

// 목적지 전송
$.ajax({
    type: 'POST',
    url: `./chat/${url}`,
    async:false,
    data: { 
        "qId" : qId,
        "query" : query,
        "paramObject": paramObject
    },
    success: function(data) {
        console.log(data);
        let msg = data.msg || "no answer";
        console.log('연관질문' , relateQstn_list);
        console.log('추출함수' , fnList);
        chat({
            lazyload,
            msgFrom : "server",
            msg	 : msg.replaceAll('\n','<br>'),
            btns : btns,
            changeFlag : true
        });
        
    },
    error: function(xhr, status, error) {
        const _url = url;
        
         if (xhr.status === 404) {
             // 컨트롤러 목적지가 존재하지 않는 경우에 대한 처리
                console.error("Controller not found");
                catchAll(chatData,query);
             } else {
              // 기타 예외 처리
                console.error("Unexpected error occurred:", error);
                chat({
                         msgFrom : "err",
                         msg	: "에러발생",
                         changeFlag : true
                 });
                // chat("err" , "에러발생" , true);
            }
    }
});
}

function catchAll(chatData,query){
 $.ajax({
      type: 'POST',
      url: './chat/catchAll',
      async: false,
      data: {
        "qId": chatData.qId,
        "query": query,
        "answer" : chatData.answer,
        "params": chatData?.params
      },
      success: function(data) {
        const msg = data.msg || "no answer";
        let chatParam ={
                msgFrom : "err",
                msg	: msg.replaceAll('\n', '<br>'),
                changeFlag : true
        };
        chat(chatParam);
      },
      error: function(err) {
        console.error(`Unexpected error occurred: ${err}`);
        let chatParam ={
                msgFrom : "err",
                msg	: "에러발생",
                changeFlag : true
        };
        chat(chatParam);
      }
    });
}

/**
* 적합한 답변이 없는 경우 문구 출력 
* @param q
* @returns
*/
function noAnswer(q){

const aList = [
    `안타깝게도, 현재 제가 가지고 있는 정보에는<br>"${q}"라는 용어에 대한 답변이 없습니다.<br>하지만 더 많은 정보를 수집하고 분석하여 더 나은 답변을 제공할 수 있도록 노력하겠습니다.`,
    `"${q}"에 대한 답변을 제공해드리지 못해 죄송합니다.<br>하지만, 더 나은 답변을 찾기 위해 노력할 것이며,<br>필요하신 정보가 있다면 최대한 도움을 드릴 수 있도록 노력하겠습니다.<br><br>다른 궁금하신 사항 있으시면 질문해주시기 바랍니다.`,
    `죄송합니다, 제 데이터 셋에는 "${q}"라는 용어가 포함되어 있지 않아서,<br>해당 질문에 대한 정확한 답변을 제공하기 어렵습니다. 하지만 더 나은 답변을 찾기 위해 노력하겠습니다.<br>이에 대해 불편을 드려 대단히 죄송합니다.<br>만약 다른 궁금한 점이 있으시다면 언제든지 질문해주시기 바랍니다.`
];
const out = Math.floor(Math.random() * aList.length);

const addHelpBtn = `<br><br>또는 추천 검색어를 확인하여 도움을 받으 실 수 있습니다.<br><button class="button-ai" onclick="sendMsg('추천검색어를 알려줘')">추천검색어를 알려줘</button>`;
return aList[out] + addHelpBtn;
}

/**
* @param lazyload : server-wait 출력 이후, 응답결과로 change
* @param a : 결과값 | 실행대상 함수명
* @param qId : 질의문의 아이디 (참조해야 하는 경우가 있을수도 있다.)
* @param q : 사용자 질의문
* @param p : params
* @param btns : 연관질문 + 추출함수
* @returns
*/
function chatJsFuncExec(chatData){	
chatVar.isAnswering = true;

const { lazyload = false, answer , qId , query , params , btns, searchDate, domainParam} = chatData;

console.log("jsRes",params);

/*let searchDate = getDateParameter(query)
console.log(searchDate);*/

let selectParams = getSelectFilter(params);
console.log("select Filter", selectParams);

// let domainParam = {dmn_nm_list , dmn_sn_list} = getDomainParamList(params); 
//let domainParam = getDomainParamList(params);

try {
    if(lazyload)
        chat({
                   msgFrom : "server-wait",
                   msg	: ""
        });
    
    // answer로 받은 함수를 코드로 변환하고 실행
    setTimeout( () => { 
        // eval(a);
        if (typeof window[answer] === 'function')
            window[answer]({
                    btns:btns,
                    params:params,
                    domainParam : domainParam,
                    searchDate:searchDate,
                    query:query
            });
        else{
            console.error('chatJsFuncExec', `${answer} 함수가 존재하지 않습니다.`);
        }
        
    } , 100); // 1초 후에 실행
 } catch (error) {
    chat("err",error ,true);
}
}



/**
* timeout까지 기다림
*/
/*
function waitForAnswering(timeout) {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      if (!chatVar.isAnswering) {
        clearInterval(intervalId);
        resolve();
      }
    }, 1000); // 1초마다 체크

    setTimeout(() => {
      clearInterval(intervalId);
      reject('Timeout'); // 일정 시간(timeout)이 지나면 Timeout 에러를 발생시킴
    }, timeout);
  });
}
*/



/**
* 
* @param msgFrom : 메세지를 보내는 사람 (server , client , err)
* @param msg : 메시지 내용
* @returns
*/
let serverResponseCnt = 0;
//function chat(msgFrom , msg , changeFlag , btns){
function chat(chatParams){
const {msgFrom , msg , appendFlag , changeFlag , btns , fnChat, originChatParam} = chatParams;
let _cnt = serverResponseCnt;

let msgArray,script;

switch(msgFrom){
    case "excel":
        chatVar.isAnswering = true;
        serverResponseCnt++;
        $('.chatListUl').append(`
                <li class="severAnswer"> <b> <img src="/resource/mbuster/codingsepo/images/mbusterLogo/logo_chat_icon.png" alt="MBUSTER"></b>
                         <div style="display:flex; justify-content: space-between;">
                            <p class="server_wait" id="s.erverResponse${serverResponseCnt}"></p>
                            <button class="gen_btn" id="gen_btn_${serverResponseCnt}" onclick="stopChat(this)" style="margin-top: auto; margin-bottom: 0;"><i class="fa-regular fa-circle-stop"></i> 대화 중단</button>
                        </div>
                </li>
                `);
        /* 
        $('.chatListUl').append(`
        <li class="severAnswer"> <b> <img src="/resource/mbuster/codingsepo/images/logo_icon_0517_faviconGBlack.png" alt="MBUSTER"></b>
                 <div style="display:flex; justify-content: space-between;">
                    <p class="server_wait" id="s.erverResponse${serverResponseCnt}"></p>
                    <button class="gen_btn" id="gen_btn_${serverResponseCnt}" onclick="stopChat(this)" style="margin-top: auto; margin-bottom: 0;"><i class="fa-regular fa-circle-stop"></i> 대화 중단</button>
                </div>
        </li>
        `);
        */
        msgArray = msg.split('<script>');
        showMsg = msgArray[0];

        var typewriter = new Typewriter(`#serverResponse${serverResponseCnt}`, {
              delay: 55,
              onComplete : ()=>{alert("끝!")}
            });
        typewriter
          .typeString(showMsg)
          .pauseFor(50)
          .start()
          .callFunction(() => { // 종료 이후 callback 함수
              console.log("종료");
              
              $(`#serverResponse${serverResponseCnt} .Typewriter__cursor`).remove();
              chatVar.isAnswering = false;
              $(`#gen_btn_${serverResponseCnt}`).remove();
             });
        
        script = `<script>${msgArray[1]}`;
        console.log(script);
        
        $(`#serverResponse${serverResponseCnt}`).append(script);
        break;
    case "err" :
        chatErr(msg , changeFlag);
        return;
    case "client":
        $('.chatListUl').append(`
        <li class="response"><b><img src="/resource/mbuster/codingsepo/images/user.gif" alt="프로필사진"></b>
        <p>${msg}</p>
        </li>
        `);
        /*
         `
        <div class="chatRow mineChat">
            <div class="chatDisplayArea">
                <div class="d-flex">
                    <i class="chatIcon bx bxs-user-circle"></i>
                    <div class=chatPadding>${msg}</div>
                </div>
            </div>
        </div>`
         */
        break;
    case "server_wait":
        chatVar.isAnswering = true;
        serverResponseCnt++;
        $('.chatListUl').append(`
        <li class="severAnswer"> <b> <img src="/resource/mbuster/codingsepo/images/mbusterLogo/logo_chat_icon.png" alt="MBUSTER"></b>
                 <div style="display:flex; justify-content: space-between;">
                    <p class="server_wait" id="serverResponse${serverResponseCnt}"></p>
                    <button class="gen_btn" id="gen_btn_${serverResponseCnt}" onclick="stopChat(this)" style="margin-top: auto; margin-bottom: 0;"><i class="fa-regular fa-circle-stop"></i> 대화 중단</button>
                </div>
        </li>
        `);
        /*
        $('.chatListUl').append(`
                <li class="severAnswer"> <b> <img src="/resource/mbuster/codingsepo/images/logo_icon_0517_faviconGBlack.png" alt="MBUSTER"></b>
                         <div style="display:flex; justify-content: space-between;">
                            <p class="server_wait" id="serverResponse${serverResponseCnt}"></p>
                            <button class="gen_btn" id="gen_btn_${serverResponseCnt}" onclick="stopChat(this)" style="margin-top: auto; margin-bottom: 0;"><i class="fa-regular fa-circle-stop"></i> 대화 중단</button>
                        </div>
                </li>
                `);
        */
        
        $(document).scrollTo(`#serverResponse${serverResponseCnt}`, {duration:1000});
        showMsg = msg;

        var typewriter = new Typewriter(`#serverResponse${serverResponseCnt}`, {
              delay: 55
            });
        typewriter
          .typeString(showMsg)
          .pauseFor(50)
          .start()
        
        break;
    case "server": // 서버의 응답 결과
        chatVar.isAnswering = true;
        
        if($(`#serverResponse${serverResponseCnt}.server_wait`)[0]){ // server_wait 필드가 존재하는 경우
            
            if(!fnChat)
                var typewriter = new Typewriter(`#serverResponse${serverResponseCnt}`, {delay: 55}).deleteAll();
            
            
            // fnChat는 버튼을 눌렀을 경우
            else if(fnChat) {
                serverResponseCnt++;
                $('.chatListUl').append(`
                        <li class="severAnswer"><b><img src="/resource/mbuster/codingsepo/images/mbusterLogo/logo_chat_icon.png" alt="MBUSTER"></b>
                          <div style="display:flex; justify-content: space-between;">
                            <p id="serverResponse${serverResponseCnt}"></p>
                            <button class="gen_btn" id="gen_btn_${serverResponseCnt}" onclick="stopChat(this)" style="margin-top: auto; margin-bottom: 0;"><i class="fa-regular fa-circle-stop"></i> 대화 중단</button>
                            </div>
                        </li>
                        `);
                
                $(document).scrollTo(`#serverResponse${serverResponseCnt}`, {duration:1000});
            }
            
            
            if(appendFlag){
                 return new Promise((resolve, reject) => {
                     if (appendFlag.status == 'start') {
                         
                         console.log(msg);
                          
                          
                        _cnt = serverResponseCnt;
                        msgArray = msg.split('<script>');
                        showMsg = msgArray[0];
                        
                        chatVar.isAnswering = true;
                        var typewriter = new Typewriter(`#serverResponse${_cnt}`, {
                              delay: 55
                        });
                        
                        typewriter
                          .typeString(msg)
                          .pauseFor(50)
                          .start()
                          .callFunction(() => { // 종료 이후 callback 함수
                              console.log("prepend 종료" , _cnt);
                                  
                              $(`#serverResponse${_cnt} .Typewriter__cursor`).remove();
                                  //if(changeFlag)  $(`#gen_btn_${_cnt}`).remove();
                                  $(`#gen_btn_${_cnt}`).remove();
                                  
                                  chatVar.isAnswering = false;
                                  
                                  $(document).scrollTo(`#serverResponse${serverResponseCnt}`, { duration: 1000 });

                                  resolve(btns); // 프로미스 성공 상태로 해결(resolve)합니다.
                              });
                         
                        } else {
                          reject("appendFlag is false"); // 프로미스 실패 상태로 거부(reject)합니다.
                        }
                      });
            }
            
        }else{
            serverResponseCnt++;
            $('.chatListUl').append(`
                <li class="severAnswer"><b><img src="/resource/mbuster/codingsepo/images/mbusterLogo/logo_chat_icon.png" alt="MBUSTER"></b>
                            <p id="serverResponse${serverResponseCnt}"></p></li>
                `);
                
            $(document).scrollTo(`#serverResponse${serverResponseCnt}`, {duration:1000});
        }
        _cnt = serverResponseCnt;
        msgArray = msg.split('<script>');
        showMsg = msgArray[0];
    
        chatVar.isAnswering = true;
        var typewriter = new Typewriter(`#serverResponse${_cnt}`, {
              delay: 55
            });
        typewriter
          .typeString(showMsg)
          .pauseFor(50)
          .start()
          .callFunction(() => { // 종료 이후 callback 함수
              console.log("종료",_cnt);
              
              $(`#serverResponse${_cnt} .Typewriter__cursor`).remove();
              //if(changeFlag)  $(`#gen_btn_${_cnt}`).remove();
              $(`#gen_btn_${_cnt}`).remove();
              
              chatVar.isAnswering = false;
              
              if(btns){
                  if(originChatParam!==null && originChatParam!==undefined){
                      //let _btns = btns.replaceAll(/onclick="[^"]*"/g, "");
                      let _btns = btns.replaceAll("onclick", "disabled_onclick");
                      $(`#serverResponse${_cnt}`).append('<hr><span style="color:red;">※아래 버튼을 눌러 새탭 열기를 해보세요!</span><br/>' + _btns);
                      let combineParamObject = originChatParam;
                      combineParamObject.serverResponseCnt=_cnt;
                      let appendNewTab = "<br/><button class='button-ai-black' onclick='combineQuery("+JSON.stringify(combineParamObject)+");'>선택 내용 새탭열기</button><br/>";
                      $(`#serverResponse${_cnt}`).append(appendNewTab);
                      $(`#serverResponse${_cnt} .button-combine`).on("click", function () {
                          $(this).toggleClass('combine');
                      });
                  }
                  else
                      $(`#serverResponse${_cnt}`).append('<hr>' + btns);
              }
              
              
             });
        
        script = `<script>${msgArray[1]}`;
        console.log(script,msgArray[1]);
        
        // 스크립트가 있는 경우만
        if(!!msgArray[1]){
            $(`#serverResponse${serverResponseCnt}`).append(script);
        }
        
        break;
}

//$('.chatList').scrollTop($('.chatList')[0].scrollHeight);
// 스크롤 최하단으로 이동
$('.chatListUl').scrollTop($('.chatListUl')[0].scrollHeight);
}

function stopChat(t){

// 답변중이 아닌 경우에는 아무 작동 X
if(!chatVar.isAnswering) return;



// 요청이 존재하는 경우 취소하기	
if(chatVar.chatXhr){
    console.error("답변을 취소합니다.");
    chatVar.chatXhr.abort();
    chatVar.chatXhr = null;
}


chatVar.isAnswering = false;
toastr.info('답변을 종료합니다.');

let elemId = $(t).parent().children()[0].id;
elemId = elemId.replaceAll('serverResponse','');

const html = $(`#serverResponse${elemId} .Typewriter__wrapper`).html();

let typeWriter = new Typewriter(`#serverResponse${elemId}`,{
     delay: 75
}).deleteAll().stop();

$(`#serverResponse${elemId} .Typewriter__wrapper`).html(html);
// $(`#serverResponse${elemId} .Typewriter__wrapper`).css('text-decoration-line','line-through');
// $(`#serverResponse${elemId} .Typewriter__wrapper`).css('color','#c14040');
$(`#serverResponse${elemId} .Typewriter__wrapper`).parent().append(`<span style="font-size:10px !important; color:black;">&nbsp;(답변이 취소되었습니다.)</span>`);
$(`#serverResponse${elemId} .Typewriter__cursor`).remove();
// 자기 자신 삭제
$(t).remove();

// typeWriter.pause();
/*
  .callFunction(() => { // 종료 이후 callback 함수
      toastr.info('답변을 종료합니다.');
      $(`#serverResponse${serverResponseCnt} .Typewriter__cursor`).remove();
      chatVar.isAnswering = false;
   });
   */
}

/**
* 에러가 발생한 경우
* @returns
*/
function chatErr(msg , changeFlag){
//let chatDiv = document.createElement("div");
chatVar.isAnswering = false;

const errMsg = msg || "에러발생";


let lastChatIdx = $('.chat_cont ul').children().length - 1;
if(changeFlag && lastChatIdx > -1){
    let targetElem = $('.chat_cont ul').children()[lastChatIdx];
    targetElem.innerHTML = `<li class="errorChat"><b><img src="/resource/mbuster/codingsepo/images/mbusterLogo/logo_chat_icon.png" alt="MBUSTER"></b>
        <p style="color: #db4444;">${errMsg}</p></li>`;
    
    $('.chatListUl').scrollTop($('.chatListUl')[0].scrollHeight);
    
    return;
}

$('.chat_cont ul').append(`
        <li class="errorChat"><b><img src="/resource/mbuster/codingsepo/images/mbusterLogo/logo_chat_icon.png" alt="MBUSTER"></b>
                    <p style="color: #db4444;">${errMsg}</p></li>
        `);

/*
chatDiv.innerHTML = `<li><b><img src="/resource/mbuster/codingsepo/images/m_chat.png" alt="MBUSTER"></b>
                    <p>${errMsg}</p></li>`;
elem.append(chatDiv)

$(".chat_cont").append(elem);
 */
$('.chatListUl').scrollTop($('.chatListUl')[0].scrollHeight);


}

/**
* chat 데이터를 DB에 넣는다.
* @param q : 질의문
* @param a : 응답결과
* @param t : rcmdtn_type (0:GPT 생성 답변,1:의미기준,2:사용자검색,3:함수)
*/
function insertChatDB(q,a,t){
// rcmdtn_type
const rcmdtnType = { GPT:0 , STD: 1, SRCH: 2 , FN: 3};

// default 값
if(!t) t=rcmdtnType.SRCH;

// valid chk
if (Object.values(rcmdtnType).indexOf(t) === -1) {
    console.error(`Invalid value for t: ${t}`);
    // 올바르지 않은 값인 경우 사용자 검색으로 본다.
    t = rcmdtnType.SRCH;
}

$.ajax({
    type: 'POST',
    url: './insertChatDB.do',
    async:false,
    data: { 
        "query" 		: q,
        "answer" 		: a,
        "rcmdtn_type" 	: t
    },
    success: function(data) {
        const {srch_mng_sn} = data;
        
        if(srch_mng_sn < 0)
            console.error("insert 실패");
        else
            console.log(`qId : ${srch_mng_sn}`);
    },
    error: function(err){
        console.error(err);
    }
});
}

/**
* 동기화 시그널
*/
function syncSignal(){
$.ajax({
    type: 'POST',
    url: './sync_chatCorpus.do',
    async:false,
    success: function(data) {
        const flag = data.flag;
        if(flag) console.log("동기화 완료");
    },
    error: function(err){
        console.error(err);
    }
});
}

/**
* @param action : 토큰 재구성의 범위 설정
* action -> 'all' : 전체 질의문 토큰 재구성 (action이 정확히 'all'인 경우만)
* 그 외, 수정된 문장만 재구성
*/
function resetTokens(action){
$.ajax({
    type: 'POST',
    url: './change_Query.do',
    async:false,
    data:{
        action : action || null
    },
    success: function(data) {
        const flag = data.flag || -1;
        if(flag >= 0)
            console.log("토큰 재구성 완료");
    },
    error: function(err){
        console.error(err);
    }
});
}

function getFunctions(qId, q) {
  return new Promise((resolve, reject) => {
  
    $.ajax({
      type: 'POST',
      url: './getFunctions.do',
      data: {
        "qId": qId,
        "query": q
      },
      success: function (data) {
        console.log("getFunctions",data);
          
        const {relateList , fnList} = data;
        
        let btns = '';
        
        for(let idx in relateList){
            const {qId,query} = relateList[idx];
            //let btn =`<button class="button-ai" onclick="sendMsg('${query}',null,${qId})">${query}</button> `;
            let btn = `<button class="button-ai">${query}</button> `;
            btns += btn;
        }
        btns += (relateList && relateList.length>0) ? '<br>' : ''; 
            
        let fnBtn = '';	
        if(fnList){
            // 중복방지
            let _fnSet = [];
            let btnArr = []; // 정렬
            for(let idx in fnList){
                const fn_qstn = fnList[idx].split("@");
                let _fnParam = {
                        fnName : fn_qstn[0] ,
                        qId : fn_qstn[1],
                        qstn : fn_qstn[2]
                };
                if(_fnSet.includes(fn_qstn[0])) continue;
                else _fnSet.push(fn_qstn[0]);
                    
                //let btn =`<button class="button-ai" onclick='executeFn(${JSON.stringify(_fnParam)})'>${_fnParam.qstn}</button> `;
                let btn =`<button class="button-ai" fnName="${fn_qstn[0]}">${_fnParam.qstn}</button> `;
                let btnObj = {};
                btnObj[_fnParam.qstn] = btn;
                btnArr.push(btnObj);
                // btns += btn;
            }
            
            // 정렬
            btnArr.sort(function(a, b) {
                  const keyA = Object.keys(a)[0];
                  const keyB = Object.keys(b)[0];
                  return keyA.localeCompare(keyB);
            });
            
            for(let idx in btnArr){
                const btn = Object.values(btnArr[idx])[0];
                btns += btn;
            }
            
            
        }
        
        resolve(btns);
          
      },
      error: function (err) {
        console.error(err);
        reject(err);
      }
    });
  });
}



function wordTest(q){
$.ajax({
    type: 'POST',
    url: './wordAnalyze.do',
    data:{
        "query" : q
    },
    success: function(data) {
        
    },
    error: function(err){
        console.error(err);
    }
});
}


/**
* @params qId : 질의문 의미기준 레코드 sn
* @params q : 질의문
*/
function loadChatFromHistory(qId, q) {
  return new Promise((resolve, reject) => {
  
    $.ajax({
      type: 'POST',
      url: './loadChatFromHistory.do',
      data: {
        "qId": qId,
        "query": q
      },
      success: function (data) {
         let chatParam ={
                 msgFrom : "client",
                 msg	: q
         };
         chat(chatParam);

        // chat("client", q);
        
        
        
        const { chat_result } = data;
        chatVar.lastQuery = q;
        chatVar.lastTokens = chat_result?.tokens || [];
        chat_response(chat_result);
        resolve();
      },
      error: function (err) {
        console.error(err);
        reject(err);
      }
    });
  });
}



/**
* 박나연/ 그룹별 채팅 내역 가져오기.
*/
function selectChatHistory(srchMngGrpSn){
//parameter(1) : srchMngGrpSn_그룹 아이디
let srch_mng_grp_sn = srchMngGrpSn;
/**
 * 왼쪽 메뉴바에서 그룹을 눌렀을 때
 * 해당 그룹아이디로 채팅내역을 불러옴.ajax
 * for문으로 내역 정렬
 * 페이지 첫 로딩 시 출력할 것.($.ready)
 * */
console.log("채팅 히스토리 내역 출력" +srchMngGrpSn );
$.ajax({
    type: 'POST',
    url: 'selectChatHistory',
    data:{
        srch_mng_grp_sn : srch_mng_grp_sn,
    },
    success: async function(data) {
        for(let idx in data){
            const item = data[idx];
            const {srch_mng_sn , srch_qstn} = item;
            let wait = await loadChatFromHistory(srch_mng_sn , srch_qstn);
        }
    },
    error: function(err){
        console.error(err);
    }
});
}



/**
* select 칼럼에 해당되는 필드 추출 
* @param params
* @returns
*/
function getSelectFilter(params){

let out = {};
for(let key in params){
    // 날짜정보 param 추출
    if(key.includes("selectFilter_")){
        const _val = params[key];
        out[key] = (_val).replaceAll("@","");
    }
}

return out;

}

/**
* 파라미터중 date 필드에 해당되는 값
* @param params
* @returns
*/
function getDatesParams(params){
let out = {};
for(let key in params){
    // 날짜정보 param 추출
    if(key.includes("_date")){
        let dateItem = {};
        
        const _val = params[key];
        const _key = key.replace("_date","");
        
        dateItem.word = _val;
        dateItem.date = 'YYYYMMDD'
        dateItem = parseDate(dateItem);
        out[_key] = dateItem;
    }
}

return out;
}
/**
* 입력받은 날짜단어로부터 실제 date값으로 변환
* ex ) 내일 -> 오늘 기준 날짜 date로부터 +1한 날짜
* @param key : from,to,after,before,singleDate 키 값
* @param word
* @returns
*/
function parseDate(data){
// 입력받은 단어에 대한 정규식 패턴 정의
const datePatterns = {
  'day'	 		: /^(오늘)$/i,
  'day-1'		: /^(어제)$/i,
  'day-2'		: /^(그제)$/i,
  'day+1'		: /^(내일)$/i,
  'day+2'		: /^(모레)$/i,
  'dayAgo'		: /\d+일전/,
  'dayAfter'	: /\d+일후/,
  'weekAgo'		: /\d+주전/,
  'weekAfter'	: /\d+주후/,
  'week-1'		: /^(저번주|지난주|일주일전)$/i,
  'week+1'		: /^(다음주|일주일후)$/i,
  'month-1'		: /^(한달전|지난달|저번달)$/i,
  'month+1'		: /^(한달후|다음달)$/i,
  'monthAgo'	: /\d+달전/,
  'monthAfter'	: /\d+달후/,
  'year'		: /^(올해)$/i,
  'year-1'		: /^(작년|지난해|전년도)$/i,
  'year+1'		: /^(내년|다음해)$/i,
};


let {word,date} = data;
// 공백제거
let _word = word.replaceAll(" ","");
_word = _word.replaceAll("부터","");
_word = _word.replaceAll("까지","");
// 날짜 계산할 현 시점
let now = new Date();

// date offest 확인
// 입력받은 단어에서 날짜값 추출
let dateOffset = ''; // 추출된 날짜값



// 정규식 패턴에 대한 검사 수행
for (let pattern in datePatterns) {
  let regex = datePatterns[pattern];
  if (regex.test(_word)) {
    dateOffset = pattern;
    break;
  }
}

// 날짜 operand 결정
let operand = 0;
if (dateOffset.includes("Ago") || dateOffset.includes("-")) {
  operand = -1;
}else if(dateOffset.includes("After") || dateOffset.includes("+")){
    operand = 1;
}

let outDate;
let n = 0;
if(dateOffset.includes("Ago") || dateOffset.includes("After")){
    n = parseInt(_word.match(/\d+/));
}else{
    n = parseInt(dateOffset.match(/\d+/)); // n = 3
}
 
n = isNaN(n) ? 0 : n;

switch (true) {
  case dateOffset.includes('day'): // 일 관련
      outDate = new Date(now.setDate(now.getDate() + (operand * n) ));
    break;
  case dateOffset.includes('week'): // 주 관련
      const weekTimeValue = 7*24*60*60*1000;
      outDate = new Date(now.getTime() + ( weekTimeValue * (operand * n) ));
    break;
  case dateOffset.includes('month'): // 월 관련
      outDate = new Date(now.setMonth(now.getMonth() + (operand * n) ));
    break;
  case dateOffset.includes('year'): // 연 관련
      outDate = new Date(now.setYear(now.getYear() + (operand * n) ));
    break;
}

if(dateOffset.includes('yyyy') && dateOffset.includes('mm') && dateOffset.includes('dd')){
    date = _word.replaceAll('-','').replaceAll('/','');
    return {word,date};
}
date = outDate.yyyymmdd();


return {word,date};

}

/**
* date와 관련된 파라미터들을 우선순위에 의해
* 축약형 파라미터로 변환해준다.
* @param params
* @returns
*/
function compressDateParams(params){
const priority1 = [
    "from","before","after","singlePoint"
];

const priority2 = [
    "to","before","after","singlePoint"
];

let out = {};

for(let pIdx in priority1){
    const _key = priority1[pIdx];
    const paramKeys = Object.keys(params);
    
    if (paramKeys.some(key => key.includes(_key))) {
         console.log(`'${_key}' exists in paramKeys`);
         const matchingKey = paramKeys.find(key => key.includes(_key));
         out['from'] = params[matchingKey];
         break;
    }
}

for(let pIdx in priority2){
    const _key = priority2[pIdx];
    const paramKeys = Object.keys(params);
    
    if (paramKeys.some(key => key.includes(_key))) {
         console.log(`'${_key}' exists in paramKeys`);
         const matchingKey = paramKeys.find(key => key.includes(_key));
         out['to'] = params[matchingKey];
         break;
    }
}

return  out;
}

/**
* 파라미터로부터 searchDate를 뽑는다.
*/
function getSearchDate(params){
let _searchDate = compressDateParams(params);
console.log(_searchDate);

return _searchDate;
}

let iframeResponseCount = 0;
function iframeChatLoad(answer , params){
iframeResponseCount++;
console.log(params);

if(answer==='accessLog'){
    console.log(answer);
    let msg = `<div id="accessLogDiv${iframeResponseCount}">접속자 리스트를 보여드리겠습니다.</div>`;
    chat("server" , msg);
    $('#accessLogDiv'+iframeResponseCount).parent().parent().parent().append(`<div class="tbl_wrap scroll" id="accessLogList${iframeResponseCount}" ></div>`);
    selectAccessLogList(iframeResponseCount,params);
}else if(answer.includes('domainList')){		//도메인 정보
    /*
     * 도메인 리스트 출력 성공
        let msg = `<div id="domainListDiv${iframeResponseCount}"></div>`;
        chat("server" , msg);
        $('#domainListDiv'+iframeResponseCount).parent().parent().parent().append(`<div class="tbl_wrap scroll" id="domainList${iframeResponseCount}" ></div>`);
        selectDomainList(iframeResponseCount); 
     * 
     * 도메인 등록 성공
     *domainInstModalOpen();
     * 
     * 
     * */
    let tmp = answer.replaceAll("domainList_","");
    console.log(tmp);
    switch(tmp){
        case "show" :
            let msg = `<div id="domainListDiv${iframeResponseCount}"></div>`;
            chat("server" , msg);
            $('#domainListDiv'+iframeResponseCount).parent().parent().parent().append(`<div class="tbl_wrap scroll" id="domainList${iframeResponseCount}" ></div>`);
            selectDomainList(iframeResponseCount); 
        case "inst" :
            domainInstModalOpen();
    }
}
}



/**
* 기술지원 페이지 이동 관련 함수 구현
*/
function askAssist(){
alert("현재 미구현된 기능입니다. 이 곳에 기술지원 관련 함수 구현하면 됩니다.");
}


/*
function initInsertTest(){
const q = [
    "엠버스터는 무슨 프로그램이야?",
    "매크로로 의심되는 사용자 알려줘",
    "시간별 매크로 접속 알려줘",
    "차단된 사용자 알려줘",
    "금일 매크로 접속 수 알려줘",
    "차단된 매크로 리스트 보여줘",
    "차단 사용자 보여줘",
    "악성 사용자 리스트 보여줘",
    "남들이 많이 조회하는 검색",
    "추천검색어를 알려줘",
    "국가별로 매크로 차단 사용자의 리스트 알려줘",
    "가장 많이 차단된 지역이 어디야?",
    "제공받을 수 있는 통계자료에 대해서 알려줘",
    "통합대시보드 보여줘",
    "요약 정보를 보여줘",
    "의심자는 캡챠가 나타나도록 세팅해줘",
    "최근 차단된 접속 이력 보여줘",
    "실시간 탐지 현황 보여줘",
    "오늘 차단된 리스트 다 보여줘",
    "금일 차단한 매크로의 정보들을 보여줘",
    "매크로를 사용한 유저를 확인하고 싶어.",
    "어떤 매크로가 접속했는지 알려줘",
    "차단된 매크로 수 알려줘",
    "트래픽이 얼마나 절약되었는지 알려줘",
    "매크로 제품 도입 후 변화된 점을 알려줘",
    "매크로 차단 서비스 도입 후 차단률을 알려줘",
    "매크로 차단 솔루션 사용 전 후 트래픽 비교",
    "매크로 차단으로 세이브된 트래픽이나 자원사용량 보여줘",
    "통계 보여줘",
    "이미지 인식하는 매크로를 이용하여 캡챠를 뚫을 수 있어?",
    "매크로가 CAPTCHA를 뚫을 가능성은 없나요?",
    "캡챠를 매크로가 뚫으면 어떡해?",
    "오늘 차단자가 가장 많았던 시간이 언제야?",
    "어느 지역에서 우리 사이트에 가장 많이 매크로를 이용하는지 알고싶어",
    "어느 지역에서 우리 사이트에 가장 많은 공격을 하는지 알고싶어",
    "매크로 탐지 기준이 뭐야?",
    "걸러지는 기준이 뭐야?",
    "이용 가능한 명령이 무엇이 있을까?",
    "니가 할 수 있는 기능리스트를 보여줘 ",
    "매크로 머신러닝이 무엇인가요",
    "접속할 수 있는 IP 수 제한할래",
    "유저를  차단하고 싶어",
    "아이피 차단 ",
    "아이디 차단해줘",
    "매크로란?",
    "매크로가 뭐야?",
    "오늘 통계 엑셀로 뽑아줘, PDF로 다운받아줘",
    "작년 대비 이번 달의 탐지된 매크로의 트래픽 양을 확인하고 싶어",
    "오늘 매크로 차단을 통해 얼마만큼의 트래픽이 절약되었어?",
    "어떻게 매크로를 탐지해?",
    "매크로 제어 정책을 확인하고 싶어",
    "탐지 가능한 매크로의 유형이 어떻게 될까?",
    "매크로 매니저에서 정의한 매크로의 범위가 어디까지야",
    "매크로 점수에 대한 기준이 뭐야",
    "매크로 차단 시스템 원리를 모르겠어",
    "매크로로 정의되는 기준이 뭐야",
    "매크로가 차단 되는 방식이 궁금해",
    "매크로 탐지 조건에 대하여 설명해줘",
    "매크로 의심자에 대한 정보 보여줘",
    "사용자 누가 차단했어?",
    "시간에 따라 사용자가 얼마나 들어왔는지 보여줘",
    "접속자 중에 차단된 사람 비율이 어떻게 돼?",
    "추가 업데이트 예정인 기능이 있어?",
    "앞으로 한 시간동안 모든 정책을 해제 하고싶어",
    "앞으로 한 시간 동안 매크로의 접속을 완전히 막고싶어",
    "지금부터 3시간 동안은 접속자한테 점검 화면 띄워줘",
    "영구차단 말고 10분동안만 차단하고 싶어",
    "차단 정책을 바꾸고 싶어 사용자가 5분동안만 차단되도록",
    "매크로 이용자들에게 엄격한 차단 정책을 적용하고 싶어",
    "차단된 사용자 다 허용해주고 캡챠 뿌리는 방식으로 변경해줘",
    "정책을 추가 할 수 있을까?",
    "RULESET을 추가 하고 싶어요",
    "매크로 행위 분석 조건을 추가할 순 없어?",
    "직접 사용자 차단할 수 있게 화면 보여줘",
    "채팅 히스토리를 저장하지 않도록 설정하고 싶어",
    "채팅 내역을 지우고 싶어",
    "특정 시간대에 접속한 사람 다 차단해",
    "말레이시아에서 접속하는 유저들은 모두 차단해줘",
    "해외에서 들어오는 사용자는 다 차단해줘",
    "아이디의 접속 정보를 보고싶어",
    "매크로 의심자가 현재 어떻게 처리되고 있어?",
    "자동 차단 종료하고 싶어",
    "자동 차단 시작하고 싶어",
    "자동 차단 등록하고 싶어",
    "자동 차단 해제하고 싶어",
    "모듈 상태 서비스 동작 재기동 해줘",
    "모듈 상태 서비스 동작 종료 해줘",
    "모듈 상태 서비스 동작 시작 해줘",
    "모듈 상태 서비스 동작 확인 해줘",
    "대상 사이트 추가 방법 알려줘",
    "특정시간에 차단 현황 보여줘",
    "매크로 아이디나 아이피의 국가가 어디야",
    "해외 접속자에 대한 정보 보여줘",
    "특정 IP, 혹은 특정 대역은 모든 탐지에서 예외처리 하고싶어",
    "우리 회사 직원들은 매크로 이용할 수 있을까?",
    "유저는 탐지 하지 않아도 돼",
    "아이피 예외 처리",
    "유저는 매크로 이용자가 아니야",
    "매크로로 차단된 사용자에 대한 차단을 풀고싶어",
    "아이피 차단 해제",
    "현재 차단 중인 BOT리스트 보여줘",
    "사람들이 제일 많이 들어온 페이지가 뭐야?",
    "매크로 차단 기능을 테스트해보고 싶으면 어떻게 해야돼?",
    "기본제공 봇리스트 제외한 우리 사이트내에 블랙리스트를 관리하고 싶어",
    "그냥 일반적인 메뉴로 보여주면 안돼?",
    "봇 의심자 자동차단모드를 끄면 어떻게 돼?",
    "봇 판단 기준치를 몇으로 설정해야해?",
    "관리자 추가할래",
    "최적의 정책이 뭐야?",
    "설정 변경 이력 보여 줘",
    "현재 설정 알려 줘",
    "차단된 아이피에서 사용한 매크로 기능을 알고싶어요",
    "유저는 왜 차단된 거야?",
    "매크로 아이디나 아이피를 무슨 이유로 차단되었는지 알려줘",
    "아이디가 왜 차단되었는지 알려줘",
    "아이피 에 대하여 분석 해줘",
    "매크로 아이디나 아이피의 활동을 알려줘",
    "매크로 아이디나 아이피의 상세정보 알려줘",
    "IP 접속 기록 TOP10",
    "일별 매크로 접속 추이 알려줘",
    "매크로로 의심되고 있는 사용자에게 제공되는 CAPTCHA의 화면을 보여줘",
    "한 식별자가 한 계정으로 예약 후 다른 계정으로 로그인하여 예약을 하는 경우를 룰셋에 추가해줘",
    "날짜에 새롭게 탐지된 차단 매크로를 알려줘",
    "접근시도가 가장 많은 매크로 순으로 보여줘",
    "매크로로 차단된 사용자의 트래픽 타임라인 보여줘",
    "매크로가 가장 많이 접근한 페이지가 궁금해 또는 리스트로 보여줘",
    "접속한 사용자와 매크로의 비율을 알려줘",
    "매크로와 일반사용자의 비율을 알려줘",
    "매크로 점수가 가장 높은 순으로 알려줘",
    "매크로 아이디나 아이피이름 알려줘",
    "매크로 제품 구독 안하면 어떻게 될까?",
    "매크로 아이디나 아이피의 매크로점수를 알려줘",
    "오늘 하루 발생한 트래픽 분석해줘",
    "매크로 탐지기능을 통과하지 못한 매크로는 영구차단이 되나요?",
    "WELLCONN의 매크로 매니저의 장점이 뭐야",
    "매크로 매니저에 대해서 알려줘",
    "제품 특성에 대해 알고싶어요",
    "주요기능이 무엇인가요",
    "차단되지 않은 매크로는 무엇인가요?",
    "FINGERPRINTING 기법을 이용하여 어떤 값을 추출해",
    "FINGERPRINTING이 뭐야? ",
    "FINGERPRINT를 왜 사용하나요?",
    "캡차가 뭐야?",
    "CAPTCHA는 어느 상황에 사용하나요? ",
    "서버점검 요청하고 싶어",
    "우리 사이트에 적용할 수 있는 방법을 알려줘",
    "기술지원을 요청하고 싶어",
    "사용자가 잘못 차단되면 어떻게 해?",
    "이번달 미국에서 이용한 유저들을 확인하고 싶어",
    "BOT이름도 탐지 가능한가?",
    "헤더 분석을 통해서 BOT을 판별할 수 있어?",
    "매크로 프로파일링을 한다면 개인정보도 식별하여 저장합니까?",
    "어떤 유형의 매크로가 가장 많이 차단되었는지 알 수 있을까?",
    "매크로 이용량이 증가하면 알림을 줘",
    "BOT의 요청인지 확인하는 방법이 있을까?",
    "차단하지 못한 매크로 의심자를 확인하고 싶어",
    "유용한 봇이 차단되는 경우가 있을까?",
    "오늘 순수 유저의 트래픽을 확인하고 싶어",
    "오늘 매크로 이용량 알려줘",
    "접속자 리스트 보여줘",
    "도메인 등록해줘",
    "등록한 도메인 수정할래",
    "등록한 도메인 삭제할래",
    "도메인 리스트 보여줘",
    "행위분석결과 보여줘",
    "행위분석결과 확인",
    "행위분석결과 과다접속한 사람 누구야?",
    "행위분석결과 여러 개의 아이피로 접근한 사람 누구야?",
    "행위분석결과 비정상적인 방법으로 데이터 수집한 사람 누구야?",
    "행위분석결과 악성BOT으로 접속한 사람 누구야?",
    "행위분석결과 도메인에 접속한 사람 누구야?",
    "행위분석결과 어느 도메인에 접속했어?",
    "행위분석결과 의심가는 차단된 사람들 알고싶어",
    "추천 검색",
    "접속자리스트 차단되지 않은 매크로 보여줘",
    "너는 누구야?",
    "너 뭐야",
    "엠버스터가 뭐야?",
    "매크로 판단 기준",
    "HTML 헤더분석이 뭐야?",
    "아이피 분석이 뭐야?",
    "행위분석이 뭐야?",
    "CAPTCHA는 뭐야?",
    "JS CHALLENGE가 뭐야?",
    "사용하는 방법이 뭐야?",
    "어떻게 이용하는 거야?",
    "이용하는 방법이 뭐야?",
    "이용하는 방법",
    "사용법",
    "이용법",
    "이용하는 법",
    "어떻게 써?",
    "어떻게 사용하나요?"
];
for (let idx in q) {
    const item = q[idx];
    setTimeout(() => insertChatDB(item , "-" , 1) , idx * 500); // idx에 따라 대기시간을 조절
}
}
*/


function getDomainParamList(params){
let dmn_nm_list = [];
let dmn_sn_list = [];

const _key = 'getDomain';

let dmnParams = [];


for(let key in params){
    // 날짜정보 param 추출
    if(key.includes(_key)){
        const _val = params[key];
        dmnParams.push(_val);
    }
}
    
    

for(let idx in dmnParams){
    const item = JSON.parse(dmnParams[idx]);
    const {sys_group_nm , dmn_sn} = item;
    
    dmn_nm_list.push(sys_group_nm);
    dmn_sn_list.push(dmn_sn);
}

if(dmn_nm_list.length==0) return null;


return {dmn_nm_list , dmn_sn_list};
}


function getDateWord(searchDate, param){

let msg = '';


let searchDate_v2 = param?.searchDate_v2 || null; 
if(searchDate_v2){
    searchDate_v2 = JSON.parse(searchDate_v2);
    const {search_from = {} , search_to = {}} = searchDate_v2;
    
    if( ( search_from == null || JSON.stringify(search_from) == '{}') && ( search_to == null || JSON.stringify(search_to)  == '{}') ){
        return {
            msg_prev : '금일기준의',
            msg_after : `'xxxx년xx월xx일부터 xxxx년xx월xx일까지' 처럼 조회를 원하는 날짜를 넣어 검색해보세요.`
        }
    }
    
    const searchFrDate = new Date(search_from.date);
    const searchToDate = new Date(search_to.date);
    // validation chk
    if(search_from.date > search_to.date){
        let tmpMsg = '';
        
        
        if(search_from != null){
            tmpMsg += `${search_from.word}(<span style="color:red">${search_from.date}</span>) `;
        }
            
        if(search_to != null){
            tmpMsg += `${search_to.word}(<span style="color:red">${search_to.date}</span>)`;
        }else{
            if(tmpMsg != '') tmpMsg += '오늘까지의';
        }
        
        tmpMsg = tmpMsg.trim();
        
        return {
            msg_prev : `잘못된 날짜 기준을 입력했습니다.<br>
            "${tmpMsg}"는 조회 기준 날짜로 사용할 수 없습니다.<br>
            조회를 원하시는 기간은 반드시 오름차순으로 입력해주세요<br>
            <br>
            금일기준의`,
            msg_after : `'xxxx년xx월xx일부터 xxxx년xx월xx일까지' 처럼 조회를 원하는 날짜를 넣어 검색해보세요.`
        }
        
    }
    
    
    if( search_from.date == search_to.date){
        msg = `${search_from.word}(${search_from.date})기준 날짜의`;
        return {
            msg_prev : msg,
            msg_after : ''
        }
    }
    
    if(search_from.word == search_to.word){
        msg = `${search_from.word}(${search_from.date} ~ ${search_to.date}) 기준 날짜의`;
        return {
            msg_prev : msg,
            msg_after : ''
        }
    }
    

    
    
    
    if(search_from != null){
        msg += `${search_from.word}(${search_from.date}) `;
    }
        
    if(search_to != null){
        msg += `${search_to.word}(${search_to.date})`;
    }else{
        if(msg != '') msg += '오늘까지의';
    }
    
    msg = msg.trim();
    
    msg += '<br>기준 날짜의';
    
    return {
        msg_prev : msg,
        msg_after : ''
    }; 
    
    
}



const {search_from , search_to} = searchDate;

if(search_from == null && search_to == null){
    return {
        msg_prev : '금일기준의',
        msg_after : `'xxxx년xx월xx일부터 xxxx년xx월xx일까지' 처럼 조회를 원하는 날짜를 넣어 검색해보세요.`
    }
}

if( search_from == search_to){
    msg = `${search_from} 기준 날짜의`;
}


return {
    msg_prev : msg,
    msg_after : ''
};

};