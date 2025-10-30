# GitHub Button Extension

[![zread](https://img.shields.io/badge/Ask_Zread-_.svg?style=flat&color=00b0aa&labelColor=000000&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuOTYxNTYgMS42MDAxSDIuMjQxNTZDMS44ODgxIDEuNjAwMSAxLjYwMTU2IDEuODg2NjQgMS42MDE1NiAyLjI0MDFWNC45NjAxQzEuNjAxNTYgNS4zMTM1NiAxLjg4ODEgNS42MDAxIDIuMjQxNTYgNS42MDAxSDQuOTYxNTZDNS4zMTUwMiA1LjYwMDEgNS42MDE1NiA1LjMxMzU2IDUuNjAxNTYgNC45NjAxVjIuMjQwMUM1LjYwMTU2IDEuODg2NjQgNS4zMTUwMiAxLjYwMDEgNC45NjE1NiAxLjYwMDFaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00Ljk2MTU2IDEwLjM5OTlIMi4yNDE1NkMxLjg4ODEgMTAuMzk5OSAxLjYwMTU2IDEwLjY4NjQgMS42MDE1NiAxMS4wMzk5VjEzLjc1OTlDMS42MDE1NiAxNC4xMTM0IDEuODg4MSAxNC4zOTk5IDIuMjQxNTYgMTQuMzk5OUg0Ljk2MTU2QzUuMzE1MDIgMTQuMzk5OSA1LjYwMTU2IDE0LjExMzQgNS42MDE1NiAxMy43NTk5VjExLjAzOTlDNS42MDE1NiAxMC42ODY0IDUuMzE1MDIgMTAuMzk5OSA0Ljk2MTU2IDEwLjM5OTlaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik0xMy43NTg0IDEuNjAwMUgxMS4wMzg0QzEwLjY4NSAxLjYwMDEgMTAuMzk4NCAxLjg4NjY0IDEwLjM5ODQgMi4yNDAxVjQuOTYwMUMxMC4zOTg0IDUuMzEzNTYgMTAuNjg1IDUuNjAwMSAxMS4wMzg0IDUuNjAwMUgxMy43NTg0QzE0LjExMTkgNS42MDAxIDE0LjM5ODQgNS4zMTM1NiAxNC4zOTg0IDQuOTYwMVYyLjI0MDFDMTQuMzk4NCAxLjg4NjY0IDE0LjExMTkgMS42MDAxIDEzLjc1ODQgMS42MDAxWiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNNCAxMkwxMiA0TDQgMTJaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00IDEyTDEyIDQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K&logoColor=ffffff)](https://zread.ai/kongyo2/github-button-extension)

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/kongyo2/github-button-extension)

GitHubリポジトリページにカスタムボタンを追加するChrome拡張機能です。この拡張機能は、GitHubのUIにシームレスに統合されたボタンを追加し、追加機能や外部サービスへの簡単なアクセスを提供します。

## 機能

- GitHubリポジトリページにカスタムボタンを追加
- GitHubのUIデザインに適合するスタイル
- ライトテーマとダークテーマの両方をサポート
- シングルページアプリケーション（SPA）ナビゲーションに対応

## インストール方法

### 開発版のインストール

1. このリポジトリをクローンまたはダウンロードします：
   ```bash
   git clone https://github.com/your-username/github-button-extension.git
   cd github-button-extension
   ```

2. 依存関係をインストールします：
   ```bash
   npm install
   ```

3. 拡張機能をビルドします：
   ```bash
   npm run build
   ```

4. Chromeブラウザで拡張機能を有効にします：
   - Chromeを開き、`chrome://extensions/` にアクセスします
   - 右上の「デベロッパーモード」を有効にします
   - 「パッケージ化されていない拡張機能を読み込む」をクリックします
   - プロジェクトの `dist` フォルダを選択します

## 開発方法

### 開発モード

開発中は以下のコマンドを使用して、ファイルの変更を監視し、自動的に再ビルドできます：

```bash
npm run dev
```

### ビルド

本番用のビルドを作成するには：

```bash
npm run build
```

### リント

コードの品質をチェックするには：

```bash
npm run lint
```

リントエラーを自動修正するには：

```bash
npm run lint:fix
```

## カスタマイズ

### ボタンの動作を変更する

ボタンのリンク先やテキストを変更するには、`src/content/index.ts` ファイルを編集します：

```typescript
// ボタンのリンク先を変更
button.href = `https://your-service.com/${owner}/${repo}`;

// ボタンのテキストを変更
const text = document.createTextNode('Your Button Text');
```

### ボタンのスタイルを変更する

ボタンの外観をカスタマイズするには、`src/content/index.css` ファイルを編集します。

### 対象とするページを変更する

拡張機能が動作するページを変更するには、`manifest.json` ファイルの `content_scripts` セクションを編集します：

```json
"content_scripts": [
  {
    "matches": [
      "https://github.com/*"
    ],
    "css": [
      "src/content/index.css"
    ],
    "js": [
      "src/content/index.ts"
    ],
    "run_at": "document_start",
    "all_frames": true
  }
]
```

## プロジェクト構造

```
github-button-extension/
├── src/
│   ├── background/
│   │   └── index.ts          # バックグラウンドスクリプト
│   ├── content/
│   │   ├── index.ts          # コンテンツスクリプト
│   │   └── index.css         # コンテンツスタイル
├── public/
│   └── icons/                # 拡張機能アイコン
├── manifest.json             # 拡張機能マニフェスト
├── package.json              # プロジェクト設定
├── tsconfig.json             # TypeScript設定
└── vite.config.ts            # Viteビルド設定
```

## 技術スタック

- **TypeScript** - 型安全なJavaScript
- **Vite** - 高速なビルドツール
- **Chrome Extension API v3** - 最新のChrome拡張機能API

## ライセンス

MIT License 
