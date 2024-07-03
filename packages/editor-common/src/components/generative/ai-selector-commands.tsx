import {
  ArrowDownWideNarrow,
  CheckCheck,
  RefreshCcwDot,
  StepForward,
  WrapText,
} from "lucide-react"
import { useEditor } from "@refly-packages/editor-core/components"
import { getPrevText } from "@refly-packages/editor-core/utils"
import { CommandGroup, CommandItem, CommandSeparator } from "../ui/command"

const options = [
  {
    value: "improve",
    label: "Improve writing",
    icon: RefreshCcwDot,
  },

  {
    value: "fix",
    label: "Fix grammar",
    icon: CheckCheck,
  },
  {
    value: "shorter",
    label: "Make shorter",
    icon: ArrowDownWideNarrow,
  },
  {
    value: "longer",
    label: "Make longer",
    icon: WrapText,
  },
  {
    value: "explain",
    label: "Explain selection",
    icon: WrapText,
  },
]

interface AISelectorCommandsProps {
  onSelect: (value: string, option: string) => void
}

const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor()

  return (
    <>
      <CommandGroup heading="Edit or review selection">
        {options.map(option => (
          <CommandItem
            onSelect={value => {
              const slice = editor.state.selection.content()
              const text = editor.storage.markdown.serializer.serialize(
                slice.content,
              )
              onSelect(text, value)
            }}
            className="flex gap-2 px-4"
            key={option.value}
            value={option.value}>
            <option.icon className="w-4 h-4 text-purple-500" />
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Use AI to do more">
        <CommandItem
          onSelect={() => {
            const pos = editor.state.selection.from

            const text = getPrevText(editor, pos)
            onSelect(text, "continue")
          }}
          value="continue"
          className="gap-2 px-4">
          <StepForward className="w-4 h-4 text-purple-500" />
          Continue writing
        </CommandItem>
      </CommandGroup>
    </>
  )
}

export default AISelectorCommands
