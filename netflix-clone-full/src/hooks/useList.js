// src/hooks/useList.js
import React from 'react'
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../services/firebase.js'

/**
 * useList - subscribes to lists/{uid}/items subcollection.
 * Returns { items, loading, toggleSave } where toggleSave writes/deletes individual item docs.
 */
export function useList(uid) {
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!uid) {
      setItems([])
      setLoading(false)
      return
    }

    const itemsCol = collection(db, 'lists', uid, 'items')
    const q = query(itemsCol, orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setItems(data)
        setLoading(false)
      },
      (err) => {
        console.error('useList onSnapshot error', err)
        setLoading(false)
      }
    )

    return () => unsub()
  }, [uid])

  async function toggleSave(item, shouldRemove = false) {
    if (!uid || !item) throw new Error('uid and item required')
    const itemId = String(item.id ?? item.movieId ?? item.tvId ?? Date.now())
    const itemRef = doc(db, 'lists', uid, 'items', itemId)

    if (shouldRemove) {
      await deleteDoc(itemRef)
      return
    }

    // store minimal fields (avoid huge payload)
    const payload = {
      id: item.id ?? item.movieId ?? item.tvId ?? itemId,
      title: item.title ?? item.name ?? item.original_title ?? '',
      poster_path: item.poster_path ?? item.backdrop_path ?? null,
      media_type: item.media_type ?? null,
      createdAt: new Date(),
    }
    await setDoc(itemRef, payload)
  }

  return { items, loading, toggleSave }
}
