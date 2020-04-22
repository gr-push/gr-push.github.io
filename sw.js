if ('permissions' in navigator) {
    navigator.permissions.query({ name: 'notifications' }).then(function (notificationPerm) {
        notificationPerm.onchange = function () {
            console.log("User decided to change his seettings. New permission status: " + notificationPerm.state);
        };
    });
}

self.addEventListener('push', async event => {
    const {
        data,
    } = event;

    if (data) {
        const displayData = await data.json();

        event.waitUntil(self.registration.showNotification(displayData.title, {
            body: displayData.message,
            icon: displayData.iconUrl,
            image: displayData.imageUrl,
            data: displayData.data,
        }));
    }
});
self.addEventListener('notificationclick', event => {
    const url = event.notification.data.siteUrl;

    event.waitUntil(clients.matchAll({
        type: "window"
    }).then(function(clientList) {
        for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];

            if (client.url === url && 'focus' in client)
                return client.focus();
        }
        if (clients.openWindow)
            return clients.openWindow(url);
    }));
});
self.addEventListener('notificationclose', event => {
    // placeholder
});
