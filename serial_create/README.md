
# description
レコード追加を連続実行するためのjavascriptカスタマイズです。
先頭にある FIELDCODE_RADIO_SERIAL あたりの定数定義に従って、以下のフィールドを追加したアプリに適用してください。

# install
- フィールドコード"radio_serialcreate"というラジオボタンを作成
- ラジオボタンの値として「有効」と「無効」を追加する
- SweetAlertを以下のURLで登録する
    - https://unpkg.com/sweetalert/dist/sweetalert.min.js
- このカスタマイズをセットする
    - ダウンロードしたjsファイルを登録するか、または以下のjsdelivrのURLを指定してください。
        - https://cdn.jsdelivr.net/gh/motohasystem/kintone_snippets@v1/serial_create/serial_create.js

![JavaScriptファイルの登録方法](img/2024-07-26-14-26-47.png)

# 便利なjsdelivr

kintoneのアプリカスタマイズとして、以下のURLをURL指定することでアプリに読み込むことができます。

    - @v1:
        - https://cdn.jsdelivr.net/gh/motohasystem/kintone_snippets@v1/serial_create/serial_create.js

指定URLのタグは@v1を指定してください。
@v1を指定する限り、意図せずにJavascriptの機能が変更されてしまうことはありません。

例えばjsdelivrでは、タグとして@latestを指定すると常にその時点の最新版を利用できます。
しかし最新版はgithubリポジトリの最新のコードが反映されるため、あなたの意図に反したJavascriptコードを実行してしまう危険を伴います。

    - @latestの例:
        - https://cdn.jsdelivr.net/gh/motohasystem/kintone_snippets@latest/serial_create/serial_create.js


