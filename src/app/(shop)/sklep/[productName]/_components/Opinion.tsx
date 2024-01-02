import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaUserCircle } from 'react-icons/fa';
import { relativeDate } from '@/lib/utils';
import { BsDot } from 'react-icons/bs';

type TOpinion = {
  authorName: string;
  content: string;
  date: Date;
  avatarURL?: string;
};
const Opinion = ({ authorName, content, date, avatarURL }: TOpinion) => {
  return (
    <div className="flex space-x-2">
      {/* Image */}
      <div>
        {avatarURL ? (
          <Avatar className="w-12 h-12">
            <AvatarImage src={avatarURL} className="object-cover object-center" />
            <AvatarFallback>
              <FaUserCircle className="w-12 h-12 text-primary/75" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <FaUserCircle className="w-12 h-12 text-primary/75" />
        )}
      </div>
      <div className="flex flex-col">
        {/* Author and date */}
        <div className="flex space-x-1 items-center">
          <div className="font-medium">{authorName}</div>
          <BsDot />
          <div className="text-xs text-muted-foreground">{relativeDate(date)}</div>
        </div>
        {/* Content */}
        <div className="text-sm text-justify">{content}</div>
      </div>
    </div>
  );
};

export default Opinion;
