/* eslint-disable */
import {
    collection,
    addDoc,
    query,
    updateDoc,
    where,
    orderBy,
    limit,
    getDocs,
    serverTimestamp,
    doc,
    getDoc,
    increment,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";


import {
    ref as sRef,           // ✅ 추가
    uploadBytes,           // ✅ 추가
    getDownloadURL,        // ✅ 추가
} from "firebase/storage";


import { db, model, storage } from '../api/config';

const COL = "boards_posts";
const norm = (v) => String(v || "").trim();

export async function listBoardLatest({ pageSize = 3 } = {}) {
    const colRef = collection(db, COL);
    const q = query(
        colRef,
        where("status", "==", "published"),
        orderBy("createdAt", "desc"),
        limit(pageSize)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listBoardPosts({ pageSize = 50 } = {}) {
    try {
        const colRef = collection(db, COL);

        const q = query(
            colRef,
            where("status", "==", "published"),
            orderBy("createdAt", "desc"),
            limit(pageSize)
        );

        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
        console.error("listBoardPosts ERROR:", e);
        console.error("code:", e?.code);
        console.error("message:", e?.message);
        throw e; // ✅ 이게 중요: 컨테이너까지 에러 전달
    }
}

export async function readBoardPost(postId) {
    const id = norm(postId);
    if (!id) return null;
    const ref = doc(db, COL, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
}

export async function createBoardPost({
    title,
    content,
    category = "free",
    createdBy = "",
    imageUrls = [],

    // ✅ 추가: 작성자 스냅샷
    authorId = "",
    authorName = "",
    authorPhoto = "",
    authorDeviceId = "",
} = {}) {
    const t = norm(title);
    const c = norm(content);
    const cat = norm(category) || "free";

    if (!t) throw new Error("title_required");
    if (!c) throw new Error("content_required");

    const payload = {
        title: t,
        content: c,
        category: cat,

        // 기존 필드 유지(형이 이미 쓰고 있던 거)
        createdBy: norm(createdBy),

        // ✅ 작성자 스냅샷 (디테일/목록 표시에 사용)
        authorId: norm(authorId),
        authorName: norm(authorName),
        authorPhoto: norm(authorPhoto),
        authorDeviceId: norm(authorDeviceId),

        createdAt: serverTimestamp(),
        status: "published",
        imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
    };

    const colRef = collection(db, COL);
    const ref = await addDoc(colRef, payload);
    return ref?.id || null;
}


function makeId() {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function compressImageToJpeg(file, { quality = 0.7, maxW = 1600, maxH = 1600 } = {}) {
    // ✅ 이미지 파일만
    if (!file || !file.type || !file.type.startsWith("image/")) return null;

    const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = dataUrl;
    });

    let w = img.width || 1;
    let h = img.height || 1;

    // ✅ 비율 유지 리사이즈
    const ratio = Math.min(maxW / w, maxH / h, 1);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);

    const blob = await new Promise((resolve) => {
        canvas.toBlob(
            (b) => resolve(b),
            "image/jpeg",
            quality
        );
    });

    if (!blob) return null;

    // blob -> File 비슷한 객체로
    return new File([blob], `${makeId()}.jpg`, { type: "image/jpeg" });
}

export async function uploadBoardImages({ files = [], postId = "" } = {}) {
    const pid = String(postId || "").trim();
    if (!pid) throw new Error("postId_required");

    const arr = Array.isArray(files) ? files : [];
    const results = [];

    for (const f of arr) {
        const compressed = await compressImageToJpeg(f, { quality: 0.7, maxW: 1600, maxH: 1600 });
        if (!compressed) continue;

        const path = `boards_posts/${pid}/images/${makeId()}.jpg`;
        const r = sRef(storage, path);

        const snap = await uploadBytes(r, compressed, { contentType: "image/jpeg" });
        const url = await getDownloadURL(snap.ref);

        results.push(url);
    }

    return results; // imageUrls
}

export async function updateBoardPostImages({ postId = "", imageUrls = [] } = {}) {
    const pid = norm(postId);
    if (!pid) throw new Error("postId_required");

    const urls = Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : [];
    const refDoc = doc(db, COL, pid);

    await updateDoc(refDoc, {
        imageUrls: urls,
        updatedAt: serverTimestamp(),
    });

    return true;
}

export async function toggleBoardLike(postId, userId) {
    const pid = norm(postId);
    const uid = norm(userId);
    if (!pid || !uid) return null;

    const refDoc = doc(db, COL, pid);
    const snap = await getDoc(refDoc);
    if (!snap.exists()) return null;

    const likedBy = snap.data().likedBy || [];
    const liked = likedBy.includes(uid);

    await updateDoc(refDoc, {
        likedBy: liked ? arrayRemove(uid) : arrayUnion(uid),
        likeCount: increment(liked ? -1 : 1),
    });

    return !liked; // true = 좋아요 됨, false = 취소됨
}

export async function incrementBoardView(postId) {
    const pid = norm(postId);
    if (!pid) return;
    const refDoc = doc(db, COL, pid);
    await updateDoc(refDoc, { viewCount: increment(1) });
}

/* ========================= 댓글 ========================= */

export async function addBoardComment({ postId, content, authorId, authorName, authorPhoto, parentId = "" }) {
    const pid = norm(postId);
    const c = norm(content);
    if (!pid || !c) throw new Error("postId_and_content_required");

    const colRef = collection(db, COL, pid, "comments");
    const payload = {
        content: c,
        authorId: norm(authorId),
        authorName: norm(authorName),
        authorPhoto: norm(authorPhoto),
        parentId: norm(parentId),
        createdAt: serverTimestamp(),
    };

    const ref = await addDoc(colRef, payload);

    // 게시글 commentCount +1
    const postRef = doc(db, COL, pid);
    await updateDoc(postRef, { commentCount: increment(1) });

    return ref.id;
}

export async function listBoardComments(postId) {
    const pid = norm(postId);
    if (!pid) return [];

    const colRef = collection(db, COL, pid, "comments");
    const q = query(colRef, orderBy("createdAt", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}