import { create } from 'zustand'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ToolCategory = 'select' | 'transform' | 'paint' | 'retouch' | 'vector' | 'text' | 'ai'

export interface Tool {
  id: string
  name: string
  shortcut: string
  category: ToolCategory
  icon?: string
}

export interface Layer {
  id: string
  name: string
  type: 'image' | 'text' | 'shape' | 'adjustment' | 'group'
  visible: boolean
  locked: boolean
  opacity: number
  blendMode: BlendMode
  data: ImageData | null
  preview: string | null
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
  
  // Layer effects
  effects?: LayerEffects
  
  // Layer mask
  mask?: {
    data: ImageData | null
    preview: string | null
    enabled: boolean
  }
  
  // Text properties
  text?: {
    content: string
    fontSize: number
    fontFamily: string
    fontWeight: string
    color: string
    align: 'left' | 'center' | 'right'
    lineHeight: number
    letterSpacing: number
  }
  
  // Shape properties
  shape?: {
    type: 'rectangle' | 'ellipse' | 'polygon' | 'line' | 'custom'
    fill: string
    stroke: string
    strokeWidth: number
    cornerRadius?: number
    sides?: number
  }
  
  // Group children
  children?: string[]
  parentId?: string
}

export interface LayerEffects {
  dropShadow?: {
    enabled: boolean
    x: number
    y: number
    blur: number
    spread: number
    color: string
    opacity: number
  }
  outerGlow?: {
    enabled: boolean
    blur: number
    spread: number
    color: string
    opacity: number
  }
  innerGlow?: {
    enabled: boolean
    blur: number
    color: string
    opacity: number
  }
  bevel?: {
    enabled: boolean
    style: 'inner' | 'outer'
    depth: number
    direction: 'up' | 'down'
    size: number
    soften: number
    angle: number
    altitude: number
    highlightColor: string
    shadowColor: string
  }
  stroke?: {
    enabled: boolean
    size: number
    position: 'inside' | 'center' | 'outside'
    color: string
    opacity: number
  }
}

export type BlendMode = 
  | 'normal' | 'dissolve'
  | 'darken' | 'multiply' | 'color-burn' | 'linear-burn' | 'darker-color'
  | 'lighten' | 'screen' | 'color-dodge' | 'linear-dodge' | 'lighter-color'
  | 'overlay' | 'soft-light' | 'hard-light' | 'vivid-light' | 'linear-light' | 'pin-light' | 'hard-mix'
  | 'difference' | 'exclusion' | 'subtract' | 'divide'
  | 'hue' | 'saturation' | 'color' | 'luminosity'

export interface Selection {
  x: number
  y: number
  width: number
  height: number
  type: 'rectangle' | 'ellipse' | 'lasso' | 'polygon' | 'magic-wand'
  path?: { x: number; y: number }[]
  feather?: number
  antiAlias?: boolean
}

export interface HistoryEntry {
  id: string
  action: string
  layers: Layer[]
  timestamp: number
  thumbnail?: string
}

export interface Adjustments {
  // Light
  exposure: number
  contrast: number
  highlights: number
  shadows: number
  whites: number
  blacks: number
  
  // Color
  temperature: number
  tint: number
  vibrance: number
  saturation: number
  
  // Presence
  clarity: number
  dehaze: number
  sharpen: number
  
  // Curves (simplified - array of points)
  curvesRGB: Array<{ x: number; y: number }>
  curvesR: Array<{ x: number; y: number }>
  curvesG: Array<{ x: number; y: number }>
  curvesB: Array<{ x: number; y: number }>
  
  // Levels
  levelsInputBlack: number
  levelsInputWhite: number
  levelsInputGamma: number
  levelsOutputBlack: number
  levelsOutputWhite: number
  
  // Color Balance
  colorBalanceShadows: { cyanRed: number; magentaGreen: number; yellowBlue: number }
  colorBalanceMidtones: { cyanRed: number; magentaGreen: number; yellowBlue: number }
  colorBalanceHighlights: { cyanRed: number; magentaGreen: number; yellowBlue: number }
  
  // HSL
  hue: number
  lightness: number
}

export interface BrushSettings {
  size: number
  hardness: number
  opacity: number
  flow: number
  spacing: number
  angle: number
  roundness: number
  scatter: number
  jitter: number
  pressureSensitivity: boolean
  buildUp: boolean
  airbrush: boolean
}

export interface EditorState {
  // Layers
  layers: Layer[]
  activeLayerId: string | null
  layerGroups: Map<string, string[]>
  
  // Tools
  activeTool: string
  previousTool: string
  
  // Colors
  primaryColor: string
  secondaryColor: string
  colorHistory: string[]
  
  // Brush Settings
  brushSettings: BrushSettings
  eraserSettings: BrushSettings
  cloneSource: { x: number; y: number; layerId: string } | null
  
  // Canvas
  canvasSize: { width: number; height: number }
  zoom: number
  panOffset: { x: number; y: number }
  rotation: number
  
  // Selection
  selection: Selection | null
  selectionPath: { x: number; y: number }[] | null
  
  // History
  history: HistoryEntry[]
  historyIndex: number
  maxHistory: number
  
  // UI State
  showGrid: boolean
  showRulers: boolean
  showGuides: boolean
  gridSize: number
  snapToGrid: boolean
  snapToGuides: boolean
  snapToEdges: boolean
  rulerUnit: 'px' | 'in' | 'cm' | 'mm'
  
  // Panels
  leftPanelWidth: number
  rightPanelWidth: number
  leftPanelTab: string
  rightPanelTab: string
  showLeftPanel: boolean
  showRightPanel: boolean
  showTimeline: boolean
  showCommandPalette: boolean
  
  // File
  fileName: string
  hasUnsavedChanges: boolean
  originalImage: string | null
  dpi: number
  
  // Adjustments (current layer)
  adjustments: Adjustments
  
  // Filter presets
  activeFilterPreset: string
  
  // Timeline/History panel
  timelineExpanded: boolean
  
  // Canvas mode
  canvasMode: 'edit' | 'transform' | 'crop'
  transformHandles: {
    active: boolean
    type: 'scale' | 'rotate' | 'skew' | 'distort' | 'perspective' | 'warp'
  }
  
  // Tool options
  shapeToolType: 'rectangle' | 'ellipse' | 'polygon' | 'line' | 'custom'
  polygonSides: number
  lineArrowStart: boolean
  lineArrowEnd: boolean
  
  // Text tool
  textEditing: boolean
  activeTextLayerId: string | null
  
  // AI processing
  aiProcessing: boolean
  aiTask: string | null
  
  // ============================================================================
  // ACTIONS
  // ============================================================================
  
  // Layer actions
  addLayer: (layer: Omit<Layer, 'id'>) => string
  removeLayer: (id: string) => void
  updateLayer: (id: string, updates: Partial<Layer>) => void
  setActiveLayer: (id: string | null) => void
  reorderLayers: (startIndex: number, endIndex: number) => void
  duplicateLayer: (id: string) => string | null
  mergeDown: (id: string) => void
  mergeVisible: () => void
  flattenImage: () => void
  groupLayers: (ids: string[]) => string | null
  ungroupLayer: (id: string) => void
  moveLayerToGroup: (layerId: string, groupId: string | null) => void
  
  // Layer effects
  setLayerEffect: (layerId: string, effect: keyof LayerEffects, settings: Partial<LayerEffects[keyof LayerEffects]>) => void
  removeLayerEffect: (layerId: string, effect: keyof LayerEffects) => void
  
  // Layer mask
  addLayerMask: (layerId: string) => void
  removeLayerMask: (layerId: string) => void
  toggleLayerMask: (layerId: string) => void
  
  // Tool actions
  setActiveTool: (tool: string) => void
  setPreviousTool: (tool: string) => void
  
  // Color actions
  setPrimaryColor: (color: string) => void
  setSecondaryColor: (color: string) => void
  swapColors: () => void
  addToColorHistory: (color: string) => void
  
  // Brush actions
  setBrushSettings: (settings: Partial<BrushSettings>) => void
  setEraserSettings: (settings: Partial<BrushSettings>) => void
  setCloneSource: (source: { x: number; y: number; layerId: string } | null) => void
  
  // Canvas actions
  setCanvasSize: (size: { width: number; height: number }) => void
  setZoom: (zoom: number) => void
  setPanOffset: (offset: { x: number; y: number }) => void
  setRotation: (rotation: number) => void
  resetView: () => void
  fitToScreen: () => void
  actualSize: () => void
  
  // Selection actions
  setSelection: (selection: Selection | null) => void
  setSelectionPath: (path: { x: number; y: number }[] | null) => void
  clearSelection: () => void
  selectAll: () => void
  invertSelection: () => void
  featherSelection: (radius: number) => void
  
  // History actions
  saveToHistory: (action: string) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  clearHistory: () => void
  
  // UI actions
  toggleGrid: () => void
  toggleRulers: () => void
  toggleGuides: () => void
  setGridSize: (size: number) => void
  setSnapToGrid: (snap: boolean) => void
  setSnapToGuides: (snap: boolean) => void
  setRulerUnit: (unit: 'px' | 'in' | 'cm' | 'mm') => void
  setLeftPanelWidth: (width: number) => void
  setRightPanelWidth: (width: number) => void
  setLeftPanelTab: (tab: string) => void
  setRightPanelTab: (tab: string) => void
  toggleLeftPanel: () => void
  toggleRightPanel: () => void
  toggleTimeline: () => void
  toggleCommandPalette: () => void
  
  // File actions
  setFileName: (name: string) => void
  setHasUnsavedChanges: (value: boolean) => void
  setOriginalImage: (image: string | null) => void
  setDpi: (dpi: number) => void
  newCanvas: (width: number, height: number, fill?: string, dpi?: number) => void
  loadImage: (imageData: string, width: number, height: number) => void
  
  // Adjustment actions
  setAdjustment: (key: keyof Adjustments, value: Adjustments[keyof Adjustments]) => void
  setAdjustments: (adjustments: Partial<Adjustments>) => void
  resetAdjustments: () => void
  
  // Filter actions
  setActiveFilterPreset: (preset: string) => void
  
  // Timeline actions
  setTimelineExpanded: (expanded: boolean) => void
  
  // Canvas mode
  setCanvasMode: (mode: 'edit' | 'transform' | 'crop') => void
  setTransformHandles: (handles: EditorState['transformHandles']) => void
  
  // Tool options
  setShapeToolType: (type: EditorState['shapeToolType']) => void
  setPolygonSides: (sides: number) => void
  
  // Text
  setTextEditing: (editing: boolean) => void
  setActiveTextLayerId: (id: string | null) => void
  
  // AI
  setAIProcessing: (processing: boolean) => void
  setAITask: (task: string | null) => void
}

// ============================================================================
// HELPERS
// ============================================================================

const generateId = () => Math.random().toString(36).substring(2, 11)

const defaultBrushSettings: BrushSettings = {
  size: 20,
  hardness: 100,
  opacity: 100,
  flow: 100,
  spacing: 25,
  angle: 0,
  roundness: 100,
  scatter: 0,
  jitter: 0,
  pressureSensitivity: true,
  buildUp: false,
  airbrush: false,
}

const defaultAdjustments: Adjustments = {
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  temperature: 0,
  tint: 0,
  vibrance: 0,
  saturation: 0,
  clarity: 0,
  dehaze: 0,
  sharpen: 0,
  curvesRGB: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
  curvesR: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
  curvesG: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
  curvesB: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
  levelsInputBlack: 0,
  levelsInputWhite: 255,
  levelsInputGamma: 1.0,
  levelsOutputBlack: 0,
  levelsOutputWhite: 255,
  colorBalanceShadows: { cyanRed: 0, magentaGreen: 0, yellowBlue: 0 },
  colorBalanceMidtones: { cyanRed: 0, magentaGreen: 0, yellowBlue: 0 },
  colorBalanceHighlights: { cyanRed: 0, magentaGreen: 0, yellowBlue: 0 },
  hue: 0,
  lightness: 0,
}

// ============================================================================
// STORE
// ============================================================================

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  layers: [],
  activeLayerId: null,
  layerGroups: new Map(),
  
  activeTool: 'move',
  previousTool: 'move',
  
  primaryColor: '#00ffff',
  secondaryColor: '#ff0066',
  colorHistory: [],
  
  brushSettings: { ...defaultBrushSettings },
  eraserSettings: { ...defaultBrushSettings, hardness: 100, opacity: 100 },
  cloneSource: null,
  
  canvasSize: { width: 1920, height: 1080 },
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  rotation: 0,
  
  selection: null,
  selectionPath: null,
  
  history: [],
  historyIndex: -1,
  maxHistory: 50,
  
  showGrid: false,
  showRulers: true,
  showGuides: true,
  gridSize: 50,
  snapToGrid: true,
  snapToGuides: true,
  snapToEdges: true,
  rulerUnit: 'px',
  
  leftPanelWidth: 280,
  rightPanelWidth: 300,
  leftPanelTab: 'tools',
  rightPanelTab: 'layers',
  showLeftPanel: true,
  showRightPanel: true,
  showTimeline: true,
  showCommandPalette: false,
  
  fileName: 'Untitled',
  hasUnsavedChanges: false,
  originalImage: null,
  dpi: 72,
  
  adjustments: { ...defaultAdjustments },
  activeFilterPreset: 'none',
  timelineExpanded: false,
  
  canvasMode: 'edit',
  transformHandles: {
    active: false,
    type: 'scale',
  },
  
  shapeToolType: 'rectangle',
  polygonSides: 5,
  lineArrowStart: false,
  lineArrowEnd: false,
  
  textEditing: false,
  activeTextLayerId: null,
  
  aiProcessing: false,
  aiTask: null,
  
  // ============================================================================
  // LAYER ACTIONS
  // ============================================================================
  
  addLayer: (layer) => {
    const id = generateId()
    const newLayer: Layer = {
      ...layer,
      id,
      name: layer.name || `Layer ${get().layers.length + 1}`,
    }
    set((state) => ({
      layers: [newLayer, ...state.layers],
      activeLayerId: id,
      hasUnsavedChanges: true,
    }))
    get().saveToHistory('Add Layer')
    return id
  },
  
  removeLayer: (id) => {
    set((state) => {
      const newLayers = state.layers.filter((l) => l.id !== id)
      const newActiveId = state.activeLayerId === id
        ? (newLayers[0]?.id || null)
        : state.activeLayerId
      return {
        layers: newLayers,
        activeLayerId: newActiveId,
        hasUnsavedChanges: true,
      }
    })
    get().saveToHistory('Remove Layer')
  },
  
  updateLayer: (id, updates) => {
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
      hasUnsavedChanges: true,
    }))
  },
  
  setActiveLayer: (id) => set({ activeLayerId: id }),
  
  reorderLayers: (startIndex, endIndex) => {
    set((state) => {
      const newLayers = [...state.layers]
      const [removed] = newLayers.splice(startIndex, 1)
      newLayers.splice(endIndex, 0, removed)
      return { layers: newLayers, hasUnsavedChanges: true }
    })
    get().saveToHistory('Reorder Layers')
  },
  
  duplicateLayer: (id) => {
    const state = get()
    const layer = state.layers.find((l) => l.id === id)
    if (layer) {
      const newId = generateId()
      const newLayer: Layer = {
        ...layer,
        id: newId,
        name: `${layer.name} copy`,
      }
      const index = state.layers.findIndex((l) => l.id === id)
      const newLayers = [...state.layers]
      newLayers.splice(index, 0, newLayer)
      set({ layers: newLayers, activeLayerId: newId, hasUnsavedChanges: true })
      get().saveToHistory('Duplicate Layer')
      return newId
    }
    return null
  },
  
  mergeDown: (id) => {
    const state = get()
    const index = state.layers.findIndex((l) => l.id === id)
    if (index < state.layers.length - 1) {
      // Merge logic would go here with canvas operations
      set((state) => ({
        layers: state.layers.filter((l) => l.id !== id),
        hasUnsavedChanges: true,
      }))
      get().saveToHistory('Merge Down')
    }
  },
  
  mergeVisible: () => {
    // Merge all visible layers into one
    get().saveToHistory('Merge Visible')
  },
  
  flattenImage: () => {
    // Flatten all layers
    get().saveToHistory('Flatten Image')
  },
  
  groupLayers: (ids) => {
    const state = get()
    const groupId = generateId()
    const groupLayer: Layer = {
      id: groupId,
      name: 'Group',
      type: 'group',
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: 'normal',
      data: null,
      preview: null,
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
      rotation: 0,
      children: ids,
    }
    
    const newLayers = state.layers.map(l => 
      ids.includes(l.id) ? { ...l, parentId: groupId } : l
    )
    
    set((state) => ({
      layers: [groupLayer, ...newLayers.filter(l => !ids.includes(l.id))],
      layerGroups: new Map(state.layerGroups).set(groupId, ids),
      hasUnsavedChanges: true,
    }))
    get().saveToHistory('Group Layers')
    return groupId
  },
  
  ungroupLayer: (id) => {
    set((state) => {
      const group = state.layers.find(l => l.id === id)
      if (group?.type === 'group' && group.children) {
        const newLayers = state.layers
          .filter(l => l.id !== id)
          .map(l => l.parentId === id ? { ...l, parentId: undefined } : l)
        const newGroups = new Map(state.layerGroups)
        newGroups.delete(id)
        return { layers: newLayers, layerGroups: newGroups, hasUnsavedChanges: true }
      }
      return state
    })
    get().saveToHistory('Ungroup Layers')
  },
  
  moveLayerToGroup: (layerId, groupId) => {
    set((state) => ({
      layers: state.layers.map(l => 
        l.id === layerId ? { ...l, parentId: groupId || undefined } : l
      ),
      hasUnsavedChanges: true,
    }))
  },
  
  // ============================================================================
  // LAYER EFFECTS
  // ============================================================================
  
  setLayerEffect: (layerId, effect, settings) => {
    set((state) => ({
      layers: state.layers.map(l => 
        l.id === layerId 
          ? { ...l, effects: { ...l.effects, [effect]: { ...l.effects?.[effect], ...settings, enabled: true } } }
          : l
      ),
      hasUnsavedChanges: true,
    }))
  },
  
  removeLayerEffect: (layerId, effect) => {
    set((state) => ({
      layers: state.layers.map(l => {
        if (l.id === layerId && l.effects) {
          const newEffects = { ...l.effects }
          delete newEffects[effect]
          return { ...l, effects: newEffects }
        }
        return l
      }),
      hasUnsavedChanges: true,
    }))
  },
  
  // ============================================================================
  // LAYER MASK
  // ============================================================================
  
  addLayerMask: (layerId) => {
    set((state) => ({
      layers: state.layers.map(l => 
        l.id === layerId 
          ? { ...l, mask: { data: null, preview: null, enabled: true } }
          : l
      ),
      hasUnsavedChanges: true,
    }))
    get().saveToHistory('Add Layer Mask')
  },
  
  removeLayerMask: (layerId) => {
    set((state) => ({
      layers: state.layers.map(l => {
        if (l.id === layerId) {
          const { mask: _, ...rest } = l as Layer & { mask?: Layer['mask'] }
          return { ...rest, mask: undefined }
        }
        return l
      }),
      hasUnsavedChanges: true,
    }))
    get().saveToHistory('Remove Layer Mask')
  },
  
  toggleLayerMask: (layerId) => {
    set((state) => ({
      layers: state.layers.map(l => 
        l.id === layerId && l.mask
          ? { ...l, mask: { ...l.mask, enabled: !l.mask.enabled } }
          : l
      ),
      hasUnsavedChanges: true,
    }))
  },
  
  // ============================================================================
  // TOOL ACTIONS
  // ============================================================================
  
  setActiveTool: (tool) => set((state) => ({ 
    activeTool: tool, 
    previousTool: state.activeTool 
  })),
  
  setPreviousTool: (tool) => set({ previousTool: tool }),
  
  // ============================================================================
  // COLOR ACTIONS
  // ============================================================================
  
  setPrimaryColor: (color) => {
    set({ primaryColor: color })
    get().addToColorHistory(color)
  },
  
  setSecondaryColor: (color) => {
    set({ secondaryColor: color })
    get().addToColorHistory(color)
  },
  
  swapColors: () => set((state) => ({
    primaryColor: state.secondaryColor,
    secondaryColor: state.primaryColor,
  })),
  
  addToColorHistory: (color) => {
    set((state) => ({
      colorHistory: [color, ...state.colorHistory.filter(c => c !== color)].slice(0, 20),
    }))
  },
  
  // ============================================================================
  // BRUSH ACTIONS
  // ============================================================================
  
  setBrushSettings: (settings) => set((state) => ({
    brushSettings: { ...state.brushSettings, ...settings },
  })),
  
  setEraserSettings: (settings) => set((state) => ({
    eraserSettings: { ...state.eraserSettings, ...settings },
  })),
  
  setCloneSource: (source) => set({ cloneSource: source }),
  
  // ============================================================================
  // CANVAS ACTIONS
  // ============================================================================
  
  setCanvasSize: (size) => set({ canvasSize: size, hasUnsavedChanges: true }),
  
  setZoom: (zoom) => set({ zoom: Math.max(0.05, Math.min(32, zoom)) }),
  
  setPanOffset: (offset) => set({ panOffset: offset }),
  
  setRotation: (rotation) => set({ rotation: rotation % 360 }),
  
  resetView: () => set({ zoom: 1, panOffset: { x: 0, y: 0 }, rotation: 0 }),
  
  fitToScreen: () => {
    // Calculate fit to screen zoom
    const state = get()
    // This would need viewport dimensions to calculate
    set({ zoom: 0.5, panOffset: { x: 0, y: 0 } })
  },
  
  actualSize: () => set({ zoom: 1, panOffset: { x: 0, y: 0 } }),
  
  // ============================================================================
  // SELECTION ACTIONS
  // ============================================================================
  
  setSelection: (selection) => set({ selection }),
  
  setSelectionPath: (path) => set({ selectionPath: path }),
  
  clearSelection: () => set({ selection: null, selectionPath: null }),
  
  selectAll: () => {
    const state = get()
    set({
      selection: {
        x: 0,
        y: 0,
        width: state.canvasSize.width,
        height: state.canvasSize.height,
        type: 'rectangle',
      },
    })
  },
  
  invertSelection: () => {
    const state = get()
    if (state.selection) {
      // Invert selection - create inverse bounding box
      const invertedSelection = {
        x: 0,
        y: 0,
        width: state.canvasSize.width - state.selection.width,
        height: state.canvasSize.height - state.selection.height,
        type: state.selection.type,
        feather: state.selection.feather,
        antiAlias: state.selection.antiAlias,
      }
      set({ selection: invertedSelection })
    } else {
      // If no selection, select all
      get().selectAll()
    }
  },
  
  featherSelection: (radius) => {
    set((state) => ({
      selection: state.selection ? { ...state.selection, feather: radius } : null,
    }))
  },
  
  // ============================================================================
  // HISTORY ACTIONS
  // ============================================================================
  
  saveToHistory: (action) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push({
        id: generateId(),
        action,
        layers: JSON.parse(JSON.stringify(state.layers)),
        timestamp: Date.now(),
      })
      // Limit history size
      if (newHistory.length > state.maxHistory) {
        newHistory.shift()
      }
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      }
    })
  },
  
  undo: () => {
    const state = get()
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1
      const entry = state.history[newIndex]
      set({
        layers: JSON.parse(JSON.stringify(entry.layers)),
        historyIndex: newIndex,
        hasUnsavedChanges: true,
      })
    }
  },
  
  redo: () => {
    const state = get()
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1
      const entry = state.history[newIndex]
      set({
        layers: JSON.parse(JSON.stringify(entry.layers)),
        historyIndex: newIndex,
        hasUnsavedChanges: true,
      })
    }
  },
  
  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
  
  clearHistory: () => set({ history: [], historyIndex: -1 }),
  
  // ============================================================================
  // UI ACTIONS
  // ============================================================================
  
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleRulers: () => set((state) => ({ showRulers: !state.showRulers })),
  toggleGuides: () => set((state) => ({ showGuides: !state.showGuides })),
  setGridSize: (size) => set({ gridSize: size }),
  setSnapToGrid: (snap) => set({ snapToGrid: snap }),
  setSnapToGuides: (snap) => set({ snapToGuides: snap }),
  setRulerUnit: (unit) => set({ rulerUnit: unit }),
  setLeftPanelWidth: (width) => set({ leftPanelWidth: width }),
  setRightPanelWidth: (width) => set({ rightPanelWidth: width }),
  setLeftPanelTab: (tab) => set({ leftPanelTab: tab }),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  toggleLeftPanel: () => set((state) => ({ showLeftPanel: !state.showLeftPanel })),
  toggleRightPanel: () => set((state) => ({ showRightPanel: !state.showRightPanel })),
  toggleTimeline: () => set((state) => ({ showTimeline: !state.showTimeline })),
  toggleCommandPalette: () => set((state) => ({ showCommandPalette: !state.showCommandPalette })),
  
  // ============================================================================
  // FILE ACTIONS
  // ============================================================================
  
  setFileName: (name) => set({ fileName: name }),
  setHasUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),
  setOriginalImage: (image) => set({ originalImage: image }),
  setDpi: (dpi) => set({ dpi: dpi }),
  
  newCanvas: (width, height, fill = '#1a1a1a', dpi = 72) => {
    const id = generateId()
    const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null
    if (canvas) {
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = fill
        ctx.fillRect(0, 0, width, height)
      }
    }
    
    const baseLayer: Layer = {
      id,
      name: 'Background',
      type: 'image',
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: 'normal',
      data: null,
      preview: canvas?.toDataURL() || null,
      position: { x: 0, y: 0 },
      size: { width, height },
      rotation: 0,
    }
    
    set({
      layers: [baseLayer],
      activeLayerId: id,
      canvasSize: { width, height },
      fileName: 'Untitled',
      hasUnsavedChanges: false,
      history: [],
      historyIndex: -1,
      originalImage: null,
      dpi: dpi,
      adjustments: { ...defaultAdjustments },
      zoom: 1,
      panOffset: { x: 0, y: 0 },
      rotation: 0,
    })
    get().saveToHistory('New Canvas')
  },
  
  loadImage: (imageData, width, height) => {
    const id = generateId()
    const baseLayer: Layer = {
      id,
      name: 'Background',
      type: 'image',
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: 'normal',
      data: null,
      preview: imageData,
      position: { x: 0, y: 0 },
      size: { width, height },
      rotation: 0,
    }
    
    set({
      layers: [baseLayer],
      activeLayerId: id,
      canvasSize: { width, height },
      hasUnsavedChanges: false,
      history: [],
      historyIndex: -1,
      originalImage: imageData,
      adjustments: { ...defaultAdjustments },
      zoom: 1,
      panOffset: { x: 0, y: 0 },
    })
    get().saveToHistory('Load Image')
  },
  
  // ============================================================================
  // ADJUSTMENT ACTIONS
  // ============================================================================
  
  setAdjustment: (key, value) => {
    set((state) => ({
      adjustments: { ...state.adjustments, [key]: value },
      hasUnsavedChanges: true,
    }))
  },
  
  setAdjustments: (adjustments) => {
    set((state) => ({
      adjustments: { ...state.adjustments, ...adjustments },
      hasUnsavedChanges: true,
    }))
  },
  
  resetAdjustments: () => set({ adjustments: { ...defaultAdjustments } }),
  
  // ============================================================================
  // FILTER ACTIONS
  // ============================================================================
  
  setActiveFilterPreset: (preset) => set({ activeFilterPreset: preset }),
  
  // ============================================================================
  // TIMELINE ACTIONS
  // ============================================================================
  
  setTimelineExpanded: (expanded) => set({ timelineExpanded: expanded }),
  
  // ============================================================================
  // CANVAS MODE
  // ============================================================================
  
  setCanvasMode: (mode) => set({ canvasMode: mode }),
  setTransformHandles: (handles) => set({ transformHandles: handles }),
  
  // ============================================================================
  // TOOL OPTIONS
  // ============================================================================
  
  setShapeToolType: (type) => set({ shapeToolType: type }),
  setPolygonSides: (sides) => set({ polygonSides: sides }),
  
  // ============================================================================
  // TEXT
  // ============================================================================
  
  setTextEditing: (editing) => set({ textEditing: editing }),
  setActiveTextLayerId: (id) => set({ activeTextLayerId: id }),
  
  // ============================================================================
  // AI
  // ============================================================================
  
  setAIProcessing: (processing) => set({ aiProcessing: processing }),
  setAITask: (task) => set({ aiTask: task }),
}))
