// hooks
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { basePreconf } from "viem/chains";
import { useAccount, useConnect, useSwitchChain } from "wagmi";
// modals
import { HelpModal } from "@/components/modals/help";
import { LoadingProfileModal } from "@/components/modals/loading-profile";
// pages
import { HomePage } from "@/components/pages/home";
import { ProfilePage } from "@/components/pages/profile";
import { Navbar } from "@/components/shared/navbar";
// hooks
import { useApp } from "@/contexts/app-context";
import { useEnvironment } from "@/contexts/environment-context";
import { useFarcaster } from "@/contexts/farcaster-context";
import { useGetUser } from "@/hooks/use-get-user";
import { useWalletBalance } from "@/hooks/use-wallet-balance";
// other
import { OverlayContent, PageContent } from "@/types/enums";

export default function AppWrapper() {
  const { isConnected, address, chainId } = useAccount();
  const { connect, error: connectError } = useConnect();
  const { switchChain } = useSwitchChain();
  const { isInMiniApp } = useEnvironment();
  const { safeAreaInsets } = useFarcaster();
  useWalletBalance();

  const {
    activeUserId,
    pageContent,
    overlayContent,
    handlePageChange,
    handleModalChange,
    setActiveProfile,
  } = useApp();

  const {
    data: modalUser,
    isLoading: isLoadingModalUser,
    isSuccess: isSuccessModalUser,
  } = useGetUser({
    userId: activeUserId,
    enabled: overlayContent === OverlayContent.VIEW_PROFILE && !!activeUserId,
  });

  useEffect(() => {
    if (connectError) {
      console.error("wagmi connection error", connectError);
    }
  }, [connectError]);

  // always connect to wagmi farcaster miniapp to retrieve wallet address
  useEffect(() => {
    if (!(isConnected && address)) {
      if (isInMiniApp) {
        connect({ connector: miniAppConnector() });
      }
      return;
    }
  }, [isConnected, address, isInMiniApp, connect]);

  // connect to base
  useEffect(() => {
    if (isConnected && !!chainId && chainId !== basePreconf.id) {
      switchChain({ chainId: basePreconf.id });
    }
  }, [isConnected, chainId, switchChain]);

  useEffect(() => {
    if (
      overlayContent === OverlayContent.VIEW_PROFILE &&
      modalUser &&
      isSuccessModalUser &&
      modalUser.user
    ) {
      setActiveProfile(modalUser.user);
      handlePageChange(PageContent.PROFILE);
    }
  }, [
    modalUser,
    handlePageChange,
    isSuccessModalUser,
    overlayContent,
    setActiveProfile,
  ]);

  return (
    <div className="relative z-10">
      <div
        className="no-scrollbar mx-auto flex size-full h-screen max-w-md flex-col gap-2 overflow-x-hidden"
        style={{
          backgroundColor: "#FCF5EC",
          backgroundSize: "160px 160px",
          backgroundPosition: "0 0, 0 80px, 80px -80px, -80px 0px",
          marginTop: safeAreaInsets.top,
          marginBottom: safeAreaInsets.bottom,
          marginLeft: safeAreaInsets.left,
          marginRight: safeAreaInsets.right,
        }}
      >
        <Navbar />

        <div className="no-scrollbar mx-auto flex h-screen max-h-screen w-full flex-col justify-between gap-2 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <div className="h-full w-full flex-1 flex-col items-start justify-center">
              {pageContent === PageContent.HOME ? (
                <HomePage key="home" />
              ) : pageContent === PageContent.PROFILE ? (
                <ProfilePage key="profile" />
              ) : null}
            </div>
          </AnimatePresence>
        </div>

        {overlayContent === OverlayContent.HELP ? (
          <HelpModal onClose={() => handleModalChange(OverlayContent.NONE)} />
        ) : overlayContent === OverlayContent.VIEW_PROFILE &&
          isLoadingModalUser ? (
          <LoadingProfileModal
            onClose={() => handleModalChange(OverlayContent.NONE)}
          />
        ) : null}
      </div>
    </div>
  );
}
