import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc, where, doc, setDoc, deleteDoc, orderBy, Timestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';
import { useSleep } from '../utility/common';
import randomLocation from 'random-location'
import { distanceFunc } from '../utility/region';
import Axios from 'axios';

const authService = getAuth(firebaseApp);




/**
 * Room 관련 서비스
 *! Create 
 * ① CreateRoom : 
 *! Read
 * ① ReadRoom : 모든 일감 가져오기
 *! Update
 
 *! Delete

 */


export const CreateMemo = async ({ MEMO, USERS_ID, MEMOTYPE }) => {

  let success = true;
  const MEMOREF = doc(collection(db, "MEMO"));
  const id = MEMOREF.id;

  try {
    const newdata = {
      MEMO_ID: id,
      MEMO: MEMO,
      MEMOTYPE: MEMOTYPE,
      CHECK: false,
      USERS_ID: USERS_ID,
      CREATEDT: Timestamp.now(),
    }
    await setDoc(MEMOREF, newdata);

  } catch (e) {
    console.log("TCL: CreateMemo -> error ", e.message)

    alert(e.message);
    success = false;
    return -1;
  } finally {
    return id;
  }
}


export const CreateBank = async ({BANKNAME, BANKNUM, USERS_ID, MEMOTYPE }) => {

  let success = true;
  const MEMOREF = doc(collection(db, "MEMO"));
  const id = MEMOREF.id;

  try {
    const newdata = {
      MEMO_ID: id,
      BANKNAME: BANKNAME,
      MEMOTYPE: MEMOTYPE,
      BANKNUM: BANKNUM,
      USERS_ID: USERS_ID,
      CREATEDT: Timestamp.now(),
    }
    await setDoc(MEMOREF, newdata);

  } catch (e) {
    console.log("TCL: CreateMemo -> error ", e.message)

    alert(e.message);
    success = false;
    return -1;
  } finally {
    return id;
  }
}

export const CreateBirthday = async ({ NAME, DATE, USERS_ID, MEMOTYPE }) => {

  let success = true;
  const MEMOREF = doc(collection(db, "MEMO"));
  const id = MEMOREF.id;

  try {
    const newdata = {
      MEMO_ID: id,
      MEMOTYPE: MEMOTYPE,
      NAME: NAME,
      DATE: DATE,
      USERS_ID: USERS_ID,
      CREATEDT: Timestamp.now(),
    }
    await setDoc(MEMOREF, newdata);

  } catch (e) {
    console.log("TCL: CreateBirthday -> error ", e.message)

    alert(e.message);
    success = false;
    return -1;
  } finally {
    return id;
  }
}


export const ReadMemoByIndividually = async ({ USERS_ID }) => {


  return new Promise(async (resolve, reject) => {
    const MEMOREF = collection(db, "MEMO");

    let memoitems = [];
    let success = false;
    const q = query(MEMOREF
      , where("USERS_ID", "==", USERS_ID)
      , orderBy("CREATEDT", "desc"));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        memoitems.push(doc.data());
      });


      if (memoitems.length > 0) {
        resolve(memoitems);
      } else {
        resolve(-1);
      }

    } catch (e) {
      console.log("error", e.message);
      resolve(-1);
    } finally {

    }

  });

}

export const Update_memobymemoid = async ({ CHECK, MEMO_ID }) => {


  const memoRef = collection(db, "MEMO");

  const rows = query(memoRef, where("MEMO_ID", '==', MEMO_ID));

  let docid = "";
  try {
    const querySnapshot = await getDocs(rows);

    querySnapshot.forEach(function (doc) {
      docid = doc.id;
      updateDoc(doc.ref, {
        CHECK: CHECK

      });
    });

  } catch (e) {
    console.log("error", e.message);
  } finally {
    return docid;
  }

}

export const DeleteMemoByMEMO_ID = async ({ MEMO_ID }) => {

  return new Promise(async (resolve, reject) => {

    const memoRef = collection(db, "MEMO");

    let success = false;
    const q = query(memoRef, where("MEMO_ID", "==", MEMO_ID));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        resolve(0);
      });



    } catch (e) {
      console.log("error", e.message);
    } finally {

    }

  });



}

