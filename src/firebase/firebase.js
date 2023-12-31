import { initializeApp } from "firebase/app";

import {
  getFirestore,
  getDocs,
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  where,
  query,
  getDoc,
  FieldValue
} from "firebase/firestore";

import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBd2wEJmGcZHo3iED7Xd-uhZOnSUqlER7M",
  authDomain: "advertisement-7b96c.firebaseapp.com",
  projectId: "advertisement-7b96c",
  storageBucket: "advertisement-7b96c.appspot.com",
  messagingSenderId: "377226109029",
  appId: "1:377226109029:web:e0adb00b4f6fe21421268c",
  measurementId: "G-C7P990NF9L"
};

const app = initializeApp(firebaseConfig);

// Firestore
const database = getFirestore();

// get single user
export const getSingleUserFromDatabase = async (id) =>{
  try{
    const result = await getDoc(doc(database, 'Users', id))
    console.log(result);
    return result.data();
  }catch (err){
    console.log(err)
    return -1;
  }
}

//ADD MENTOR

export const addMentorInDatabase = async (uid, data) => {
  try {
    await setDoc(doc(database, "Users", uid), data);
    return true;
  } catch (err) {
    console.log("Err: ", err);
    return false;
  }
};

// update mentor account
export const updateMentorAccount = async (accountDetails, userEmail)=>{
  try{
    const result = await updateDoc(doc(database, "Users", userEmail), {accountDetails})
    return result;
  } catch (err){
    console.log(err)
    return -1;
  }
}

// update mentor calendly
export const updateMentorCalendly = async (mentorCalendlyLink, userEmail)=>{
  try{
    const result = await updateDoc(doc(database, "Users", userEmail), {mentorCalendlyLink})
    return result;
  } catch (err){
    console.log(err)
    return -1;
  }
}

// get all mentors
export const getAllMentors = async ()=>{
  try {
    let users = [];
    let mentors=[];
    await (
      await getDocs(collection(database, 'Users'))
    ).forEach((doc) => {
      users.push({ id:doc.id, ...doc.data() });
    })
    users.map((user,idx)=>{
      if(user.userType == 'Mentor'){
        mentors.push({...user})
      }
    })
    return await mentors
    // return [{email:"adminblogs@reverrapp.com", password:"admin@blogs"}];
  } catch (err) {
    console.log("Err: ", err);
    return -1;
  }
}


// Fetch Admins Data
export const getAdminsFromDatabase = async () => {
  try {
    let Admins = [];
    await (
      await getDocs(collection(database, `Admin`))
    ).forEach((doc) => {
      Admins.push({ ...doc.data() });
    });
    return Admins
    // return [{email:"adminblogs@reverrapp.com", password:"admin@blogs"}];
  } catch (err) {
    console.log("Err: ", err);
  }
};

// getUser
export const getUserFromDatabase = async (uid) => {
  let User;
  await (
    await getDocs(
      query(collection(database, `Users`), where("uid", "==", `${uid}`))
    )
  ).forEach((doc) => {
    User = { ...doc.data() };
  });
  return User;
};


// updateUser

export const updateUserInDatabse = async (uid, data) => {
  try {
    return await updateDoc(doc(database, "Users", uid), data);
  } catch (err) {
    console.log("Err: ", err);
  }
};

// getDocs
export const getInvestorDealsFromDatabase = async () => {
  try {
    let investorDeals = [];
    await (
      await getDocs(collection(database, `TLBlogs`))
    ).forEach((doc) => {
      investorDeals.push({ ...doc.data(), id: doc.id });
    });
    return investorDeals;
  } catch (err) {
    console.log("Err: ", err);
  }
};
export const getRRBlogs = async () => {
  try {
    let investorDeals = [];
    await (
      await getDocs(collection(database, `RRBlogs`))
    ).forEach((doc) => {
      investorDeals.push({ ...doc.data(), id: doc.id });
    });
    return investorDeals;
  } catch (err) {
    console.log("Err: ", err);
  }
};
// addDocs

export const addbloginTL = async (uid, data) => {
  try {
    data.createdAt = new Date()
    return await setDoc(doc(database, "TLBlogs", uid), data);
  } catch (err) {
    console.log("Err: ", err);
  }
};

export const addbloginRR = async (uid, data) => {
  try {
    data.createdAt = new Date()
    return await setDoc(doc(database, "RRBlogs", uid), data);
  } catch (err) {
    console.log("Err: ", err);
  }
};

// updateDocs
export const updateInvestorDetailsInDatabase = async (uid, data) => {
  try {
    return await updateDoc(doc(database, "TLBlogs", uid), data);
  } catch (err) {
    console.log("Err: ", err);
  }
};

// deleteDocs

export const deleteInvestorDetailsInDatabse = async (uid) => {
  try {
    return await deleteDoc(doc(database, "Investordeals", uid));
  } catch (err) {
    console.log("Err: ", err);
  }
};

export const deleteTLBlog = async (uid) => {
  try {
    return await deleteDoc(doc(database, "TLBlogs", uid));
  } catch (err) {
    console.log("Err: ", err);
  }
};

export const deleteRRBlog = async (uid) => {
  try {
    return await deleteDoc(doc(database, "RRBlogs", uid));
  } catch (err) {
    console.log("Err: ", err);
  }
};

// Storage
const storage = getStorage(app);

export const uploadMedia = async (media, path) => {
  
  if(media!==""){
  try {
    await uploadBytesResumable(ref(storage, `${path}/${media.name}`), media);
    const getMedia = await ref(storage, `${path}/${media.name}`);
    const mediaLink = await getDownloadURL(getMedia);
    return mediaLink;
  } catch (err) {
    console.log("Err: ", err);
    return false
  }
}
};

export const deleteMedia = (media, path) => {
  deleteObject(ref(storage, `${path}/${media}`));
};

//FETCH ARRAY OF UNIQUE ID FROM FIREBASE
export const getListOfUniqueId=async()=>{
try {
  let listOfUniqueId
  await (
    await getDocs(collection(database, `metaData`))
  ).forEach((doc) => {
  console.log(doc.id)
  if(doc.id==="applyForDeals"){
    listOfUniqueId=( doc.data().uniqueId);
  }
    
  });
  return listOfUniqueId;
} catch (error) {
  console.log("Err: ", error);
}
}

//ADD FORM UNIQUE ID
export const addUniqueIdToFirebase=async(id)=>{
  try {
    return await updateDoc(doc(database, "metaData", "applyForDeals"), {uniqueId:id});
  } catch (err) {
    console.log("Err: ", err);
  }
}

//ADD PPT DATA TO FIREBASE
export const addPptInDatabase=async(uid,data)=>{
  try {
    return await setDoc(doc(database, "PptTemplates", uid), data);
  } catch (err) {
    console.log("Err: ", err);
  }
}

//ADD DOCUMENT IN FIREBASE
export const addDocumentInDatabase=async(uid,data)=>{
  try {
    return await setDoc(doc(database, "DocumentTemplates", uid), data);
  } catch (err) {
    console.log("Err: ", err);
  }
}