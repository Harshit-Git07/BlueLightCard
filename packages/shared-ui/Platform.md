# Rewriters

Rewriters simply rewrite the implementation of client libraries such as fetch and useRouter from Nextjs. Depending on what the platform is set to, using the fetch api will either use mobile hybrid code or proxy through to the original fetch api.

The benefit of this, allows the original usage of these libraries just with an extra argument for setting the platform, so the usage is the same on different platforms.

### Usage

Using fetch from `lib/rewriters`

```tsx
import { fetch } from '../lib/rewriters';

type Props = SharedProps & {};

const IsoComponent: FC<Props> = ({ platform }) => {
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://blcshine.io/...', {
        headers: {
          Authorization: 'Bearer ...'
        },
        platform,
      });
      const json = await response.json();
    };
    fetchData();
  }, []);
  return <></>;
};

// usage on mobile-hybrid
<IsoComponent platform={PlatformVariant.Mobile} />

// usage on web browser
<IsoComponent platform={PlatformVariant.Desktop} />
```

Using useRouter from `lib/rewriters`, this uses the original nextjs hook with additional support for navigating on native apps.

```tsx
import { useRouter } from '../lib/rewriters';

const Component: FC<Props> = ({ platform }) => {
  const router = useRouter();

  const onClick = useCallback(() => {
    if (platform === PlatformVariant.Mobile) {
      router.pushNative('/deeplink.php');
    } else {
      router.push('/nextjs-route');
    }
  }, []);

  return <button onClick={onClick}>Button</button>;
};
```
