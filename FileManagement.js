function myFunction() {
    // 基準となる時間
    const now = new Date();

    // 対象のGoogle Driveの対象フォルダIDを指定
    // DriveのIDに置き換えてください。
    const root = DriveApp.getFolderById('******');

    // rootフォルダから調査開始
    scanFolder(root, now);
}

// 指定フォルダ内の調査
function scanFolder(rootFolder, now) {

    // フォルダ内のファイル一覧を取得
    const files = rootFolder.getFiles();

    // files内で最近作成されたものを探してDiscordに送信
    judgeFile(files, now);

    // フォルダ内のフォルダ一覧を取得
    const folders = rootFolder.getFolders();

    // それぞれのフォルダについてscanFolderを実行
    while (folders.hasNext()) {
        const folder = folders.next();
        scanFolder(folder, now);
    }
}

// アップロード時間を判定
function judgeFile(files, now) {

    // すべてのファイルについてアップロード時間を判定
    while (files.hasNext()) {
        const file = files.next();
        // ファイルの作成（アップロード）時間を取得
        const createDate = file.getDateCreated();
        // 分単位で差分を計算
        const timeDiff = (now.getTime() - createDate.getTime()) / (60 * 1000);

        // 1分以内に作成されたファイルだったとき
        if (1 >= timeDiff) {
            // Log出力
            Logger.log(file.getName());
            // Discordに送信
            sendDiscord(
                [{
                    "title": "新しいファイルがアップロードされました",
                    "color": 1127128,
                    "fields":
                        [{
                            "name": "ファイル名",
                            "value": file.getName()
                        },
                        {
                            "name": "URL",
                            "value": file.getDownloadUrl()
                        }]
                }]
            )
        }
    }
}

function sendDiscord(embeds) {
    // webhookのURLを入れてください。
    const webhookUrl = 'https://discord.com/api/webhooks/*****';

    const username = 'Drive速報【ドラ速】';
    const jsonData = {
        "username": username,
        "embeds": embeds
    };

    const payload = JSON.stringify(jsonData);
    const options = {
        "method": "post",
        "contentType": "application/json",
        "payload": payload
    };

    UrlFetchApp.fetch(webhookUrl, options);
}
