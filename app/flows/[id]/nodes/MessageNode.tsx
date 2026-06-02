import { Handle, Position, NodeProps } from 'reactflow';
import { MessageSquare } from 'lucide-react';

export default function MessageNode({ data, selected }: NodeProps) {
  const hasButtons = data.buttons && data.buttons.length > 0;

  return (
    <div className={`bg-white rounded-2xl shadow-lg border-2 min-w-[200px] max-w-[240px] transition-all ${
      selected ? 'border-blue-500 shadow-blue-100' : 'border-blue-200'
    }`}>
      <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-t-xl px-4 py-2.5 flex items-center gap-2">
        <MessageSquare size={14} className="text-white" />
        <span className="text-white font-bold text-sm">Message</span>
      </div>
      <div className="px-4 py-3 space-y-2">
        {data.text ? (
          <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed">{data.text}</p>
        ) : (
          <p className="text-xs text-gray-400 italic">Click to add message...</p>
        )}
        {hasButtons && (
          <div className="space-y-1.5 pt-1">
            {data.buttons.slice(0, 3).map((btn: any, i: number) => (
              <div key={i} className="relative text-[10px] border border-blue-200 text-blue-600 rounded-lg px-2 py-1 text-center font-semibold bg-blue-50/30">
                {btn.text || `Button ${i + 1}`}
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`btn-${i}`}
                  style={{ right: -22, top: '50%', transform: 'translateY(-50%)' }}
                  className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white hover:scale-110 transition-transform"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white" />
      
      {!hasButtons && (
        <Handle type="source" position={Position.Right}
          className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white" />
      )}
    </div>
  );
}
