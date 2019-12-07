var $textarea = $('#text');
var $btnCheck = $('#btn-check');
var $badwordsCard = $('#badwords-card');
var $badwordsCount = $('#badwords-count');
var $badwordsList = $('#badwords-list');
var $keywordsCard = $('#keywords-card');
var $keywordsCount = $('#keywords-count');
var $keywordsList = $('#keywords-list');
var $textCount = $('#text-count');



// Popup open event
$('document').ready(function () {
    $textarea.focus();

    // 결과 초기화
    initialize();

    // Chrome stroage 조회
    chrome.storage.sync.get('text', function (response) {
        if (response.text) {
            $textarea.val(response.text);
            $textCount.text($textarea.val().length);
            // check(true);
            check();
        }
    });

    $textCount.text($textarea.val().length);
});

// 초기화
function initialize() {
    $badwordsCard.hide();
    $badwordsCount.text(0);
    $badwordsList.empty();
    $keywordsCard.hide();
    $keywordsCount.text(0);
    $keywordsList.empty();
}

// 검사하기 버튼 클릭
$('#btn-check').click(function () {
    // 결과 초기화
    initialize();

    if ($textarea.val()) {
        check();
    }
    else {
        $textarea.focus();

        // Chrome stroage 저장
        chrome.storage.sync.set({ 'badwordsCount': '' });
    }

    // Chrome stroage 저장
    chrome.storage.sync.set({ 'text': $textarea.val() });
});

function check() {
    $.ajax({
        type: "POST",
        // url: "http://localhost:8081/check",
        url: "http://52.35.43.187:8081/check",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($textarea.val())
    })
        .done(function (responseData) {
            $badwordsCard.show();
            $keywordsCard.show();

            // 금지어 있을때
            if (responseData.badwords) {
                const badwordsMap = new Map(Object.entries(responseData.badwords));

                // 금지어 목록
                var ul = document.createElement("ul");
                ul.className = "list-inline scroll-badwords";

                // 금지어 카운트
                var badwordsCount = 0;
                badwordsMap.forEach(function (value, key) {
                    badwordsCount += +value;

                    var span = document.createElement("span");
                    span.style.color = "red";
                    span.innerHTML = "&bull; ";

                    var li = document.createElement("li");
                    li.appendChild(span);
                    li.appendChild(document.createTextNode(key + " : " + value));

                    ul.appendChild(li);
                });

                $badwordsCount.text(badwordsCount);
                $badwordsList.append(ul);

                // Chrome stroage 저장
                chrome.storage.sync.set({ 'badwordsCount': badwordsCount });

            } else {
                $badwordsList.text('완벽합니다!');

                // Chrome stroage 저장
                chrome.storage.sync.set({ 'badwordsCount': '' });
            }


            // 키워드 있을때
            if (responseData.keywords) {
                const keywordsMap = new Map(Object.entries(responseData.keywords));

                // 키워드 목록
                var ul = document.createElement("ul");
                ul.className = "list-inline scroll-keywords";

                // 키워드 카운트
                var keywordsCount = 0;
                keywordsMap.forEach(function (value, key) {
                    keywordsCount += +value;

                    var span = document.createElement("span");
                    span.style.color = "blue";
                    span.innerHTML = "&bull; ";

                    var li = document.createElement("li");
                    li.appendChild(span);
                    li.appendChild(document.createTextNode(key + " : " + value));

                    ul.appendChild(li);
                });

                $keywordsCount.text(keywordsCount);
                $keywordsList.append(ul);
            }


        })
        .fail(function (error) {
            console.log(error);
        });
}

// Text 글자수 카운트
$textarea.on('keyup propertychange paste', function () {
    $textCount.text($textarea.val().length);
});