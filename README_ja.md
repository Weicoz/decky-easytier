# Decky EasyTier

<p align="center">
  <img src="./assets/banner.png" alt="Decky EasyTier Banner" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/SteamDeckHomebrew/decky-loader"><img src="https://img.shields.io/badge/Decky-Plugin-blue.svg" alt="Decky Plugin" /></a>
  <a href="https://github.com/EasyTier/EasyTier"><img src="https://img.shields.io/badge/EasyTier-v2.6.4-green.svg" alt="EasyTier" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> | <a href="README_zh.md">简体中文</a> | <b>日本語</b>
</p>

---

**Decky EasyTier** は、Steam Deck 向けに設計された [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) プラグインです。SteamOS のゲームモード上で、[EasyTier](https://github.com/EasyTier/EasyTier) による分散型メッシュ VPN（仮想 LAN 構築）をシームレスに管理および監視できます。

---

## 🌟 主な機能

- 🎮 **ゲームモードに完全最適化**: SteamOS のクイックアクセスメニュー（QAM `...` ボタン）に自然に統合。ゲームパッドだけで全機能を直感的に操作できます。
- 🚀 **ワンクリック簡単セットアップ**: ターミナル用のワンライナー導入スクリプト、またはプラグイン画面内からの**公式コア自動オンラインインストール**に対応。手動でのバイナリ配置は一切不要です。
- 📱 **独立した Web 管理ダッシュボード**: 軽量 Web サーバー（ポート `21010`）を内蔵。同一 Wi-Fi 内のスマートフォンや PC ブラウザから、ソフトウェアキーボードに頼らず快適に設定を入力できます。
- 🟢 **リアルタイム接続ステータス**: 仮想 IP、ホスト名、NAT タイプ（FullCone / Symmetric など）、Peer ID などの接続情報を一目で把握。
- 🌐 **ピア一覧とトラフィック監視**: 接続中の全ノード状態、通信経路（P2P 直接接続 / リレー）、往復遅延時間（Ping）、送受信データ量をリアルタイム表示。
- ⚡ **ワンタップ Ping 速度テスト**: コントローラー操作だけで各ピアとの実測通信遅延を即座に計測。
- ⚙️ **systemd デーモン自動管理**: EasyTier の起動・停止・再起動、および OS 起動時のバックグラウンド自動起動（systemd）に対応。

---

## 📦 インストール方法

### 方法 1: ターミナルからのワンクリック導入（推奨 ⚡）
Steam Deck を **デスクトップモード** に切り替え、端末アプリ **Konsole** を開いて以下のコマンドを実行します：

```bash
curl -fsSL https://raw.githubusercontent.com/Weicoz/decky-easytier/main/install.sh | bash
```

> **ネットワーク高速化ミラー**（GitHub への接続が不安定な場合）：
> ```bash
> curl -fsSL https://ghfast.top/https://raw.githubusercontent.com/Weicoz/decky-easytier/main/install.sh | bash
> ```

> 💡 **スクリプトが自動で行う処理：**
> 1. システムアーキテクチャ（x86_64）の検出と EasyTier 公式最新リリースの自動ダウンロード
> 2. `easytier-core`、`easytier-cli` の配置と Linux ネットワーク特権（`cap_net_admin`）の付与
> 3. デフォルト設定ファイルの生成と `systemd` 自動起動デーモンサービスの登録
> 4. `decky-easytier` プラグインの配置および Decky Loader の自動リロード

---

### 方法 2: プラグイン画面からのワンクリック導入（コマンド入力不要 🎮）
Decky Loader 経由で本プラグインを導入済みの場合：

1. Steam のゲームモードで、本体右側のクイックアクセスボタン（`...`）を押し、Decky Loader メニューを開きます。
2. **EasyTier 管理** を選択します。
3. 画面に **【🚀 コアコンポーネントのワンクリック導入】** バナーが表示されるので、**【EasyTier コアをオンライン取得してインストール】** を選択します。
4. プラグインが Root 権限で自動的にコアのダウンロード・システムサービスの登録を完了します。**デスクトップモードへの切り替えや Linux コマンドの入力は一切不要です！**

---

### 方法 3: 手動インストールとローカルビルド（開発者向け 🛠️）
1. リポジトリをクローン：
   ```bash
   git clone https://github.com/Weicoz/decky-easytier.git /home/deck/homebrew/plugins/decky-easytier
   ```
2. ビルドの実行（Node.js >= 18 および pnpm が必要）：
   ```bash
   cd /home/deck/homebrew/plugins/decky-easytier
   pnpm install
   pnpm run build
   ```
3. EasyTier バイナリの配置：
   - 実行ファイル：`/home/deck/.local/bin/easytier-core` および `easytier-cli`（実行権限 `chmod +x` が必要）
   - 設定ファイル：`/home/deck/.config/easytier/config.toml`
   - サービスファイル：`/etc/systemd/system/easytier.service`

---

## 🌐 Web コンソール（ダッシュボード）の利用

本プラグインは独立した HTTP サーバーを内蔵しており、デフォルトで `http://127.0.0.1:21010` をリッスンします。
- **本体で開く**: ゲームモードのプラグイン画面で **【Web 管理を開く】** をタップすると、Steam 内蔵ブラウザが起動します。
- **スマホ・PC から管理**: プラグイン画面に表示される **LAN 接続 URL**（例: `http://192.168.10.x:21010`）を確認し、同一 Wi-Fi に接続されたスマートフォンのブラウザからアクセスすることで、ネットワーク名や共有パスワードを簡単にコピー＆ペーストできます。

---

## 📄 ライセンス

本プロジェクトは [MIT License](LICENSE) のもとで公開されています。
EasyTier の著作権は EasyTier プロジェクトの原著作者に帰属します。
