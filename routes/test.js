let clickedDialogEvent = false;

const iFrame = document.getElementById('sample1');
$('.modal-backdrop').show();
const faceDetectResultProcess = function () {
    faceDetectJs().then(result => {
        if (result) {
            if(isReTakeSuccessMessageShow) {
                let reTakeSuccessMessage = '{$reTakeSuccessMessage}';
                if(clickedDialogEvent) { 
                    reTakeSuccessMessage += '<br>' + '{$resumeLectureMessage}';
                    }
                const reTakeSuccessDialog = bootbox.dialog({
                    message: reTakeSuccessMessage,
                    backdrop: false,
                    closeButton: false
                });
                setInterval(function () {
                    reTakeSuccessDialog.modal('hide');
                }, 3000);
                iFrame.contentWindow.postMessage('playFaceCameraToFrame', '*');
            }
            isReTakeSuccessMessageShow = false;
            wrongTimeCount = 0;
            totaleCaptureCount = getImage(totaleCaptureCount);
        } else {
                clickedDialogEvent = false;
                if(wrongTimeCount < 2) {
                    wrongTimeCount++;
                    const firstDetectFailureMessage = '{$firstDetectFailureMessage}';
                    switch(wrongTimeCount) {
                        case 1:
                        isReTakeSuccessMessageShow = true;
                        var dialog = bootbox.dialog({
                            message: firstDetectFailureMessage,
                            backdrop: false,
                            closeButton: false
                        });
                        setInterval(
                            function () {
                                dialog.modal('hide');
                            }, 3000);
                        setTimeout(() => {faceDetectResultProcess();}, 5000);
                        break;
                        case 2:
                        // 動画停止するイベント
                        iFrame.contentWindow.postMessage('stopFaceCameraToFrame', '*');
                        // ダイアログが表示されて、OKクリックしたら、 もう一回検出してみる。
                        // OKクリックしていない場合、講義を閉じる
                        const dialogTimeCount = {$secondDetectWaitMin} * 60 * 1000; // realtimeReDetectMinutesのように数1分あとチェック
                        let clickedDialogIntervalID = setInterval(function() {
                            if(clickedDialogEvent) { 
                                clearInterval(clickedDialogIntervalID);
                                } else {
                                const rootWindow = (window.top) ? window.top.window : window;
                                rootWindow.close();
                                }
                        }, dialogTimeCount);
                        bootbox.dialog({
                            message: '{$secondDetectFailureMessage}',
                            backdrop: true,
                            closeButton: false,
                            buttons: {
                                ok: {
                                    label: '{$reTakeButtonLabel}',
                                    className: 'btn-primary',
                                    callback: function() {
                                        clickedDialogEvent = true;
                                        wrongTimeCount = 1;
                                        isReTakeSuccessMessageShow = true;
                                        intervals.push(timerID);
                                        faceDetectResultProcess();
                                    }
                                }
                            }
                        });      
                        break;
                    }
                }
        } 
    });
}