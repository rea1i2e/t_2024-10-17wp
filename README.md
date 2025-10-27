# WordPress_dev_Docker_wp-env

## 動作が確認できている環境
- Nodeバージョン v16.13.0
- Docker（https://matsuand.github.io/docs.docker.jp.onthefly/get-docker/）インストール済み

## 使い方（ゼロからローカル環境構築を始める場合）

1. クローンorダウンロードしたフォルダをvscode等で開く
2. テーマディレクトリ名を一括置換（themeName → 任意のテーマディレクトリ名）
7. style.cssの中身（テーマ名など）を任意の内容に変更する
8. ターミナルを開き、`npm i`とコマンドを入力
9. node_modulesとpackage-lock.jsonが生成されるのを確認する
10. `npm run wp-env start`とコマンド入力し、wp-envを起動（WordPressの環境構築が行われる）
11. `npx gulp`とコマンドを入力するとgulpが動き出す（gulpはブラウザシンク、scssコンパイル、画像圧縮の役割を担っている）
12. WordPressの管理画面（/wp-admin）に入り、テーマをこれから開発するものに変更（初期ユーザー名`admin`、初期パス`password`）

## 使い方（既に開発が進んでいる状態からローカル環境構築を始める場合）
1. クローンorダウンロードしたフォルダをvscode等で開く
2. ターミナルを開き、`npm i`とコマンドを入力
3. node_modulesとpackage-lock.jsonが生成されるのを確認する
4. `npm run wp-env start`とコマンド入力し、wp-envを起動（WordPressの環境構築が行われる）
5. データベースをインポートする`npm run wp-env run cli wp db import sql/wpenv.sql`
6. `npx gulp`とコマンドを入力するとgulpが動き出す（gulpはブラウザシンク、scssコンパイル、画像圧縮の役割を担っている）
7. WordPressの管理画面（/wp-admin）に入り、テーマを開発中のものに変更（初期ユーザー名`admin`、初期パス`password`）

## データベース更新するときの手順
__1人での開発の場合は任意のタイミングで手順3と4を行えばOK__
1. チームメンバーがデータベースを触っていないことを確認
2. データベースを更新
3. データベースをエクスポート`npm run wp-env run cli wp db export sql/wpenv.sql`
4. Gitにあげる
5. チームメンバーに更新したことを伝える
6. チームメンバーはデータベースを更新されたデータベースをインポートする`npm run wp-env run cli wp db import sql/wpenv.sql`

## .wp-env.jsonを書き換えたときの手順
1. wp-envを停止 `npm run wp-env stop`
2. アプデした状態で再起動 `npm run wp-env start --update`
- ポート番号を変更した場合は、gulpfile.jsの22行目を書き換える必要あり

## 作業ディレクトリについて
- sass, jsの記述はsrcフォルダの中で行う
- 画像はsrcフォルダのimagesの中に格納する
- phpはdist直下のファイルに直接記述する
- プラグインは管理画面からインストールするとdist/wp-content/plugins/に自動的に格納される
- メディアは管理画面からアップロードするとdist/wp-content/uploads/フォルダに自動的に格納される（ただし容量が増えすぎる場合はGitHub等で管理すべきでない。管理から外すときは.wp-env.jsonの18行目を消去する。）
- src/sass/global/_breakpoints.scssにある変数をpc or spに設定することで、spファースト・pcファーストの切り替え（初期値：sp）
- サイズ指定は、原則rem()を使う
- font-sizeは、maxrem()の単位を使うことで、10px未満にならないように指定可能。

## よく使うコマンドまとめ
- wp-env起動 `npm run wp-env start`  
- wp-env停止 `npm run wp-env stop`  
- アプデした状態で再起動 `npm run wp-env start --update`  
- データベースをエクスポート `npm run wp-env run cli wp db export sql/wpenv.sql`  
- データベースをインポート `npm run wp-env run cli wp db import sql/wpenv.sql`
- パッケージインストール `npm i`
- gulp起動 `npx gulp`

## 本番デプロイ（CI/CD）

### 🚀 自動デプロイ機能
このプロジェクトには GitHub Actions を使用した自動デプロイ機能が組み込まれています。

### ⚙️ 必要な設定

#### 1. GitHub Secrets 設定
リポジトリの `Settings` > `Secrets and variables` > `Actions` で以下を設定：

```
FTP_SERVER      # FTPサーバーアドレス
FTP_USERNAME    # FTPユーザー名  
FTP_PASSWORD    # FTPパスワード
TEST_URL        # テスト環境URL（Discord通知用）
DISCORD_WEBHOOK # Discord Webhook URL（任意）
```

#### 2. ワークフロー動作確認
- `main` ブランチにpushすると自動実行
- PHPシンタックスチェック → ビルド → FTPデプロイの順で実行
- Discord通知でデプロイ結果を確認可能

### 📋 デプロイ内容
- `dist/wp-content/themes/` 配下のテーマファイルのみをデプロイ
- プラグインやメディアファイルは対象外
- PHPシンタックスエラーがあっても継続実行（警告のみ）

### 🛠️ トラブルシューティング
- デプロイエラー時は GitHub Actions のログを確認
- FTP設定やパーミッション問題が主な原因
- テスト環境でWordPressが正常動作していることを確認

## 備考
- ベースの環境はhttps://github.com/koyumi-takaishi/WordPress_dev_Docker_wp-env
- rem記述を前提


## GitHub CLIを使った導入手順

### 新規リポジトリ作成＋クローンする場合は、コマンドを実行
```bash
gh repo create 新規リポジトリ名 \
  --template rea1i2e/t_2024-10-17wp \
  --private \
  --description "リポジトリの説明文" && \
sleep 5 && \
gh repo clone GitHubのユーザー名/新規リポジトリ名
```

- 説明文の修正は、コマンドを実行
```bash
gh repo edit GitHubのユーザー名/新規リポジトリ名 --description "新しい説明文"
```