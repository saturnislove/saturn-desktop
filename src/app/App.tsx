import { useState, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { useDesktopState } from './hooks/useDesktopState';
import { DesktopIcon } from './components/DesktopIcon';
import { FolderWindow } from './components/FolderWindow';
import { ContextMenu } from './components/ContextMenu';
import { ImagePreviewModal } from './components/ImagePreviewModal';
import { FilePreviewModal } from './components/FilePreviewModal';
import { FileUploadHandler } from './components/FileUploadHandler';
import { RenameModal } from './components/RenameModal';
import { Dock } from './components/Dock';
import { MenuBar } from './components/MenuBar';
import { DesktopItem } from './types';
import wallpaperImage from 'figma:asset/4d05b3618583678157cf3e4c1d9c5d67cca8a7e3.png';

export default function App() {
  const {
    items,
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
  } = useDesktopState();

  const [imagePreview, setImagePreview] = useState<{
    visible: boolean;
    imageUrl: string | null;
    imageName: string | null;
  }>({
    visible: false,
    imageUrl: null,
    imageName: null,
  });

  const [filePreview, setFilePreview] = useState<{
    visible: boolean;
    fileUrl: string | null;
    fileName: string | null;
    fileType: string | null;
  }>({
    visible: false,
    fileUrl: null,
    fileName: null,
    fileType: null,
  });

  const [renameModal, setRenameModal] = useState<{
    visible: boolean;
    itemId: string | null;
    currentName: string;
  }>({
    visible: false,
    itemId: null,
    currentName: '',
  });

  const [dragOver, setDragOver] = useState(false);
  const [currentContextFolderId, setCurrentContextFolderId] = useState<
    string | null
  >(null);
  const [currentContextItemId, setCurrentContextItemId] = useState<
    string | null
  >(null);
  const wallpaperInputRef = useRef<(() => void) | null>(null);
  const imageInputRef = useRef<(() => void) | null>(null);
  const fileInputRef = useRef<(() => void) | null>(null);

  // Desktop items only (not in folders)
  const desktopItems = items.filter((item) => item.parentId === null);
  
  // Minimized folders
  const minimizedFolders = openFolders.filter((f) => f.isMinimized);

  // Handle desktop click (deselect)
  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedItemId(null);
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  // Handle desktop context menu
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!editMode) return;

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      type: 'desktop',
    });
    setCurrentContextFolderId(null);
    setCurrentContextItemId(null);
  };

  // Handle folder context menu
  const handleFolderContextMenu = (e: React.MouseEvent, folderId: string) => {
    e.preventDefault();
    if (!editMode) return;

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      type: 'folder',
      folderId,
    });
    setCurrentContextFolderId(folderId);
    setCurrentContextItemId(null);
  };

  // Handle item context menu
  const handleItemContextMenu = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editMode) return;

    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      type: 'item',
      itemId,
    });
    setCurrentContextItemId(itemId);
    setSelectedItemId(itemId);
  };

  // Handle icon click
  const handleIconClick = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  // Handle icon double click
  const handleIconDoubleClick = (item: DesktopItem) => {
    if (item.type === 'folder') {
      openFolder(item.id);
    } else if (item.type === 'image') {
      setImagePreview({
        visible: true,
        imageUrl: item.imageUrl || null,
        imageName: item.name,
      });
    } else if (item.type === 'file') {
      // Preview file
      setFilePreview({
        visible: true,
        fileUrl: item.fileUrl || null,
        fileName: item.name,
        fileType: item.fileType || null,
      });
    }
  };

  // Create new folder
  const handleNewFolder = () => {
    const parentId = currentContextFolderId;
    const name = `New Folder`;

    // Find first available grid position
    let x = 1;
    let y = 1;
    const occupiedPositions = items
      .filter((item) => item.parentId === parentId)
      .map((item) => `${item.x}-${item.y}`);

    while (occupiedPositions.includes(`${x}-${y}`)) {
      y++;
      if (y > 5) {
        y = 1;
        x++;
      }
    }

    addItem({
      name,
      type: 'folder',
      x,
      y,
      parentId,
    });
  };

  // Upload image
  const handleUploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      const parentId = currentContextFolderId;

      // Find first available grid position
      let x = 1;
      let y = 1;
      const occupiedPositions = items
        .filter((item) => item.parentId === parentId)
        .map((item) => `${item.x}-${item.y}`);

      while (occupiedPositions.includes(`${x}-${y}`)) {
        y++;
        if (y > 5) {
          y = 1;
          x++;
        }
      }

      addItem({
        name: file.name,
        type: 'image',
        x,
        y,
        parentId,
        imageUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  // Upload file
  const handleUploadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileUrl = e.target?.result as string;
      const parentId = currentContextFolderId;

      // Find first available grid position
      let x = 1;
      let y = 1;
      const occupiedPositions = items
        .filter((item) => item.parentId === parentId)
        .map((item) => `${item.x}-${item.y}`);

      while (occupiedPositions.includes(`${x}-${y}`)) {
        y++;
        if (y > 5) {
          y = 1;
          x++;
        }
      }

      addItem({
        name: file.name,
        type: 'file',
        x,
        y,
        parentId,
        fileUrl,
        fileType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  // Change wallpaper
  const handleChangeWallpaper = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setWallpaper(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  // Rename item
  const handleRenameStart = () => {
    if (!currentContextItemId) return;
    const item = items.find((i) => i.id === currentContextItemId);
    if (!item) return;

    setRenameModal({
      visible: true,
      itemId: currentContextItemId,
      currentName: item.name,
    });
  };

  const handleRenameComplete = (newName: string) => {
    if (renameModal.itemId) {
      renameItem(renameModal.itemId, newName);
    }
  };

  // Delete item
  const handleDelete = () => {
    if (!currentContextItemId) return;
    deleteItem(currentContextItemId);
    setSelectedItemId(null);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (editMode) {
      setDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    if (!editMode) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        handleUploadImage(file);
      } else {
        handleUploadFile(file);
      }
    }
  };

  const handleItemDragEnd = (itemId: string, x: number, y: number) => {
    updateItemPosition(itemId, x, y);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{
        backgroundImage: `url(${wallpaper === 'figma:asset/4d05b3618583678157cf3e4c1d9c5d67cca8a7e3.png' ? wallpaperImage : wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* macOS Menu Bar */}
      <MenuBar />

      {/* Drag overlay */}
      {dragOver && (
        <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm border-4 border-blue-500 border-dashed z-[9998] flex items-center justify-center">
          <div className="text-white text-2xl font-semibold">
            Drop file to upload
          </div>
        </div>
      )}

      {/* Desktop Icons Grid */}
      <div
        className="absolute left-6 right-6 bottom-6"
        style={{
          top: 'calc(2.5rem + env(safe-area-inset-top, 0px))',
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 90px)',
          gridTemplateRows: 'repeat(20, 100px)',
          gap: '12px',
          alignContent: 'start',
          justifyContent: 'start',
        }}
      >
        {desktopItems.map((item) => (
          <DesktopIcon
            key={item.id}
            item={item}
            isSelected={selectedItemId === item.id}
            onClick={() => handleIconClick(item.id)}
            onDoubleClick={() => handleIconDoubleClick(item)}
            onContextMenu={(e) => handleItemContextMenu(e, item.id)}
            onDragEnd={(x, y) => handleItemDragEnd(item.id, x, y)}
          />
        ))}
      </div>

      {/* Folder Windows */}
      <AnimatePresence>
        {openFolders.map((folder) => (
          <FolderWindow
            key={folder.id}
            folder={folder}
            items={items}
            selectedItemId={selectedItemId}
            onClose={() => closeFolder(folder.id)}
            onBringToFront={() => bringToFront(folder.id)}
            onUpdatePosition={(x, y) => updateFolderPosition(folder.id, x, y)}
            onToggleMinimize={() => toggleMinimize(folder.id)}
            onToggleFullscreen={() => toggleFullscreen(folder.id)}
            onItemClick={handleIconClick}
            onItemDoubleClick={handleIconDoubleClick}
            onItemContextMenu={handleItemContextMenu}
            onContextMenu={handleFolderContextMenu}
            onItemDragEnd={handleItemDragEnd}
          />
        ))}
      </AnimatePresence>

      {/* Dock with minimized windows */}
      <Dock
        minimizedFolders={minimizedFolders}
        onRestore={(folderId) => toggleMinimize(folderId)}
      />

      {/* File Upload Handlers */}
      <FileUploadHandler onFileSelect={handleChangeWallpaper}>
        {({ openFilePicker }) => {
          wallpaperInputRef.current = openFilePicker;
          return null;
        }}
      </FileUploadHandler>

      <FileUploadHandler onFileSelect={handleUploadImage} accept="image/*">
        {({ openFilePicker }) => {
          imageInputRef.current = openFilePicker;
          return null;
        }}
      </FileUploadHandler>

      <FileUploadHandler onFileSelect={handleUploadFile} accept="*/*">
        {({ openFilePicker }) => {
          fileInputRef.current = openFilePicker;
          return null;
        }}
      </FileUploadHandler>

      {/* Context Menu */}
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        type={contextMenu.type}
        editMode={editMode}
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        onChangeWallpaper={() => wallpaperInputRef.current?.()}
        onNewFolder={handleNewFolder}
        onUploadImage={() => imageInputRef.current?.()}
        onUploadFile={() => fileInputRef.current?.()}
        onRename={handleRenameStart}
        onDelete={handleDelete}
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        visible={imagePreview.visible}
        imageUrl={imagePreview.imageUrl}
        imageName={imagePreview.imageName}
        onClose={() =>
          setImagePreview({ visible: false, imageUrl: null, imageName: null })
        }
      />

      {/* File Preview Modal */}
      <FilePreviewModal
        visible={filePreview.visible}
        fileUrl={filePreview.fileUrl}
        fileName={filePreview.fileName}
        fileType={filePreview.fileType}
        onClose={() =>
          setFilePreview({
            visible: false,
            fileUrl: null,
            fileName: null,
            fileType: null,
          })
        }
      />

      {/* Rename Modal */}
      <RenameModal
        visible={renameModal.visible}
        currentName={renameModal.currentName}
        onClose={() =>
          setRenameModal({ visible: false, itemId: null, currentName: '' })
        }
        onRename={handleRenameComplete}
      />
    </div>
  );
}