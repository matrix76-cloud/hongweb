// ✅ 리팩터링 적용된 MobileContentpage (useContractFlow 적용)
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import MobileChatContentLayout from "../../screen/Layout/Layout/MobileChatContentLayout";
import { arrayUnion, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from "firebase/firestore";
import { UserContext } from "../../context/User";
import { CeateAITextMessage, CreateMessage, UpdateDocChat } from "../../service/ChatService";
import { db, model } from "../../api/config";
import { uploadImage } from "../../service/UploadService";
import { Toaster, toast } from "sonner";
import ChatFlowViews from "../../components/chat/ChatFlowViews";
import useContractFlow from "../../hooks/useContractFlow";
import { MOBILEMAINMENU } from "../../utility/screen";
import MobileAIContentLayout from "../../screen/Layout/Layout/MobileAIContentLayout";
import AIChatFlowView from "../../components/chat/AIChatFlowView";
import { parseSearchPlan, searchCampsFromServer } from "../../features/camp/campSearch";
import { clearFortuneProfile, getFortuneProfile } from "../../features/features/fortuneStorage";

// 🔮 운세 프로필 저장소


// ✅ helper: 모델이 준 문자열을 안전하게 JSON 파싱
const parseAIPlan = (s) => {
  try {
    const cleaned = s.replace(/```json|```/g, "").trim();
    const obj = JSON.parse(cleaned);
    if (!obj?.action) return null;
    return obj;
  } catch (e) {
    console.warn("AI plan parse fail:", e, s);
    return null;
  }
}

// ✅ helper: answer JSON → 채팅 텍스트
const formatAnswerText = (plan) => {
  const out = [];
  if (plan.summary) out.push(plan.summary);

  if (Array.isArray(plan.sections)) {
    for (const sec of plan.sections) {
      const title = sec?.title ? `\n${sec.title}\n` : "\n";
      const items = (sec?.items || []).map((x) => `• ${x}`).join("\n");
      out.push(`${title}${items}`);
    }
  }

  if (plan.follow_up) out.push(`\n${plan.follow_up}`);
  return out.join("\n");
}

// 역할 판별
const toRole = (m, myId) => {
  if (m.USERS_ID === "ai-friend-id") return "model";
  return "user";
};

// 연속 같은 역할 merge + 대화 규칙 보정
const buildGeminiHistory = (rawMsgs, myId, pendingUserText) => {
  const turns = [];

  for (const m of rawMsgs) {
    const role = toRole(m, myId);
    const text = (m.TEXT || "").trim();
    if (!text) continue;

    const last = turns[turns.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += `\n${text}`;
    } else {
      turns.push({ role, parts: [{ text }] });
    }
  }

  if (pendingUserText?.trim()) {
    const last = turns[turns.length - 1];
    if (last?.role === "user") {
      last.parts[0].text += `\n${pendingUserText.trim()}`;
    } else {
      turns.push({ role: "user", parts: [{ text: pendingUserText.trim() }] });
    }
  }

  while (turns[0]?.role === "model") turns.shift();
  return turns;
};

// Firestore 컬렉션 전체 삭제(메시지 기록 보관 X)
async function deleteAllMessagesOfChat(chatId) {
  const colRef = collection(db, `CHAT/${chatId}/messages`);
  let total = 0;
  while (true) {
    const snap = await getDocs(query(colRef, limit(450)));
    if (snap.empty) break;
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    total += snap.size;
    if (snap.size < 450) break;
  }
  return total;
}

const MobileAIContentpage = () => {
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
  const contactFlow = useContractFlow(contactId);

  const [isAITyping, setIsAITyping] = useState(false);
  const preset = location.state?.AI_PRESET;
  const chatid = location.state?.ITEM?.CHAT_ID;

  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // 최초 입장: 메시지 하나도 없으면 웰컴
  useEffect(() => {
    if (!chatid) return;
    let did = false;
    (async () => {
      const snap = await getDocs(collection(db, `CHAT/${chatid}/messages`));
      if (!did && snap.empty && preset?.welcome) {
        await CreateMessage({
          CHAT_ID: chatid,
          msg: preset.welcome,
          users_id: "ai-friend-id",
          CHAT_CONTENT_TYPE: "TEXT",
          read: [user.USERS_ID],
          ITEM: location.state.ITEM,
          MSG_TYPE: "WELCOME",
        });
      }
    })();
    return () => { did = true; };
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

  // ✅ 인자(강제 텍스트)도 받을 수 있게 리팩
  const _handlesend = async (forcedText) => {
    const input = (typeof forcedText === "string") ? forcedText : message;
    if (!input || !input.trim()) return;

    const userInput = input.trim();

    await CreateMessage({
      CHAT_ID: chatid,
      msg: userInput,
      users_id: user.USERS_ID,
      read: [user.USERS_ID],
      CHAT_CONTENT_TYPE: "TEXT",
      ITEM: location.state.ITEM
    });

    if (typeof forcedText !== "string") setMessage("");
    window.scrollTo(0, document.body.scrollHeight);

    if (!location.state.IS_AI_CHAT) return;

    try {
      setIsAITyping(true);

      // 🔮 운세 프리플라이트: 프로필 없고, 입력에 DOB가 없으면 폼 카드 먼저
      if (preset?.id === "fortune") {
        const profile = getFortuneProfile(user.USERS_ID);
        const hasDobInText = /\d{4}[-/.]?\d{2}[-/.]?\d{2}/.test(userInput);
        if (!profile && !hasDobInText) {
          await CeateAITextMessage({
            CHAT_ID: chatid,
            text: "🔮 운세 보려면 기본 정보를 입력해 주세요.",
            item: {
              ...location.state.ITEM,
              AI_CARD: {
                type: "fortune_form",
                initial: {
                  tz: (Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Seoul"),
                  cal: "solar",
                  unknownTime: true,
                },
              },
            },
            read: [user.USERS_ID],
            msgType: "FORTUNE_FORM",
          });
          setIsAITyping(false);
          return;
        }
      }

      const raw = messages.slice(-12);
      const history = buildGeminiHistory(raw, user.USERS_ID, userInput);

      const chatSession = await model.startChat({
        systemInstruction: { parts: [{ text: preset?.systemInstruction || "" }] },
        history,
      });

      // 🔁 캠핑 프리셋 처리
      if (preset?.id === "camp") {
        const isPack = /(준비|챙길|필요|패킹|장비|용품)/.test(userInput);

        if (!isPack) {
          const quickPlan = {
            action: "search",
            source: "camping",
            filters: { keywords: [userInput.trim()] },
            sort: { by: "relevance", order: "desc" },
            limit: 20,
          };

          const quick = await searchCampsFromServer(quickPlan);
          const all = (quick.docs || []).filter(d => (d.facltNm || d.name) && d.addr1);

          const normalize = (s = "") =>
            s.toString().toLowerCase().replace(/\(.*?\)/g, "").replace(/\s+/g, "").replace(/[^\p{L}\p{N}]/gu, "");
          const stripTypeSuffix = (s = "") => s.replace(/\s*(캠핑장|글램핑|카라반|야영장|오토\s*캠핑)\s*$/u, "");
          const stripMarketingSuffix = (s = "") => s.replace(/\s+(파크|리조트)\s*$/u, "");
          const baseName = (s = "") => normalize(stripMarketingSuffix(stripTypeSuffix(s)));

          const qRaw = normalize(userInput);
          const qBase = baseName(userInput);
          const nameRaw = d => normalize(d.facltNm || d.name || "");
          const nameBase = d => baseName(d.facltNm || d.name || "");

          const exact = all.filter(d => nameRaw(d) === qRaw || nameBase(d) === qBase);
          const starts = exact.length ? [] : all.filter(d => nameBase(d).startsWith(qBase));
          const contains = (exact.length || starts.length) ? [] : all.filter(d => nameBase(d).includes(qBase));

          const uniqBy = (arr, keyFn) => {
            const m = new Map();
            for (const x of arr) { const k = keyFn(x); if (!m.has(k)) m.set(k, x); }
            return [...m.values()];
          };

          let hits = exact.length ? exact : (starts.length ? starts : contains);
          hits = uniqBy(hits, d => `${d.facltNm || d.name}@@${d.addr1}`);

          const display = hits.slice(0, exact.length ? 1 : 5);

          if (display.length) {
            const itemsForCard = display.map(d => ({
              id: d.id || d.contentId,
              facltNm: d.facltNm || d.name || "",
              addr1: d.addr1 || "",
            }));

            await CeateAITextMessage({
              CHAT_ID: chatid,
              text: exact.length
                ? "정확히 일치하는 1곳을 찾았어요."
                : `${hits.length}곳 중 이름 기준으로 추려서 보여드려요.`,
              item: {
                ...location.state.ITEM,
                SEARCH_PLAN: quickPlan,
                AI_CARD: { type: "camp_list", items: itemsForCard },
              },
              read: [user.USERS_ID],
              msgType: "CAMP_LIST",
            });
            setIsAITyping(false);
            return;
          }
        }

        const intentHint =
          /(준비|챙길|필요|패킹|장비|용품|필요)/.test(userInput) ? "PACKING_LIST" : undefined;

        const payload = JSON.stringify({ message: userInput, context: { intent_hint: intentHint } });
        const result = await chatSession.sendMessage("search 또는 answer JSON만 출력. 코드블록 금지.\n" + payload);
        const aiText = (await result.response.text()).trim();
        const plan = parseAIPlan(aiText);

        if (!plan) {
          await CreateMessage({
            CHAT_ID: chatid,
            msg: "검색 계획을 해석하지 못했어요. 지역/테마/편의시설을 한 번만 더 구체적으로 말해줄래요?",
            users_id: "ai-friend-id",
            CHAT_CONTENT_TYPE: "TEXT",
            read: [user.USERS_ID],
            ITEM: location.state.ITEM,
          });
          setIsAITyping(false);
          return;
        }

        if (plan.action === "answer") {
          const text = formatAnswerText(plan);
          await CeateAITextMessage({
            CHAT_ID: chatid,
            text,
            item: { ...location.state.ITEM, AI_ANSWER: plan },
            read: [user.USERS_ID],
            msgType: "CAMP_ANSWER",
          });
          setIsAITyping(false);
          return;
        }

        if (plan.action === "search") {
          const { docs, relaxed, reason } = await searchCampsFromServer(plan);

          const top = docs.slice(0, plan.limit || 20);
          const itemsForCard = top.map((d, i) => ({
            rank: i + 1,
            id: d.id || d.contentId,
            name: d.name || d.facltNm,
            region: d.region || `${d.doNm || ""} ${d.sigunguNm || ""}`.trim(),
            pet_friendly:
              typeof d.pet_friendly === "boolean"
                ? d.pet_friendly
                : (/가능/.test(String(d.animalCmgCl)) || /반려견/.test(String(d.tooltip || d.tooltipme || ""))),
            theme_tags: d.theme_tags || (d.lctCl ? d.lctCl.split(",") : []),
            amenities: d.amenities || (d.sbrsCl ? d.sbrsCl.split(",") : []),
            image: d.image || d.firstImageUrl || null,
            addr1: d.addr1 || "",
          }));

          await CeateAITextMessage({
            CHAT_ID: chatid,
            text: `${relaxed ? "🔎 조건을 조금 완화해서 찾아봤어요.\n" : ""} 원하는 곳을 누르면 상세를 보여줄게요.`,
            item: {
              ...location.state.ITEM,
              SEARCH_PLAN: plan,
              AI_CARD: { type: "camp_list", items: itemsForCard },
              ...(reason ? { RELAX_REASON: reason } : {}),
            },
            read: [user.USERS_ID],
            msgType: "CAMP_LIST",
          });

          setIsAITyping(false);
          return;
        }

        await CreateMessage({
          CHAT_ID: chatid,
          msg: "요청을 이해했지만 알 수 없는 action이에요. 다시 한번 부탁할게요!",
          users_id: "ai-friend-id",
          CHAT_CONTENT_TYPE: "TEXT",
          read: [user.USERS_ID],
          ITEM: location.state.ITEM,
        });
        setIsAITyping(false);
        return;
      }

      // 🔮 운세 등 기본 프리셋 처리: fortune_profile context 자동 첨부
      let sendContent = "";
      if (preset?.id === "fortune") {
        const profile = getFortuneProfile(user.USERS_ID);
        sendContent = "context: " + JSON.stringify({ fortune_profile: profile || null });
      }

      const result = await chatSession.sendMessage(sendContent);
      const aiResponse = await result.response.text();

      await CreateMessage({
        CHAT_ID: chatid,
        msg: aiResponse,
        users_id: "ai-friend-id",
        CHAT_CONTENT_TYPE: "TEXT",
        read: [user.USERS_ID],
        ITEM: location.state.ITEM,
      });

      setIsAITyping(false);
    } catch (err) {
      setIsAITyping(false);
      console.error("Gemini 응답 실패:", err);
      toast.error("AI 응답에 문제가 생겼어요!");
    }
  };

  const handleResetConversation = async () => {
    if (!chatid || resetting) return;
    const ok = window.confirm("대화 내용을 전부 삭제하고 처음부터 다시 시작할까요?");
    if (!ok) return;

    try {
      setResetting(true);
      setIsAITyping(false);
      setMessage("");

      // 1) 서버 기록 삭제
      await deleteAllMessagesOfChat(chatid);
   
      // 2) 로컬 비우기
      setMessages([]);

      // 2.5) 운세 프로필도 삭제
      clearFortuneProfile(user.USERS_ID);

      // 3) 웰컴 메시지 다시
      const welcomeText =
        preset?.welcome ||
        "안녕! 나는 알비야 🤗 원하는 주제로 다시 시작해볼까?";

      await CreateMessage({
        CHAT_ID: chatid,
        msg: welcomeText,
        users_id: "ai-friend-id",
        CHAT_CONTENT_TYPE: "TEXT",
        read: [user.USERS_ID],
        ITEM: location.state.ITEM,
        MSG_TYPE: "WELCOME",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.error("reset failed", e);
      toast.error("초기화에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <MobileAIContentLayout
      name={preset?.leftname || "AI 친구 하루"}
      onResetConversation={handleResetConversation}
      resetting={resetting}
    >
      <AIChatFlowView
        ITEM={location.state.ITEM}
        user={user}
        currentStep={contactFlow.currentStep}
        CONTACTITEM={contactFlow}
        messages={messages}
        message={message}
        setMessage={setMessage}
        _handlesend={_handlesend}
        bgImage={preset?.bg}
        leftname={preset?.leftname}
        leftimage={preset?.leftimage}
        isAITyping={isAITyping}
      />
      <Toaster position="bottom-right" richColors />
    </MobileAIContentLayout>
  );
};

export default MobileAIContentpage;
