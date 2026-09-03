"use client";

import Link from "next/link";
import { startTransition } from "react";
import { useTheme } from "next-themes";
import { KeyRound, LogOut, Moon, Sun, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/app/actions/auth";

export function AccountMenu({ name, username, role }: { name: string; username: string; role: "ADMIN" | "VIEWER" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
        <UserRound className="size-4" />
        <span className="max-w-32 truncate">{name}</span>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground">{role}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs text-muted-foreground">@{username}</div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/account" />}>
          <KeyRound className="size-4" /> 비밀번호 변경
        </DropdownMenuItem>
        <DropdownMenuItem closeOnClick={false} onClick={() => setTheme(isDark ? "light" : "dark")}>
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {isDark ? "라이트 모드" : "다크 모드"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => startTransition(() => logoutAction())}>
          <LogOut className="size-4" /> 로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
