import dedent from 'dedent-js';

export default async function({ assertions, core }) {
    if (!assertions.length) {
      core.setOutput("comment", '✅ Budget met, nothing to see here');
    } else {
      const comment = assertions.map((result) => {
        return `
          ❌ **${result.auditProperty || ''}.${result.auditId}** failure on [${result.url}](${result.url})

          *${result.auditTitle}* - [docs](${result.auditDocumentationLink})

          | Actual | Expected |
          | --- | --- |
          | ${result.actual} | ${result.operator} ${result.expected} |
        `;
      }).join('\n');

      core.setOutput("comment", dedent(comment));
    }
}
