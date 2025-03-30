// utils/checkUserExists.ts
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export const checkUserExists = async (email: string): Promise<boolean> => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);
    console.log(snapshot)

    return !snapshot.empty; // 문서가 있으면 true (이미 존재)
};