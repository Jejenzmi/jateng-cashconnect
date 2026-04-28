import { useState } from 'react';

export interface SmartDisplayMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
}

export function useSmartDisplayMedia() {
  const [media, setMedia] = useState<SmartDisplayMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const uploadMedia = async (_file: File) => {};
  const deleteMedia = async (_id: string) => {};

  return { media, setMedia, isLoading, uploadMedia, deleteMedia };
}
