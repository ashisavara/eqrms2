"use client";

import { Excalidraw, serializeAsJSON } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AppState, BinaryFiles, ExcalidrawInitialDataState, ExcalidrawProps } from "@excalidraw/excalidraw/types";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { saveGroupWhiteboard } from "@/lib/actions/groupWhiteboardActions";

type SaveSource = "autosave" | "manual";
type ExcalidrawOnChangeArgs = Parameters<NonNullable<ExcalidrawProps["onChange"]>>;

type SceneSnapshot = {
  elements: ExcalidrawOnChangeArgs[0];
  appState: AppState;
  files: BinaryFiles;
};

type MandateWhiteboardClientProps = {
  groupId: number;
  initialScene: ExcalidrawInitialDataState | null;
  initialUpdatedAt: string | null;
};

export default function MandateWhiteboardClient({
  groupId,
  initialScene,
  initialUpdatedAt,
}: MandateWhiteboardClientProps) {
  const sceneRef = useRef<SceneSnapshot | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(initialUpdatedAt);

  const initialData = useMemo(() => {
    if (!initialScene || typeof initialScene !== "object") return undefined;
    return initialScene as ExcalidrawInitialDataState;
  }, [initialScene]);

  const persistScene = useCallback(
    async (source: SaveSource) => {
      if (isSaving) return;
      if (source === "autosave" && !isDirty) return;
      if (!sceneRef.current) return;

      setIsSaving(true);
      try {
        const sceneString = serializeAsJSON(
          sceneRef.current.elements,
          sceneRef.current.appState,
          sceneRef.current.files,
          "database"
        );
        const sceneJson = JSON.parse(sceneString);
        const result = await saveGroupWhiteboard(groupId, sceneJson, source);
        if (!result.success) {
          throw new Error(result.error || "Failed to save whiteboard");
        }

        setIsDirty(false);
        setLastSavedAt(result.updatedAt || new Date().toISOString());
      } catch (error) {
        console.error("Whiteboard save error:", error);
        toast.error("Whiteboard autosave failed. Your changes are still unsaved.");
      } finally {
        setIsSaving(false);
      }
    },
    [groupId, isDirty, isSaving]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      void persistScene("autosave");
    }, 60000);

    return () => clearInterval(interval);
  }, [persistScene]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        void persistScene("autosave");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [persistScene]);

  const saveStatus = isSaving
    ? "Saving..."
    : isDirty
      ? "Unsaved changes"
      : `Saved${lastSavedAt ? ` at ${new Date(lastSavedAt).toLocaleTimeString()}` : ""}`;

  return (
    <div className="relative h-[calc(100vh-8px)] w-full">
      <Toaster position="top-center" />
      <div className="absolute left-2 right-2 top-2 z-10 flex items-center justify-between pointer-events-none">
        <p className="text-xs text-muted-foreground bg-background/80 rounded px-2 py-1 pointer-events-auto">
          {saveStatus}
        </p>
        <Button type="button" size="sm" className="pointer-events-auto" disabled={isSaving} onClick={() => void persistScene("manual")}>
          {isSaving ? "Saving..." : "Save now"}
        </Button>
      </div>
      <div className="h-full w-full">
        <Excalidraw
          initialData={initialData}
          onChange={(elements, appState, files) => {
            sceneRef.current = { elements, appState, files };
            setIsDirty(true);
          }}
        />
      </div>
    </div>
  );
}
