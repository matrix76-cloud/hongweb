// 리팩터링 적용된 MobileContentpage (useContractFlow 적용)
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import MobileChatContentLayout from "../../screen/Layout/Layout/MobileChatContentLayout";
import { collection, doc, onSnapshot, orderBy, query, updateDoc, writeBatch } from "firebase/firestore";
import { UserContext } from "../../context/User";
import { CreateMessage, UpdateDocChat } from "../../service/ChatService";
import { db } from "../../api/config";
import { uploadImage } from "../../service/UploadService";
import { Toaster, toast } from "sonner";
import ChatFlowViews from "../../components/chat/ChatFlowViews";
import useContractFlow from "../../hooks/useContractFlow";
import { MOBILEMAINMENU } from "../../utility/screen";

const MobileContentpage = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const fileInput = useRef();
  const [imgview, setImgview] = useState('');
  const [imgviewpopup, setImgviewpopup] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profilepopup, setProfilepopup] = useState(false);

  const contactId = location.state.CONTACTITEM?.CONTACT_ID;
  const contactFlow = useContractFlow(contactId); // ✅ 통합된 계약 흐름 훅 사용

  const chatid = location.state.ITEM.CHAT_ID;

  console.log("chatid", chatid);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleUploadClick = () => fileInput.current.click();

  const handlefileuploadChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["jpg", "jpeg", "png", "bmp"];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      toast.info("이미지는 jpg, png, bmp만 가능해요.");
      return;
    }

    setMessages(prev => [...prev, { TEXT: '', CHAT_CONTENT_TYPE: 'IMAGE', CREATEDT: new Date(), USERS_ID: user.USERS_ID, TEMP_ID: 'uploading-image' }]);
    setUploading(true);

    await new Promise((res) => setTimeout(res, 300));

    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL("image/jpeg", 0.9);

        setMessages(prev => prev.filter(m => m.TEMP_ID !== 'uploading-image'));

        const uploadedUrl = await uploadImage({ uri: base64, random: Math.random() });

        await CreateMessage({
          CHAT_ID: chatid,
          msg: uploadedUrl,
          users_id: user.USERS_ID,
          read: [user.USERS_ID],
          CHAT_CONTENT_TYPE: "IMAGE",
          ITEM: location.state.ITEM
        });
      };
    };
    reader.readAsDataURL(file);
    setUploading(false);
  };

  useEffect(() => {
    const q = query(
      collection(db, `CHAT/${chatid}/messages`),
      orderBy("CREATEDT", "asc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgList = snapshot.docs.map(doc => doc.data());
      setMessages(msgList);

      const batch = writeBatch(db);
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const docRef = docSnap.ref;

        const hasUserRead = (data.READ || []).includes(user.USERS_ID);

        // ✅ 사용자가 관리자 메시지를 아직 읽지 않은 경우
        if (data.USERS_ID === "admin-system-id" && !hasUserRead) {
          batch.update(docRef, {
            READ: [...(data.READ || []), user.USERS_ID],
          });
        }
      });

      await batch.commit();
    });

    return () => unsubscribe();
  }, [chatid]);
  
  

  useEffect(() => {
    const q = query(
      collection(db, `CHAT/${chatid}/messages`),
      orderBy("CREATEDT", "asc")
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const list = [];

      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        list.push(data);

        // ✅ 시뮬레이터는 읽음 처리만 안 함 (보기는 함)
        if (
          !user.simulate &&
          data.MESSAGE_ID &&
          (!data.READ || !data.READ.includes(user.USERS_ID))
        ) {
          await UpdateDocChat({
            DOC: `CHAT/${chatid}/messages`,
            MESSAGE_ID: data.MESSAGE_ID,
            USERS_ID: user.USERS_ID,
          });
        }
      }

      setMessages(list);

      console.log("list", list);
    });

    return () => unsubscribe();
  }, [chatid, user.USERS_ID]);
  

  const _handlesend = async () => {
    if (!message.trim()) return;
    
    await CreateMessage({
      CHAT_ID: chatid,
      msg: message,
      users_id: user.USERS_ID,
      read: [user.USERS_ID],
      CHAT_CONTENT_TYPE: "TEXT",
      ITEM: location.state.ITEM
    });
    setMessage("");
    window.scrollTo(0, document.body.scrollHeight);
  };

  return (
    <MobileChatContentLayout message={message} name={location.state.NAME} ITEM={location.state.ITEM} type={MOBILEMAINMENU.CHATMENU} image={location.state.LEFTIMAGE}>
      <ChatFlowViews
        ITEM={location.state.ITEM}
        user={user}
        currentStep={contactFlow.currentStep}
        CONTACTITEM={contactFlow}

        messages={messages}
        message={message}
        setMessage={setMessage}
        _handlesend={_handlesend}
        leftname={location.state.LEFTNAME}
        leftimage={location.state.LEFTIMAGE}

        handleUploadClick={handleUploadClick}
        handlefileuploadChange={handlefileuploadChange}
        uploading={uploading}
        fileInput={fileInput}

        _handleimgView={setImgview}
        imgview={imgview}
        imgviewpopup={imgviewpopup}
        setImgviewpopup={setImgviewpopup}

        profilepopup={profilepopup}
        setProfilepopup={setProfilepopup}
      />

      <Toaster position="bottom-right" richColors />
    </MobileChatContentLayout>
  );
};

export default MobileContentpage;

