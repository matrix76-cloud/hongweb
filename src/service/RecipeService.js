import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, limit, arrayUnion } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS } from '../utility/status';
import { ensureHttps } from '../utility/common';

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

function randomNumberInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export const CreateRecipe = async({ITEM}) =>{

  let success = true;
  const RECIPEREF = doc(collection(db, "RECIPE"));
  const id = RECIPEREF.id;

  const VIEW = randomNumberInRange(1, 1500);

  // const response = await fetch(ensureHttps(ITEM.ATT_FILE_NO_MAIN),{
  //   mode: 'no-cors'
  // });


  // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  // const blob = await response.blob();
  // console.log("TCL: CreateRecipe -> blob2", blob,ITEM.ATT_FILE_NO_MAIN);

  
  // // // Firebase Storage에 저장할 경로
  // // const storageRef = storage.ref().child(`recipe/${Date.now()}`);
  // // const snapshot = await storageRef.put(blob);

  // // // 업로드된 이미지 URL을 가져옵니다.
  // // const downloadURL = await snapshot.ref.getDownloadURL();
  // // console.log("TCL: CreateRecipe -> downloadURL", downloadURL)

  

  try{
     const newdata = {
         RECIPE_ID : id,
         ITEM : ITEM,
         VIEW : VIEW,
         CREATEDT : Date.now(),
  
     }
     await setDoc(RECIPEREF, newdata);
  

  }catch(e){
    console.log("TCL: CreateCategory -> error ",e.message )
     
      alert( e.message);
      success =false;
      return -1;
  }finally{
    return id;
  }
}


export const ReadRECIPE = async()=>{
  const recipeRef = collection(db, "RECIPE");

  let recipeitems = [];
  let success = false;
  const q = query(recipeRef);

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      recipeitems.push(doc.data());
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(recipeitems);
      } else {
        resolve(-1);
      }
    });
  }
}

export const ReadRECIPEBYRECIPE_ID = async ({RECIPE_ID}) => {
  const recipeRef = collection(db, "RECIPE");

  let recipeitem = {};
  let success = false;


  const q = query(recipeRef, where("RECIPE_ID", "==", RECIPE_ID));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      recipeitem = doc.data();
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(recipeitem);
      } else {
        resolve(-1);
      }
    });
  }
}