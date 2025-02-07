import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { useState } from 'react';
import { Input } from '../ui/input';

// use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY as string);

export function Giphy({ onGifClick }: { onGifClick: (e: any) => void; }) {
  const [searchTerm, setSearchTerm] = useState('bg gradients');
  
  const handleGifClick = (item: any, event) => {
    event.preventDefault();
    onGifClick(item);
  }
  const fetchGifs = (offset: number) => gf.search(searchTerm, { offset, limit: 10 })

  return (
    <div className="flex flex-col justify-center">
      <Input className='my-8' type="text" placeholder={"Search Giphy"} onChange={(e) => setSearchTerm(e.target.value)} />
      <Grid width={450} columns={3} key={searchTerm} fetchGifs={fetchGifs} onGifClick={handleGifClick} />
    </div>
  )
};
