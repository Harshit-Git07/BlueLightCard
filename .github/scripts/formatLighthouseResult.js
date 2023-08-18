import dedent from 'dedent-js';

export default async function({ links, manifest, core }) {
    const results = manifest.filter(result => result.isRepresentativeRun);
    const score = res => res >= 90 ? '🟢' : res >= 50 ? '🟠' : '🔴';

    const comment = results.map((result) => {
      const summary = result.summary;
      const url = result.url;

      return `
        🌎 [${url}](${url})
        ⚡️ [Lighthouse report](${links[url]})

        | Category | Score |
        | --- | --- |
        ${Object.keys(summary).map((key) => {
          const percentage = Math.round(summary[key] * 100);
          return `| ${score(percentage)} ${key} | ${percentage} |`;
        }).join('\n')}
      `;
    }).join('\n');

    core.setOutput("comment", dedent(comment));
}
