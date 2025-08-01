import { Rating } from '@smastrom/react-rating';
import type { reviewType } from "@/Types";

const ReviewComment = ({rating, reviewer, comment}: reviewType) => {

    return (
        <div className='w-full h-full border-2 p-2'>
            <div className='flex w-full justify-between items-center mb-2'>
                <div className='font-semibold text-gray-800'>
                    {reviewer}
                </div>
                <div>
                    <Rating style={{ maxWidth: 125 }} value={rating} readOnly isDisabled/>
                </div>
            </div>
            <div className="text-gray-600 text-sm leading-relaxed text-left">
                {comment}
            </div>
        </div>
    );
};

export default ReviewComment;