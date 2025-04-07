import { Chip } from "@heroui/react";
import { Copy } from "lucide-react";
import { addToast } from "@heroui/react";

interface JoinCodeChipProps {
  joinCode: string;
}

const JoinCodeChip = ({ joinCode }: JoinCodeChipProps) => {
  return (
    <Chip
      className="cursor-pointer select-all hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
      color="primary"
      variant="flat"
      onClick={() => {
        navigator.clipboard.writeText(joinCode);
        addToast({
          title: "Workspace code copied to clipboard",
          color: "success",
        });
      }}
    >
      <div className="flex items-center gap-1 font-mono">
        {joinCode}
        <Copy size={14} />
      </div>
    </Chip>
  );
};

export default JoinCodeChip; 