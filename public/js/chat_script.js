navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
$(function () {
    let peerID;
    let peerid = $('#peerid');
    let connect = $('#buttonpeer');
    let msglist = $('#messages');
    let msgtxt = $('#msgtxt');
    let sendmsg = $('#sendmsg');
    let call = $('#callpeer');
    let videlement = $('#videlement');
    let acceptcall = $('#acceptcall');
    let endcall = $('#endcall');
    let sendBox = $('#sendBox');
    let Otherpeerid;

    $('#step3').hide();
    call.hide();
    sendBox.hide();
    acceptcall.hide();

    peer.on('call',(call)=>{
        acceptcall.show();
        endcall.show();
        $('#callpeer').hide();
        acceptcall.click(()=>{
            call.answer(window.localStream);
            step3(call);
        });
    });

    step1();

    call.click(()=>{
        $('#callpeer').hide();
        console.log(Otherpeerid);
        var call = peer.call(Otherpeerid,window.localStream);
        step3(call);
    });

    function step3 (call) {
        // Hang up on an existing call if present
        if (window.existingCall) {
            window.existingCall.close();
        }

        // Wait for stream on the call, then set peer video display
        call.on('stream', function(stream){
            $('#receivedvid').prop('src', URL.createObjectURL(stream));
        });

        // UI stuff
        window.existingCall = call;
        $('#their-id').val(call.peer);
        call.on('close', step2);
        $('#step3').show();
        acceptcall.hide();
    }

    function step1(){
        navigator.getUserMedia({audio:true,video: true},function(stream){
            $('#myvid').prop("src",URL.createObjectURL(stream));
            window.localStream = stream;
            step2();
        }, (err) => {
            console.log(err);
        });
    }

    function step2(){
        $('#step3').hide();
    }

    connect.click(()=>{
        $.get('/getpeerId?username=' + peerid.val(), function (id) {
            if(id!=='0'){
                let conn = peer.connect(id);
                Otherpeerid = id;

                connect.hide();
                call.show();
                sendBox.show();

                sendmsg.click(()=>{
                    conn.send(msgtxt.val());
                    console.log("Message sent(connect.click()):",msgtxt.val());
                });

                conn.on('data',function (data) {
                    if(data==='$END CALL$'){
                        window.existingCall.close();
                        step2();
                        $('#receivedvid').prop('src', '');
                        call.show();
                    } else {
                        console.log("Received(connect.click()):",data);
                        msglist.append(`<li>${data}</li>`);
                    }
                });

                endcall.click(()=>{
                    window.existingCall.close();
                    conn.send('$END CALL$');
                    step2();
                    $('#receivedvid').prop('src', '');
                    call.show();
                });
            } else {
                alert('entered username does not exist or is not online');
            }
        });
    });

    peer.on('error',(err)=>{
        alert(err.message);
        step2();
    });

    peer.on('connection',(conn)=>{
        conn.on('open',()=>{

            connect.hide();
            call.show();
            sendBox.show();

            for(var data in peer.connections) {
                if(peer.connections.hasOwnProperty(data)){
                    Otherpeerid = data;
                }
            }

            conn.on('data',(data)=>{
                if(data==='$END CALL$'){
                    window.existingCall.close();
                    step2();
                    $('#receivedvid').prop('src', '');
                    call.show();
                } else {
                    console.log('Received(peer.on)',data);
                    msglist.append(`<li>${data}</li>`);
                }
            });

            sendmsg.click(()=>{
                conn.send(msgtxt.val());
                console.log("Message sent(peer.on):",msgtxt.val());
            });

            endcall.click(()=>{
                window.existingCall.close();
                conn.send('$END CALL$');
                step2();
                $('#receivedvid').prop('src', '');
                call.show();
            });
        });
    });
});
