import axios from "axios";
import { useRouter } from "next/navigation";
import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

interface useFavoriteProps {
  listingId: string;
  currentUser?: SafeUser | null;
}

function useFavorite({ listingId, currentUser }: useFavoriteProps) {
  const router = useRouter();
  const loginModal = useLoginModal();

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];
    return list.includes(listingId);
  }, [currentUser?.favoriteIds, listingId]);

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!currentUser) {
        return loginModal.onOpen();
      }
      try {
        let request;
        if (hasFavorited) {
          request = () => axios.delete(`/api/favorites/${listingId}`);
        } else {
          request = () => axios.post(`/api/favorites/${listingId}`);
        }
        await request();
        router.refresh();
        toast.success("Success");
      } catch (error: any) {
        toast.error("Something went wrong!");
      }
    },
    [currentUser, hasFavorited, listingId, loginModal, router]
  );

  return { hasFavorited, toggleFavorite };
}
export default useFavorite;
