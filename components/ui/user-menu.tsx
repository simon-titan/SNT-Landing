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
import Show from "../auth/show";

export const UserMenu = () => {
  const { user, logout, openProfile } = useAuth();

  const handleMenuSelect = (details: { value: string }) => {
    switch (details.value) {
      case "account":
        openProfile();
        break;
      case "logout":
        logout();
        break;
    }
  };

  return (
    <MenuRoot positioning={{ placement: "bottom" }} onSelect={handleMenuSelect}>
      <MenuTrigger>
        <Avatar
          src={user?.ProfileImageS3Url || undefined}
          name={user?.FullName}
        />
      </MenuTrigger>

      <MenuContent>
        <VStack py={2} px="14px" align="start" gap="0">
          <HStack>
            <Text fontSize="sm">{user?.FullName}</Text>
            <Show.Plan basic>
              <Tag colorPalette="purple" size="sm" startElement={<Star />}>
                Pro
              </Tag>
            </Show.Plan>
            <Show.Plan pro>
              <Tag colorPalette="gray" size="sm" startElement={<Star />}>
                Basic
              </Tag>
            </Show.Plan>
          </HStack>
          <Text fontSize="sm" color="fg.muted">
            {user?.Email}
          </Text>
        </VStack>
        <MenuSeparator />
        <MenuItem
          value="account"
          data-o-profile="1"
          data-mode="popup"
          data-o-account-activity="Open Account"
        >
          <User weight="bold" />
          Account
        </MenuItem>

        {/* <MenuItem value="settings">
          <GearSix weight="bold" />
          Settings
        </MenuItem> */}
        <MenuItem
          value="help"
          data-o-support="1"
          data-mode="popup"
          data-o-account-activity="Open Support Form"
        >
          <Question weight="bold" />
          Help & Support
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          value="logout"
          data-o-logout-link="1"
          data-o-logout-url="/"
          data-o-account-activity="Person logout"
        >
          <SignOut weight="bold" />
          Logout
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};
