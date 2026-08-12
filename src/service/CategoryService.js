import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, limit, arrayUnion } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS } from '../utility/status';

const authService = getAuth(firebaseApp);



/**
 * Search 관련 서비스
 *! Create 
 * ① CreateSearch : 
 * Search 생성 
 * USER_ID(검색한사람 정보 인덱스),
 * SEARCH(검색어),
 * CONTENT(검색결과),
 * CREATEDT(생성날짜)

 *! Read
 * ① ReadSearchByid : 인덱스에 맞는 검색어 결과 가져오기

 *! update
 * ① UpdateSearchByid : 인덱스에 맞는 검색내용 업데이트
 * USERCOMMENT(추가 커메트)


 *! Delete
 * ① DeleteSearchByid : 인덱스에 맞는 검색내용삭제
 */

export const CreateCategory = async({USERS_ID,CATEGORY}) =>{

  let success = true;
  const CATEGORYREF = doc(collection(db, "CATEGORY"));
  const id = CATEGORYREF.id;

  try{
     const newdata = {
         CATEGORY_ID : id,
         USERS_ID : USERS_ID,
         CATEGORY : CATEGORY,
         CREATEDT : Date.now(),
  
     }
     await setDoc(CATEGORYREF, newdata);
  

  }catch(e){
    console.log("TCL: CreateCategory -> error ",e.message )
     
      alert( e.message);
      success =false;
      return -1;
  }finally{
    return id;
  }
}


export const ReadCATEGORY = async({USERS_ID})=>{
  const categoryRef = collection(db, "CATEGORY");

  let categoryitems = [];
  let success = false;
  const q = query(categoryRef
  ,where("USERS_ID", "==", USERS_ID)
  ,orderBy("CREATEDT", "desc")
  );

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      categoryitems.push(doc.data());
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(categoryitems);
      } else {
        resolve(-1);
      }
    });
  }
}
export const DeleteCATEGORYByid = async({CATEGORY_ID})=>{

  let success = true;
  const categoryRef = doc(db, "CATEGORY", CATEGORY_ID);
  try{
      await deleteDoc(categoryRef);
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


export const DeleteCATEGORYCONENTByCATEGORY = async ({ CATEGORY }) => {

  let success = true;
  const categorycontentRef = doc(db, "CATEGORYCONTENT", CATEGORY);
  try {
    await deleteDoc(categorycontentRef);
  } catch (e) {
    console.log("error", e.message);
    success = false;
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(0);
      } else {
        resolve(-1);
      }
    });
  }

}
export const CreateCategoryContent = async({USERS_ID,CONTENT, KEYWORD, CATEGORY}) =>{

  let success = true;
  const CATEGORYCONTENTREF = doc(collection(db, "CATEGORYCONTENT"));
  const id = CATEGORYCONTENTREF.id;

  try{
     const newdata = {
         CATEGORYCONTENT_ID : id,
         USERS_ID : USERS_ID,
         CATEGORY : CATEGORY,
         CONTENT: CONTENT,
         KEYWORD : KEYWORD,
         BGCOLOR : "#fff",
         MEMOITEMS : [],
         CREATEDT : Date.now(),
  
     }
     await setDoc(CATEGORYCONTENTREF, newdata);
  

  }catch(e){
    console.log("TCL: CreateCategory -> error ",e.message )
     
      alert( e.message);
      success =false;
      return -1;
  }finally{
    return id;
  }
}
export const ReadCATEGORYCONTENT = async ({ USERS_ID, CATEGORY }) => {
  
  console.log("category", CATEGORY);
  const categorycontentRef = collection(db, "CATEGORYCONTENT");

  let categoryitems = [];
  let success = false;
  const q = query(categorycontentRef
  , where("USERS_ID", "==", USERS_ID)
  , where("CATEGORY", "==", CATEGORY)
  ,orderBy("CREATEDT", "desc")
  );

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      categoryitems.push(doc.data());
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(categoryitems);
      } else {
        resolve(-1);
      }
    });
  }
}
export const ReadCATEGORYCONTENTBYCATEGORYCONTENT_ID = async ({ CATEGORYCONTENT_ID }) => {


  const categorycontentRef = collection(db, "CATEGORYCONTENT");

  let categoryitem = {};
  let success = false;
  const q = query(categorycontentRef
    , where("CATEGORYCONTENT_ID", "==", CATEGORYCONTENT_ID)
  );

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      categoryitem = (doc.data());
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(categoryitem);
      } else {
        resolve(-1);
      }
    });
  }
}

export const ReadALLCATEGORYCONTENT = async ({ USERS_ID }) => {
  const categorycontentRef = collection(db, "CATEGORYCONTENT");

  let categoryitems = [];
  let success = false;
  const q = query(categorycontentRef
    , where("USERS_ID", "==", USERS_ID)
    , orderBy("CREATEDT", "desc")
  );

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      categoryitems.push(doc.data());
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(categoryitems);
      } else {
        resolve(-1);
      }
    });
  }
}

export const UpdateCATEGORYCONTENTCOLORByid = async({CATEGORYCONTENT_ID, BGCOLOR})=>{

 const categorycontentRef = collection(db, "CATEGORYCONTENT");

 const rows = query(categorycontentRef, where("CATEGORYCONTENT_ID", "==", CATEGORYCONTENT_ID));
 try {
   const querySnapshot = await getDocs(rows);

   querySnapshot.forEach(function (doc) {
     updateDoc(doc.ref, {
       BGCOLOR:BGCOLOR,
     });
   });
 } catch (e) {
   return new Promise((resolve, resject) => {
     console.log("error", e.message);
     resolve(-1);
   });
 
   
 } finally {
   return new Promise((resolve, resject) => {
   console.log("TCL: UpdateCATEGORYCONTENTCOLORByid -> resolve success", resolve)
     resolve(0);

   
   });
 }
}

export const UpdateCATEGORYCONTENTMEMOByid = async({CATEGORYCONTENT_ID, MEMO})=>{

  const categorycontentRef = collection(db, "CATEGORYCONTENT");
 
  const rows = query(categorycontentRef, where("CATEGORYCONTENT_ID", "==", CATEGORYCONTENT_ID));
  try {
    const querySnapshot = await getDocs(rows);
 
    querySnapshot.forEach(function (doc) {
      updateDoc(doc.ref, {
        MEMOITEMS:arrayUnion(MEMO),
      });
    });
  } catch (e) {
    return new Promise((resolve, resject) => {
      console.log("error", e.message);
      resolve(-1);
    });
  
    
  } finally {
    return new Promise((resolve, resject) => {
    console.log("TCL: UpdateCATEGORYCONTENTCOLORByid -> resolve success", resolve)
      resolve(0);
 
    
    });
  }
 }

export const DeleteCATEGORYCONTENTByid = async({CATEGORYCONTENT_ID})=>{

  let success = true;
  const searchRef = doc(db, "CATEGORYCONTENT", CATEGORYCONTENT_ID);
  try{
      await deleteDoc(searchRef);
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
 * 
 * 검색 결과를 30개까지만 제한 합니다
 */
// export const ReadSearchByid = async({USER_ID})=>{
//   const searchRef = collection(db, "SEARCH");

//   let searchitems = [];
//   let success = false;
//   const q = query(searchRef,where("USER_ID", "==", USER_ID)
//   ,limit(20)
//   ,orderBy("CREATEDT", "desc")
//   );

//   try {
//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//       searchitems.push(doc.data());
//     });

//     if (querySnapshot.size > 0) {
//       success = true;
//     }
//   } catch (e) {
//     console.log("error", e.message);
//   } finally {
//     return new Promise((resolve, resject) => {
//       if (success) {
//         resolve(searchitems);
//       } else {
//         resolve(-1);
//       }
//     });
//   }
// }



// export const UpdateSearchByid = async({SEARCH_ID, USERCOMMENT})=>{

//  const searchRef = collection(db, "SEARCH");

//  const rows = query(searchRef, where("SEARCH_ID", "==", SEARCH_ID));
//  try {
//    const querySnapshot = await getDocs(rows);

//    querySnapshot.forEach(function (doc) {

//      updateDoc(doc.ref, {
//        USERCOMMENT:USERCOMMENT,
//      });
//    });
//  } catch (e) {
//    return new Promise((resolve, resject) => {
//      console.log("error", e.message);
//      resolve(-1);
//    });
 
   
//  } finally {
//    return new Promise((resolve, resject) => {
//    console.log("TCL: UpdateCommunityByid -> resolve success", resolve)
//      resolve(0);

   
//    });
//  }
// }


// export const DeleteSearchByid = async({SEARCH_ID})=>{

//   let success = true;
//   const searchRef = doc(db, "SEARCH", SEARCH_ID);
//   try{
//       await deleteDoc(searchRef);
//   }catch(e){
//       console.log("error", e.message);
//       success = false;
//   }finally{
//     return new Promise((resolve, resject) => {
//       if (success) {
//         resolve(0);
//       } else {
//         resolve(-1);
//       }
//     });
//   }

// }