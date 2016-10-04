$(document).ready(function () {
    if (!("Notification" in window)) {
        console.log('Ваш браузер не поддерживает HTML Notifications, его необходимо обновить.');
    }
    else if (Notification.permission === "granted") {
        console.log('Права получены ранее');
        var notification = new Notification('Подключение',
            { body: 'да-да', dir: 'auto', icon: 'icon.jpg' }
        );
        notification.onclick =  function() {
            console.log('Пользователь кликнул на уведомление');
        };
        notification.onshow =  function() {
            console.log('Уведомление показано');
        };
        notification.onclose =  function() {
            console.log('Уведомление закрыли');
        }
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
        if (permission === "granted") {
            console.log('Права успешно получены');
            var notification = new Notification('Подключение',
                { body: 'да-да', dir: 'auto', icon: 'icon.jpg' }
            );
            notification.onclick =  function() {
                console.log('Пользователь кликнул на уведомление');
            };
            notification.onshow =  function() {
                console.log('Уведомление показано');
            };
            notification.onclose =  function() {
                console.log('Уведомление закрыли');
            }
        } else {
            console.log('Права не получены.Юзер отклонил наш запрос'); // Юзер отклонил наш запрос на показ уведомлений
            }
        });
    } else {
        console.log('Права не получены');
    }
});




