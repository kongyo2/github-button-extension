# GitHub Button Extension

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
