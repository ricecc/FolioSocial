"use client";
import React, { createContext, useState, useCallback, useContext, useEffect, ReactNode } from 'react';
import { fetchPostsFeed } from '@/lib/actions/posts.actions'; // Importa la funzione di fetch

interface UserProps {
  _id: string;
  id: string;
  image: string;
  name: string;
  lastName: string;
  username: string;
}

interface Post {
  _id: string;
  like: UserProps[];
  postImages: string[];
  image: string;
  quotes: { quote: string }[];
  book: {
    title: string;
    author: string;
  };
  author: {
    image: string;
    username: string;
    id: string;
  };
}

interface FeedContextType {
  feed: Post[];
  loading: boolean;
  hasMore: boolean;
  loadMorePosts: () => void;
}

interface FeedProviderProps {
  children: ReactNode;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<FeedProviderProps> = ({ children }) => {
  const [feed, setFeed] = useState<Post[]>([]); // Rimosso initialPosts
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); // Avvio con false poiché inizialmente non sta caricando
  const [hasMore, setHasMore] = useState(true);

  // Funzione per caricare ulteriori post
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newPage = page + 1;
      const newFeed = await fetchPostsFeed(newPage, 6); // Carica nuovi post

      setHasMore(newFeed.posts.length >= 6); // Se ci sono meno di 6 post, non ci sono più post da caricare
      setFeed((prevFeed) => [...prevFeed, ...newFeed.posts]); // Aggiungi nuovi post al feed
      setPage(newPage);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  // Effetto per caricare i post iniziali
  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      try {
        const initialFeed = await fetchPostsFeed(1, 6); // Carica i post iniziali
        setFeed(initialFeed.posts); // Imposta i post iniziali nello stato
        setHasMore(initialFeed.posts.length >= 6); // Controlla se ci sono più post da caricare
      } catch (error) {
        console.error('Error loading initial posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialPosts(); // Esegui la funzione all'avvio
  }, []); // L'array vuoto assicura che venga eseguito solo al montaggio

  return (
    <FeedContext.Provider value={{ feed, loading, hasMore, loadMorePosts }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};
