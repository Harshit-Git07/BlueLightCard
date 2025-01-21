import Content from './RichtextModule/Content';

export default function StepList({
  intro,
  steps,
}: Partial<{
  intro: any;
  steps: Array<{
    content: any;
  }>;
}>) {
  return (
    <section className="section space-y-8">
      {intro && (
        <header className="richtext text-center">
          <Content value={intro} />
        </header>
      )}

      <ol className="grid gap-8 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
        {steps?.map((step, index) => (
          <li className="grid grid-cols-[auto,1fr] gap-2" key={index}>
            <b className="text-gradient aspect-square h-[1em] -translate-y-4 text-center text-6xl tabular-nums">
              {index + 1}
            </b>

            <div className="richtext">
              <Content value={step.content} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
