
type ProgressBarStep = 'Cart' | 'Payment' | 'Confirmation';

interface ProgressBarProps {
    currentStep: ProgressBarStep;
}
export default function ProgressBarCheckout(
    {
        currentStep,
    }:ProgressBarProps
) {
    const steps: ProgressBarStep[] = ['Cart', 'Payment', 'Confirmation'];
    return (
      <div className='w-full max-w-[600px] flex justify-between relative mb-15'>
        <div className='absolute top-[70%] left-[18px] right-[48px] h-[6px]  bg-[#ffffff] z-10 border-1 border-gray-900'></div>
        {steps.map((label) => (
          <div key={label} className='flex flex-col items-center relative z-20 p-0 10px'>
            <div className='text-gray-500 text-sm'>{label}</div>
          {currentStep===label ? <div className='w-[20px] h-[20px] rounded-full bg-[#3b4a6b]'></div> : <div className='w-[20px] h-[20px] rounded-full bg-[#ffffff] border-1 border-gray-900 '></div>}
          </div>
        ))}
      </div>
    );
  };