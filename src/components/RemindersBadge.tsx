interface Props {
  count: number;
}

export function RemindersBadge({ count }: Props) {
  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-on-error text-xs font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-200">
      {count > 9 ? '9+' : count}
    </span>
  );
}
