const config = {
    mode: 'rtc',
    codec: 'vp8'
}

const options = {
    appId: 'cd934bd49e864261b6bf27f698d8ce7c',
    channel: 'MathsLoyal VideoRoom',
    token: null,

}

const rtc = {
    client: null,
    localVideoTrack: null,
    localAudioTrack: null,
}

const btnCam = $('#btnCam');
const btnMic = $('#btnMic');
const btnPlug = $('#btnPlug');
const remote = $('#remote');
const local = $('#local');

const join = async () => {
    rtc.client = AgoraRTC.createClient(config);
    await rtc.client.join(options.appId, options.channel, options.token || null);
}

async function startOneToOneVideoCall() {
    join().then(() => {
        startVideo();
        startAudio();
        rtc.client.on('user-published', async (user, mediaType) => {

            if (rtc.client._users.length > 1) {
                rtc.client.leave();
                remote.html('<div class="roomMessage"><p class="full">Please Wait Room is Full</p></div>');
                return;
            } else {
                remote.html('');
            }

            await rtc.client.subscribe(user, mediaType);
            if (mediaType === 'video') {
                const remoteVideoTrack = user.videoTrack;
                remoteVideoTrack.play('remote');

            }
            if (mediaType === 'audio') {
                const remoteAudioTrack = user.audioTrack;
                remoteAudioTrack.play()
            }
        });
    });
}


const startVideo = async () => {
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    rtc.client.publish(rtc.localVideoTrack);
    rtc.localVideoTrack.play('local');
}

const startAudio = async () => {
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    rtc.client.publish(rtc.localAudioTrack);
    rtc.localAudioTrack.play();
}

const stopVideo = () => {
    rtc.localVideoTrack.close();
    rtc.localVideoTrack.stop();
    rtc.client.unpublish(rtc.localVideoTrack);
}

const stopAudio = () => {
    rtc.localAudioTrack.close();
    rtc.localAudioTrack.stop();
    rtc.client.unpublish(rtc.localAudioTrack);
}


//Toggle Camera

btnCam.click(function () {
    if ($(this).hasClass('fa-video-camera')) {
        $(this).addClass('fa-video-slash');
        $(this).removeClass('fa-video-camera');
        $(this).css('color', 'red');
        stopVideo();

    } else {
        $(this).addClass('fa-video-camera');
        $(this).removeClass('fa-video-slash');
        $(this).css('color', 'black');
        startVideo();

    }
});
//Toggle Microphone
btnMic.click(function () {
    if ($(this).hasClass('fa-microphone')) {
        $(this).addClass('fa-microphone-slash');
        $(this).removeClass('fa-microphone');
        $(this).css('color', 'red');
        stopAudio()

    } else {
        $(this).addClass('fa-microphone');
        $(this).removeClass('fa-microphone-slash');
        $(this).css('color', 'black');
        startAudio();


    }
});

//Toggle Join and Leave

btnPlug.click(function () {
    if ($(this).hasClass('fas fa-plug')) {
        $(this).addClass('fa-window-close');
        $(this).removeClass('fas fa-plug');
        $(this).css('color', 'red');
        startOneToOneVideoCall();
    } else {
        $(this).addClass('fas fa-plug');
        $(this).removeClass('fa-window-close');
        $(this).css('color', 'black');

        rtc.client.leave();
        stopVideo();
        stopAudio();
    }
});