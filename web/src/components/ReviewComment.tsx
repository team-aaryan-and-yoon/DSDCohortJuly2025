import { Rating } from '@smastrom/react-rating';
import type { reviewType } from "@/Types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
const ReviewComment = ({rating, reviewer, comment, avatar_url=undefined}: reviewType) => {
    const split_name = reviewer.split(" ")
    // Create initials safely - handle single names
    const initials = split_name.length >= 2 
        ? split_name[0][0] + split_name[1][0]
        : split_name[0][0] + (split_name[0][1] || '');
    
    return (
        <div className='w-full h-full border-2 border-gray-500 p-2 rounded-md'>
            <div className='flex justify-between items-center mb-2'>
                <div className='flex gap-3 items-center'>
                    <Avatar>
                        <AvatarImage src={avatar_url} />
                        <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
                    </Avatar>       
                    <div className='font-semibold text-gray-800'>
                        {reviewer}
                    </div>
                </div>

                <div>
                    <Rating style={{ maxWidth: 125 }} value={rating} readOnly isDisabled/>
                </div>
            </div>
            <div className="flex text-gray-600 border-2 bg-white rounded-md">
                <span className='p-2 text-sm leading-relaxed text-left '>{comment}</span>
            </div>
        </div>
    );
};

export default ReviewComment;