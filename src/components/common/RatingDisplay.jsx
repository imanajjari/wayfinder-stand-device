import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

export default function RatingDisplay({ rating, size = "text-2xl" }) {
  // rating باید عددی بین 0 تا 5 باشه (مثلاً 4.3)
  const normalizedRating = Math.max(0, Math.min(5, rating || 0));

  // تولید آرایه‌ای از 5 ستاره
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (normalizedRating >= i) {
      // ستاره کامل
      stars.push(<BsStarFill key={i} className={`${size} text-gray-400`} />);
    } else if (normalizedRating >= i - 0.5) {
      // ستاره نیمه
      stars.push(<BsStarHalf key={i} className={`${size} text-gray-400`} />);
    } else {
      // ستاره خالی
      stars.push(<BsStar key={i} className={`${size} text-gray-400`} />);
    }
  }

  return (
    <div className="flex justify-between items-center gap-1" dir="ltr">
      {stars}
      {/* <span className="text-white ml-2 font-medium">{normalizedRating.toFixed(1)}</span> */}
    </div>
  );
}