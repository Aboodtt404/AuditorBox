import React, { useEffect, useRef, useState } from 'react';
import { Command } from 'cmdk';
import { useAuditData } from '../../hooks/useAuditData';

type CommandItem = {
  id: string;
  type: 'Forms' | 'Navigation' | 'Actions';
  title: string;
  subtitle?: string;
  icon: string; // Material icon name
  action?: () => void;
  params?: any;
  badge?: string;
  shortcut?: string[];
};

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: string, params?: any) => void;
  onSelectForm: (formId: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  onNavigate,
  onSelectForm
}) => {
  const [query, setQuery] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const commandRef = useRef<HTMLDivElement>(null);
  const { forms } = useAuditData();

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Reset selection on query change
  useEffect(() => {
    setSelectedItemIndex(0);
  }, [query]);

  // Build command items
  const getCommandItems = (): CommandItem[] => {
    const items: CommandItem[] = [];

    // Navigation items
    const navItems = [
      {
        id: 'nav-dashboard', type: 'Navigation' as const, title: 'Dashboard',
        icon: 'dashboard', action: () => onNavigate('dashboard'),
        shortcut: ['⌘', 'D'],
      },
      {
        id: 'nav-phases', type: 'Navigation' as const, title: 'Phase 1: Planning & Risk Assessment',
        subtitle: 'Current active phase', icon: 'timeline',
        action: () => onNavigate('phases'),
      },
      {
        id: 'nav-risk', type: 'Navigation' as const, title: 'Phase 2: Risk Response',
        icon: 'shield', action: () => onNavigate('phases'),
        shortcut: ['G', 'then', 'R'],
      },
      {
        id: 'nav-graph', type: 'Navigation' as const, title: 'Audit Graph',
        icon: 'hub', action: () => onNavigate('graph'),
      },
      {
        id: 'nav-financials', type: 'Navigation' as const, title: 'Financials',
        icon: 'account_balance', action: () => onNavigate('financials'),
      },
    ].filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(query.toLowerCase())
    );
    items.push(...navItems);

    // Forms
    const formItems: CommandItem[] = forms ? Object.entries(forms)
      .filter(([formId, form]) =>
        form.title.toLowerCase().includes(query.toLowerCase()) ||
        formId.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
      .map(([formId, form]) => ({
        id: `form-${formId}`,
        type: 'Forms' as const,
        title: form.title,
        subtitle: `ID: ${formId}`,
        icon: 'description',
        action: () => onSelectForm(formId),
      })) : [];
    items.push(...formItems);

    // Actions
    const actionItems = [
      {
        id: 'action-audit-log', type: 'Actions' as const, title: 'Create New Audit Log',
        icon: 'add_circle', action: () => onNavigate('calculator'),
        badge: 'BLOCKCHAIN', shortcut: ['⌘', 'N'],
      },
      {
        id: 'action-export', type: 'Actions' as const, title: 'Export Workpapers',
        icon: 'file_download', action: () => onNavigate('export'),
        shortcut: ['⌘', 'E'],
      },
      {
        id: 'action-invite', type: 'Actions' as const, title: 'Invite Team Member',
        icon: 'person_add', action: () => onNavigate('users'),
      },
    ].filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    items.push(...actionItems);

    return items.slice(0, 12);
  };

  if (!open) return null;

  const items = getCommandItems();

  // Group items by type
  const grouped = items.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  const groupOrder = ['Navigation', 'Forms', 'Actions'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 backdrop-blur-sm bg-background-dark/60 transition-all duration-200 ease-out">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <Command
        ref={commandRef}
        shouldFilter={false}
        className="relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[70vh] ring-1 ring-white/10"
      >
        {/* Search input */}
        <div className="relative border-b border-slate-800 flex items-center px-4 py-4">
          <span className="material-icons text-slate-400 text-2xl ml-2">search</span>
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Type a command or search..."
            className="w-full bg-transparent border-none focus:ring-0 text-lg text-white placeholder-slate-500 px-4 h-8 outline-none"
            autoFocus
          />
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-slate-800/50 border border-slate-800 text-xs text-slate-400 font-medium font-mono">
            <span className="text-[10px]">ESC</span>
          </div>
        </div>

        {/* Results */}
        <Command.List className="overflow-y-auto flex-1 p-2 custom-scrollbar">
          <Command.Empty className="px-4 py-8 text-center text-slate-500">
            No results found
          </Command.Empty>

          {groupOrder.map(group => {
            const groupItems = grouped[group];
            if (!groupItems || groupItems.length === 0) return null;

            return (
              <Command.Group
                key={group}
                heading={
                  <div className="flex flex-col">
                    {/* Only add separator for non-first visible groups */}
                    {group !== groupOrder.find(g => grouped[g]?.length) && (
                      <div className="border-t border-slate-800/50 mb-2 mt-1" />
                    )}
                    <div className="px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {group === 'Forms' ? 'Recent Forms' : group}
                    </div>
                  </div>
                }
                className="command-group"
              >
                {/* Separator style for the group heading is handled via CSS in index.css usually, 
                    but here we can just let cmdk handle it or add it to the heading if needed. 
                    The previous div-based separator is removed to keep DOM clean for cmdk. */}

                {groupItems.map((item) => {
                  const globalIndex = items.indexOf(item);
                  const isSelected = globalIndex === selectedItemIndex;

                  return (
                    <Command.Item
                      key={item.id}
                      value={item.id}
                      onSelect={() => {
                        item.action?.();
                        onClose();
                        setQuery('');
                      }}
                      className={`w-full group flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer text-left transition-colors ${isSelected
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'hover:bg-primary/20 hover:text-white text-slate-300'
                        }`}
                      onMouseEnter={() => setSelectedItemIndex(globalIndex)}
                    >
                      <div className="flex items-center gap-3">
                        {/* Special pulsing dot for blockchain action */}
                        {item.badge === 'BLOCKCHAIN' ? (
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                          </span>
                        ) : (
                          <span className={`material-icons text-xl ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>
                            {item.icon}
                          </span>
                        )}

                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.title}</span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <span className={`text-xs ${isSelected ? 'text-blue-100 opacity-80' : 'text-slate-500'}`}>
                              {item.subtitle}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Shortcuts */}
                      {item.shortcut && (
                        <div className="flex items-center gap-1">
                          {item.shortcut.map((key, i) =>
                            key === 'then' ? (
                              <span key={i} className="text-[10px] text-slate-600 font-mono">then</span>
                            ) : (
                              <kbd key={i} className="hidden group-hover:flex h-5 items-center gap-1 rounded border border-slate-600 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400">
                                {key}
                              </kbd>
                            )
                          )}
                        </div>
                      )}

                      {/* Return icon for selected */}
                      {isSelected && !item.shortcut && (
                        <span className="material-icons text-sm text-white animate-pulse">keyboard_return</span>
                      )}
                    </Command.Item>
                  );
                })}
              </Command.Group>
            );
          })}
        </Command.List>


        {/* Footer hints */}
        <div className="bg-surface-dark border-t border-slate-800 px-4 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="bg-slate-800 border border-slate-700 rounded p-0.5">
                <span className="material-icons text-[14px]">arrow_upward</span>
              </span>
              <span className="bg-slate-800 border border-slate-700 rounded p-0.5">
                <span className="material-icons text-[14px]">arrow_downward</span>
              </span>
              <span>to navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="bg-slate-800 border border-slate-700 rounded p-0.5">
                <span className="material-icons text-[14px]">keyboard_return</span>
              </span>
              <span>to select</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-slate-400">AuditorBox Network Active</span>
          </div>
        </div>
      </Command>
    </div>
  );
};

export default CommandPalette;
