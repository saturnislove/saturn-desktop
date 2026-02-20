import { useState, useEffect } from 'react';
import { DesktopItem, FolderWindow, ContextMenuState } from '../types';

// Default desktop items - this is what everyone sees
const DEFAULT_ITEMS: DesktopItem[] = [
  {
    id: '1',
    name: 'Documents',
    type: 'folder',
    x: 0,
    y: 0,
    parentId: null,
  },
  {
    id: '2',
    name: "THINGS I'M BUILDING",
    type: 'folder',
    x: 0,
    y: 1,
    parentId: null,
  },
  {
    id: '3',
    name: 'Photos',
    type: 'folder',
    x: 0,
    y: 2,
    parentId: null,
  },
  {
    id: '4',
    name: 'Seun',
    type: 'folder',
    x: 0,
    y: 3,
    parentId: null,
  },
  {
    id: '5',
    name: 'ovd',
    type: 'folder',
    x: 0,
    y: 4,
    parentId: null,
  },
  {
    id: '6',
    name: 'DONOTOPEN',
    type: 'folder',
    x: 0,
    y: 5,
    parentId: null,
  },
  // Text file inside Documents folder
  {
    id: '7',
    name: 'if_you_found_this.txt',
    type: 'file',
    x: 0,
    y: 0,
    parentId: '1', // Inside Documents folder
    fileUrl: 'data:text/plain;charset=utf-8,' + encodeURIComponent(`this is not everything.

just fragments i decided to leave public.

some of this is work.
some of this is grief.
some of this is evolution.

if you're reading this,
you slowed down.

thank you for that.

— saturn`),
    fileType: 'text/plain',
  },
  // Images inside Photos folder
  {
    id: '8',
    name: 'tiger_sword.jpg',
    type: 'file',
    x: 0,
    y: 0,
    parentId: '3', // Inside Photos folder
    fileUrl: 'https://images.unsplash.com/photo-1646174962705-d282599d24e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWdlciUyMGNhcnJ5aW5nJTIwc3dvcmQlMjB3YXJyaW9yfGVufDF8fHx8MTc3MTU2OTYxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fileType: 'image/jpeg',
  },
];

const STORAGE_KEY = 'macos-desktop-items-v4'; // Changed key to force reset with new Photos content
const WALLPAPER_KEY = 'macos-desktop-wallpaper';

export const useDesktopState = () => {
  // Clear old localStorage data
  if (typeof window !== 'undefined') {
    const oldKeys = ['macos-desktop-items', 'macos-desktop-items-v2', 'macos-desktop-items-v3'];
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Load saved state from localStorage on mount
  const [items, setItems] = useState<DesktopItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Verify we have all default items (6 folders + 1 text file + 1 image), if not reset to defaults
          if (!parsed || parsed.length < 8) {
            return DEFAULT_ITEMS;
          }
          return parsed;
        } catch (e) {
          console.error('Failed to parse saved items', e);
        }
      }
    }
    return DEFAULT_ITEMS;
  });

  const [wallpaper, setWallpaperState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(WALLPAPER_KEY);
      if (saved) {
        return saved;
      }
    }
    return 'figma:asset/4d05b3618583678157cf3e4c1d9c5d67cca8a7e3.png';
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  // Save wallpaper to localStorage
  const setWallpaper = (newWallpaper: string) => {
    setWallpaperState(newWallpaper);
    if (typeof window !== 'undefined') {
      localStorage.setItem(WALLPAPER_KEY, newWallpaper);
    }
  };

  const [openFolders, setOpenFolders] = useState<FolderWindow[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(true);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    type: 'desktop',
  });
  const [maxZIndex, setMaxZIndex] = useState(1);

  const addItem = (item: Omit<DesktopItem, 'id'>) => {
    const newItem: DesktopItem = {
      ...item,
      id: Date.now().toString(),
    };
    setItems([...items, newItem]);
  };

  const openFolder = (folderId: string) => {
    const folder = items.find((item) => item.id === folderId);
    if (!folder || openFolders.find((f) => f.id === folderId)) return;

    const newWindow: FolderWindow = {
      id: folderId,
      name: folder.name,
      x: 100 + openFolders.length * 30,
      y: 80 + openFolders.length * 30,
      width: 700,
      height: 500,
      zIndex: maxZIndex + 1,
      isMinimized: false,
      isFullscreen: false,
    };
    setOpenFolders([...openFolders, newWindow]);
    setMaxZIndex(maxZIndex + 1);
  };

  const closeFolder = (folderId: string) => {
    setOpenFolders(openFolders.filter((f) => f.id !== folderId));
  };

  const bringToFront = (folderId: string) => {
    const newZIndex = maxZIndex + 1;
    setOpenFolders(
      openFolders.map((f) =>
        f.id === folderId ? { ...f, zIndex: newZIndex } : f
      )
    );
    setMaxZIndex(newZIndex);
  };

  const updateFolderPosition = (folderId: string, x: number, y: number) => {
    setOpenFolders(
      openFolders.map((f) => (f.id === folderId ? { ...f, x, y } : f))
    );
  };

  const updateItemPosition = (itemId: string, x: number, y: number) => {
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, x, y } : item))
    );
  };

  const toggleMinimize = (folderId: string) => {
    setOpenFolders(
      openFolders.map((f) =>
        f.id === folderId ? { ...f, isMinimized: !f.isMinimized } : f
      )
    );
  };

  const toggleFullscreen = (folderId: string) => {
    setOpenFolders(
      openFolders.map((f) =>
        f.id === folderId ? { ...f, isFullscreen: !f.isFullscreen } : f
      )
    );
  };

  const deleteItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const renameItem = (itemId: string, newName: string) => {
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, name: newName } : item))
    );
    // Also update open folder name if it's a folder
    setOpenFolders(
      openFolders.map((f) => (f.id === itemId ? { ...f, name: newName } : f))
    );
  };

  return {
    items,
    openFolders,
    selectedItemId,
    wallpaper,
    editMode,
    contextMenu,
    setItems,
    addItem,
    openFolder,
    closeFolder,
    bringToFront,
    updateFolderPosition,
    updateItemPosition,
    toggleMinimize,
    toggleFullscreen,
    deleteItem,
    renameItem,
    setSelectedItemId,
    setWallpaper,
    setEditMode,
    setContextMenu,
  };
};