"use client";

import {
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsWithQueryState,
} from "@/components/ui/tabs";
import { useApp } from "@/contexts/app-context";
import { ProfileHeader } from "./profile-header";

export const ProfilePage = () => {
  const { activeProfile } = useApp();

  return (
    <div className="relative flex w-full flex-col items-center justify-center px-2">
      <ProfileHeader user={activeProfile} />

      {/* User stats and activity */}
      <TabsWithQueryState
        className="mb-4 w-full"
        defaultValue="tab1"
        queryKey="profile"
      >
        <TabsList className="flex w-full justify-between">
          <TabsTrigger className="w-full" value="tab1">
            Tab1
          </TabsTrigger>
          <TabsTrigger className="w-full" value="tab2">
            Tab2
          </TabsTrigger>
        </TabsList>
        <TabsContent className="my-4" value="tab1">
          Tab 1
        </TabsContent>
        <TabsContent className="my-4" value="tab2">
          Tab 2
        </TabsContent>
      </TabsWithQueryState>
    </div>
  );
};
