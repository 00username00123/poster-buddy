"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';

export function useFirestore<T extends { id: string }>(collectionName: string, initialData: T[] = []) {
  const [data, setData] = useState<T[]>(initialData);

  useEffect(() => {
    const q = query(collection(db, collectionName));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      setData(documents);
    });

    return () => unsubscribe();
  }, [collectionName]);

  const addDocument = async (newDocument: Omit<T, 'id'>) => {
    await addDoc(collection(db, collectionName), newDocument);
  };

  const updateDocument = async (id: string, updatedDocument: Partial<T>) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, updatedDocument);
  };

  const deleteDocument = async (id: string) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  };

  return { movies: data, setMovies: setData, addMovie: addDocument, updateMovie: updateDocument, deleteMovie: deleteDocument };
}
