export interface DesktopItem {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'file';
  x: number;
  y: number;
  parentId: string | null; // null = on desktop, otherwise folder ID
  imageUrl?: string; // for image type
  fileUrl?: string; // for file type
  fileType?: string; // MIME type for file
}

export interface FolderWindow {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isFullscreen: boolean;
}

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  type: 'desktop' | 'folder' | 'item';
  folderId?: string;
  itemId?: string;
}