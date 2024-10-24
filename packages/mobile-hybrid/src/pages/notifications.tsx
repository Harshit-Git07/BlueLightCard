import { useEffect } from 'react';
import { NextPage } from 'next';
import { useSetAtom } from 'jotai';
import { spinner } from '@/modules/Spinner/store';
import { getPathFromUrl, usePlatformAdapter } from '@bluelightcard/shared-ui';
import InvokeNativeAPICall from '@/invoke/apiCall';
import NotificationItem from '@/components/NotificationItem/NotificationItem';
import useAPI from '@/hooks/useAPI';

const invokeNativeApiCall = new InvokeNativeAPICall();

type Notification = {
  id: string;
  title: string;
  description: string;
  isClicked: string;
  href: string;
};

/**
 * Hybrid Notifications page that is rendered when the user clicks the
 * notification bell on the iOS or Android app. This pulls data from
 * native, which pulls from Braze, which pulls from Google Sheets
 * populated by the Partnerships team.
 *
 * Defensive programming and very thorough testing is strongly recommended
 * here as data entry could very easily go wrong and get provided with bad
 * data. It is not easy to change that data once it has gone into Braze.
 * Braze itself can also be unpredictable.
 *
 * @returns Notification page markup
 */
const NotificationsPage: NextPage = () => {
  const setSpinner = useSetAtom(spinner);
  const platformAdapter = usePlatformAdapter();

  const notifications = useAPI('contentcardsRequest') as Notification[];

  const onNotificationClick = (notification: Notification) => async () => {
    if (!notification?.id) return;

    invokeNativeApiCall.requestData('contentcardsLogClick', { id: notification.id });

    try {
      // iOS requires navigation to be done just to a path
      // it cannot be given just a whole URL so trim the href
      const navigationPath = getPathFromUrl(notification.href);
      platformAdapter.navigate(navigationPath, true);
    } catch (err) {
      console.error('Unable to navigate to notification href', err);
    }

    // Braze can be slow to update so wait 200ms before refresh
    setTimeout(() => invokeNativeApiCall.requestData('contentcardsRequest'), 200);
  };

  useEffect(() => {
    setSpinner(true);
    invokeNativeApiCall.requestData('contentcardsRequest');
  }, [setSpinner]);

  useEffect(() => {
    if (!notifications) return;
    setSpinner(false);
  }, [setSpinner, notifications]);

  return (
    <div className="pt-4">
      {notifications?.map((notification) => (
        <NotificationItem
          key={notification.id}
          id={notification.id}
          title={notification.title}
          subtext={notification.description}
          isClicked={notification.isClicked === 'true'}
          onClick={onNotificationClick(notification)}
        />
      ))}
    </div>
  );
};

export default NotificationsPage;
