// Service Worker for 交通轉乘記錄器
// Version 1.0.0

const CACHE_NAME = 'transit-planner-v1.0.0';
const urlsToCache = [
    './',
    './index.html',
    './app.js',
    './manifest.json'
];

// 安裝事件
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('App shell cached successfully');
                // 立即激活新的 Service Worker
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Caching failed:', error);
            })
    );
});

// 激活事件
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 清除舊版本的快取
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker activated');
            // 立即控制所有頁面
            return self.clients.claim();
        })
    );
});

// 攔截網路請求
self.addEventListener('fetch', (event) => {
    // 只處理 GET 請求
    if (event.request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 如果快取中有請求的資源，直接返回
                if (response) {
                    console.log('Serving from cache:', event.request.url);
                    return response;
                }
                
                // 否則從網路獲取
                console.log('Fetching from network:', event.request.url);
                return fetch(event.request).then((response) => {
                    // 檢查是否是有效的回應
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // 複製回應（因為 response 是 stream，只能使用一次）
                    const responseToCache = response.clone();
                    
                    // 將新獲取的資源加入快取
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                }).catch(() => {
                    // 網路請求失敗，如果是導航請求，返回離線頁面
                    if (event.request.destination === 'document') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});

// 處理來自主應用的消息
self.addEventListener('message', (event) => {
    console.log('Service Worker received message:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME).then(() => {
            console.log('Cache cleared');
            event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
        });
    }
});

// 推送通知事件（預留功能）
self.addEventListener('push', (event) => {
    console.log('Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : '您有新的交通提醒',
        icon: './icon-192x192.png',
        badge: './icon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: '查看詳情',
                icon: './icon-192x192.png'
            },
            {
                action: 'close',
                title: '關閉',
                icon: './icon-192x192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('交通轉乘記錄器', options)
    );
});

// 通知點擊事件
self.addEventListener('notificationclick', (event) => {
    console.log('Notification click received');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('./')
        );
    }
});

// 背景同步事件（預留功能）
self.addEventListener('sync', (event) => {
    console.log('Background sync triggered');
    
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // 在這裡可以執行背景同步邏輯
            // 例如同步離線時保存的路線資料
            console.log('Performing background sync...')
        );
    }
});

// 錯誤處理
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker unhandled promise rejection:', event.reason);
});
