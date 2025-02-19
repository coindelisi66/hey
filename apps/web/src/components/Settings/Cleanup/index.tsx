import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { Localstorage } from '@hey/data/storage';
import { PAGEVIEW } from '@hey/data/tracking';
import { Button, Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { NextPage } from 'next';
import toast from 'react-hot-toast';
import { useDisconnectXmtp } from 'src/hooks/useXmtpClient';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';

const CleanupSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const disconnectXmtp = useDisconnectXmtp();

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'cleanup' });
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  const cleanup = (key: string) => {
    localStorage.removeItem(key);
    toast.success(t`Cleared ${key}`);
  };

  return (
    <GridLayout>
      <MetaTags title={t`Cleanup settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="p-5">
          <div className="space-y-5">
            <div className="text-lg font-bold">
              <Trans>Cleanup local storage</Trans>
            </div>
            <p>
              <Trans>
                If you stuck with some issues, you can try to clean up the
                browser's internal local storage. This will remove all the data
                stored in your browser.
              </Trans>
            </p>
          </div>
          <div className="divider my-5" />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>
                  <Trans>Optimistic publications</Trans>
                </b>
                <div className="lt-text-gray-500 text-xs font-bold">
                  <Trans>
                    Clean your posts or comments that are not indexed
                  </Trans>
                </div>
              </div>
              <Button onClick={() => cleanup(Localstorage.TransactionStore)}>
                <Trans>Cleanup</Trans>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>
                  <Trans>Timeline settings</Trans>
                </b>
                <div className="lt-text-gray-500 text-xs font-bold">
                  <Trans>Clean your timeline filter settings</Trans>
                </div>
              </div>
              <Button onClick={() => cleanup(Localstorage.TimelineStore)}>
                <Trans>Cleanup</Trans>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>
                  <Trans>Direct message keys</Trans>
                </b>
                <div className="lt-text-gray-500 text-xs font-bold">
                  <Trans>Clean your DM encryption key</Trans>
                </div>
              </div>
              <Button
                onClick={() => {
                  disconnectXmtp();
                  toast.success(t`Cleared DM keys`);
                }}
              >
                <Trans>Cleanup</Trans>
              </Button>
            </div>
          </div>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default CleanupSettings;
