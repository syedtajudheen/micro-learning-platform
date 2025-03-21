'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image';
import useDebounceValue from '@/hooks/useDebounceValue';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

export function Unsplash({ onUnsplashImageClick }: { onUnsplashImageClick: (e: any) => void; }) {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('gradients');
  const debouncedSearch = useDebounceValue(searchTerm, 800)
  const [isLoading, setIsLoading] = useState(false);

  const searchPhotos = async (query, page, perPage) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=${perPage}`, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });
      const data = await response.json();
      return data.results;

    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  const searchImages = async (searchTerm: string, pageNo: number = page) => {
    setIsLoading(true);
    const results = await searchPhotos(searchTerm, pageNo, 20);
    setImages(results);
    setIsLoading(false);
  };

  const handleLoadMore = async () => {
    setPage(page + 1);
    const results = await searchPhotos(debouncedSearch, page + 1, 20);
    setImages([...images, ...results]);
  };

  useEffect(() => {
    if (debouncedSearch) {
      searchImages(debouncedSearch, 1);
    }
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col space-y-4">
      <Input className='my-8' type="text" placeholder="Search Unsplash" onChange={(e) => setSearchTerm(e.target.value)} />

      <div className="grid grid-cols-2 gap-4">
        {images?.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square cursor-pointer hover:opacity-80"
            onClick={() => onUnsplashImageClick(image)}
          >
            <Image
              src={image.urls.small}
              alt={image.alt_description}
              width={250}
              height={350}
              className="object-cover rounded-md w-full h-[350px]"
            />
          </div>
        ))}
      </div>
      {!isLoading && <Button onClick={handleLoadMore}>Load More</Button>}
    </div>
  )
};
