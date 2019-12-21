var $textarea = $('#text');
var $btnCheck = $('#btn-check');
var $badwordsCard = $('#badwords-card');
var $badwordsCount = $('#badwords-count');
var $badwordsList = $('#badwords-list');
var $keywordsCard = $('#keywords-card');
var $keywordsCount = $('#keywords-count');
var $keywordsList = $('#keywords-list');
var $keywordSearchCountList = $('#keyword-search-amount-list');
var $textCount = $('#text-count');
var $badwordsProgressbar = $('#badwords-progressbar');
var $btnBadwordsToggle = $('#btn-badwords-toggle');
var $btnKeywordsToggle = $('#btn-keywords-toggle');




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
    $keywordSearchCountList.empty();
    $badwordsProgressbar.width("100%");
}

// 검사하기 버튼 클릭
$btnCheck.click(function () {

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

// 금지어 Toggle
$btnBadwordsToggle.click(function () {
    $badwordsList.toggle('fast');

    $btnBadwordsToggle.text() === "∧" ?
        $btnBadwordsToggle.text("∨") :
        $btnBadwordsToggle.text("∧");
});

// 키워드 Toggle
$btnKeywordsToggle.click(function () {
    $('#keywords-list-toggle').toggle('fast');

    $btnKeywordsToggle.text() === "∧" ?
        $btnKeywordsToggle.text("∨") :
        $btnKeywordsToggle.text("∧");
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
                    span.style.color = "#dc3545";
                    span.innerHTML = "&bull; ";

                    var anchor = document.createElement("a");
                    anchor.setAttribute("href", "#");
                    anchor.setAttribute("class", "badword");
                    anchor.setAttribute("word", key);
                    anchor.innerText = key + " : " + value;

                    var li = document.createElement("li");
                    li.appendChild(span);
                    li.appendChild(anchor);

                    ul.appendChild(li);
                });


                $badwordsCount.text(badwordsCount);
                $badwordsList.append(ul);

                // 금지어 Progress bar
                $badwordsProgressbar.width(badwordsCount >= 10 ? 10 : (10 - badwordsCount) * 10 + "%");

                // Chrome stroage 저장
                chrome.storage.sync.set({ 'badwordsCount': badwordsCount });

                // 금지어 클릭
                $(".badword").on("click", function (event) {
                    var badword = event.currentTarget.attributes.word.value;
                    highlightWords(badword);
                });

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

                // 키워드 검색량
                var ul2 = document.createElement("ul");
                ul2.className = "list-inline scroll-keywords";

                keywordsMap.forEach(function (value, key) {
                    // 키워드
                    var span = document.createElement("span");
                    span.style.color = "#28a745";
                    span.innerHTML = "&bull; ";

                    var anchor = document.createElement("a");
                    anchor.setAttribute("href", "#");
                    anchor.setAttribute("class", "keyword");
                    anchor.innerText = key + " : " + value;

                    var li = document.createElement("li");
                    li.appendChild(span);
                    li.appendChild(anchor);

                    ul.appendChild(li);

                    // 키워드 검색량
                    var anchor2 = document.createElement("a");
                    anchor2.setAttribute("href", "#");
                    anchor2.setAttribute("class", "search-amount");
                    anchor2.setAttribute("keyword", key);
                    anchor2.innerText = "검색량조회";

                    var li2 = document.createElement("li");
                    li2.appendChild(anchor2);

                    ul2.appendChild(li2);
                });

                $keywordsCount.text(keywordsMap.size);
                $keywordsList.append(ul);
                $keywordSearchCountList.append(ul2);
            }

            // 키워드 검색량 클릭
            $(".search-amount").on("click", function (event) {
                var keyword = event.currentTarget.attributes.keyword.value;
                getKeywordSearchAmount(keyword);
            });
        })
        .fail(function (error) {
            console.log(error);
        });
}

// Text 글자수 카운트
$textarea.on('keyup propertychange paste', function () {
    $textCount.text($textarea.val().length);
});

function highlightWords(word) {

    console.log(word);

    $textarea.highlightWithinTextarea({
        highlight: word
    });
}

function getKeywordSearchAmount(keyword) {
    console.log(keyword);
}