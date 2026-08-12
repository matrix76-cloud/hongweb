import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';

import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';
import randomLocation from 'random-location'
import { useSleep } from '../utility/common';
import Axios from 'axios';
import { CONTACTTYPE } from '../utility/screen';

const authService = getAuth(firebaseApp);

import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, getDocs, runTransaction, getDoc, where } from 'firebase/firestore';


// 1. 게시글 등록
export const createPost = async (data) => {

    await addDoc(collection(db, 'POSTS'), {
        ...data,
        likes: 0,
        createdAt: serverTimestamp()
    });
};

// 2. 게시글 수정
export const updatePost = async (postId, data) => {
    const postRef = doc(db, 'POSTS', postId);
    await updateDoc(postRef, data);
};

// 3. 게시글 삭제
export const deletePost = async (postId) => {
    await deleteDoc(doc(db, 'POSTS', postId));
};

// 4. 댓글 등록
export const addComment = async (postId, commentData) => {
    await addDoc(collection(db, `POSTS/${postId}/COMMENTS`), {
        ...commentData,
        createdAt: serverTimestamp()
    });
};

// 5. 댓글 삭제
export const deleteComment = async (postId, commentId) => {
    await deleteDoc(doc(db, `POSTS/${postId}/COMMENTS`, commentId));
};


// 전체 게시글 읽기
export const getAllPosts = async () => {
    const q = query(collection(db, 'POSTS'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

// 특정 게시글의 댓글 읽기
export const getCommentsByPostId = async (postId) => {
    const snapshot = await getDocs(collection(db, `POSTS/${postId}/COMMENTS`));
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

export const likePost = async (postId, userId) => {
    const postRef = doc(db, 'POSTS', postId);
    const likeRef = doc(db, 'POSTS', postId, 'LIKES', userId); // 🔄 서브컬렉션 구조로 변경

    await runTransaction(db, async (tx) => {
        const postSnap = await tx.get(postRef);
        const newLikes = (postSnap.data().likes || 0) + 1;

        tx.update(postRef, { likes: newLikes });
        tx.set(likeRef, {
            USERS_ID: userId,
            createdAt: serverTimestamp()
        });
    });
};

export const unlikePost = async (postId, userId) => {
    const postRef = doc(db, 'POSTS', postId);
    const likeRef = doc(db, 'POSTS', postId, 'LIKES', userId); // 🔄 서브컬렉션 구조로 변경

    await runTransaction(db, async (tx) => {
        const postSnap = await tx.get(postRef);
        const newLikes = Math.max(0, (postSnap.data().likes || 1) - 1);

        tx.update(postRef, { likes: newLikes });
        tx.delete(likeRef);
    });
};
export const checkUserLikedPost = async (postId, userId) => {
    const likeRef = doc(db, 'POSTS', postId, 'LIKES', userId);
    const docSnap = await getDoc(likeRef);
    return docSnap.exists();
};

export const getMyPosts = async (userId) => {
    const q = query(
        collection(db, 'POSTS'),
        where('USERS_ID', '==', userId),
        orderBy('createdAt', 'desc')
    );

    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};
  
