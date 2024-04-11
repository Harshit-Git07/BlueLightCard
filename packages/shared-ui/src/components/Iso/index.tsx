import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { fetch, useRouter } from '../../lib/rewriters';
import { PlatformVariant, SharedProps } from '../../types';
import Button from '../Button';
import { Profile, mapping } from './mapper';

type Props = SharedProps & {
  idToken?: string;
  routeToPath: string;
};

const platformApiUrls = {
  [PlatformVariant.Desktop]: 'https://identity.blcshine.io/user',
  [PlatformVariant.Mobile]: '/api/4/user/profile/retrieve.php',
};

/**
 * Iso is abbreviated for Isomorphic (https://www.lullabot.com/articles/what-is-an-isomorphic-application) since this component must run on both web browser and mobile hybrid (android, ios).
 * This uses the rewriter versions of fetch and useRouter, where each takes in an extra argument - platform, which changes the implementation.
 * @param props
 * @returns
 */
const Iso: FC<Props> = ({ idToken, routeToPath, platform = PlatformVariant.Desktop }) => {
  const router = useRouter(PlatformVariant.Mobile);
  const [apiResponse, setApiResponse] = useState();
  const apiUrl = platformApiUrls[platform];

  const api = useMemo<Profile>(() => {
    return mapping[platform](apiResponse);
  }, [apiResponse]);

  const onButtonClick = useCallback(() => {
    if (platform === PlatformVariant.Desktop) {
      router.push(routeToPath);
    } else {
      router.pushNative(routeToPath, 'iso');
    }
  }, []);

  useEffect(() => {
    const fetchTest = async () => {
      const response = await fetch(
        apiUrl,
        {
          headers: idToken
            ? { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` }
            : {},
        },
        platform,
      );
      const profile = await response.json();
      setApiResponse(profile);
    };
    fetchTest();
  }, []);
  return (
    <div className="p-3">
      <Button onClick={onButtonClick}>Iso Button</Button>
      <ul>
        <li>DOB: {api.dob}</li>
        <li>Gender: {api.gender}</li>
        <li>Mobile: {api.mobile}</li>
      </ul>
    </div>
  );
};

export default Iso;
