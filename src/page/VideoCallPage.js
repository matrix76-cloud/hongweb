// pages/VideoCallPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import VideoChatModal from '../components/videocall/VideoChatModal';
import useVideoCall from '../components/videocall/useVideoCall';
import { useSearchParams } from 'react-router-dom';
import { imageDB } from '../utility/imageData';

const VideoCallPage = () => {
    const [searchParams] = useSearchParams();
    const chatId = searchParams.get('chatId');
    const receiverId = searchParams.get('receiverId');
    const calleeName = searchParams.get('calleeName');
    const calleeProfileImg = searchParams.get('calleeProfileImg');
    const isCaller = searchParams.get('isCaller') === 'true';
    const userParam = searchParams.get('user');
    const user = userParam ? JSON.parse(decodeURIComponent(userParam)) : null;

    console.log("VideoCallPage receiverId:", receiverId);


    const [waiting, setWaiting] = useState(true);
    const [inCall, setInCall] = useState(true);
    const [ended, setEnded] = useState(false);

    const localRef = useRef(null);
    const remoteRef = useRef(null);

    const {
        startCall,
        acceptCall,
        endCall,
    } = useVideoCall({
        chatId,
        isCaller,
        localRef,
        remoteRef,
        receiverId,
        user,
        onRemoteConnected: () => setWaiting(false)
    });

    const handleClose = () => {
        endCall();
        setInCall(false);
        setEnded(true);
    };

    useEffect(() => {
        if (isCaller) startCall();
        else acceptCall();
    }, [chatId, isCaller]);

    if (ended) {
        return (
            <EndWrapper>
                <EndImage src={imageDB.hongchatclose} alt="종료됨" />
            </EndWrapper>
        );
    }

    return (
        <VideoChatModal
            localRef={localRef}
            remoteRef={remoteRef}
            inCall={inCall}
            isCaller={isCaller}
            startCall={startCall}
            acceptCall={acceptCall}
            endCall={endCall}
            waiting={waiting}
            chatId={chatId}
            calleeName={calleeName}
            calleeProfileImg={calleeProfileImg}
            onClose={handleClose}
        />
    );
};

export default VideoCallPage;

const EndWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #fff;
`;

const EndText = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const EndImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;
