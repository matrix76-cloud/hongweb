import { useEffect, useState } from 'react';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../api/config';



export const useUnreadChatCount = (currentUserId, interval = 10000) => {
    const [totalUnread, setTotalUnread] = useState(0);
    const [roomUnreadMap, setRoomUnreadMap] = useState({});

    useEffect(() => {
        if (!currentUserId) return;

        const fetchUnreadCounts = async () => {
            const chatRoomsRef = collection(db, 'CHAT');
            const snapshot = await getDocs(chatRoomsRef);

            let total = 0;
            let perRoom = {};

            for (const doc of snapshot.docs) {
                const roomId = doc.id;
                const roomData = doc.data();

                const ownerId = roomData.OWNER_ID;
                const supporterId = roomData.SUPPORTER_ID;
                const isOwner = ownerId === currentUserId;
                const isSupporter = supporterId === currentUserId;
                if (!isOwner && !isSupporter) continue;

                const messagesRef = collection(db, 'CHAT', roomId, 'messages');
                const msgSnap = await getDocs(messagesRef);

                let roomUnread = 0;

                msgSnap.forEach((msgDoc) => {
                    const msg = msgDoc.data();
                    const isMyMessage = msg.USERS_ID === currentUserId;
                    const hasRead = (msg.READ || []).includes(currentUserId);
                    if (!isMyMessage && !hasRead) {
                        roomUnread += 1;
                        total += 1;
                    }
                });

                if (roomUnread > 0) {
                    perRoom[roomId] = roomUnread;
                }
            }

            setTotalUnread(total);
            setRoomUnreadMap(perRoom);
        };

        // 🔁 10초마다 polling
        fetchUnreadCounts(); // 최초 1회
        const timer = setInterval(fetchUnreadCounts, interval);

        return () => clearInterval(timer); // 정리
    }, [currentUserId, interval]);

    return { totalUnread, roomUnreadMap };
};
