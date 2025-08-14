// 交通轉乘記錄器 - 主要應用邏輯
// PWA Version for GitHub Pages

// 應用狀態
let currentRouteSegments = [];
let savedRoutes = [];
let routeCounter = 1;
let deferredPrompt;
let isDataLoaded = false;

// 強化的實時保存當前路線狀態
function saveCurrentState() {
    try {
        const routeNameElement = document.getElementById('routeName');
        const currentState = {
            routeName: routeNameElement ? routeNameElement.value || '' : '',
            segments: currentRouteSegments,
            timestamp: Date.now(),
            version: '1.0'
        };
        localStorage.setItem('transitCurrentRoute', JSON.stringify(currentState));
        // 同時保存到一個備用key
        localStorage.setItem('transitCurrentRoute_backup', JSON.stringify(currentState));
        console.log('當前狀態已保存:', currentState);
    } catch (error) {
        console.error('保存當前狀態失敗:', error);
    }
}

// 強化的載入當前路線狀態
function loadCurrentState() {
    try {
        let saved = localStorage.getItem('transitCurrentRoute');
        // 如果主要保存失敗，嘗試備用保存
        if (!saved) {
            saved = localStorage.getItem('transitCurrentRoute_backup');
        }
        
        if (saved) {
            const currentState = JSON.parse(saved);
            if (currentState.segments && currentState.segments.length > 0) {
                currentRouteSegments = currentState.segments;
                
                // 確保DOM元素存在後再設置值
                setTimeout(() => {
                    const routeNameElement = document.getElementById('routeName');
                    if (routeNameElement && currentState.routeName) {
                        routeNameElement.value = currentState.routeName;
                    }
                    updateTimelinePreview();
                    console.log('當前狀態已恢復:', currentState);
                }, 100);
                
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('載入當前狀態失敗:', error);
        return false;
    }
}

// 頁面可見性變化時保存數據
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        console.log('頁面隱藏，保存數據');
        saveCurrentState();
        saveData();
    }
});

// 頁面卸載前保存數據
window.addEventListener('beforeunload', function() {
    console.log('頁面即將卸載，保存數據');
    saveCurrentState();
    saveData();
});

// 定期自動保存（每30秒）
setInterval(function() {
    if (currentRouteSegments.length > 0) {
        saveCurrentState();
        console.log('定期自動保存執行');
    }
}, 30000);

// 交通工具配置
const transportConfig = {
    'taiwan-railway': { name: '台鐵', color: 'taiwan-railway', icon: '🚂', needsSeat: true },
    'high-speed': { name: '高鐵', color: 'high-speed', icon: '🚄', needsSeat: true },
    'metro': { name: '捷運', color: 'metro-blue', icon: '🚇', needsSeat: false },
    'tram': { name: '輕軌', color: 'metro-orange', icon: '🚊', needsSeat: false },
    'bus': { name: '市區公車', color: 'bus', icon: '🚌', needsSeat: false },
    'intercity-bus': { name: '國道客運', color: 'intercity-bus', icon: '🚍', needsSeat: true },
    'walking': { name: '步行', color: 'walking', icon: '🚶', needsSeat: false }
};

// 顏色關鍵字對應
const colorMapping = {
    '紅': 'metro-red', '红': 'metro-red',
    '橘': 'metro-orange', '橙': 'metro-orange',
    '黃': 'metro-yellow', '黄': 'metro-yellow',
    '綠': 'metro-green', '绿': 'metro-green',
    '藍': 'metro-blue', '蓝': 'metro-blue',
    '紫': 'metro-purple',
    '棕': 'metro-brown', '咖啡': 'metro-brown',
    '粉': 'metro-pink'
};

// 頁面載入完成時初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('交通轉乘記錄器載入中...');
    
    // 確保DOM完全載入後再初始化
    setTimeout(function() {
        // 載入保存的資料
        loadSavedData();
        
        // 初始化 PWA 功能
        initializePWA();
        
        // 添加路線名稱輸入的實時保存
        const routeNameInput = document.getElementById('routeName');
        if (routeNameInput) {
            routeNameInput.addEventListener('input', function() {
                saveCurrentState();
            });
            
            // 失去焦點時也保存
            routeNameInput.addEventListener('blur', function() {
                saveCurrentState();
            });
        }
        
        // 標記數據已載入
        isDataLoaded = true;
        
        // 更新狀態
        updateStatus('🎯 應用載入完成！資料已恢復');
        updateOnlineStatus();
        
        console.log('應用初始化完成');
    }, 200);
});

// 強化版載入保存的資料
function loadSavedData() {
    try {
        // 載入已保存的路線
        const saved = localStorage.getItem('transitRoutes');
        if (saved) {
            savedRoutes = JSON.parse(saved);
            routeCounter = savedRoutes.length;
            updateSavedRoutesDisplay();
            updateRouteCount();
        }
        
        // 載入當前編輯中的路線狀態
        const loaded = loadCurrentState();
        if (loaded) {
            console.log('已恢復上次編輯的路線');
        }
        
        console.log('數據載入完成');
    } catch (error) {
        console.error('載入資料失敗:', error);
    }
}

// 保存資料到 localStorage
function saveData() {
    try {
        localStorage.setItem('transitRoutes', JSON.stringify(savedRoutes));
    } catch (error) {
        console.error('保存資料失敗:', error);
    }
}

// PWA 初始化
function initializePWA() {
    // Service Worker 註冊
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('Service Worker 註冊成功:', registration);
            })
            .catch(error => {
                console.log('Service Worker 註冊失敗:', error);
            });
    }
    
    // PWA 安裝提示
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        document.getElementById('installBtn').classList.remove('hide');
        updateStatus('💡 可以安裝為手機App！點擊右上角"安裝APP"按鈕');
    });
    
    // 在線/離線狀態監聽
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

// 安裝 PWA
function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                updateStatus('🎉 App安裝成功！');
                document.getElementById('installBtn').classList.add('hide');
            }
            deferredPrompt = null;
        });
    }
}

// 更新在線狀態
function updateOnlineStatus() {
    const statusBadge = document.getElementById('statusBadge');
    const isOnline = navigator.onLine;
    statusBadge.textContent = `PWA版本 - ${isOnline ? '在線' : '離線'}`;
    
    if (!isOnline) {
        updateStatus('📱 已切換為離線模式，功能正常運作');
    }
}

// 更新狀態訊息
function updateStatus(message) {
    document.getElementById('statusMessage').textContent = message;
    console.log(message);
}

// 更新路線計數
function updateRouteCount() {
    document.getElementById('routeCount').textContent = savedRoutes.length;
}

// 自動偵測線路顏色
function detectLineColor(lineText) {
    if (!lineText) return 'metro-blue';
    
    console.log('檢測線路顏色:', lineText);
    
    for (const [colorKey, colorClass] of Object.entries(colorMapping)) {
        if (lineText.includes(colorKey + '線') || lineText.includes(colorKey)) {
            console.log('找到顏色:', colorKey, '對應:', colorClass);
            return colorClass;
        }
    }
    
    console.log('使用預設顏色: metro-blue');
    return 'metro-blue';
}

// 計算時間差（分鐘）
function calculateDuration(startTime, endTime) {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    return Math.round((end - start) / (1000 * 60));
}

// 格式化時間顯示
function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes}分鐘`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小時${mins}分` : `${hours}小時`;
}

// 顯示新增路段表單
function showAddSegmentForm() {
    document.getElementById('addSegmentCard').classList.remove('hide');
    
    // 自動設定建議時間
    if (currentRouteSegments.length > 0) {
        const lastSegment = currentRouteSegments[currentRouteSegments.length - 1];
        const nextTime = new Date(`2000-01-01 ${lastSegment.endTime}`);
        nextTime.setMinutes(nextTime.getMinutes() + (lastSegment.transferTime || 5));
        
        const timeString = nextTime.toTimeString().slice(0, 5);
        document.getElementById('startTime').value = timeString;
    }
}

// 隱藏新增路段表單
function hideAddSegmentForm() {
    document.getElementById('addSegmentCard').classList.add('hide');
    clearSegmentForm();
}

// 切換線路輸入框和座位號碼顯示
function toggleLineInput() {
    const transport = document.getElementById('transport').value;
    const lineGroup = document.getElementById('lineInputGroup');
    const seatGroup = document.getElementById('seatInputGroup');
    
    // 顯示/隱藏線路輸入框
    if (transport === 'metro' || transport === 'tram') {
        lineGroup.classList.remove('hide');
    } else {
        lineGroup.classList.add('hide');
        document.getElementById('metroLine').value = '';
    }
    
    // 顯示/隱藏座位號碼輸入框
    if (transportConfig[transport]?.needsSeat) {
        seatGroup.classList.remove('hide');
    } else {
        seatGroup.classList.add('hide');
        document.getElementById('seatNumber').value = '';
    }
}

// 新增路段
function addSegment() {
    try {
        const fromStation = document.getElementById('fromStation').value.trim();
        const toStation = document.getElementById('toStation').value.trim();
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const transport = document.getElementById('transport').value;
        const metroLine = document.getElementById('metroLine').value.trim();
        const cost = parseInt(document.getElementById('cost').value) || 0;
        const vehicleNumber = document.getElementById('vehicleNumber').value.trim();
        const platform = document.getElementById('platform').value.trim();
        const seatNumber = document.getElementById('seatNumber')?.value.trim() || '';
        const transferTime = parseInt(document.getElementById('transferTime').value) || 0;
        
        console.log('添加路段:', { fromStation, toStation, startTime, endTime, transport, metroLine, seatNumber });
        
        if (!fromStation || !toStation || !startTime || !endTime) {
            alert('請填寫完整的路段資訊！');
            return;
        }
        
        const duration = calculateDuration(startTime, endTime);
        if (duration <= 0) {
            alert('到達時間必須晚於出發時間！');
            return;
        }
        
        // 處理捷運/輕軌線路名稱和顏色
        let transportName = transportConfig[transport].name;
        let transportColor = transportConfig[transport].color;
        
        if ((transport === 'metro' || transport === 'tram') && metroLine) {
            transportName = metroLine;
            transportColor = detectLineColor(metroLine);
        }
        
        const segment = {
            id: Date.now(),
            fromStation,
            toStation,
            startTime,
            endTime,
            transport,
            transportName,
            transportColor,
            cost,
            vehicleNumber,
            platform,
            seatNumber,
            transferTime,
            duration
        };
        
        currentRouteSegments.push(segment);
        console.log('路段已添加:', segment);
        updateTimelinePreview();
        saveCurrentState(); // 立即保存當前狀態
        hideAddSegmentForm();
        updateStatus(`✅ 路段已新增！目前共${currentRouteSegments.length}段`);
        
    } catch (error) {
        console.error('添加路段時發生錯誤:', error);
        alert('添加路段時發生錯誤，請稍後再試');
    }
}

// 清空路段表單
function clearSegmentForm() {
    document.getElementById('fromStation').value = '';
    document.getElementById('toStation').value = '';
    document.getElementById('cost').value = '';
    document.getElementById('vehicleNumber').value = '';
    document.getElementById('platform').value = '';
    document.getElementById('transferTime').value = '';
    document.getElementById('metroLine').value = '';
    document.getElementById('seatNumber').value = '';
    document.getElementById('lineInputGroup').classList.add('hide');
    document.getElementById('seatInputGroup').classList.add('hide');
    document.getElementById('transport').value = 'taiwan-railway';
    
    // 重新觸發顯示邏輯
    toggleLineInput();
}

// 更新時間軸預覽
function updateTimelinePreview() {
    const preview = document.getElementById('routePreview');
    const timeline = document.getElementById('timeline');
    
    if (currentRouteSegments.length === 0) {
        preview.classList.add('hide');
        return;
    }
    
    preview.classList.remove('hide');
    timeline.innerHTML = '';
    
    let totalCost = 0;
    let totalDuration = 0;
    
    // 創建站點集合，確保每個站點都獨立顯示
    const stations = [];
    
    currentRouteSegments.forEach((segment, index) => {
        totalCost += segment.cost;
        
        // 添加起點站（只在第一段或站名不同時添加）
        if (index === 0) {
            stations.push({
                type: 'station',
                time: segment.startTime,
                name: segment.fromStation,
                color: segment.transportColor
            });
        } else {
            const prevSegment = currentRouteSegments[index - 1];
            if (prevSegment.toStation !== segment.fromStation) {
                // 前一段的終點站
                stations.push({
                    type: 'station',
                    time: prevSegment.endTime,
                    name: prevSegment.toStation,
                    color: prevSegment.transportColor
                });
                
                // 轉乘信息
                // 🚀 改回簡單版本：
stations.push({
    type: 'transfer-info',
    text: `🔄 轉乘<br>${prevSegment.toStation} → ${segment.fromStation}`
});
                
                if (prevSegment.transferTime > 0) {
                    stations.push({
                        type: 'transfer-time',
                        text: `🚶 轉乘等待 ${prevSegment.transferTime}分鐘`
                    });
                }
                
                // 當前段的起點站
                stations.push({
                    type: 'station',
                    time: segment.startTime,
                    name: segment.fromStation,
                    color: segment.transportColor
                });
            }
        }
        
        // 添加交通工具信息
        stations.push({
            type: 'transport',
            transportName: segment.transportName,
            transportColor: segment.transportColor,
            icon: transportConfig[segment.transport].icon,
            vehicleNumber: segment.vehicleNumber,
            platform: segment.platform,
            seatNumber: segment.seatNumber,
            duration: segment.duration,
            cost: segment.cost,
            segmentIndex: index
        });
        
        // 最後一段的終點站
        if (index === currentRouteSegments.length - 1) {
            stations.push({
                type: 'station',
                time: segment.endTime,
                name: segment.toStation,
                color: segment.transportColor
            });
        }
    });
    
    // 渲染所有站點和交通工具
    // 🔧 在 updateTimelinePreview() 函數中，找到 stations.forEach() 部分
// 大約在第334行開始，替換整個 forEach 邏輯：

stations.forEach((item) => {
    const div = document.createElement('div');
    
    if (item.type === 'station') {
        div.className = 'timeline-item';
        div.innerHTML = `
            <div class="timeline-dot dot-${item.color}"></div>
            <div class="station-info">
                <div class="station-time">${item.time}</div>
                <div class="station-name">${item.name}</div>
            </div>
        `;
    } else if (item.type === 'transport') {
        div.className = 'timeline-item';
        div.style.position = 'relative';
        div.innerHTML = `
    <div class="timeline-icon">
        ${item.icon}
    </div>
    <div class="transport-card transport-${item.transportColor}">
        <div class="transport-header">
            <span class="transport-name">
                ${item.transportName}${item.vehicleNumber ? ` ${item.vehicleNumber}` : ''}
            </span>
        </div>
        <div class="transport-details">
            ${item.platform ? `📍 ${item.platform}` : ''}
            ${item.seatNumber ? `${item.platform ? ' | ' : ''}💺 ${item.seatNumber}` : ''}
            <br>⏱️ 行程時間 ${formatDuration(item.duration)}
            <br>💰 NT$${item.cost}
        </div>
        <button class="button button-small button-red delete-button" onclick="removeSegment(${item.segmentIndex})">刪除</button>
    </div>
`;
    } else if (item.type === 'transfer-info') {
        div.className = 'transfer-info';
        div.innerHTML = item.text;
    } else if (item.type === 'transfer-time') {
        div.className = 'transfer-info';
        div.innerHTML = item.text;
    }
    
    timeline.appendChild(div);
});
    
    // 計算總時間
    if (currentRouteSegments.length > 0) {
        const firstSegment = currentRouteSegments[0];
        const lastSegment = currentRouteSegments[currentRouteSegments.length - 1];
        totalDuration = calculateDuration(firstSegment.startTime, lastSegment.endTime);
    }
    
    // 更新總計顯示
    document.getElementById('totalTime').textContent = formatDuration(totalDuration);
    document.getElementById('totalCost').textContent = `NT$${totalCost}`;
}

// 移除路段
function removeSegment(index) {
    console.log('嘗試刪除路段:', index);
    
    if (index >= 0 && index < currentRouteSegments.length) {
        if (confirm('確定要刪除這個路段嗎？')) {
            currentRouteSegments.splice(index, 1);
            updateTimelinePreview();
            saveCurrentState(); // 立即保存狀態
            updateStatus('🗑️ 路段已刪除！');
        }
    }
}

// 儲存完整路線
function saveRoute() {
    const routeName = document.getElementById('routeName').value.trim();
    
    if (!routeName) {
        alert('請輸入路線名稱！');
        return;
    }
    
    if (currentRouteSegments.length === 0) {
        alert('請至少添加一個路段！');
        return;
    }
    
    const firstSegment = currentRouteSegments[0];
    const lastSegment = currentRouteSegments[currentRouteSegments.length - 1];
    const totalCost = currentRouteSegments.reduce((sum, seg) => sum + seg.cost, 0);
    const totalDuration = calculateDuration(firstSegment.startTime, lastSegment.endTime);
    
    const newRoute = {
        id: Date.now(),
        name: routeName,
        segments: [...currentRouteSegments],
        totalTime: totalDuration,
        totalCost,
        startTime: firstSegment.startTime,
        endTime: lastSegment.endTime,
        createdAt: new Date().toISOString()
    };
    
    savedRoutes.push(newRoute);
    saveData();
    updateSavedRoutesDisplay();
    updateRouteCount();
    clearCurrentRoute(); // 這會清除localStorage中的當前狀態
    updateStatus('🎉 路線儲存成功！');
}

// 清空當前路線
function clearCurrentRoute() {
    currentRouteSegments = [];
    document.getElementById('routeName').value = '';
    document.getElementById('routePreview').classList.add('hide');
    hideAddSegmentForm();
    
    // 清除保存的當前狀態
    localStorage.removeItem('transitCurrentRoute');
    
    // 重設時間
    document.getElementById('startTime').value = '08:00';
    document.getElementById('endTime').value = '09:00';
}

// 更新已保存路線顯示
function updateSavedRoutesDisplay() {
    const container = document.getElementById('savedRoutes');
    
    if (savedRoutes.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #6b7280; padding: 20px;">尚未保存任何路線</div>';
        return;
    }
    
    container.innerHTML = savedRoutes.map((route, index) => `
        <div class="summary-card">
            <div class="summary-header">
                <div>
                    <h4 style="color: white; margin-bottom: 5px;">${route.name}</h4>
                    <div style="color: #9ca3af; font-size: 14px;">
                        ${route.startTime} - ${route.endTime} · ${formatDuration(route.totalTime)} · NT$${route.totalCost}
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="button button-small" onclick="editRoute(${index})" style="background: #3b82f6;">編輯</button>
                    <button class="button button-small button-red" onclick="deleteRoute(${index})">刪除</button>
                </div>
            </div>
            <div style="font-size: 12px; color: #6b7280;">
                ${route.segments.map(seg => seg.fromStation).join(' → ')} → ${route.segments[route.segments.length - 1].toStation}
            </div>
        </div>
    `).join('');
}

// 編輯路線
function editRoute(index) {
    const route = savedRoutes[index];
    currentRouteSegments = [...route.segments];
    document.getElementById('routeName').value = route.name;
    updateTimelinePreview();
    saveCurrentState(); // 保存當前狀態
    updateStatus('📝 路線載入完成，可以進行編輯');
}

// 刪除路線
function deleteRoute(index) {
    if (confirm('確定要刪除這條路線嗎？')) {
        savedRoutes.splice(index, 1);
        saveData();
        updateSavedRoutesDisplay();
        updateRouteCount();
        updateStatus('🗑️ 路線已刪除！');
    }
}

// 清除所有資料
function clearAllData() {
    if (confirm('確定要清除所有資料嗎？此操作無法復原！')) {
        savedRoutes = [];
        clearCurrentRoute();
        localStorage.removeItem('transitRoutes');
        localStorage.removeItem('transitCurrentRoute'); // 同時清除當前狀態
        updateSavedRoutesDisplay();
        updateRouteCount();
        updateStatus('🔄 所有資料已清除！');
    }
}
