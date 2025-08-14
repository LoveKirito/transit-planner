# 🚇 交通轉乘記錄器

一個完全離線的PWA應用，讓你可以自定義規劃和記錄交通路線，支援台鐵、高鐵、捷運、公車等多種交通工具。

## ✨ 功能特色

### 🚀 PWA功能
- 📱 **可安裝到桌面** - 支援手機、平板、電腦安裝
- 🌐 **完全離線使用** - 無網路也能正常運作
- 💾 **本地資料保存** - 資料安全保存在裝置上
- ⚡ **快速啟動** - 如原生App般的啟動速度

### 🚇 交通規劃功能
- ♾️ **無限路段支援** - 支援複雜多段轉乘規劃
- 🎨 **智能顏色檢測** - 自動檢測捷運線路顏色（紅線、藍線等）
- 🔄 **站名智能分離** - 處理不同系統間站名差異（如高鐵左營站↔台鐵新左營站）
- 📍 **時間軸視覺化** - 仿TransTaiwan的清晰時間軸設計
- 💰 **自動費用計算** - 統計總時間、總費用

### 🛠️ 支援交通工具
- 🚂 **台鐵** - 各級列車（區間、莒光、自強等）
- 🚄 **高鐵** - 台灣高速鐵路
- 🚇 **捷運** - 支援各都市捷運系統（台北、桃園、台中、高雄等）
- 🚊 **輕軌** - 淡海輕軌、高雄輕軌等
- 🚌 **公車/客運** - 市區公車、國道客運
- 🚶 **步行** - 轉乘步行時間

## 📱 線上體驗

**GitHub Pages部署：** [https://yourusername.github.io/transit-planner](https://yourusername.github.io/transit-planner)

### 安裝到手機
1. 用手機瀏覽器開啟上述網址
2. 點擊右上角「📱 安裝APP」按鈕
3. 或使用瀏覽器的「加入主畫面」功能
4. 完成！可在桌面找到應用圖示

## 🎯 使用方法

### 基本使用流程
1. **輸入路線名稱** - 例如「新竹→台北」
2. **逐段添加路程** - 一段一段建立你的行程
3. **設定詳細資訊** - 時間、車次、月台、費用等
4. **即時預覽** - 查看時間軸式路線圖
5. **保存路線** - 儲存常用路線供日後參考

### 特殊功能說明

#### 🎨 自動顏色檢測
當選擇「捷運」時，輸入線路名稱會自動檢測顏色：
- 輸入「台北捷運紅線」→ 自動顯示紅色
- 輸入「高雄捷運橘線」→ 自動顯示橘色
- 支援：紅、橘、黃、綠、藍、紫、棕、粉等顏色

#### 🔄 站名智能處理
系統會自動處理不同交通系統間的站名差異：
```
台鐵六家站 (08:15)
    ↓ 台鐵
高鐵新竹站 (08:30)  ← 自動分離顯示
    ↓ 高鐵
高鐵台北站 (09:15)
```

#### 💡 智能時間建議
添加下一段路程時，系統會自動：
- 建議起始時間（上一段結束時間 + 轉乘時間）
- 保留站名輸入的靈活性
- 提醒可能的轉乘站名差異

## 🛠️ 技術架構

### 前端技術
- **Pure HTML/CSS/JavaScript** - 無框架依賴，輕量快速
- **Progressive Web App** - 完整PWA支援
- **Responsive Design** - 響應式設計，支援各種螢幕

### PWA技術特性
- **Service Worker** - 離線快取與背景同步
- **Web App Manifest** - 完整應用資訊配置
- **Local Storage** - 本地資料持久化
- **Installable** - 可安裝為原生應用體驗

### 瀏覽器支援
- ✅ Chrome/Chromium (Android, Windows, macOS, Linux)
- ✅ Safari (iOS, macOS)
- ✅ Firefox (Android, Windows, macOS, Linux)
- ✅ Edge (Windows, macOS, Android)

## 📂 文件結構

```
transit-planner/
├── index.html          # 主要HTML文件
├── app.js              # 應用邏輯JavaScript
├── sw.js               # Service Worker
├── manifest.json       # Web App Manifest
└── README.md           # 說明文件
```

## 🚀 本地開發

### 快速開始
```bash
# 1. 克隆專案
git clone https://github.com/yourusername/transit-planner.git
cd transit-planner

# 2. 啟動本地伺服器（任選一種）
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx http-server

# 使用 PHP
php -S localhost:8000

# 3. 開啟瀏覽器
open http://localhost:8000
```

### PWA測試
1. **桌面瀏覽器** - 開啟DevTools > Application > Service Workers
2. **手機測試** - 使用Chrome/Safari的遠程調試
3. **離線測試** - 中斷網路連接測試離線功能
4. **安裝測試** - 測試「加入主畫面」功能

## 🌟 部署到GitHub Pages

### 自動部署（推薦）
1. Fork這個專案到你的GitHub帳號
2. 進入專案設定 > Pages
3. 選擇Source: Deploy from a branch
4. 選擇Branch: main 
5. 點擊Save，等待部署完成
6. 訪問 `https://yourusername.github.io/transit-planner`

### 手動部署
```bash
# 1. 創建新的GitHub倉庫
# 2. 克隆到本地
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name

# 3. 複製所有文件到專案目錄
# 4. 提交並推送
git add .
git commit -m "🚇 Add transit planner PWA"
git push origin main

# 5. 啟用GitHub Pages
# 進入 GitHub 專案頁面 > Settings > Pages > Source: Deploy from a branch
```

## 📱 功能展示

### 時間軸顯示效果
```
08:00 ● 台鐵新竹站
      🚂 台鐵 區間133 | 3B月台 | 15分鐘 | NT$15
08:15 ● 台鐵六家站
      🔄 轉乘：台鐵六家站 → 高鐵新竹站
      🚶 轉乘等待 15分鐘
08:30 ● 高鐵新竹站  
      🚄 高鐵 高鐵889 | 1月台 | 45分鐘 | NT$250
09:15 ● 高鐵台北站
```

### 支援的輸入格式
- **捷運線路**：「台北捷運紅線」、「高雄捷運橘線」、「桃園捷運綠線」
- **車次號碼**：「自強142」、「高鐵0144」、「區間3133」
- **月台資訊**：「第2月台」、「1月台」、「3A」
- **時間格式**：24小時制，如「08:30」、「15:45」

## 💡 使用技巧

### 規劃複雜路線
1. **分段規劃** - 將長途旅程分成多個段落
2. **預留轉乘時間** - 設定適當的轉乘等待時間
3. **備註重要資訊** - 在車次欄位記錄重要提醒
4. **保存常用路線** - 將經常使用的路線保存起來

### 手機使用建議
1. **安裝為應用** - 獲得最佳使用體驗
2. **離線使用** - 無網路時也能正常查看和規劃
3. **快速啟動** - 從桌面直接啟動，如原生應用
4. **資料備份** - 定期截圖重要路線作為備份

## 🤝 貢獻指南

歡迎貢獻代碼、報告問題或提出建議！

### 貢獻方式
1. **Fork專案** - 在GitHub上fork此專案
2. **創建分支** - `git checkout -b feature/amazing-feature`
3. **提交變更** - `git commit -m 'Add some amazing feature'`
4. **推送分支** - `git push origin feature/amazing-feature`
5. **提交PR** - 在GitHub上創建Pull Request

### 問題回報
如果發現問題，請在GitHub Issues中回報，包含：
- 問題描述
- 重現步驟
- 預期行為
- 實際行為
- 螢幕截圖（如果適用）
- 瀏覽器和系統資訊

## 📄 授權條款

MIT License - 詳見 [LICENSE](LICENSE) 文件

## 🙏 致謝

- 設計靈感來源：TransTaiwan App
- 圖示設計：使用SVG自製交通主題圖示
- PWA技術參考：Google PWA最佳實踐指南

## 📞 聯絡資訊

- **專案地址**：https://github.com/yourusername/transit-planner
- **問題回報**：https://github.com/yourusername/transit-planner/issues
- **功能建議**：歡迎在Issues中提出

---

**🚇 讓交通規劃變得更簡單！**
