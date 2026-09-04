"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordAction, type ActionState } from "@/app/actions/auth";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(changePasswordAction, {});
  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="current">현재 비밀번호</Label>
        <Input id="current" name="current" type="password" autoComplete="current-password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="next">새 비밀번호</Label>
        <Input id="next" name="next" type="password" autoComplete="new-password" minLength={6} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">새 비밀번호 확인</Label>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={6} required />
      </div>
      {state.error && <p role="alert" className="rounded-lg bg-negative-bg px-3 py-2 text-label-1 text-negative">{state.error}</p>}
      {state.success && <p role="status" className="rounded-lg bg-positive-bg px-3 py-2 text-label-1 text-positive">{state.success}</p>}
      <Button type="submit" disabled={pending}>{pending ? "변경 중…" : "비밀번호 변경"}</Button>
    </form>
  );
}
