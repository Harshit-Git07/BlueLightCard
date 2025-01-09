export default function CustomHTML({
  html,
}: Partial<{
  html: string;
}>) {
  if (!html) return null;
  return (
    <div
      className="font-typography-body font-typography-body-weight text-typography-body leading-typography-body text-colour-onSurface-light dark:text-colour-onSurface-dark"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
