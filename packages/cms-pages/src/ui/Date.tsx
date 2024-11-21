function date({ value }: { value: string }) {
  if (!value) return null;

  const formatted = new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return <time dateTime={value}>{formatted}</time>;
}

export default date;
