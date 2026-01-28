import * as React from "react";

type StarRatingProps = {
  value: number;                 // 0..5
  onChange: (value: number) => void;
  max?: number;                  // default 5
  size?: number;                 // px
  readOnly?: boolean;
  className?: string;
};

export function StarRating({
  value,
  onChange,
  max = 5,
  size = 22,
  readOnly = false,
  className = "",
}: StarRatingProps) {
  const [hover, setHover] = React.useState<number | null>(null);

  const active = hover ?? value;

  return (
    <div className={`flex items-center gap-1 ${className}`} role="radiogroup" aria-label="Avaliação">
      {Array.from({ length: max }, (_, idx) => {
        const starValue = idx + 1;
        const filled = starValue <= active;

        return (
          <button
            key={starValue}
            type="button"
            className={`cursor-pointer select-none ${readOnly ? "opacity-70 cursor-default" : ""}`}
            onClick={() => !readOnly && onChange(starValue)}
            onMouseEnter={() => !readOnly && setHover(starValue)}
            onMouseLeave={() => !readOnly && setHover(null)}
            aria-label={`${starValue} de ${max}`}
            aria-checked={starValue === value}
            role="radio"
          >
            <StarIcon filled={filled}/>
          </button>
        );
      })}

      <span className="ml-2 text-sm text-muted-foreground">
        {value}/{max}
      </span>
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="

        w-10 h-10
        sm:w-7 sm:h-7
        md:w-8 md:h-8
        lg:w-9 lg:h-9
      "
      fill={filled ? "yellow" : "none"}
      stroke="white"
      strokeWidth="1"
    >
      <path d="M12 17.27l5.18 3.05-1.64-5.81L20.5 9.5l-6.06-.52L12 3.5 9.56 8.98 3.5 9.5l4.96 5.01-1.64 5.81L12 17.27z" />
    </svg>
  );
}