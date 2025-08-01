import { useEffect } from 'react';
import { useState } from 'react';
import { LightLoading } from '@refly/ui-kit';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStoreShallow } from '@refly/stores';

export const HomeRedirect = ({ defaultNode }: { defaultNode: ReactNode }) => {
  const [element, setElement] = useState<ReactNode | null>(null);
  const { isLogin } = useUserStoreShallow((state) => ({
    isLogin: state.isLogin,
  }));

  const handleHomeRedirect = async () => {
    if (isLogin) {
      return <Navigate to={'/canvas/empty'} replace />;
    }
    return defaultNode;
  };

  useEffect(() => {
    handleHomeRedirect().then(setElement);
  }, []);

  return element ?? <LightLoading />;
};
