"use client";

import { Avatar } from "@/components/ui/avatar";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { Text, VStack, HStack } from "@chakra-ui/react";
import { Question, SignOut, User, Star } from "@phosphor-icons/react/dist/ssr";
import { Tag } from "@/components/ui/tag";
import { useAuth } from "../provider/auth-provider";
import { SignedIn } from "../auth/protect-content";
import { Profile, Support, LogOut } from "../auth/embed";

export const UserMenu = () => {
  const { user } = useAuth();

  return (
    <MenuRoot positioning={{ placement: "bottom" }}>
      <MenuTrigger>
        <Avatar
          src={user?.ProfileImageS3Url || undefined}
          name={user?.FullName}
          size="sm"
        />
      </MenuTrigger>

      <MenuContent>
        <VStack py={2} px="14px" align="start" gap="0">
          <HStack>
            <Text fontSize="sm">{user?.FullName}</Text>
            <SignedIn plan="LmJZpYmP">
              <Tag colorPalette="purple" size="sm" startElement={<Star />}>
                Pro
              </Tag>
            </SignedIn>
            <SignedIn plan="L9nqaeQZ">
              <Tag colorPalette="gray" size="sm" startElement={<Star />}>
                Basic
              </Tag>
            </SignedIn>
          </HStack>
          <Text fontSize="sm" color="fg.muted">
            {user?.Email}
          </Text>
        </VStack>
        <MenuSeparator />

        <Profile popup>
          <MenuItem value="account">
            <User weight="bold" />
            Account
          </MenuItem>
        </Profile>
        <Support popup>
          <MenuItem value="help">
            <Question weight="bold" />
            Help & Support
          </MenuItem>
        </Support>
        <MenuSeparator />
        <LogOut>
          <MenuItem value="logout">
            <SignOut weight="bold" />
            Logout
          </MenuItem>
        </LogOut>
      </MenuContent>
    </MenuRoot>
  );
};
