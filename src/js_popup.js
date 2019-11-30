var $badwordsCard = $('#badwords-card');
var $badwordsCount = $('#badwords-count');
var $badwordsList = $('#badwords-list');
var $keywordsCard = $('#keywords-card');
var $keywordsList = $('#keywords-list');


// Popup open event
$('document').ready(function () {
    $('#text').focus();

    // 결과 초기화
    initialize();
});

// 초기화
function initialize() {
    $badwordsCard.hide();
    $keywordsCard.hide();
    $badwordsCount.text(0);
    $badwordsList.empty();
}

// 검사하기 버튼 클릭
$('#btn-check').click(function () {
    // 결과 초기화
    initialize();

    var data = {
        text: $('#text').val()
    };

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/check",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data)
    })
        .done(function (responseData) {
            $badwordsCard.show();
            $keywordsCard.show();

            // 금지어 있을때
            if (responseData.badwords) {
                const badwordsMap = new Map(Object.entries(responseData.badwords));

                // 금지어 목록
                var ul = document.createElement("ul");
                ul.className = "list-inline";

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

            } else {
                $badwordsList.text('완벽합니다!');
            }

            // 키워드 있을때
            if (responseData.keywords) {
                const keywordsMap = new Map(Object.entries(responseData.keywords));

                // 키워드 목록
                var ul = document.createElement("ul");
                ul.className = "list-inline";

                keywordsMap.forEach(function (value, key) {
                    var span = document.createElement("span");
                    span.style.color = "blue";
                    span.innerHTML = "&bull; ";

                    var li = document.createElement("li");
                    li.appendChild(span);
                    li.appendChild(document.createTextNode(key + " : " + value));

                    ul.appendChild(li);
                });

                $keywordsList.append(ul);
            }
        })
        .fail(function (error) {
            console.log(error);
        });
});