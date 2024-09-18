"use client";
import { useEffect, DependencyList } from 'react';

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps: DependencyList = [], // Imposta un array vuoto come valore predefinito
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn(); // Chiama la funzione senza passare deps
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps); // Usa deps come dipendenze per useEffect
}
