"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";

export function ConnectToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isConnected = searchParams.has("connected");

  const handleToggle = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);

    if (checked) {
      params.set("connected", "1");
    } else {
      params.delete("connected");
    }

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.push(newUrl);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Connected</span>
      <Switch
        checked={isConnected}
        onCheckedChange={handleToggle}
        aria-label="Toggle connect mode"
      />
    </div>
  );
}
