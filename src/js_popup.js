// Popup open event
$('document').ready(function () {
    $('#text').focus();
});

// 검사하기 버튼 클릭
$('#btn-check').click(function () {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://riacg0udgj.execute-api.ap-northeast-2.amazonaws.com/dev/hello-lambda');
    xhr.onreadystatechange = function (event) {
        document.getElementById("scan-result").innerHTML = event.target.response;
    }
    xhr.send(JSON.stringify($('#text').val()));
});