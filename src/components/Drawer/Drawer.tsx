import {
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { Giphy } from "./Giphy"
import { OverlayTypes } from "@/store/features/editor/types"
import { Unsplash } from "./Unsplash"

type DrawerProps = {
  type: string;
  onGifClick: (e: any) => void;
  onUnsplashImageClick: (e: any) => void;
}

export function Drawer({ type, onGifClick, onUnsplashImageClick }: DrawerProps) {
  const title = type === OverlayTypes.GIPHY ? 'Giphy Library' : 'Unsplash Library';

  return (
    <SheetContent className="overflow-y-scroll bg-white min-w-[500px]">
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
      </SheetHeader>
      {(type === OverlayTypes.GIPHY) && <Giphy onGifClick={onGifClick} />}
      {(type === OverlayTypes.UNSPLASH) && <Unsplash onUnsplashImageClick={onUnsplashImageClick} />}
    </SheetContent>
  )
};
