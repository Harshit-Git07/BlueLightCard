# Storybook Deployments

Storybook deployments are managed via a [github action](.github/actions/storybook/action.yml).

Inputs available:
| Input | Description |
| ----- | ----------- |
| packageName | Package name e.g mobile-hybrid |
| brandDeployments | Enable deployment of brands e.g blc-uk, dds-uk etc |
| cloudflareApiToken | Cloudflare api token for authentication |
| cloudflareAccountId | Cloudflare account to deploy to |
| gitHubToken | Github token |

**Example**:

```yml
steps:
  - name: Publish
    uses: ./.github/actions/storybook
    id: storybook-publish
    with:
      cloudflareApiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
      cloudflareAccountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      packageName: mobile-hybrid
      brandDeployments: true
      gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

## Brand deployments

To deploy storybook for multiple brands, set `brandDeployments` to `true`. This will create a storybook instance for each brand under a subpath, for example with mobile-hybrid:

- mobile-hybrid-storybook.pages.dev/blc-uk
- mobile-hybrid-storybook.pages.dev/blc-au
- mobile-hybrid-storybook.pages.dev/dds-uk

This helps to keep Cloudflare page projects minimised, it also makes switching between brands a lot easier by keeping it under the single domain.

When `brandDeployments` is `false`, a single storybook instance is deployed (no subpath).

## Local brand testing

To spin up the storybook dev server for a specific brand, set the environment variable `NEXT_PUBLIC_APP_BRAND` in your env file to the brand you want, for example on mobile hybrid (`packages/mobile-hybrid/.env`):

```sh
NEXT_PUBLIC_APP_BRAND=dds-uk
```

Then run the storybook dev server

```sh
npm run storybook -w packages/mobile-hybrid
```
