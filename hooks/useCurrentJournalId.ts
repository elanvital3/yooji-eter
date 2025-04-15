// 📁 hooks/useCurrentJournalId.ts
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useCurrentUser } from "./useCurrentUser";

export function useCurrentJournalId() {
    const user = useCurrentUser();
    const [journalId, setJournalId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchJournal = async () => {
            const q = query(
                collection(db, "journals"),
                where("userId", "==", user.uid),
                where("status", "==", "in_progress")
            );
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const firstDoc = snapshot.docs[0];
                setJournalId(firstDoc.id);
            }
        };

        fetchJournal();
    }, [user]);

    return journalId;
}