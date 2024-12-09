"use client";

import { Box } from "@chakra-ui/react";

interface AuthProps {
  children?: React.ReactNode;
  popup?: boolean;
  uid?: string;
  [key: string]: any; // For any additional props
}

export const Login = ({ children, popup, ...props }: AuthProps) => {
  return (
    <Box
      {...(children ? { asChild: true } : {})}
      data-o-auth="1"
      data-mode={popup ? "popup" : "embed"}
      data-widget-mode="login"
      {...props}
    >
      {popup && children}
    </Box>
  );
};

export const SignUp = ({ children, popup, ...props }: AuthProps) => {
  return (
    <Box
      {...(children ? { asChild: true } : {})}
      data-o-auth="1"
      data-mode={popup ? "popup" : "embed"}
      data-widget-mode="register"
      {...props}
    >
      {popup && children}
    </Box>
  );
};

export const Profile = ({ children, popup, ...props }: AuthProps) => {
  return (
    <Box
      {...(children ? { asChild: true } : {})}
      data-o-profile="1"
      data-mode={popup ? "popup" : "embed"}
      {...props}
    >
      {popup && children}
    </Box>
  );
};

export const LeadCapture = ({ children, popup, uid, ...props }: AuthProps) => {
  return (
    <Box
      {...(children ? { asChild: true } : {})}
      data-o-lead-capture="1"
      data-form-uid={uid}
      data-mode={popup ? "popup" : "embed"}
      {...props}
    >
      {popup && children}
    </Box>
  );
};

export const EmailList = ({ children, popup, uid, ...props }: AuthProps) => {
  return (
    <Box
      {...(children ? { asChild: true } : {})}
      data-o-email-list="1"
      data-email-list-uid={uid}
      data-mode={popup ? "popup" : "embed"}
      {...props}
    >
      {popup ? children : null}
    </Box>
  );
};

export const Support = ({ children, popup, ...props }: AuthProps) => {
  return (
    <Box
      {...(children ? { asChild: true } : {})}
      data-o-support="1"
      data-mode={popup ? "popup" : "embed"}
      {...props}
    >
      {popup ? children : null}
    </Box>
  );
};

export const LogOut = ({ children, ...props }: AuthProps) => {
  return (
    <Box
      {...(children ? { asChild: true } : {})}
      data-o-logout-link="1"
      {...props}
    >
      {children}
    </Box>
  );
};
