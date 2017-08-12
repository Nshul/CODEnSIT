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
    let Otherpeerid;
    $('#step3').hide();

    peer.on('call',(call)=>{
        acceptcall.show();
        endcall.show();
        acceptcall.click(()=>{
            call.answer(window.localStream);
            step3(call);
        })
    });

    endcall.click(()=>{
        window.existingCall.close();
        step2();
        $('#receivedvid').prop('src', '');
    });

    step1();

    call.click(()=>{
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
    }

    function step1(){
        navigator.getUserMedia({audio:true,video: true},function(stream){
            $('#myvid').prop("src",URL.createObjectURL(stream));
            window.localStream = stream;
            step2();
        },function () {
            console.log("Error with webcam in step1 encountered");
        })
    }

    function step2(){
        $('#step3').hide();
    }

    connect.click(()=>{
        $.get('/getpeerId?username=' + peerid.val(), function (id) {
            if(id!=='0'){
                let conn = peer.connect(id);
                Otherpeerid = id;

                conn.send("Connection has been established");

                sendmsg.click(()=>{
                    conn.send(msgtxt.val());
                    console.log("Message sent(connect.click()):",msgtxt.val());
                });

                conn.on('data',function (data) {
                    msglist.append(`<li>${data}</li>`);
                    console.log("Received(connect.click()):",data);
                })
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
            conn.on('data',(data)=>{
                console.log('Received(peer.on)',data);
                msglist.append(`<li>${data}</li>`);
            });

            console.log(conn);
            conn.send("Connection has been established");

            sendmsg.click(()=>{
                conn.send(msgtxt.val());
                console.log("Message sent(peer.on):",msgtxt.val());
            });
        });
    })
});
