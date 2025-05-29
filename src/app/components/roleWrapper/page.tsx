'use client';

import HamburgerMenu from "../HamburgerMenu";

export default function RoleWrapper({ children }: { children: React.ReactNode }) {
    return <HamburgerMenu>{children}</HamburgerMenu>;
  }
