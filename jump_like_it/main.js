/**
 * レコード編集画面に検索ボタンを追加します。
 * 検索は、指定したアプリの指定したフィールドに対して実行します。
 * 初期設定として、アプリに以下の4つのフィールドを配置してください
 *
 * 1. 検索キーワードを入力するフィールド（一行文字列、数値、ラジオボタンのいずれか）
 * 2. 検索対象アプリのアプリIDを記入するフィールド（数値フィールド、ラジオボタン、ドロップダウン）
 * 3. 検索対象アプリのドメインを記入するフィールド（一行文字列、ラジオボタン）
 * 4. URLを開くボタンを配置するスペースフィールド
 *
 */

(function () {
    "use strict";
    const eventTypes = [
        "app.record.create.show",
        "app.record.edit.show",
        // "app.record.detail.show", // 詳細画面でもボタンを表示したい場合はこの行を有効化
    ];

    kintone.events.on(eventTypes, function (event) {
        // フィールド設定
        const config = {
            QUERY_FIELD: "snipet_query", // 検索キーワードを入力するフィールドのフィールドコード
            APPID_FIELD: "snipet_appid", // 検索対象アプリのアプリIDを記入するフィールドコード
            DOMAIN_FIELD: "snipet_domain", // 検索対象アプリのドメインを記入するフィールドコード

            SEARCHBUTTON_FIELD: "button_search", // URLを開くボタンを配置するスペースフィールドのコード
            BUTTON_LABEL: "商品を検索する", // ボタンのラベル

            QUERY_TARGET: "検索フィールド", // domainとappidを指定したアプリが持つフィールドのうち、検索したい情報を格納しているフィールドコード
        };

        const record = event.record;
        if (
            record[config.APPID_FIELD] === undefined ||
            record[config.DOMAIN_FIELD] === undefined ||
            record[config.QUERY_FIELD] === undefined
        ) {
            const msg = `設定が不足しています。フィールドコードが${config.QUERY_FIELD}, ${config.APPID_FIELD}, ${config.DOMAIN_FIELD}のフィールドをアプリに配置してください`;
            alert(msg);
            return event;
        }

        // ボタンを作成、KUCが読み込まれている場合はKUCを使う
        let button;
        if (typeof Kuc !== "undefined" && Kuc.Button) {
            button = new Kuc.Button({
                text: config.BUTTON_LABEL,
                type: "button",
                className: "kuc-btn kuc-btn-primary",
            });
        } else {
            button = document.createElement("button");
            button.textContent = config.BUTTON_LABEL;
            button.className = "kuc-btn kuc-btn-primary";
        }

        // ボタンを作成
        button.onclick = function () {
            let appid, domain;
            try {
                const result = getAppIdAndDomain(config);
                appid = result.appid;
                domain = result.domain;
            } catch (error) {
                console.error(error);
                alert(error.message);
                return event;
            }

            // SOURCE_FIELDのフィールドに入っている値を取得する
            const record = kintone.app.record.get().record;
            const searchKey = record[config.QUERY_FIELD].value || "";

            // searchKeyが空の場合はアラートを表示して処理を中断
            if (!searchKey) {
                alert(
                    `検索キーワードが未入力です。検索したい文字を入力してください`
                );
                return;
            }

            const queryFieldValue = record[config.QUERY_FIELD].value || "";

            // URLエンコード
            const query = encodeURIComponent(queryFieldValue);

            // 検索対象アプリの対象フィールドコード
            const searchFieldCode = encodeURIComponent(config.QUERY_TARGET);

            // URL生成
            const url = `https://${domain}/k/${appid}/?query=${searchFieldCode}%20like%20%22${query}%22`;
            window.open(url, "_blank");
        };
        button.style.margin = "8px";

        // スペースフィールドにボタンを追加
        const spaceElement = kintone.app.record.getSpaceElement(
            config.SEARCHBUTTON_FIELD
        );
        if (!spaceElement) {
            console.error("スペースフィールドが見つかりません");
            return event;
        }

        // スペースフィールドのDOMを取得
        spaceElement.appendChild(button);

        return event;
    });

    // アプリ内に配置されているフィールドを検証し、存在すれば値を取得する
    // フィールドコードが設定されていない場合はアラートを表示して処理を中断
    function getAppIdAndDomain(config) {
        const record = kintone.app.record.get().record;

        const appid = record[config.APPID_FIELD].value || "";
        const domain = record[config.DOMAIN_FIELD].value || "";

        if (appid === "" || domain === "") {
            const msg = `設定が不足しています。フィールドコードが${config.APPID_FIELD}と${config.DOMAIN_FIELD}のフィールドに値を入力してください`;
            throw new Error(msg);
        }

        return {
            appid,
            domain: domain ? domain + ".cybozu.com" : undefined,
        };
    }
})();
