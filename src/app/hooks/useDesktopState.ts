import { useState, useEffect } from 'react';
import { DesktopItem, FolderWindow, ContextMenuState } from '../types';

const GITHUB_FOLDER_MAP: Record<string, string> = {
  '1': 'Documents', '2': 'THINGS_IM_BUILDING', '3': 'Photos',
  '4': 'Seun', '5': 'ovd', '6': 'DONOTOPEN',
};

function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const types: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif',
    webp: 'image/webp', svg: 'image/svg+xml', mp4: 'video/mp4', mov: 'video/quicktime',
    mp3: 'audio/mpeg', wav: 'audio/wav', pdf: 'application/pdf', txt: 'text/plain', md: 'text/markdown',
  };
  return types[ext] || 'application/octet-stream';
}

const DEFAULT_ITEMS: DesktopItem[] = [
  { id: '1', name: 'Documents', type: 'folder', x: 0, y: 0, parentId: null },
  { id: '2', name: "THINGS I'M BUILDING", type: 'folder', x: 0, y: 1, parentId: null },
  { id: '3', name: 'Photos', type: 'folder', x: 0, y: 2, parentId: null },
  { id: '4', name: 'Seun', type: 'folder', x: 0, y: 3, parentId: null },
  { id: '5', name: 'ovd', type: 'folder', x: 0, y: 4, parentId: null },
  { id: '6', name: 'DONOTOPEN', type: 'folder', x: 0, y: 5, parentId: null },
  {
    id: '7',
    name: 'if_you_found_this.txt',
    type: 'file',
    x: 0,
    y: 0,
    parentId: '1',
    fileUrl: 'data:text/plain;charset=utf-8,' + encodeURIComponent("this is not everything. just fragments i decided to leave public. some of this is work. some of this is personal. some of this is both.\n\nyou're here, which means you were curious enough to look.\n\nthat counts for something.\n\n— saturn"),
    fileType: 'text/plain',
  },
  {
    id: '8',
    name: 'tiger_sword.jpg',
    type: 'file',
    x: 0,
    y: 0,
    parentId: '3',
    fileUrl: 'https://images.unsplash.com/photo-1646174962705-d282599d24e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjY5NDF8MHwxfHNlYXJjaHwxfHx0aWdlciUyMHN3b3JkfGVufDB8fHx8MTc0NzE4MzY3OXww&ixlib=rb-4.1.0&q=80&w=1080',
    fileType: 'image/jpeg',
  },
];

const STORAGE_KEY = 'macos-desktop-items-v4';
const WALLPAPER_KEY = 'macos-desktop-wallpaper';

export const useDesktopState = () => {
  // Clean up old storage keys
  useEffect(() => {
    const OLD_KEYS = [
      'macos-desktop-items',
      'macos-desktop-items-v2',
      'macos-desktop-items-v3',
    ];
    OLD_KEYS.forEach((key) => localStorage.removeItem(key));
  }, []);

  const [items, setItems] = useState<DesktopItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_ITEMS;
  });

  const [githubItems, setGithubItems] = useState<DesktopItem[]>([]);

  useEffect(() => {
    const fetchGitHubContent = async () => {
      const allItems: DesktopItem[] = [];
      await Promise.all(
        Object.entries(GITHUB_FOLDER_MAP).map(async ([folderId, folderName]) => {
          try {
            const res = await fetch(
              `https://api.github.com/repos/saturnislove/saturn-desktop/contents/public/content/${folderName}?ref=main`
            );
            if (!res.ok) return;
            const files = await res.json();
            (files as Array<{ name: string; sha: string; download_url: string | null; type: string }>)
              .filter((f) => f.type === 'file' && f.name !== '.gitkeep' && f.download_url)
              .forEach((file, index) => {
                const fileType = getFileType(file.name);
                const isImage = fileType.startsWith('image/');
                allItems.push({
                  id: `gh-${file.sha}`,
                  name: file.name,
                  type: isImage ? 'image' : 'file',
                  x: index,
                  y: 0,
                  parentId: folderId,
                  fileUrl: file.download_url!,
                  imageUrl: isImage ? file.download_url! : undefined,
                  fileType,
                });
              });
          } catch {
            // folder not yet created — skip
          }
        })
      );
      setGithubItems(allItems);
    };
    fetchGitHubContent();
  }, []);

  const [wallpaper, setWallpaper] = useState<string>(() => {
    return localStorage.getItem(WALLPAPER_KEY) || 'figma:asset/4d05b3618583678157cf3e4c1d9c5d67cca8a7e3.png';
  });

  const [openFolders, setOpenFolders] = useState<FolderWindow[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    type: 'desktop',
  });

  // Persist items to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Persist wallpaper to localStorage
  useEffect(() => {
    localStorage.setItem(WALLPAPER_KEY, wallpaper);
  }, [wallpaper]);

  const addItem = (item: Omit<DesktopItem, 'id'>) => {
    const newItem: DesktopItem = {
      ...item,
      id: Date.now().toString(),
    };
    setItems((prev) => [...prev, newItem]);
  };

  const openFolder = (folderId: string) => {
    const folder = items.find((item) => item.id === folderId);
    if (!folder) return;

    const alreadyOpen = openFolders.find((f) => f.id === folderId);
    if (alreadyOpen) {
      bringToFront(folderId);
      return;
    }

    const newFolder: FolderWindow = {
      id: folderId,
      name: folder.name,
      x: 100 + openFolders.length * 30,
      y: 100 + openFolders.length * 30,
      width: 600,
      height: 400,
      zIndex: openFolders.length + 1,
      isMinimized: false,
      isFullscreen: false,
    };
    setOpenFolders((prev) => [...prev, newFolder]);
  };

  const closeFolder = (folderId: string) => {
    setOpenFolders((prev) => prev.filter((f) => f.id !== folderId));
  };

  const bringToFront = (folderId: string) => {
    setOpenFolders((prev) => {
      const maxZ = Math.max(...prev.map((f) => f.zIndex));
      return prev.map((f) =>
        f.id === folderId ? { ...f, zIndex: maxZ + 1 } : f
      );
    });
  };

  const updateFolderPosition = (folderId: string, x: number, y: number) => {
    setOpenFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, x, y } : f))
    );
  };

  const updateItemPosition = (itemId: string, x: number, y: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, x, y } : item))
    );
  };

  const toggleMinimize = (folderId: string) => {
    setOpenFolders((prev) =>
      prev.map((f) =>
        f.id === folderId ? { ...f, isMinimized: !f.isMinimized } : f
      )
    );
  };

  const toggleFullscreen = (folderId: string) => {
    setOpenFolders((prev) =>
      prev.map((f) =>
        f.id === folderId ? { ...f, isFullscreen: !f.isFullscreen } : f
      )
    );
  };

  const deleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const renameItem = (itemId: string, newName: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, name: newName } : item))
    );
  };

  return {
    items: [...items, ...githubItems],
    openFolders,
    selectedItemId,
    wallpaper,
    editMode,
    contextMenu,
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
