import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentGroupId } from "@/lib/auth/serverGroupMandate";
import { getUserRoles } from "@/lib/auth/getUserRoles";
import { can } from "@/lib/permissions";
import UserLog from "@/components/rms/UserLog";
import RmsPageTitle from "@/components/uiComponents/rms-page-title";
import MandateWhiteboardClient from "./MandateWhiteboardClient";
import { loadGroupWhiteboard } from "@/lib/actions/groupWhiteboardActions";
import type { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types";

export default async function MandateWhiteboardPage() {
  const userRoles = await getUserRoles();
  if (!can(userRoles, "mandate", "view_mandate")) {
    redirect("/uservalidation");
  }

  const groupId = await getCurrentGroupId();
  if (!groupId) {
    return (
      <>
        <UserLog segment="mandate:whiteboard" entityTitle="Mandate Whiteboard" pagePath="/mandate/whiteboard" />
        <div className="p-4 space-y-3">
          <RmsPageTitle title="Mandate Whiteboard" caption="Visual whiteboard for mandate discussion and planning" />
          <p className="text-muted-foreground">
            Please select a group using the &quot;Select Group&quot; button before opening the whiteboard.
          </p>
          <Link href="/mandate" className="blue-hyperlink">
            Back to Mandate
          </Link>
        </div>
      </>
    );
  }

  const whiteboard = await loadGroupWhiteboard(groupId);
  const initialSceneRaw = whiteboard.success ? whiteboard.data?.excalidraw_json ?? null : null;
  const initialScene =
    initialSceneRaw && typeof initialSceneRaw === "object"
      ? (initialSceneRaw as ExcalidrawInitialDataState)
      : null;
  const initialUpdatedAt = whiteboard.success ? whiteboard.data?.excalidraw_updated_at ?? null : null;

  return (
    <>
      <div>
        <MandateWhiteboardClient groupId={groupId} initialScene={initialScene} initialUpdatedAt={initialUpdatedAt} />
      </div>
    </>
  );
}
