import { Handle, Position, NodeProps } from 'reactflow';
import { List } from 'lucide-react';

export default function ListMessageNode({ data, selected }: NodeProps) {
  const sections = data.sections || [];
  const hasItems = sections.some((s: any) => s.rows && s.rows.length > 0);

  return (
    <div className={`bg-white rounded-2xl shadow-lg border-2 min-w-[200px] max-w-[240px] transition-all ${
      selected ? 'border-teal-500 shadow-teal-100' : 'border-teal-200'
    }`}>
      <div className="bg-gradient-to-r from-teal-500 to-teal-400 rounded-t-xl px-4 py-2.5 flex items-center gap-2">
        <List size={14} className="text-white" />
        <span className="text-white font-bold text-sm">List Message</span>
      </div>
      <div className="px-4 py-3 space-y-2">
        <p className="text-xs text-gray-700 line-clamp-2">
          {data.body || <span className="text-gray-400 italic">Click to add body...</span>}
        </p>
        
        {sections.map((sec: any, sIdx: number) => {
          const rows = sec.rows || [];
          if (rows.length === 0) return null;
          
          return (
            <div key={sIdx} className="space-y-1 mt-2">
              <p className="text-[8px] font-bold text-teal-600 uppercase tracking-wider">
                {sec.title || `Section ${sIdx + 1}`}
              </p>
              {rows.map((row: any, rIdx: number) => (
                <div key={rIdx} className="relative text-[10px] border border-teal-200 text-teal-700 bg-teal-50/30 rounded-lg px-2 py-1 text-center font-semibold">
                  {row.title || `Item ${rIdx + 1}`}
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`list-${sIdx}-${rIdx}`}
                    style={{ right: -22, top: '50%', transform: 'translateY(-50%)' }}
                    className="!w-3 !h-3 !bg-teal-500 !border-2 !border-white hover:scale-110 transition-transform"
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
      
      <Handle type="target" position={Position.Left}
        className="!w-3 !h-3 !bg-teal-500 !border-2 !border-white" />
      
      {!hasItems && (
        <Handle type="source" position={Position.Right}
          className="!w-3 !h-3 !bg-teal-500 !border-2 !border-white" />
      )}
    </div>
  );
}
