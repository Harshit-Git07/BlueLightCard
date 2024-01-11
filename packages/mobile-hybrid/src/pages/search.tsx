import Button from '@/components/Button/Button';
import { APIUrl } from '@/globals';
import InvokeNativeNavigation from '@/invoke/navigation';
import { AppContext } from '@/store';
import { NextPage } from 'next';
import { useContext, useEffect } from 'react';

const navigation = new InvokeNativeNavigation();

const SearchPage: NextPage = () => {
  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    (Object.keys(APIUrl) as Array<keyof typeof APIUrl>).forEach((key) => {
      dispatch({
        type: 'setLoading',
        state: {
          key: APIUrl[key],
          loading: false,
        },
      });
    });
  }, []);

  return (
    <div className="p-5">
      <h1>Search Page</h1>
      <Button text="Map Search" onClick={() => navigation.navigate('/mapsearch.php')} />
    </div>
  );
};

export default SearchPage;
