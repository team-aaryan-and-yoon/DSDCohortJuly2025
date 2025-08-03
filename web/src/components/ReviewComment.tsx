import { Rating } from '@smastrom/react-rating';
import type { reviewType } from "@/Types";

const ReviewComment = ({rating, reviewer, comment}: reviewType) => {

    return (
        <div className='w-full h-full border-2 border-gray-500 p-2 rounded-md'>
            <div className='flex justify-between items-center mb-2'>
                <div className='font-semibold text-gray-800'>
                    {reviewer}
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