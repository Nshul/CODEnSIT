navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
$(function () {
    let peerID;
    let peerid = $('#peerid');
    let connect = $('#buttonpeer');
    let msglist = $('#messages');
    let msgtxt = $('#msgtxt');
    let sendmsg = $('#sendmsg');
    let call = $('#callpeer');
    // let canvas = $('#mediacanvas');
    let videlement = $('#videlement');
    let acceptcall = $('#acceptcall');
    let endcall = $('#endcall');
    $('#step3').hide();

    peer.on('open',(id)=>{
        console.log("My peer id is :"+id);
        peerID = id;
    });

    // navigator.getUserMedia({audio: true, video: true}, function(stream){
    // window.localStream = stream;

    peer.on('call',(call)=>{
        acceptcall.show();
        endcall.show();
        acceptcall.click(()=>{
            call.answer(window.localStream);
            step3(call);
        })
    });

    endcall.click(()=>{
        window.existingCall.close();step2();
    });

    step1();

    call.click(()=>{
            var call = peer.call(peerid.val(),window.localStream)
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
        var conn = peer.connect(peerid.val());
        console.log("connection established");
        // console.log(conn);

        sendmsg.click(()=>{
            conn.send(msgtxt.val());
            console.log("Message sent(connect.click()):",msgtxt.val());
        });

        conn.on('data',function (data) {
            msglist.append(`<li>${data}</li>`);
            console.log("Received(connect.click()):",data);
        })
    });

    // peer.on('call',(call)=>{
    //     call.answer(window.localStream);
    //     call.on('stream',(stream)=>{
    //         canvas.prop("src",URL.createObjectURL(stream));
    //     })
    // })

    peer.on('error',(err)=>{
        alert(err.message);
        step2();
    })

    peer.on('connection',(conn)=>{
        conn.on('open',()=>{
            conn.on('data',(data)=>{
                console.log('Received(peer.on)',data);
                msglist.append(`<li>${data}</li>`);
            });

            conn.send("Connection has been established with ",conn.peer);
            sendmsg.click(()=>{
                conn.send(msgtxt.val());
                console.log("Message sent(peer.on):",msgtxt.val());
            });
        });


    })

});
