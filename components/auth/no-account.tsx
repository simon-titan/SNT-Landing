import { Center, type CenterProps } from "@chakra-ui/react";
import { LuImage } from "react-icons/lu";

export const NotLoggedIn = (props: CenterProps) => (
  <div>
    <p>
      To access this content you need to <Button>sign up</Button> for the{" "}
      <strong>{pro ? "Pro" : "Basic"}</strong> plan or <Button>log in</Button>{" "}
      if you already have an account.
    </p>
  </div>
);
