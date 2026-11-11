# Sunnine 的溫室圖書館

像素風格的溫室圖書館個人網站，使用 GitHub Pages 內建的 Jekyll 自動產生頁面，不需要在電腦上安裝任何工具。

## 一、第一次部署

1. 把這個資料夾裡的所有檔案（包含 `.gitignore`）放進你在 VS Code 連結的 GitHub 專案根目錄。
2. Commit 並 push 到 `main` 分支。
3. 到 GitHub 上的專案頁面：**Settings → Pages**。
   - Source 選 **Deploy from a branch**
   - Branch 選 **main**，資料夾選 **/ (root)**，按 Save。
4. 等一到兩分鐘，頁面上方會出現網站網址。

### 關於 `baseurl`（很重要）

打開 `_config.yml`：

- 如果專案名稱是 `你的帳號.github.io`，網址會是 `https://你的帳號.github.io/`，`baseurl` 保持空白 `""`。
- 如果專案是其他名稱，例如 `greenhouse`，網址會是 `https://你的帳號.github.io/greenhouse/`，請把 `baseurl` 改成 `"/greenhouse"`，否則樣式和連結會壞掉。

## 二、日常更新

### 新增一篇文章

在 `_posts/` 資料夾新增一個檔案，檔名格式固定為：

```
年-月-日-英文網址.md
例：2026-12-01-reading-notes.md
```

檔名最後一段會成為文章網址（`/posts/reading-notes/`），建議用英文小寫和連字號。

檔案內容的開頭是一段設定，下面就是內文：

```markdown
---
title: 文章標題
summary: 一句話摘要，會出現在文章總覽和文章開頭。
category: 讀書筆記
---

第一段內文。

## 小標題

> 想特別強調的一句話，會顯示成引言卡片。

- 條列項目
- 條列項目
```

存檔、commit、push，網站就會自動：

- 產生這篇文章的內頁
- 把它放進「近期文章」總覽（依年份分組，閱讀時間自動計算）
- 讓它出現在溫室裡那本「近期文章」書中（只顯示最新三篇）

### 在文章裡放圖片

把圖片放進 `assets/images/`，在文章中這樣寫：

```markdown
![圖片的替代文字](/assets/images/photo.jpg)
*圖說文字*
```

如果有設定 `baseurl`，路徑前面要加上它，例如 `/greenhouse/assets/images/photo.jpg`。

### 修改書單

編輯 `_data/books.yml`。每本書一個區塊，由上到下就是顯示順序；溫室裡那本書只會顯示前三本。`color` 是書單頁小書本圖示的顏色。

### 修改「關於我」

編輯 `about.md`：

- `greeting`：溫室裡「關於我」那本書左頁的大字
- `book_text`：那本書右頁的文字，每一行是一段
- 下方的內文：「關於我」分頁的完整內容

### 修改其他文字

`_config.yml` 裡的 `title`、`description`、`books_intro`、`posts_intro` 分別是網站名稱、網站描述，以及書單和文章兩本書左頁的那一句話。

## 三、檔案說明

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 溫室首頁 |
| `assets/js/greenhouse.js` | 溫室的動畫與互動程式（一般不需要修改） |
| `assets/css/site.css` | 分頁與文章的樣式 |
| `about.md`、`books.html`、`posts.html` | 三個分頁 |
| `_posts/` | 所有文章 |
| `_data/books.yml` | 書單資料 |
| `_layouts/`、`_includes/` | 分頁與文章的版型 |
