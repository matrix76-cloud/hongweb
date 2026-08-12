import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../api/config";

export default function useContractFlow(contactId) {
    const [contactItem, setContactItem] = useState({
        CONTACTSTATUS: "초기",
        CONTACT_INFO: [],
        LEFT_SIGN: "",
        LEFTCREATEDT: "",
        RIGHT_SIGN: "",
        RIGHTCREATEDT: "",
        PURCHASECREATEDT: "",
        OWNER_ID: "",
        SUPPORTER_ID: "",
        CONTACT_ID: contactId,
        WORKTYPE: "",
        COMPLETE: {}, // ✅ 새로운 필드로 COMPLETE 추가
        REVIEW: {}, // ✅ 추가
    });

    useEffect(() => {
        if (!contactId) return;

        const unsub = onSnapshot(doc(db, `CONTACT/${contactId}`), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();

                setContactItem({
                    CONTACTSTATUS: data.CONTACTSTATUS ?? "초기",
                    CONTACT_INFO: data.CONTACT_INFO ?? [],
                    LEFT_SIGN: data.LEFT_SIGN ?? "",
                    LEFTCREATEDT: data.LEFTCREATEDT ?? "",
                    RIGHT_SIGN: data.RIGHT_SIGN ?? "",
                    RIGHTCREATEDT: data.RIGHTCREATEDT ?? "",
                    PURCHASECREATEDT: data.PURCHASECREATEDT ?? "",
                    OWNER_ID: data.OWNER_ID ?? "",
                    SUPPORTER_ID: data.SUPPORTER_ID ?? "",
                    CONTACT_ID: data.CONTACT_ID ?? contactId,
                    WORKTYPE: data.WORKTYPE ?? "",
                    COMPLETE: data.COMPLETE ?? {}, // ✅ COMPLETE 필드 반영
                    REVIEW: data.REVIEW ?? {}, // ✅ 리뷰 필드 반영
                });
            }
        });

        return () => unsub();
    }, [contactId]);

    // ✅ 현재 상태값
    const status = contactItem.CONTACTSTATUS;
    const stepOrder = {
        "초기": 0,
        "의뢰자서명전": 0,
        "의뢰자서명완료": 1,
        "홍여사서명완료": 2,
        "결제완료": 3,
        "작업완료": 4,
        "평가완료": 5,
        "정산완료": 6
    };
    const currentStep = stepOrder[status] ?? 0;

    // ✅ 완료 보고 및 리뷰 데이터 추출
    const complete = contactItem.COMPLETE ?? {};
    const review = contactItem.REVIEW ?? {};

    return {
        ...contactItem,
        currentStep,
        currentStatus: status,

        // 흐름 단계별 상태
        isContractStarted: currentStep >= 0,
        isContractDone: currentStep >= 2,
        isPaymentDone: currentStep >= 3,
        isWorkDone: currentStep >= 4,
        isReviewDone: currentStep >= 5,
        isSettled: currentStep >= 6,

        // ✅ 완료 보고 관련
        hasResultImages: !!complete.images?.length,
        resultImages: complete.images ?? [],
        resultText: complete.result ?? "",

        // ✅ 평가 관련
        hasReview: !!review.text,
        reviewText: review.text ?? "",
        reviewTags: review.tags ?? [],
    };
}
