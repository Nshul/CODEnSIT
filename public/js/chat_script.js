navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
$(function () {
    let peerid = $('#peerid');
    let connect = $('#buttonpeer');
    let msglist = $('#messages');
    let msgtxt = $('#msgtxt');
    let sendmsg = $('#sendmsg');
    let call = $('#callpeer');
    let acceptcall = $('#acceptcall');
    let endcall = $('#endcall');
    let sendBox = $('#sendBox');
    let clearButton = $('#clear');
    let Otherpeerid, Otherusername='';

    $('#step3').hide();
    call.hide();
    sendBox.hide();
    acceptcall.hide();

    peer.on('call',(call)=>{
        console.log('CALLLLLL');
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
            $('#step3').show();
            $('#top_banner').hide();
        });

        // UI stuff
        window.existingCall = call;

        call.on('close', step2);
        if(Otherusername===''){
            $.get('/getusername?id=' + Otherpeerid, (data) => {
                Otherusername = data;
                console.log(data);
                console.log(Otherusername);
                $('#their-id').text(Otherusername);
            });
        } else {
            $('#their-id').text(Otherusername);
        }

        call.on('close', step2);
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

    clearButton.click(()=> {
        $.post('/clearchat',{
            sender: myusername,
            reciever: Otherusername
        }, (success)=> {
            if(success){
                msglist.html('');
            } else {
                alert('error in clearing chat');
            }
        });
    });

    connect.click(()=>{
        $.get('/getpeerId?username=' + peerid.val(), function (id) {
            if(id!=='0'){
                let conn = peer.connect(id);
                Otherusername = peerid.val();
                Otherpeerid = id;

                connect.hide();
                call.show();

                $.get('/getchat?sender=' + myusername +
                    '&reciever=' + Otherusername, function (comments) {
                    for(let chat of comments) {
                        let img;
                        (chat.author === myusername) ? img='matt.jpg' : img='elliot.jpg';
                        let name;
                        (chat.author === myusername) ? name='You' : name=chat.author;
                        msglist.append(`
                        <div class="comment">
                            <a class="avatar">
                                <img src="/img/${img}">
                            </a>
                            <div class="content">
                                <a class="author">${name}</a>
                                <div class="text">
                                    ${chat.text}
                                </div>
                            </div>
                        </div>`);
                    }
                    sendBox.show();
                });

                sendmsg.click(()=>{
                    conn.send(msgtxt.val());
                    $.post('/sendmsg',{
                        msg: msgtxt.val(),
                        sender: myusername,
                        reciever: Otherusername
                    }, function (success) {
                        if(success){
                            msglist.append(`
                            <div class="comment">
                                <a class="avatar">
                                    <img src="/img/matt.jpg">
                                </a>
                                <div class="content">
                                    <a class="author">You</a>
                                    <div class="text">
                                        ${msgtxt.val()}
                                    </div>
                                </div>
                            </div>`);
                            //console.log("Message sent(connect.click()):",msgtxt.val());
                            msgtxt.val('');
                        }
                    });
                });

                msgtxt.keydown((e)=> {
                    if(e.keyCode === 13) {
                        conn.send(msgtxt.val());
                        $.post('/sendmsg',{
                            msg: msgtxt.val(),
                            sender: myusername,
                            reciever: Otherusername
                        }, function (success) {
                            if(success){
                                msglist.append(`
                            <div class="comment">
                                <a class="avatar">
                                    <img src="/img/matt.jpg">
                                </a>
                                <div class="content">
                                    <a class="author">You</a>
                                    <div class="text">
                                        ${msgtxt.val()}
                                    </div>
                                </div>
                            </div>`);
                                //console.log("Message sent(connect.click()):",msgtxt.val());
                                msgtxt.val('');
                            }
                        });
                    }
                });

                conn.on('data',function (data) {
                    if(data==='$END CALL$'){
                        window.existingCall.close();
                        step2();
                        $('#receivedvid').prop('src', '');
                        call.show();
                        $('#top_banner').show();
                    } else {
                        $.post('/recievemsg',{
                            msg: data,
                            sender: myusername,
                            reciever: Otherusername
                        }, function (success) {
                            if(success){
                                msglist.append(`
                                <div class="comment">
                                    <a class="avatar">
                                        <img src="/img/elliot.jpg">
                                    </a>
                                    <div class="content">
                                        <a class="author">${Otherusername}</a>
                                        <div class="text">
                                            ${data}
                                        </div>
                                    </div>
                                </div>`);
                                //console.log("Received(connect.click()):",data);
                            }
                        });
                    }
                });

                endcall.click(()=>{
                    window.existingCall.close();
                    $('#top_banner').show();
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

            for(var data in peer.connections) {
                if(peer.connections.hasOwnProperty(data)){
                    console.log(peer.connections);
                    Otherpeerid = data;
                    $.get('/getusername?id=' + data, (Other)=>{
                        Otherusername = Other;
                        $.get('/getchat?sender=' + myusername +
                            '&reciever=' + Otherusername, function (comments) {
                            for(let chat of comments) {
                                let img;
                                (chat.author === myusername) ? img='matt.jpg' : img='elliot.jpg';
                                let name;
                                (chat.author === myusername) ? name='You' : name=chat.author;
                                msglist.append(`
                                <div class="comment">
                                    <a class="avatar">
                                        <img src="/img/${img}">
                                    </a>
                                    <div class="content">
                                        <a class="author">${name}</a>
                                        <div class="text">
                                            ${chat.text}
                                        </div>
                                    </div>
                                </div>`);
                            }
                            sendBox.show();
                        });
                    });
                }
            }

            conn.on('data',(data)=>{
                if(data==='$END CALL$'){
                    window.existingCall.close();
                    step2();
                    $('#receivedvid').prop('src', '');
                    call.show();
                    $('#top_banner').show();
                } else {
                    $.post('/recievemsg',{
                        msg: data,
                        sender: myusername,
                        reciever: Otherusername
                    }, function (success) {
                        if(success){
                            msglist.append(`
                            <div class="comment">
                                <a class="avatar">
                                    <img src="/img/elliot.jpg">
                                </a>
                                <div class="content">
                                    <a class="author">${Otherusername}</a>
                                    <div class="text">
                                        ${data}
                                    </div>
                                </div>
                            </div>`);
                            //console.log('Received(peer.on)',data);
                        }
                    });
                }
            });

            sendmsg.click(()=>{
                conn.send(msgtxt.val());
                $.post('/sendmsg',{
                    msg: msgtxt.val(),
                    sender: myusername,
                    reciever: Otherusername
                }, function (success) {
                    if(success){
                        msglist.append(`
                            <div class="comment">
                                <a class="avatar">
                                    <img src="/img/matt.jpg">
                                </a>
                                <div class="content">
                                    <a class="author">${myusername}</a>
                                    <div class="text">
                                        ${msgtxt.val()}
                                    </div>
                                </div>
                            </div>`);
                        //console.log("Message sent(peer.on):",msgtxt.val());
                        msgtxt.val('');
                    }
                });
            });

            msgtxt.keydown((e)=> {
                if(e.keyCode === 13) {
                    conn.send(msgtxt.val());
                    $.post('/sendmsg',{
                        msg: msgtxt.val(),
                        sender: myusername,
                        reciever: Otherusername
                    }, function (success) {
                        if(success){
                            msglist.append(`
                            <div class="comment">
                                <a class="avatar">
                                    <img src="/img/matt.jpg">
                                </a>
                                <div class="content">
                                    <a class="author">${myusername}</a>
                                    <div class="text">
                                        ${msgtxt.val()}
                                    </div>
                                </div>
                            </div>`);
                            //console.log("Message sent(peer.on()):",msgtxt.val());
                            msgtxt.val('');
                        }
                    });
                }
            });

            endcall.click(()=>{
                window.existingCall.close();
                conn.send('$END CALL$');
                step2();
                $('#receivedvid').prop('src', '');
                call.show();
                $('#top_banner').show();
            });
        });
    });
});
