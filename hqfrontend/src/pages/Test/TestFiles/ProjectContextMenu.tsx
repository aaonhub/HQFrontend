import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export default function ProjectContextMenu() {
  return (
    <ContextMenu>

      {/* Trigger */}
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md text-sm">
        Right click here
      </ContextMenuTrigger>

      {/* Content */}
      <ContextMenuContent className="w-64">

        {/* Back */}
        <ContextMenuItem inset>
          Back
        </ContextMenuItem>

        <ContextMenuItem inset disabled>
          Forward
        </ContextMenuItem>

        <ContextMenuItem inset>
          Reload
        </ContextMenuItem>


      </ContextMenuContent>
    </ContextMenu>
  )
}
