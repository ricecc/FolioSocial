"use client";
import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';
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
  initialPosts: any[]; // Tipo corretto per i post iniziali
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<FeedProviderProps> = ({ children, initialPosts }) => {
  const [feed, setFeed] = useState<any[]>(initialPosts); // Inizializza lo stato con i post iniziali
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); // Avvio con `false` poiché inizialmente non sta caricando
  const [hasMore, setHasMore] = useState(true);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newPage = page + 1;
      const newFeed = await fetchPostsFeed(newPage, 6); // Presumo che `fetchPostsFeed` accetti pagina e limite

      setHasMore(newFeed.posts.length >= 6); // Se ci sono meno di 6 post, non ci sono più post da caricare
      setFeed((prevFeed) => [...prevFeed, ...newFeed.posts]); // Aggiungi nuovi post al feed
      setPage(newPage);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

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
