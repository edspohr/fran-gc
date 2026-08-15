interface HairlineRuleProps {
  className?: string;
}

export default function HairlineRule({ className = '' }: HairlineRuleProps) {
  return (
    <span
      aria-hidden="true"
      className={`block h-px w-16 bg-gold/60 ${className}`}
    />
  );
}
