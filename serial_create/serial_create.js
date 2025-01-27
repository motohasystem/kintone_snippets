(function () {
    "use strict";

    // 共通の定数を定義しておきます。ラジオボタンのフィールドコードやラベルを変更したいときはここを書き換えてください。
    const CONSTANTS = {
        FIELDCODE_RADIO_SERIAL: "radio_serialcreate",
        FIELDVALUE_SERIAL_ENABLED: "有効",
    };

    // [1] レコード追加完了イベントに対するハンドラーです
    kintone.events.on("app.record.create.submit.success", function (event) {

        // 連続作成モードであることを判定します
        const serial = event.record[CONSTANTS.FIELDCODE_RADIO_SERIAL].value;
        if (serial !== CONSTANTS.FIELDVALUE_SERIAL_ENABLED) {
            // 連続作成モードでなければ何もしないでeventを返します
            return event;
        }

        try {
            // 現在のホスト名を取得します
            var hostname = window.location.origin;
            // 現在のアプリIDを取得します
            var appId = kintone.app.getId();
            // レコード追加画面のURLを構築します
            var recordCreateUrl =
                hostname + "/k/" + appId + "/edit?recreate=true";

            // event.urlにレコード追加画面のURLを代入します
            event.url = recordCreateUrl;

            // eventを返します
            return event;
        } catch (error) {
            console.error("未考慮のエラーが発生しました:", error);
            throw error;
        }
    });

    // [2] レコード追加表示イベントに対するハンドラーです
    kintone.events.on("app.record.create.show", function (event) {
        // GETパラメータを取得します
        const url = new URL(window.location.href);
        const recreate = url.searchParams.get("recreate");

        // ライブラリチェックを行います
        if (isValidLibraries() == false) {
            // 問題があれば適切なエラーメッセージを返してユーザーに通知します
            event.error =
                "SweetAlertライブラリのJavaScriptファイル[ https://unpkg.com/sweetalert/dist/sweetalert.min.js ]をこのアプリのカスタマイズに設定してください。";
            return event;
        }

        // フィールドチェックを行います
        if (isValidField(event) == false) {
            // 問題があれば適切なエラーメッセージを返してユーザーに通知します
            event.error = `フィールドコード[${CONSTANTS.FIELDCODE_RADIO_SERIAL}]のラジオボタンをフォームに設置して、[${CONSTANTS.FIELDVALUE_SERIAL_ENABLED}]を選択肢に持たせてください`;
            return event;
        }

        // 連続作成モードの場合はSweetAlertでダイアログを表示します
        if (recreate === "true") {
            swal({
                text: "連続作成モードです",
                icon: "success",
                buttons: false,
                timer: 1200,
            });
            event.record[CONSTANTS.FIELDCODE_RADIO_SERIAL].value =
                CONSTANTS.FIELDVALUE_SERIAL_ENABLED;
        }

        return event;
    });

    // [3] 必要なライブラリが設定されているかどうかを判定する関数です
    function isValidLibraries() {
        // SweetAlertライブラリが設定されているかどうかを判定します
        if (typeof swal !== "function") {
            // SweetAlertライブラリが設定されていない場合はfalseを返します
            return false;
        }
        
        // 問題なければtrueを返して正常(valid)ですよ、と回答します
        return true;
    }

    // [4] 必要なフィールドが存在しているかどうかを判定する関数です
    function isValidField(event) {
        // FIELDCODE_RADIO_SERIAL のフィールド情報を取得します
        const field = event.record[CONSTANTS.FIELDCODE_RADIO_SERIAL];
        // フィールドが存在しない場合はfalseを返します
        if (field === undefined) {
            return false;
        }

        // 問題なければtrueを返して正常(valid)ですよ、と回答します
        return true;
    }
})();
