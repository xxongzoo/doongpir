
$(window).load(function() {
    $('.messages-content').mCustomScrollbar();
    setTimeout(function() {
        fakeMessage();
    }, 100);
});

function updateScrollbar() {
    $('.messages-content').mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
        scrollInertia: 10,
        timeout: 0
    });
}

function setDate(){
    let d = new Date();
    let m = d.getMinutes();
    if (m != d.getMinutes()) {
        m = d.getMinutes();
        $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
    }
}

// 변수 생성
let userMessages = [];
let assistantMessages = [];

// 가짜 메시지 보내는 함수
function fakeMessage() {
    $('<div class="message new"><figure class="avatar"><img src="fireprofile.png" /></figure>안녕? 난 장꾸둥이야. 오늘 뭐했어?</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();H
    updateScrollbar();
}

async function sendMessage() {
    // 사용자의 메시지 가져옴
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    if ($.trim(message) == '') {
        return false; // 메시지가 비어있으면 함수를 종료
    }

    // 채팅 말풍선에 사용자의 메시지 출력
    $('<div class="message message-personal">' + message + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    messageInput.value = ''; // 입력 필드 초기화
    updateScrollbar(); // 스크롤바 업데이트

    // Push
    userMessages.push(message);

    // 백엔드 서버에 메시지를 보내고 응답 출력
    try {
        const response = await fetch('http://localhost:4007/fortuneTell', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userMessages: userMessages,
                assistantMessages: assistantMessages,
            })
        });

        if (!response.ok) {
            throw new Error('Request failed with status ' + response.status);
        }

        const data = await response.json();

        // Push
        assistantMessages.push(data.assistant);

        // 채팅 말풍선에 챗GPT 응답 출력
        $('<div class="message new">' + data.assistant + '</div>').appendTo($('.mCSB_container')).addClass('new');
        setDate();
        updateScrollbar();

    } catch (error) {
        console.error('Error:', error);
    }
}

$(window).on('keydown', function(e) {
    if (e.which == 13) {
        sendMessage();
        return false; // 기본 엔터 키 동작 방지
    }
});
