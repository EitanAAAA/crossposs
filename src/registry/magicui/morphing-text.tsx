"use client";

import { useId } from "react";

interface MorphingTextProps {
  className?: string;
  texts: string[];
}

export function MorphingText({
  className,
  texts,
}: MorphingTextProps) {
  const id = useId();

  return (
    <div
      className={`relative inline-block w-full text-center ${className} filter-[url(#${id})]`}
    >
      <style>
        {`
          @keyframes morph {
            0%, 20% {
              filter: blur(0px);
              opacity: 1;
            }
            30%, 90% {
               filter: blur(0px);
               opacity: 0;
            }
            100% {
               filter: blur(0px);
               opacity: 0;
            }
          }
           @keyframes morph-text {
             0%, 15% {
                filter: blur(0px);
                opacity: 1;
             }
             25%, 85% {
                filter: blur(4px);
                opacity: 0;
             }
             95%, 100% {
                filter: blur(0px);
                opacity: 1;
             }
           }
        `}
      </style>

      {texts.map((text, index) => (
        <span
          key={index}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
          style={{
            animation: `morph-text ${texts.length * 2}s linear infinite`,
            animationDelay: `${index * 2}s`,
            opacity: 0,
          }}
        >
          {text}
        </span>
      ))}

      {/* Improve accessibility/layout stability by rendering the longest text invisibly to set width */}
      <span className="invisible opacity-0">{texts.reduce((a, b) => a.length > b.length ? a : b)}</span>

      <svg className="absolute hidden">
        <defs>
          <filter id={id}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}





