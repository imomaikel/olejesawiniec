import { BiChevronLeft, BiChevronRight, BiChevronsLeft, BiChevronsRight } from 'react-icons/bi';
import { shopRouter } from '@/server/routers/shopRouter';
import { OPINIONS_PER_PAGE } from '@/utils/constans';
import { trpc } from '@/components/providers/TRPC';
import { inferRouterOutputs } from '@trpc/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import Opinion from './Opinion';

type TOpinions = {
  initialOpinions: Exclude<inferRouterOutputs<typeof shopRouter>['getProduct'], null>['opinions'];
  totalOpinions: number;
};
const Opinions = ({ initialOpinions, totalOpinions }: TOpinions) => {
  const [fetchedOpinions, setFetchedOpinions] = useState<typeof initialOpinions>(initialOpinions);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalOpinions / OPINIONS_PER_PAGE);

  const isFirst = currentPage === 1;
  const isPrev = currentPage - 1 <= 0;

  const isNext = currentPage + 1 > totalPages;
  const isLast = currentPage >= totalPages;

  const { mutate: getOpinions, isLoading } = trpc.shop.getOpinions.useMutation();

  const handlePageChange = (newPage: number) => {
    getOpinions(
      { page: currentPage },
      {
        onSuccess: (data) => {
          setFetchedOpinions(data);
          setCurrentPage(newPage);
        },
      },
    );
  };

  return (
    <div className="mt-2">
      <div className="space-y-2">
        {(currentPage === 1 ? initialOpinions : fetchedOpinions).map((opinion) => (
          <Opinion
            key={opinion.id}
            authorName={opinion.user?.name || 'Imię ukryte'}
            content={opinion.content}
            date={opinion.createdAt}
            avatarURL={opinion.user?.image || undefined}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          <div>
            <Button
              size="icon"
              variant="ghost"
              disabled={isFirst || isLoading}
              onClick={() => handlePageChange(1)}
              aria-label="Przewiń do początku"
            >
              <BiChevronsLeft className="h-6 w-6" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              disabled={isPrev || isLoading}
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Poprzednia strona"
            >
              <BiChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          <div>
            <span>
              Strona <Badge variant="secondary">{currentPage}</Badge> na <Badge variant="secondary">{totalPages}</Badge>
            </span>
          </div>
          <div>
            <Button
              size="icon"
              variant="ghost"
              disabled={isLast || isLoading}
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Następna strona"
            >
              <BiChevronRight className="h-6 w-6" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              disabled={isNext || isLoading}
              onClick={() => handlePageChange(totalPages)}
              aria-label="Przewiń do końca"
            >
              <BiChevronsRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Opinions;
