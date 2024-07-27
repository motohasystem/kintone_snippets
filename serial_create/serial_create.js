(function () {
    "use strict";
    const CONSTANTS = {
        FIELDCODE_RADIO_SERIAL: "radio_serialcreate",
        FIELDVALUE_SERIAL_ENABLED: "有効",
    };

    // レコード追加イベントに対するハンドラー
    kintone.events.on("app.record.create.submit.success", function (event) {
        console.log({ event });
        const serial = event.record[CONSTANTS.FIELDCODE_RADIO_SERIAL].value;
        if (serial !== CONSTANTS.FIELDVALUE_SERIAL_ENABLED) {
            return event;
        }

        try {
            // 現在のホスト名を取得
            var hostname = window.location.origin;
            // 現在のアプリIDを取得
            var appId = kintone.app.getId();
            // レコード追加画面のURLを構築
            var recordCreateUrl =
                hostname + "/k/" + appId + "/edit?recreate=true";

            // event.urlにレコード追加画面のURLを代入
            event.url = recordCreateUrl;

            // eventを返す
            return event;
        } catch (error) {
            console.error("未考慮のエラーが発生しました:", error);
            throw error;
        }
    });

    kintone.events.on("app.record.create.show", function (event) {
        // GETパラメータを取得
        const url = new URL(window.location.href);
        const recreate = url.searchParams.get("recreate");

        // エラーチェック
        if (isValidLibraries() == false) {
            event.error =
                "SweetAlertライブラリのJavaScriptファイル[ https://unpkg.com/sweetalert/dist/sweetalert.min.js ]をこのアプリのカスタマイズに設定してください。";
            return event;
        }

        if (isValidField(event) == false) {
            event.error = `フィールドコード[${CONSTANTS.FIELDCODE_RADIO_SERIAL}]のラジオボタンをフォームに設置して、[${CONSTANTS.FIELDVALUE_SERIAL_ENABLED}]を選択肢に持たせてください`;
            return event;
        }

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

    // SweetAlertライブラリが設定されているかどうかを判定する関数
    function isValidLibraries() {
        // SweetAlertライブラリが設定されているかどうかを判定
        if (typeof swal === "function") {
            return true;
        }
        return false;
    }

    // このカスタマイズが動作できる環境かを判定する関数
    function isValidField(event) {
        // FIELDCODE_RADIO_SERIAL のフィールド情報を取得
        const field = event.record[CONSTANTS.FIELDCODE_RADIO_SERIAL];
        // フィールドが存在しない場合はエラー
        if (field === undefined) {
            return false;
        }

        return true;
    }
})();
