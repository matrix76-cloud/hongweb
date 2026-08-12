// 📄 src/service/DevProjectService.js
import { db, storage } from "../api/config";
import {
    collection,
    getDocs,
    query,
    orderBy,
    where,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    limit,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * 컬렉션 SSOT
 */
const COL = "DEV_PROJECTS";

/**
 * tags 입력: "PG결제, 푸시알림, 채팅" -> ["PG결제","푸시알림","채팅"] (최대 3)
 */
export const parseTags = (tagsText) => {
    const arr = String(tagsText || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    return arr.slice(0, 3);
};

/**
 * ✅ 공개된 프로젝트 목록(모바일 카드용)
 */
export const getPublishedDevProjects = async () => {
    try {
        const q = query(
            collection(db, COL),
            where("isPublished", "==", true),
            orderBy("order", "asc")
        );

        const snap = await getDocs(q);
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        return list;
    } catch (e) {
        console.error("🔥 getPublishedDevProjects error:", e);
        return [];
    }
};

/**
 * ✅ 관리자용 전체 목록
 */
export const getAllDevProjects = async () => {
    try {
        const q = query(collection(db, COL), orderBy("order", "asc"));
        const snap = await getDocs(q);
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        return list;
    } catch (e) {
        console.error("🔥 getAllDevProjects error:", e);
        return [];
    }
};

export const getDevProjectById = async ({ projectId }) => {
    try {
        const pid = String(projectId || "").trim();
        if (!pid) return null;

        const colRef = collection(db, COL);
        const q = query(colRef, where("projectId", "==", pid), limit(1));
        const snap = await getDocs(q);

        if (snap.empty) return null;

        const d = snap.docs[0];
        return { id: d.id, ...d.data() }; // id는 문서ID(랜덤)
    } catch (e) {
        console.error("🔥 getDevProjectById error:", e);
        return null;
    }
};

/**
 * ✅ 이미지 1장 업로드 -> url 반환
 * path: dev_projects/{projectId}/{timestamp}_{name}
 */
export const uploadDevProjectImage = async ({ projectId, file }) => {
    const pid = String(projectId || "").trim();
    if (!pid) throw new Error("projectId is required");
    if (!file) throw new Error("file is required");

    const safeName = String(file.name || "image").replace(/\s+/g, "_");
    const storageRef = ref(storage, `dev_projects/${pid}/${Date.now()}_${safeName}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
};

/**
 * ✅ 프로젝트 생성(문서ID = projectId)
 * - 최초 생성은 setDoc
 */
export const createDevProject = async ({
    projectId,
    order,
    title,
    desc,
    tags,
    isPublished,
    detailHtml,
    imageUrls, // 배열(0번 썸네일)
}) => {
    try {
        const pid = String(projectId || "").trim();
        if (!pid) throw new Error("projectId is required");
        if (!title) throw new Error("title is required");

        const refDoc = doc(db, COL, pid);
        await setDoc(refDoc, {
            projectId: pid,
            order: Number(order || 0),
            title: String(title || ""),
            desc: String(desc || ""),
            tags: Array.isArray(tags) ? tags.slice(0, 3) : [],
            isPublished: !!isPublished,
            detailHtml: String(detailHtml || ""),
            imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return true;
    } catch (e) {
        console.error("🔥 createDevProject error:", e);
        throw e;
    }
};

/**
 * ✅ 프로젝트 수정
 */
export const updateDevProject = async ({
    projectId,
    order,
    title,
    desc,
    tags,
    isPublished,
    detailHtml,
    imageUrls,
}) => {
    try {
        const pid = String(projectId || "").trim();
        if (!pid) throw new Error("projectId is required");

        const refDoc = doc(db, COL, pid);
        await updateDoc(refDoc, {
            order: Number(order || 0),
            title: String(title || ""),
            desc: String(desc || ""),
            tags: Array.isArray(tags) ? tags.slice(0, 3) : [],
            isPublished: !!isPublished,
            detailHtml: String(detailHtml || ""),
            imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
            updatedAt: serverTimestamp(),
        });

        return true;
    } catch (e) {
        console.error("🔥 updateDevProject error:", e);
        throw e;
    }
};

/**
 * ✅ 삭제
 */
export const deleteDevProject = async ({ projectId }) => {
    try {
        const pid = String(projectId || "").trim();
        if (!pid) throw new Error("projectId is required");

        await deleteDoc(doc(db, COL, pid));
        return true;
    } catch (e) {
        console.error("🔥 deleteDevProject error:", e);
        throw e;
    }
};
