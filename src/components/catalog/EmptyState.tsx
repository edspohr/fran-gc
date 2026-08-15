interface EmptyStateProps {
  title: string;
  body?: string;
}

export default function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <div className="py-20 text-center space-y-3">
      <p className="font-serif text-2xl text-cream">{title}</p>
      {body && <p className="text-cream-muted text-sm max-w-md mx-auto">{body}</p>}
    </div>
  );
}
