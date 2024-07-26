const CONSTANTS = {
    FIELDCODE_RADIO_SERIAL: "radio_serialcreate",
    FIELDVALUE_RADIO_SERIAL: {
        DISABLE: "無効",
        ENABLE: "有効",
    },
};

(function () {
    "use strict";

    // レコード追加イベントに対するハンドラー
    kintone.events.on("app.record.create.submit.success", function (event) {
        console.log({ event });
        const serial = event.record[CONSTANTS.FIELDCODE_RADIO_SERIAL].value;
        if (serial === CONSTANTS.FIELDVALUE_RADIO_SERIAL.DISABLE) {
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
            console.error("エラーが発生しました:", error);
            throw error;
        }
    });

    kintone.events.on("app.record.create.show", function (event) {
        // GETパラメータを取得
        var url = new URL(window.location.href);
        var recreate = url.searchParams.get("recreate");
        if (recreate === "true") {
            swal({
                text: "連続作成モードです",
                icon: "success",
                buttons: false,
                timer: 1200,
            });
            event.record[CONSTANTS.FIELDCODE_RADIO_SERIAL].value =
                CONSTANTS.FIELDVALUE_RADIO_SERIAL.ENABLE;
        }

        return event;
    });
})();
