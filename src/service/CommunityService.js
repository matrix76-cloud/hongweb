import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS } from '../utility/status';

const authService = getAuth(firebaseApp);



/**
 * Commnunity 관련 서비스
 *! Create 
 * ① CreateCommunity : 
 * 게시판 생성 
 * USER_ID(게시자 정보 인덱스),
 * COMMUNITYCATEGORY(카테고리)
 * LABEL(제목), 
 * CONTENT(내용), 
 * REPRESENTIMG(대표이미지),
 * CREATEDT(작성날짜) : 기본값(현재시간 기준)
 * COMMUNITYSTATUS(게시물상태) : 기본값(COMMUNITYSTATUS.REGIST), 
 * HEARTUSERS(좋아요한 사람들 인덱스) : 기본값(빈배열), 
 * VIEWUSERS(이글 본 사람들 인덱스) : 기본값(빈배열)
 * COMMUNITYREVIEWIDS(댓글 단 사람들 인덱스) : 기본값(빈배열)
 *! Read
 * ① ReadCommunityByid : 모든 커뮤니티 가져오기
 *! Update
 * ① UpdateCommunityByid :인덱스에 맞는 커뮤니티 업데이트
 *! Delete
 * ① DeleteCommunityByid :인덱스에 맞는 커뮤니티 삭제
 */


export const CreateCommunity = async({USER_ID,LABEL,COMMUNITYCATEGORY,CONTENT, REPRESENTIMG}) =>{

    let success = true;
    const COMMUNITYREF = doc(collection(db, "COMMUNITY"));
    const id = COMMUNITYREF.id;

    try{

   
       const newdata = {
           COMMUNITY_ID : id,
           USER_ID : USER_ID,
           COMMUNITYCATEGORY : COMMUNITYCATEGORY,
           LABEL : LABEL,
           CONTENT : CONTENT,
           REPRESENTIMG :REPRESENTIMG,
           CREATEDT : Date.now(),
           COMMUNITYSTATUS :COMMUNITYSTATUS.REGIST,
           HEARTUSERS : [],
           VIEWUSERS :[],
           COMMUNITYREVIEWIDS: [],
           COMMUNITYSUMMARY_ID : ""
   
       }
       await setDoc(COMMUNITYREF, newdata);
    

    }catch(e){
      console.log("TCL: CreateCommunity -> error ",e.message )
       
        alert( e.message);
        success =false;
        return -1;
    }finally{
      return id;
    }
}

export const ReadCommunityByid = async({COMMUNITY_ID})=>{
  const communityRef = collection(db, "COMMUNITY");

  let communityitem = {};
  let success = false;
  const q = query(communityRef, where("COMMUNITY_ID", "==", COMMUNITY_ID));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      communityitem =(doc.data());
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(communityitem);
      } else {
        resolve(-1);
      }
    });
  }
}

export const UpdateCommunityByid = async({COMMUNITY_ID, LABEL,CONTENT, REPRESENTIMG})=>{

   console.log("TCL: UpdateCommunityByid -> LABEL", LABEL);
   console.log("TCL: UpdateCommunityByid -> COMMUNITY_ID",COMMUNITY_ID);

  const communityRef = collection(db, "COMMUNITY");


  const rows = query(communityRef, where("COMMUNITY_ID", "==", COMMUNITY_ID));
  try {
    const querySnapshot = await getDocs(rows);

    querySnapshot.forEach(function (doc) {

    console.log("TCL: UpdateCommunityByid -> doc", doc)
  
      updateDoc(doc.ref, {
        LABEL: LABEL,
        CONTENT:CONTENT,
        REPRESENTIMG:REPRESENTIMG,
      });
    });
  } catch (e) {
    return new Promise((resolve, resject) => {
      console.log("error", e.message);
      resolve(-1);
    });
  
    
  } finally {
    return new Promise((resolve, resject) => {
    console.log("TCL: UpdateCommunityByid -> resolve success", resolve)
      resolve(0);

    
    });
  }

}
export const DeleteCommunityByid = async({COMMUNITY_ID}) =>{

  let success = true;
  const communityRef = doc(db, "COMMUNITY", COMMUNITY_ID);
  try{
      await deleteDoc(communityRef);
  }catch(e){
      console.log("error", e.message);
      success = false;
  }finally{
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(0);
      } else {
        resolve(-1);
      }
    });
  }
}


/**
 * CommnunitySummary 관련 서비스(Community 와 관계가 되었으며 COMMUNITY_ID 와 관계가 있다)
 *! Create 
 * ① CreateCommunitySummary : 
 * 게시판 생성 
 * USER_ID(게시자 정보 인덱스),
 * COMMUNITYCATEGORY(카테고리)
 * LABEL(제목), 
 * CONTENTSUMMARY(축약된 내용), 
 * REPRESENTIMG(대표이미지),
 * CREATEDT(작성날짜) : 기본값(현재시간 기준)
 * COMMUNITYSTATUS(게시물상태) : 기본값(COMMUNITYSTATUS.REGIST), 
 * HEARTUSERS(좋아요한 사람들 인덱스) : 기본값(빈배열), 
 * VIEWUSERS(이글 본 사람들 인덱스) : 기본값(빈배열)
 * COMMUNITYREVIEWIDS(댓글 단 사람들 인덱스) : 기본값(빈배열)
 *! Read
 * ① ReadCommunitySummary : 모든 커뮤니티 가져오기
 *! Update
 * ① UpdateCommunitySummaryByid :인덱스에 맞는 커뮤니티 업데이트
 *! Delete
 * ① DeleteCommunitySummaryByid :인덱스에 맞는 커뮤니티 삭제
 */

 export const CreateCommunitySummary = async({COMMUNITY_ID, USER_ID,LABEL,COMMUNITYCATEGORY, CONTENTSUMMARY, REPRESENTIMG}) =>{

  let success = true;
  const COMMUNITYSUMMARYREF = doc(collection(db, "COMMUNITYSUMMARY"));
  const id = COMMUNITYSUMMARYREF.id;

  try{

 
     const newdata = {
         COMMUNITYSUMMARY_ID : id,
         COMMUNITY_ID : COMMUNITY_ID,
         USER_ID : USER_ID,
         COMMUNITYCATEGORY : COMMUNITYCATEGORY,
         LABEL : LABEL,
         CONTENTSUMMARY : CONTENTSUMMARY,
         REPRESENTIMG :REPRESENTIMG,
         CREATEDT : Date.now(),
         COMMUNITYSTATUS :COMMUNITYSTATUS.REGIST,
         HEARTUSERS : [],
         VIEWUSERS :[],
         COMMUNITYREVIEWIDS: [],
 
     }
     await setDoc(COMMUNITYSUMMARYREF, newdata);
  

  }catch(e){
    console.log("TCL: CreateCommunitySummary -> error ",e.message )
     
      alert( e.message);
      success =false;
      return -1;
  }finally{
    return id;
  }
}

export const ReadCommunitySummary = async()=>{
const communitysummaryRef = collection(db, "COMMUNITYSUMMARY");

let communityitems = [];
let success = false;
const q = query(communitysummaryRef, orderBy("CREATEDT", "desc"));

try {
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    communityitems.push(doc.data());
  });

  if (querySnapshot.size > 0) {
    success = true;
  }
} catch (e) {
  console.log("error", e.message);
} finally {
  return new Promise((resolve, resject) => {
    if (success) {
      resolve(communityitems);
    } else {
      resolve(-1);
    }
  });
}
}



export const UpdateCommunitySummaryByid = async({COMMUNITYSUMMARY_ID, LABEL,CONTENTSUMMARY, REPRESENTIMG})=>{

 console.log("TCL: UpdateCommunitySummaryByid -> LABEL", LABEL);
 console.log("TCL: UpdateCommunitySummaryByid -> COMMUNITY_ID",COMMUNITYSUMMARY_ID);

const communityRef = collection(db, "COMMUNITYSUMMARY");


const rows = query(communityRef, where("COMMUNITYSUMMARY_ID", "==", COMMUNITYSUMMARY_ID));
try {
  const querySnapshot = await getDocs(rows);

  querySnapshot.forEach(function (doc) {

  console.log("TCL: UpdateCommunitySummaryByid -> doc", doc)

    updateDoc(doc.ref, {
      LABEL: LABEL,
      CONTENTSUMMARY:CONTENTSUMMARY,
      REPRESENTIMG:REPRESENTIMG,
    });
  });
} catch (e) {
  return new Promise((resolve, resject) => {
    console.log("error", e.message);
    resolve(-1);
  });

  
} finally {
  return new Promise((resolve, resject) => {
  console.log("TCL: UpdateCommunitySummaryByid -> resolve success", resolve)
    resolve(0);

  
  });
}

}
export const DeleteCommunitySummaryByid = async({COMMUNITYSUMMARY_ID}) =>{

let success = true;
const communitysummaryRef = doc(db, "COMMUNITYSUMMARY", COMMUNITYSUMMARY_ID);
try{
    await deleteDoc(communitysummaryRef);
}catch(e){
    console.log("error", e.message);
    success = false;
}finally{
  return new Promise((resolve, resject) => {
    if (success) {
      resolve(0);
    } else {
      resolve(-1);
    }
  });
}
}

