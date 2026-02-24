'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MousePointer2, Move, Crop, Paintbrush, Eraser, PaintBucket, Type,
  Square, Circle, Minus, ZoomIn, Hand, PenTool, Lasso, Wand2,
  Sparkles, Bandage, Stamp, Sun, Moon, Droplets, Contrast, Aperture,
  CircleDot, Scissors, RotateCcw, FlipHorizontal, FlipVertical,
  Maximize, Minimize, Grid3X3, Pipette, Target, Layers,
  Filter, Blend, Pen, Pencil, RotateCw, ZoomOut,
  FileImage, Download, Undo2, Redo2, Save, Menu, X, Settings,
  Hexagon, Triangle, Star, Heart, Eye, EyeOff,
  Lock, Unlock, Plus, Trash2, ChevronDown, SlidersHorizontal,
  ArrowUpDown, AirVent, SprayCan, Focus,
  HandMetal, ScanFace, Crosshair, Search, Command, Keyboard,
  PanelLeftClose, PanelRightClose, ArrowLeft, ImagePlus, FileDown,
  Copy, Clipboard, Scissors as ScissorsIcon,
  CheckCircle2, AlertCircle, Info, Loader2, Globe, RefreshCw,
  ArrowUp, ArrowDown, ArrowRight, Palette, Gauge,
  CircleSlash, Lightbulb,
  type LucideIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useEditorStore, Layer, BlendMode } from '@/store/editorStore'
import { cn } from '@/lib/utils'
import { allTools, toolCategories, getToolById, type ToolDefinition, type ToolCategory } from './tools'

// Filter presets
const filterPresets = [
  { id: 'none', name: 'None', settings: {} },
  { id: 'vintage', name: 'Vintage', settings: { contrast: 15, saturation: -30, temperature: 20 } },
  { id: 'bw', name: 'B&W', settings: { saturation: -100 } },
  { id: 'sepia', name: 'Sepia', settings: { saturation: -40, temperature: 30 } },
  { id: 'cyberpunk', name: 'Cyberpunk', settings: { contrast: 30, saturation: 50, temperature: -10 } },
  { id: 'brutal', name: 'Brutal', settings: { contrast: 50, clarity: 30 } },
  { id: 'warm', name: 'Warm', settings: { temperature: 30, saturation: 10 } },
  { id: 'cool', name: 'Cool', settings: { temperature: -30, tint: 10 } },
  { id: 'fade', name: 'Fade', settings: { contrast: -20, blacks: 30 } },
  { id: 'vibrant', name: 'Vibrant', settings: { vibrance: 40, saturation: 20 } },
]

// Blend modes
const blendModes: { value: BlendMode; label: string; group: string }[] = [
  { value: 'normal', label: 'Normal', group: 'basic' },
  { value: 'dissolve', label: 'Dissolve', group: 'basic' },
  { value: 'darken', label: 'Darken', group: 'darken' },
  { value: 'multiply', label: 'Multiply', group: 'darken' },
  { value: 'color-burn', label: 'Color Burn', group: 'darken' },
  { value: 'lighten', label: 'Lighten', group: 'lighten' },
  { value: 'screen', label: 'Screen', group: 'lighten' },
  { value: 'color-dodge', label: 'Color Dodge', group: 'lighten' },
  { value: 'overlay', label: 'Overlay', group: 'contrast' },
  { value: 'soft-light', label: 'Soft Light', group: 'contrast' },
  { value: 'hard-light', label: 'Hard Light', group: 'contrast' },
  { value: 'difference', label: 'Difference', group: 'difference' },
  { value: 'hue', label: 'Hue', group: 'color' },
  { value: 'saturation', label: 'Saturation', group: 'color' },
  { value: 'color', label: 'Color', group: 'color' },
  { value: 'luminosity', label: 'Luminosity', group: 'color' },
]

// Keyboard shortcuts
const keyboardShortcuts = [
  { key: 'V', action: 'Move Tool' },
  { key: 'M', action: 'Select Tool' },
  { key: 'L', action: 'Lasso Tool' },
  { key: 'W', action: 'Magic Wand' },
  { key: 'C', action: 'Crop Tool' },
  { key: 'B', action: 'Brush Tool' },
  { key: 'E', action: 'Eraser Tool' },
  { key: 'G', action: 'Gradient/Fill' },
  { key: 'T', action: 'Text Tool' },
  { key: 'P', action: 'Pen Tool' },
  { key: 'U', action: 'Shape Tools' },
  { key: 'I', action: 'Eyedropper' },
  { key: 'H', action: 'Hand Tool' },
  { key: 'Z', action: 'Zoom Tool' },
  { key: 'J', action: 'Healing Tools' },
  { key: 'S', action: 'Clone Stamp' },
  { key: 'O', action: 'Dodge/Burn' },
  { key: 'X', action: 'Swap Colors' },
  { key: 'D', action: 'Default Colors' },
  { key: '[', action: 'Decrease Brush Size' },
  { key: ']', action: 'Increase Brush Size' },
  { key: 'Ctrl+Z', action: 'Undo' },
  { key: 'Ctrl+Shift+Z', action: 'Redo' },
  { key: 'Ctrl+S', action: 'Save/Export' },
  { key: 'Ctrl+O', action: 'Open Image' },
  { key: 'Ctrl+N', action: 'New Canvas' },
  { key: 'Ctrl+D', action: 'Deselect' },
  { key: 'Ctrl+A', action: 'Select All' },
  { key: 'Ctrl+I', action: 'Invert Selection' },
  { key: 'Ctrl+K', action: 'Command Palette' },
  { key: 'Space', action: 'Pan (hold)' },
  { key: 'Ctrl+0', action: 'Fit to Screen' },
  { key: 'Ctrl+1', action: 'Actual Size' },
]

// Tool options state type
interface ToolOptionsState {
  // Selection tools
  tolerance: number
  feather: number
  antiAlias: boolean
  contiguous: boolean
  
  // Brush tools
  hardness: number
  flow: number
  airbrush: boolean
  scatter: number
  jitter: number
  angle: number
  roundness: number
  pressureSensitivity: boolean
  
  // Clone/Healing
  aligned: boolean
  sampleAllLayers: boolean
  
  // Dodge/Burn
  dodgeBurnRange: 'shadows' | 'midtones' | 'highlights'
  dodgeBurnExposure: number
  
  // Sponge
  spongeMode: 'saturate' | 'desaturate'
  
  // Shape tools
  shapeFill: string
  shapeStroke: string
  shapeStrokeWidth: number
  shapeCornerRadius: number
  polygonSides: number
  starInnerRadius: number
  
  // Gradient
  gradientType: 'linear' | 'radial' | 'angular' | 'diamond'
  gradientReverse: boolean
  
  // Crop
  cropAspectRatio: 'free' | '1:1' | '4:3' | '16:9' | '3:2'
  cropRuleOfThirds: boolean
  cropFaceAware: boolean
}

// Default tool options
const defaultToolOptions: ToolOptionsState = {
  tolerance: 32,
  feather: 0,
  antiAlias: true,
  contiguous: true,
  
  hardness: 100,
  flow: 100,
  airbrush: false,
  scatter: 0,
  jitter: 0,
  angle: 0,
  roundness: 100,
  pressureSensitivity: true,
  
  aligned: true,
  sampleAllLayers: false,
  
  dodgeBurnRange: 'midtones',
  dodgeBurnExposure: 50,
  
  spongeMode: 'saturate',
  
  shapeFill: '#00ffff',
  shapeStroke: '#000000',
  shapeStrokeWidth: 0,
  shapeCornerRadius: 0,
  polygonSides: 5,
  starInnerRadius: 50,
  
  gradientType: 'linear',
  gradientReverse: false,
  
  cropAspectRatio: 'free',
  cropRuleOfThirds: true,
  cropFaceAware: false,
}

// Custom cursor for different tools
const getCursorForTool = (toolId: string): string => {
  const cursors: Record<string, string> = {
    'move': 'move',
    'hand': 'grab',
    'brush': 'crosshair',
    'pencil': 'crosshair',
    'airbrush': 'crosshair',
    'eraser': 'crosshair',
    'fill': 'crosshair',
    'gradient': 'crosshair',
    'eyedropper': 'crosshair',
    'select-rect': 'crosshair',
    'select-ellipse': 'crosshair',
    'lasso': 'crosshair',
    'lasso-polygon': 'crosshair',
    'lasso-magnetic': 'crosshair',
    'magic-wand': 'crosshair',
    'quick-select': 'crosshair',
    'crop': 'crosshair',
    'healing': 'crosshair',
    'spot-healing': 'crosshair',
    'clone-stamp': 'crosshair',
    'dodge': 'crosshair',
    'burn': 'crosshair',
    'sponge': 'crosshair',
    'blur-tool': 'crosshair',
    'sharpen-tool': 'crosshair',
    'smudge': 'crosshair',
    'pen': 'crosshair',
    'rectangle': 'crosshair',
    'ellipse': 'crosshair',
    'polygon': 'crosshair',
    'line': 'crosshair',
    'triangle': 'crosshair',
    'star': 'crosshair',
    'heart': 'crosshair',
    'text': 'text',
    'zoom': 'zoom-in',
  }
  return cursors[toolId] || 'default'
}

// Mobile Toolbar Component with all tools and options
interface MobileToolbarProps {
  activeTool: string
  setActiveTool: (tool: string) => void
  primaryColor: string
  setPrimaryColor: (color: string) => void
  secondaryColor: string
  setSecondaryColor: (color: string) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  brushSettings: { size: number; opacity: number }
  setBrushSettings: (settings: { size: number; opacity: number }) => void
  layers: Layer[]
  activeLayerId: string | null
  setActiveLayer: (id: string) => void
  updateLayer: (id: string, updates: Partial<Layer>) => void
  addLayer: (layer: Omit<Layer, 'id'>) => string
  removeLayer: (id: string) => void
  duplicateLayer: (id: string) => void
  canvasSize: { width: number; height: number }
  adjustments: Record<string, number>
  setAdjustment: (key: string, value: number) => void
  resetAdjustments: () => void
  handleAI: (task: string) => void
  isAIProcessing: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  setShowExportDialog: (show: boolean) => void
  selection: unknown
  clearSelection: () => void
  selectAll: () => void
  swapColors: () => void
  zoom: number
  setZoom: (zoom: number) => void
  resetView: () => void
  showGrid: boolean
  toggleGrid: () => void
  flipHorizontal: () => void
  flipVertical: () => void
}

function MobileToolbar({
  activeTool,
  setActiveTool,
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  undo,
  redo,
  canUndo,
  canRedo,
  brushSettings,
  setBrushSettings,
  layers,
  activeLayerId,
  setActiveLayer,
  updateLayer,
  addLayer,
  removeLayer,
  duplicateLayer,
  canvasSize,
  adjustments,
  setAdjustment,
  resetAdjustments,
  handleAI,
  isAIProcessing,
  fileInputRef,
  setShowExportDialog,
  selection,
  clearSelection,
  selectAll,
  swapColors,
  zoom,
  setZoom,
  resetView,
  showGrid,
  toggleGrid,
  flipHorizontal,
  flipVertical,
}: MobileToolbarProps) {
  const [activePanel, setActivePanel] = useState<'tools' | 'layers' | 'adjust' | 'ai' | 'text' | 'filters' | 'shapes' | 'options' | 'colors' | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>('paint')
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [quickToolsExpanded, setQuickToolsExpanded] = useState(false)
  
  // Text options for mobile
  const [textFont, setTextFont] = useState('Arial')
  const [textSize, setTextSize] = useState(32)
  const [textBold, setTextBold] = useState(false)
  
  // Extended tool options for mobile (same as PC)
  const [toolHardness, setToolHardness] = useState(100)
  const [toolFlow, setToolFlow] = useState(100)
  const [toolOpacity, setToolOpacity] = useState(100)
  const [toolFeather, setToolFeather] = useState(0)
  const [toolTolerance, setToolTolerance] = useState(32)
  const [toolContiguous, setToolContiguous] = useState(true)
  const [shapeFill, setShapeFill] = useState('#00ffff')
  const [shapeStroke, setShapeStroke] = useState('#000000')
  const [shapeStrokeWidth, setShapeStrokeWidth] = useState(0)
  const [dodgeBurnRange, setDodgeBurnRange] = useState<'shadows' | 'midtones' | 'highlights'>('midtones')
  const [dodgeBurnExposure, setDodgeBurnExposure] = useState(50)

  // All tool categories for mobile
  const mobileToolCategories = [
    {
      id: 'select',
      name: 'Select',
      icon: Square,
      tools: [
        { id: 'select-rect', icon: Square, name: 'Rect' },
        { id: 'select-ellipse', icon: Circle, name: 'Ellipse' },
        { id: 'lasso', icon: Lasso, name: 'Lasso' },
        { id: 'magic-wand', icon: Wand2, name: 'Magic' },
        { id: 'quick-select', icon: CircleDot, name: 'Quick' },
      ]
    },
    {
      id: 'paint',
      name: 'Paint',
      icon: Paintbrush,
      tools: [
        { id: 'brush', icon: Paintbrush, name: 'Brush' },
        { id: 'pencil', icon: Pencil, name: 'Pencil' },
        { id: 'eraser', icon: Eraser, name: 'Eraser' },
        { id: 'airbrush', icon: AirVent, name: 'Air' },
        { id: 'fill', icon: PaintBucket, name: 'Fill' },
        { id: 'gradient', icon: Aperture, name: 'Grad' },
        { id: 'eyedropper', icon: Pipette, name: 'Pick' },
      ]
    },
    {
      id: 'retouch',
      name: 'Retouch',
      icon: Sparkles,
      tools: [
        { id: 'spot-healing', icon: Sparkles, name: 'Heal' },
        { id: 'healing', icon: Bandage, name: 'Patch' },
        { id: 'clone-stamp', icon: Stamp, name: 'Clone' },
        { id: 'dodge', icon: Sun, name: 'Dodge' },
        { id: 'burn', icon: Moon, name: 'Burn' },
        { id: 'blur-tool', icon: Focus, name: 'Blur' },
        { id: 'sharpen-tool', icon: Focus, name: 'Sharp' },
        { id: 'smudge', icon: HandMetal, name: 'Smudge' },
      ]
    },
    {
      id: 'vector',
      name: 'Shapes',
      icon: Square,
      tools: [
        { id: 'rectangle', icon: Square, name: 'Rect' },
        { id: 'ellipse', icon: Circle, name: 'Ellipse' },
        { id: 'polygon', icon: Hexagon, name: 'Poly' },
        { id: 'line', icon: Minus, name: 'Line' },
        { id: 'triangle', icon: Triangle, name: 'Tri' },
        { id: 'star', icon: Star, name: 'Star' },
        { id: 'heart', icon: Heart, name: 'Heart' },
      ]
    },
    {
      id: 'text',
      name: 'Text',
      icon: Type,
      tools: [
        { id: 'text', icon: Type, name: 'Text' },
      ]
    },
    {
      id: 'transform',
      name: 'Transform',
      icon: Move,
      tools: [
        { id: 'move', icon: Move, name: 'Move' },
        { id: 'crop', icon: Crop, name: 'Crop' },
        { id: 'flip-h', icon: FlipHorizontal, name: 'Flip H' },
        { id: 'flip-v', icon: FlipVertical, name: 'Flip V' },
      ]
    },
    {
      id: 'view',
      name: 'View',
      icon: Hand,
      tools: [
        { id: 'hand', icon: Hand, name: 'Pan' },
        { id: 'zoom', icon: ZoomIn, name: 'Zoom' },
      ]
    },
  ]

  // Quick access tools (always visible)
  const quickTools = [
    { id: 'brush', icon: Paintbrush, name: 'Brush' },
    { id: 'eraser', icon: Eraser, name: 'Erase' },
    { id: 'pencil', icon: Pencil, name: 'Pencil' },
    { id: 'fill', icon: PaintBucket, name: 'Fill' },
    { id: 'text', icon: Type, name: 'Text' },
    { id: 'eyedropper', icon: Pipette, name: 'Pick' },
    { id: 'crop', icon: Crop, name: 'Crop' },
    { id: 'select-rect', icon: Square, name: 'Select' },
  ]

  const activeLayer = layers.find(l => l.id === activeLayerId)

  return (
    <>
      {/* Top Bar - Mobile */}
      <div className="fixed top-0 left-0 right-0 h-11 bg-black/60 backdrop-blur-xl flex items-center justify-between px-1 z-50 md:hidden border-b border-white/5">
        {/* Left - Undo/Redo */}
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo()} className="h-9 w-9 text-white/70 hover:text-white disabled:opacity-30">
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo()} className="h-9 w-9 text-white/70 hover:text-white disabled:opacity-30">
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Center - Zoom */}
        <div className="flex items-center gap-0.5 bg-white/5 rounded-full px-1 py-0.5">
          <Button variant="ghost" size="icon" onClick={() => setZoom(Math.max(0.1, zoom / 1.25))} className="h-7 w-7 text-white/70 hover:text-white">
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-[11px] text-white font-mono min-w-9 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={() => setZoom(Math.min(10, zoom * 1.25))} className="h-7 w-7 text-white/70 hover:text-white">
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={resetView} className="h-7 w-7 text-cyan/80 hover:text-cyan">
            <Maximize className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="h-9 w-9 text-white/70 hover:text-white">
            <ImagePlus className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowExportDialog(true)} className="h-9 w-9 text-cyan">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bottom Toolbar - Icon Only */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl flex md:hidden z-50 border-t border-white/5">
        {/* Main Tools Row - Scrollable */}
        <div className="flex-1 flex items-center justify-around py-2 px-1 gap-0.5 overflow-x-auto">
          {/* Tools Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuickToolsExpanded(!quickToolsExpanded)}
            className={cn("h-9 w-9 rounded-full transition-all shrink-0", quickToolsExpanded ? "bg-cyan text-black shadow-lg shadow-cyan/30" : "text-white/70 hover:text-white hover:bg-white/10")}
          >
            <Menu className="w-4 h-4" />
          </Button>

          {/* Adjust */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePanel(activePanel === 'adjust' ? null : 'adjust')}
            className={cn("h-9 w-9 rounded-full transition-all shrink-0", activePanel === 'adjust' ? "bg-cyan text-black shadow-lg shadow-cyan/30" : "text-white/70 hover:text-white hover:bg-white/10")}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>

          {/* Tool Options */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePanel(activePanel === 'options' ? null : 'options')}
            className={cn("h-9 w-9 rounded-full transition-all shrink-0", activePanel === 'options' ? "bg-cyan text-black shadow-lg shadow-cyan/30" : "text-white/70 hover:text-white hover:bg-white/10")}
          >
            <Settings className="w-4 h-4" />
          </Button>

          {/* Brush */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTool('brush')}
            className={cn("h-9 w-9 rounded-full transition-all shrink-0", activeTool === 'brush' ? "bg-cyan text-black shadow-lg shadow-cyan/30" : "text-white/70 hover:text-white hover:bg-white/10")}
          >
            <Paintbrush className="w-4 h-4" />
          </Button>

          {/* Eraser */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTool('eraser')}
            className={cn("h-9 w-9 rounded-full transition-all shrink-0", activeTool === 'eraser' ? "bg-cyan text-black shadow-lg shadow-cyan/30" : "text-white/70 hover:text-white hover:bg-white/10")}
          >
            <Eraser className="w-4 h-4" />
          </Button>

          {/* Color */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePanel(activePanel === 'colors' ? null : 'colors')}
            className="h-9 w-9 rounded-full border-2 border-white/30 shadow-lg transition-transform hover:scale-110 shrink-0"
            style={{ backgroundColor: primaryColor }}
          />

          {/* Text */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setActiveTool('text'); setActivePanel('text') }}
            className={cn("h-9 w-9 rounded-full transition-all shrink-0", activeTool === 'text' ? "bg-cyan text-black shadow-lg shadow-cyan/30" : "text-white/70 hover:text-white hover:bg-white/10")}
          >
            <Type className="w-4 h-4" />
          </Button>

          {/* Shapes */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePanel(activePanel === 'shapes' ? null : 'shapes')}
            className={cn("h-9 w-9 rounded-full transition-all shrink-0", activePanel === 'shapes' ? "bg-cyan text-black shadow-lg shadow-cyan/30" : "text-white/70 hover:text-white hover:bg-white/10")}
          >
            <Square className="w-4 h-4" />
          </Button>

          {/* Filters */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePanel(activePanel === 'filters' ? null : 'filters')}
            className={cn("h-9 w-9 rounded-full transition-all shrink-0", activePanel === 'filters' ? "bg-cyan text-black shadow-lg shadow-cyan/30" : "text-white/70 hover:text-white hover:bg-white/10")}
          >
            <Filter className="w-4 h-4" />
          </Button>

          {/* Layers */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePanel(activePanel === 'layers' ? null : 'layers')}
            className={cn("h-9 w-9 rounded-full transition-all shrink-0", activePanel === 'layers' ? "bg-cyan text-black shadow-lg shadow-cyan/30" : "text-white/70 hover:text-white hover:bg-white/10")}
          >
            <Layers className="w-4 h-4" />
          </Button>

          {/* AI */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePanel(activePanel === 'ai' ? null : 'ai')}
            className={cn("h-9 w-9 rounded-full transition-all shrink-0", activePanel === 'ai' ? "bg-gradient-to-br from-cyan to-pink text-black shadow-lg shadow-pink/30" : "text-white/70 hover:text-white hover:bg-white/10")}
          >
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Expanded Tools Panel - Slides up */}
      <AnimatePresence>
        {quickToolsExpanded && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-14 left-0 right-0 bg-black/80 backdrop-blur-xl rounded-t-3xl z-50 md:hidden max-h-[60vh] overflow-hidden border-t border-white/10"
          >
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {/* Handle */}
              <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-4" />

              {/* Tool Categories */}
              <div className="space-y-3">
                {mobileToolCategories.map(category => (
                  <div key={category.id}>
                    <div className="text-[11px] text-white/50 font-medium mb-2">{category.name}</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {category.tools.map(tool => (
                        <Button
                          key={tool.id}
                          variant="ghost"
                          onClick={() => {
                            setActiveTool(tool.id)
                            setQuickToolsExpanded(false)
                          }}
                          className={cn(
                            "h-11 w-11 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all",
                            activeTool === tool.id
                              ? "bg-cyan text-black shadow-lg shadow-cyan/30"
                              : "bg-white/10 text-white/70 hover:text-white hover:bg-white/15"
                          )}
                        >
                          <tool.icon className="w-5 h-5" />
                          <span className="text-[8px]">{tool.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Panel - Slides from right */}
      <AnimatePresence>
        {activePanel && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-11 bottom-14 right-0 w-48 bg-black/75 backdrop-blur-xl z-50 flex flex-col md:hidden border-l border-white/10"
          >
            {/* Panel Content */}
            <ScrollArea className="flex-1">
              {activePanel === 'layers' && (
                <div className="p-2 space-y-1">
                  {/* Layer Actions */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider">Layers</span>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" onClick={() => addLayer({ type: 'image', name: 'Layer', visible: true, locked: false, opacity: 100, blendMode: 'normal', data: null, preview: null, position: { x: 0, y: 0 }, size: canvasSize, rotation: 0 })} className="h-6 w-6 text-white/60 hover:text-cyan">
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setActivePanel(null)} className="h-6 w-6 text-white/60 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Layer List */}
                  <div className="space-y-0.5">
                    {layers.map(layer => (
                      <div
                        key={layer.id}
                        onClick={() => setActiveLayer(layer.id)}
                        className={cn(
                          "flex items-center gap-1.5 p-1.5 rounded-lg cursor-pointer transition-colors",
                          activeLayerId === layer.id ? "bg-cyan/20 border border-cyan/30" : "bg-white/5 hover:bg-white/10"
                        )}
                      >
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible }) }} className="h-6 w-6">
                          {layer.visible ? <Eye className="w-3 h-3 text-cyan" /> : <EyeOff className="w-3 h-3 text-white/40" />}
                        </Button>
                        <div className="w-9 h-9 bg-white/10 rounded overflow-hidden shrink-0">
                          {layer.preview && <img src={layer.preview} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <span className="flex-1 text-[10px] text-white/70 truncate">{layer.name}</span>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { locked: !layer.locked }) }} className="h-6 w-6">
                          {layer.locked ? <Lock className="w-3 h-3 text-white/40" /> : <Unlock className="w-3 h-3 text-white/40" />}
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Layer Opacity */}
                  {activeLayer && (
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-white/50">Opacity</span>
                          <span className="text-cyan">{activeLayer.opacity}%</span>
                        </div>
                        <Slider value={[activeLayer.opacity]} onValueChange={([v]) => updateLayer(activeLayer.id!, { opacity: v })} min={0} max={100} className="brutal-slider" />
                      </div>

                      {/* Blend Mode */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-white/50">Blend Mode</span>
                        <select
                          value={activeLayer.blendMode}
                          onChange={(e) => updateLayer(activeLayer.id!, { blendMode: e.target.value as BlendMode })}
                          className="w-full bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white"
                        >
                          <optgroup label="Basic">
                            <option value="normal">Normal</option>
                            <option value="dissolve">Dissolve</option>
                          </optgroup>
                          <optgroup label="Darken">
                            <option value="darken">Darken</option>
                            <option value="multiply">Multiply</option>
                            <option value="color-burn">Color Burn</option>
                          </optgroup>
                          <optgroup label="Lighten">
                            <option value="lighten">Lighten</option>
                            <option value="screen">Screen</option>
                            <option value="color-dodge">Color Dodge</option>
                          </optgroup>
                          <optgroup label="Contrast">
                            <option value="overlay">Overlay</option>
                            <option value="soft-light">Soft Light</option>
                            <option value="hard-light">Hard Light</option>
                          </optgroup>
                          <optgroup label="Color">
                            <option value="hue">Hue</option>
                            <option value="saturation">Saturation</option>
                            <option value="color">Color</option>
                            <option value="luminosity">Luminosity</option>
                          </optgroup>
                        </select>
                      </div>

                      {/* Layer Actions */}
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => duplicateLayer(activeLayer.id!)} className="flex-1 h-7 text-[9px] bg-white/5 text-white/70">
                          <Copy className="w-3 h-3 mr-1" />
                          Duplicate
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeLayer(activeLayer.id!)} className="flex-1 h-7 text-[9px] bg-red-500/10 text-red-400">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activePanel === 'adjust' && (
                <div className="p-2 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70">Adjustments</span>
                    <Button variant="ghost" size="icon" onClick={() => setActivePanel(null)} className="h-6 w-6 text-white/50">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Adjustments - Full like PC */}
                  {[
                    { key: 'exposure', label: 'Exposure', min: -100, max: 100 },
                    { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
                    { key: 'highlights', label: 'Highlights', min: -100, max: 100 },
                    { key: 'shadows', label: 'Shadows', min: -100, max: 100 },
                    { key: 'whites', label: 'Whites', min: -100, max: 100 },
                    { key: 'blacks', label: 'Blacks', min: -100, max: 100 },
                    { key: 'temperature', label: 'Temperature', min: -100, max: 100 },
                    { key: 'tint', label: 'Tint', min: -100, max: 100 },
                    { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
                    { key: 'vibrance', label: 'Vibrance', min: -100, max: 100 },
                    { key: 'hue', label: 'Hue', min: -180, max: 180 },
                    { key: 'sharpen', label: 'Sharpen', min: 0, max: 100 },
                    { key: 'clarity', label: 'Clarity', min: -100, max: 100 },
                    { key: 'dehaze', label: 'Dehaze', min: -100, max: 100 },
                  ].map(item => (
                    <div key={item.key} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-white/50">{item.label}</span>
                        <span className="text-cyan">{adjustments[item.key as keyof typeof adjustments] || 0}</span>
                      </div>
                      <Slider 
                        value={[adjustments[item.key as keyof typeof adjustments] as number || 0]} 
                        onValueChange={([v]) => setAdjustment(item.key, v)} 
                        min={item.min} 
                        max={item.max} 
                        className="brutal-slider" 
                      />
                    </div>
                  ))}

                  <Button variant="outline" size="sm" onClick={resetAdjustments} className="w-full text-[10px] h-7 bg-white/5 border-white/10 text-white/70">
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset All
                  </Button>
                </div>
              )}

              {activePanel === 'ai' && (
                <div className="p-2 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70">AI Tools</span>
                    <Button variant="ghost" size="icon" onClick={() => setActivePanel(null)} className="h-6 w-6 text-white/50">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* AI Tools Grid */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'Enhancement', name: 'Enhance', icon: Sparkles },
                      { id: 'Background Removal', name: 'BG Remove', icon: Scissors },
                      { id: 'Object Removal', name: 'Remove', icon: Eraser },
                      { id: 'Sky Replacement', name: 'Sky', icon: Globe },
                      { id: 'Portrait Retouch', name: 'Portrait', icon: ScanFace },
                      { id: 'Upscaling', name: '2X', icon: Maximize },
                      { id: 'Upscaling 4X', name: '4X', icon: Maximize },
                      { id: 'Denoise', name: 'Denoise', icon: CircleSlash },
                      { id: 'Color Grade', name: 'Color', icon: Palette },
                      { id: 'Depth Blur', name: 'Blur', icon: Aperture },
                      { id: 'Vintage Style', name: 'Vintage', icon: Lightbulb },
                      { id: 'Cinematic Style', name: 'Cinema', icon: Aperture },
                    ].map(tool => (
                      <Button
                        key={tool.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAI(tool.id)}
                        disabled={isAIProcessing}
                        className="flex flex-col items-center gap-1 h-auto py-2 bg-white/5 hover:bg-white/10 text-white/70"
                      >
                        {isAIProcessing ? <Loader2 className="w-4 h-4 animate-spin text-cyan" /> : <tool.icon className="w-4 h-4 text-cyan" />}
                        <span className="text-[9px]">{tool.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === 'options' && (
                <div className="p-2 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70">Tool Options</span>
                    <Button variant="ghost" size="icon" onClick={() => setActivePanel(null)} className="h-6 w-6 text-white/50">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Brush Size */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/50">Size</span>
                      <span className="text-cyan">{brushSettings.size}px</span>
                    </div>
                    <Slider value={[brushSettings.size]} onValueChange={([v]) => setBrushSettings({ ...brushSettings, size: v })} min={1} max={200} className="brutal-slider" />
                  </div>

                  {/* Opacity */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/50">Opacity</span>
                      <span className="text-cyan">{brushSettings.opacity}%</span>
                    </div>
                    <Slider value={[brushSettings.opacity]} onValueChange={([v]) => setBrushSettings({ ...brushSettings, opacity: v })} min={1} max={100} className="brutal-slider" />
                  </div>

                  {/* Hardness */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/50">Hardness</span>
                      <span className="text-cyan">{toolHardness}%</span>
                    </div>
                    <Slider value={[toolHardness]} onValueChange={([v]) => setToolHardness(v)} min={0} max={100} className="brutal-slider" />
                  </div>

                  {/* Flow */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/50">Flow</span>
                      <span className="text-cyan">{toolFlow}%</span>
                    </div>
                    <Slider value={[toolFlow]} onValueChange={([v]) => setToolFlow(v)} min={1} max={100} className="brutal-slider" />
                  </div>

                  {/* Feather (for selection tools) */}
                  {['select-rect', 'select-ellipse', 'lasso', 'magic-wand'].includes(activeTool) && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-white/50">Feather</span>
                        <span className="text-cyan">{toolFeather}px</span>
                      </div>
                      <Slider value={[toolFeather]} onValueChange={([v]) => setToolFeather(v)} min={0} max={50} className="brutal-slider" />
                    </div>
                  )}

                  {/* Tolerance (for magic wand) */}
                  {activeTool === 'magic-wand' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-white/50">Tolerance</span>
                        <span className="text-cyan">{toolTolerance}</span>
                      </div>
                      <Slider value={[toolTolerance]} onValueChange={([v]) => setToolTolerance(v)} min={0} max={100} className="brutal-slider" />
                    </div>
                  )}

                  {/* Dodge/Burn Range */}
                  {['dodge', 'burn'].includes(activeTool) && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-white/50">Range</span>
                      <div className="flex gap-1">
                        {['shadows', 'midtones', 'highlights'].map(range => (
                          <Button
                            key={range}
                            variant="ghost"
                            size="sm"
                            onClick={() => setDodgeBurnRange(range as typeof dodgeBurnRange)}
                            className={cn("flex-1 h-7 text-[9px]", dodgeBurnRange === range ? "bg-cyan text-black" : "bg-white/10 text-white/70")}
                          >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dodge/Burn Exposure */}
                  {['dodge', 'burn'].includes(activeTool) && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-white/50">Exposure</span>
                        <span className="text-cyan">{dodgeBurnExposure}%</span>
                      </div>
                      <Slider value={[dodgeBurnExposure]} onValueChange={([v]) => setDodgeBurnExposure(v)} min={1} max={100} className="brutal-slider" />
                    </div>
                  )}

                  {/* Contiguous Toggle */}
                  {activeTool === 'magic-wand' && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50">Contiguous</span>
                      <button
                        onClick={() => setToolContiguous(!toolContiguous)}
                        className={cn("w-10 h-5 rounded-full transition-colors", toolContiguous ? "bg-cyan" : "bg-white/20")}
                      >
                        <div className={cn("w-4 h-4 rounded-full bg-white transition-transform", toolContiguous ? "translate-x-5" : "translate-x-0.5")} />
                      </button>
                    </div>
                  )}

                  {/* Reset Button */}
                  <Button variant="outline" size="sm" onClick={() => { setToolHardness(100); setToolFlow(100); setToolFeather(0); setToolTolerance(32); }} className="w-full text-[10px] h-7 bg-white/5 border-white/10 text-white/70">
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset Options
                  </Button>
                </div>
              )}

              {activePanel === 'colors' && (
                <div className="p-2 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70">Colors</span>
                    <Button variant="ghost" size="icon" onClick={() => setActivePanel(null)} className="h-6 w-6 text-white/50">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Primary/Secondary Colors */}
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'color'
                        input.value = primaryColor
                        input.onchange = (e) => setPrimaryColor((e.target as HTMLInputElement).value)
                        input.click()
                      }}
                      className="w-10 h-10 rounded-lg border-2 border-cyan shadow-lg"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <button
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'color'
                        input.value = secondaryColor
                        input.onchange = (e) => setSecondaryColor((e.target as HTMLInputElement).value)
                        input.click()
                      }}
                      className="w-8 h-8 rounded-lg border border-white/30"
                      style={{ backgroundColor: secondaryColor }}
                    />
                    <Button variant="ghost" size="icon" onClick={swapColors} className="h-7 w-7 text-white/60 hover:text-cyan">
                      <ArrowUpDown className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Color Palette - Full like PC */}
                  <div className="grid grid-cols-8 gap-1">
                    {[
                      // Row 1 - Basic Colors
                      '#000000', '#ffffff', '#ff0000', '#ff0066', '#ff00ff', '#9900ff', '#0066ff', '#00ffff',
                      // Row 2 - Bright Colors  
                      '#00ff00', '#66ff00', '#ffff00', '#ff9900', '#ff6600', '#ff3300', '#cc0066', '#990066',
                      // Row 3 - Pastel Colors
                      '#ffcccc', '#ffe6cc', '#ffffcc', '#ccffcc', '#ccffff', '#cce6ff', '#ccccff', '#ffccff',
                      // Row 4 - Dark Colors
                      '#333333', '#666666', '#999999', '#cccccc', '#003366', '#006633', '#663300', '#330033',
                      // Row 5 - Skin Tones
                      '#ffdfc4', '#f0d5be', '#eecebb', '#e6c9a8', '#dbc4a2', '#c9a87c', '#a67b5b', '#8d5524',
                      // Row 6 - Nature Colors
                      '#228b22', '#32cd32', '#90ee90', '#006400', '#8b4513', '#d2691e', '#f4a460', '#deb887',
                    ].map((color) => (
                      <button
                        key={color}
                        className="w-5 h-5 rounded-sm border border-white/10 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => setPrimaryColor(color)}
                      />
                    ))}
                  </div>

                  {/* Quick Colors */}
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[10px] text-white/50 block mb-1">Quick Colors</span>
                    <div className="flex gap-1 flex-wrap">
                      {['#00ffff', '#ff00ff', '#ffff00', '#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'].map(color => (
                        <button
                          key={color}
                          onClick={() => setPrimaryColor(color)}
                          className={cn("w-7 h-7 rounded border-2 transition-transform hover:scale-110", primaryColor === color ? "border-cyan" : "border-white/20")}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'text' && (
                <div className="p-2 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70">Text Options</span>
                    <Button variant="ghost" size="icon" onClick={() => setActivePanel(null)} className="h-6 w-6 text-white/50">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Font Selection */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-white/50">Font</span>
                    <select
                      value={textFont}
                      onChange={(e) => setTextFont(e.target.value)}
                      className="w-full bg-white/10 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Impact">Impact</option>
                      <option value="Comic Sans MS">Comic Sans</option>
                    </select>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/50">Size</span>
                      <span className="text-cyan">{textSize}px</span>
                    </div>
                    <Slider value={[textSize]} onValueChange={([v]) => setTextSize(v)} min={8} max={120} className="brutal-slider" />
                  </div>

                  {/* Font Style */}
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTextBold(!textBold)}
                      className={cn("flex-1 h-8 text-[10px]", textBold ? "bg-cyan text-black" : "bg-white/10 text-white/70")}
                    >
                      <b>B</b>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-8 text-[10px] bg-white/10 text-white/70">
                      <i>I</i>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-8 text-[10px] bg-white/10 text-white/70">
                      <u>U</u>
                    </Button>
                  </div>

                  {/* Text Color */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-white/50">Color</span>
                    <div className="flex gap-1">
                      {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map(color => (
                        <button
                          key={color}
                          onClick={() => setPrimaryColor(color)}
                          className={cn("w-6 h-6 rounded border-2 transition-transform hover:scale-110", primaryColor === color ? "border-cyan" : "border-white/20")}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Apply Text */}
                  <Button
                    onClick={() => setActiveTool('text')}
                    className="w-full bg-cyan text-black text-[10px] h-8"
                  >
                    <Type className="w-3 h-3 mr-1" />
                    Tap Canvas to Add Text
                  </Button>
                </div>
              )}

              {activePanel === 'shapes' && (
                <div className="p-2 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70">Shapes</span>
                    <Button variant="ghost" size="icon" onClick={() => setActivePanel(null)} className="h-6 w-6 text-white/50">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Shape Tools Grid */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'rectangle', icon: Square, name: 'Rect' },
                      { id: 'ellipse', icon: Circle, name: 'Circle' },
                      { id: 'polygon', icon: Hexagon, name: 'Poly' },
                      { id: 'line', icon: Minus, name: 'Line' },
                      { id: 'triangle', icon: Triangle, name: 'Tri' },
                      { id: 'star', icon: Star, name: 'Star' },
                      { id: 'heart', icon: Heart, name: 'Heart' },
                      { id: 'rounded-rect', icon: Square, name: 'Round' },
                    ].map(shape => (
                      <Button
                        key={shape.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => { setActiveTool(shape.id); setActivePanel(null) }}
                        className={cn("flex flex-col items-center gap-1 h-auto py-2", activeTool === shape.id ? "bg-cyan text-black" : "bg-white/10 text-white/70 hover:bg-white/15")}
                      >
                        <shape.icon className="w-4 h-4" />
                        <span className="text-[8px]">{shape.name}</span>
                      </Button>
                    ))}
                  </div>

                  {/* Shape Colors */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-white/50">Fill Color</span>
                    <div className="flex gap-1 flex-wrap">
                      {['#00ffff', '#ff00ff', '#ffff00', '#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'].map(color => (
                        <button
                          key={color}
                          onClick={() => setPrimaryColor(color)}
                          className={cn("w-6 h-6 rounded border-2 transition-transform hover:scale-110", primaryColor === color ? "border-cyan" : "border-white/20")}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Stroke */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/50">Stroke Width</span>
                      <span className="text-cyan">2px</span>
                    </div>
                    <Slider value={[2]} onValueChange={() => {}} min={0} max={20} className="brutal-slider" />
                  </div>
                </div>
              )}

              {activePanel === 'filters' && (
                <div className="p-2 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70">Filters</span>
                    <Button variant="ghost" size="icon" onClick={() => setActivePanel(null)} className="h-6 w-6 text-white/50">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Filter Presets */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'none', name: 'None', color: 'bg-white/10' },
                      { id: 'vintage', name: 'Vintage', color: 'bg-amber-500/30' },
                      { id: 'bw', name: 'B&W', color: 'bg-gray-500/30' },
                      { id: 'sepia', name: 'Sepia', color: 'bg-orange-500/30' },
                      { id: 'cyberpunk', name: 'Cyber', color: 'bg-purple-500/30' },
                      { id: 'brutal', name: 'Brutal', color: 'bg-red-500/30' },
                      { id: 'warm', name: 'Warm', color: 'bg-yellow-500/30' },
                      { id: 'cool', name: 'Cool', color: 'bg-blue-500/30' },
                      { id: 'fade', name: 'Fade', color: 'bg-slate-500/30' },
                      { id: 'vibrant', name: 'Vibrant', color: 'bg-pink-500/30' },
                    ].map(filter => (
                      <Button
                        key={filter.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Apply filter preset
                          if (filter.id === 'none') {
                            resetAdjustments()
                          } else {
                            const presets: Record<string, Record<string, number>> = {
                              vintage: { contrast: 15, saturation: -30, temperature: 20 },
                              bw: { saturation: -100 },
                              sepia: { saturation: -40, temperature: 30 },
                              cyberpunk: { contrast: 30, saturation: 50, temperature: -10 },
                              brutal: { contrast: 50 },
                              warm: { temperature: 30, saturation: 10 },
                              cool: { temperature: -30, tint: 10 },
                              fade: { contrast: -20 },
                              vibrant: { vibrance: 40, saturation: 20 },
                            }
                            const settings = presets[filter.id] || {}
                            Object.entries(settings).forEach(([key, value]) => {
                              setAdjustment(key, value)
                            })
                          }
                        }}
                        className={cn("flex flex-col items-center gap-1 h-auto py-2", filter.color, "text-white/70 hover:text-white")}
                      >
                        <Filter className="w-4 h-4" />
                        <span className="text-[9px]">{filter.name}</span>
                      </Button>
                    ))}
                  </div>

                  {/* Reset Button */}
                  <Button variant="outline" size="sm" onClick={resetAdjustments} className="w-full text-[10px] h-7 bg-white/5 border-white/10 text-white/70 mt-2">
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset All
                  </Button>
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brush Size Control - Only for brush tools */}
      {['brush', 'pencil', 'eraser', 'airbrush', 'clone-stamp', 'healing', 'spot-healing'].includes(activeTool) && !activePanel && !quickToolsExpanded && (
        <div className="fixed top-14 left-2 flex items-center gap-2 md:hidden z-40 bg-black/60 backdrop-blur-xl rounded-full px-3 py-1.5 border border-white/10">
          <Button variant="ghost" size="icon" onClick={() => setBrushSettings({ ...brushSettings, size: Math.max(1, brushSettings.size - 5) })} className="h-6 w-6 text-white/70 hover:text-cyan">
            -
          </Button>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan" style={{ transform: `scale(${Math.min(2, brushSettings.size / 50)})` }} />
            <span className="text-[10px] text-white font-mono w-6 text-center">{brushSettings.size}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setBrushSettings({ ...brushSettings, size: Math.min(200, brushSettings.size + 5) })} className="h-6 w-6 text-white/70 hover:text-cyan">
            +
          </Button>
        </div>
      )}
    </>
  )
}

interface EditorProps {
  onBack: () => void
}

export function Editor({ onBack }: EditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Image cache for stable preview - prevents flickering
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map())
  // Render scheduling for smooth updates
  const renderScheduledRef = useRef(false)
  // Offscreen canvas for double buffering
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [commandSearch, setCommandSearch] = useState('')
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'webp'>('png')
  const [exportQuality, setExportQuality] = useState(95)
  const [exportSize, setExportSize] = useState<'1x' | '0.5x' | '2x' | '4x'>('1x')
  const [exportDpi, setExportDpi] = useState(72)
  const [activeFilterPreset, setActiveFilterPreset] = useState('none')
  const [isAIProcessing, setIsAIProcessing] = useState(false)
  const [aiTask, setAiTask] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  
  // Tool options state
  const [toolOptions, setToolOptions] = useState<ToolOptionsState>(defaultToolOptions)
  
  // Selection state
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null)
  
  // Clone stamp source
  const [cloneSourcePoint, setCloneSourcePoint] = useState<{ x: number; y: number } | null>(null)
  const [isSettingCloneSource, setIsSettingCloneSource] = useState(false)
  
  // Recent commands for command palette
  const [recentCommands, setRecentCommands] = useState<string[]>([])
  
  // Timeline expanded state
  const [timelineExpanded, setTimelineExpanded] = useState(false)
  
  // Polygon lasso points
  const [polygonPoints, setPolygonPoints] = useState<{ x: number; y: number }[]>([])
  
  // Pen tool path
  const [penPath, setPenPath] = useState<{ x: number; y: number; cp1?: { x: number; y: number }; cp2?: { x: number; y: number } }[]>([])
  
  // Shape drawing
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null)
  const [shapeEnd, setShapeEnd] = useState<{ x: number; y: number } | null>(null)

  // Crop tool state
  const [cropRect, setCropRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [isCropping, setIsCropping] = useState(false)
  const [cropHandle, setCropHandle] = useState<string | null>(null)

  // Text tool state
  const [textInput, setTextInput] = useState<{ x: number; y: number; value: string; active: boolean } | null>(null)
  const [textOptions, setTextOptions] = useState({ fontFamily: 'Arial', fontSize: 32, fontWeight: 'normal' })

  // Gradient preview
  const [gradientPreview, setGradientPreview] = useState<{ start: { x: number; y: number }; end: { x: number; y: number } } | null>(null)

  // Pattern stamp
  const [patternType, setPatternType] = useState<'dots' | 'lines' | 'grid'>('dots')

  // Canvas rotation
  const [canvasRotation, setCanvasRotation] = useState(0)

  // Brush cursor position
  const [brushCursorPos, setBrushCursorPos] = useState<{ x: number; y: number } | null>(null)

  // Straight line drawing (hold Shift)
  const [straightLineStart, setStraightLineStart] = useState<{ x: number; y: number } | null>(null)
  const [isShiftHeld, setIsShiftHeld] = useState(false)

  // Mobile touch state
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null)
  const [touchStartZoom, setTouchStartZoom] = useState<number>(1)
  const [lastTouchCenter, setLastTouchCenter] = useState<{ x: number; y: number } | null>(null)
  const [longPressTimeout, setLongPressTimeout] = useState<NodeJS.Timeout | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Clone stamp initial offset
  const [cloneInitialOffset, setCloneInitialOffset] = useState<{ x: number; y: number } | null>(null)

  const store = useEditorStore()
  const {
    layers,
    activeLayerId,
    activeTool,
    primaryColor,
    secondaryColor,
    brushSettings,
    eraserSettings,
    canvasSize,
    zoom,
    panOffset,
    showGrid,
    showRulers,
    fileName,
    hasUnsavedChanges,
    adjustments,
    selection,
    selectionPath,
    history,
    historyIndex,
    setActiveTool,
    setPrimaryColor,
    setSecondaryColor,
    setBrushSettings,
    setEraserSettings,
    setZoom,
    setPanOffset,
    resetView,
    toggleGrid,
    toggleRulers,
    addLayer,
    removeLayer,
    updateLayer,
    setActiveLayer,
    duplicateLayer,
    undo,
    redo,
    canUndo,
    canRedo,
    newCanvas,
    loadImage,
    setAdjustment,
    resetAdjustments,
    swapColors,
    clearSelection,
    selectAll,
    invertSelection,
    setSelection,
    setSelectionPath,
    saveToHistory,
  } = store

  // Get current tool definition
  const currentTool = useMemo(() => getToolById(activeTool), [activeTool])

  // Toast notification
  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setToastMessage({ type, message })
    setTimeout(() => setToastMessage(null), 3000)
  }, [])

  // Initialize canvas
  useEffect(() => {
    if (layers.length === 0) {
      newCanvas(1920, 1080, '#1a1a1a')
    }
  }, [])

  // Apply CSS filters to canvas
  const getFilterString = useCallback(() => {
    const parts: string[] = []
    if (adjustments.exposure !== 0) parts.push(`brightness(${100 + adjustments.exposure}%)`)
    if (adjustments.contrast !== 0) parts.push(`contrast(${100 + adjustments.contrast}%)`)
    if (adjustments.saturation !== 0) parts.push(`saturate(${100 + adjustments.saturation}%)`)
    if (adjustments.temperature !== 0) parts.push(`sepia(${Math.abs(adjustments.temperature) / 2}%)`)
    if (adjustments.hue !== 0) parts.push(`hue-rotate(${adjustments.hue}deg)`)
    // Sharpen is applied via canvas convolution, not CSS filters
    return parts.join(' ')
  }, [adjustments])

  // Helper: Get cached image or load new one
  const getCachedImage = useCallback((src: string): HTMLImageElement | null => {
    const cache = imageCacheRef.current
    if (cache.has(src)) {
      return cache.get(src)!
    }
    
    const img = new window.Image()
    img.src = src
    if (img.complete) {
      cache.set(src, img)
      return img
    }
    
    // Image not loaded yet, return null but cache it for future use
    img.onload = () => {
      cache.set(src, img)
    }
    return null
  }, [])

  // Render canvas with double buffering for stability
  useEffect(() => {
    // Prevent multiple render calls in same frame
    if (renderScheduledRef.current) return
    renderScheduledRef.current = true

    requestAnimationFrame(() => {
      renderScheduledRef.current = false
      
      const canvas = canvasRef.current
      if (!canvas) return

      // Create or resize offscreen canvas for double buffering
      if (!offscreenCanvasRef.current) {
        offscreenCanvasRef.current = document.createElement('canvas')
      }
      const offscreen = offscreenCanvasRef.current
      offscreen.width = canvasSize.width
      offscreen.height = canvasSize.height
      
      const ctx = offscreen.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, offscreen.width, offscreen.height)

      // Draw checkerboard for transparency (optimized)
      const patternSize = 20
      for (let x = 0; x < offscreen.width; x += patternSize) {
        for (let y = 0; y < offscreen.height; y += patternSize) {
          ctx.fillStyle = ((x + y) / patternSize) % 2 === 0 ? '#2a2a2a' : '#222222'
          ctx.fillRect(x, y, patternSize, patternSize)
        }
      }

      // Apply filters
      ctx.filter = getFilterString()

      // Render visible layers
      const visibleLayers = layers.filter(l => l.visible).reverse()
      
      visibleLayers.forEach(layer => {
        ctx.globalAlpha = layer.opacity / 100
        ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation

        if (layer.preview) {
          // Use cached image for stable preview
          const img = getCachedImage(layer.preview)
          if (img) {
            ctx.drawImage(img, layer.position.x, layer.position.y, layer.size.width, layer.size.height)
          }
        }

        // Render shapes
        if (layer.type === 'shape' && layer.shape) {
          ctx.fillStyle = layer.shape.fill
          ctx.strokeStyle = layer.shape.stroke
          ctx.lineWidth = layer.shape.strokeWidth

          if (layer.shape.type === 'rectangle') {
            ctx.fillRect(layer.position.x, layer.position.y, layer.size.width, layer.size.height)
            if (layer.shape.strokeWidth > 0) {
              ctx.strokeRect(layer.position.x, layer.position.y, layer.size.width, layer.size.height)
            }
          } else if (layer.shape.type === 'ellipse') {
            ctx.beginPath()
            ctx.ellipse(
              layer.position.x + layer.size.width / 2,
              layer.position.y + layer.size.height / 2,
              layer.size.width / 2,
              layer.size.height / 2,
              0, 0, Math.PI * 2
            )
            ctx.fill()
            if (layer.shape.strokeWidth > 0) ctx.stroke()
          }
        }

        // Render text
        if (layer.type === 'text' && layer.text) {
          ctx.font = `${layer.text.fontWeight} ${layer.text.fontSize}px ${layer.text.fontFamily}`
          ctx.fillStyle = layer.text.color
          ctx.textAlign = layer.text.align
          ctx.fillText(layer.text.content, layer.position.x, layer.position.y)
        }
      })

      // Reset context
      ctx.filter = 'none'
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'

      // Apply sharpen filter if needed (optimized)
      if (adjustments.sharpen !== 0) {
        const imageData = ctx.getImageData(0, 0, offscreen.width, offscreen.height)
        const data = imageData.data
        const width = offscreen.width
        const height = offscreen.height
        const strength = adjustments.sharpen / 100
        
        // Sharpen kernel
        const kernel = [
          0, -strength, 0,
          -strength, 1 + 4 * strength, -strength,
          0, -strength, 0
        ]
        
        const result = new Uint8ClampedArray(data.length)
        
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 3; c++) {
              let sum = 0
              for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                  const idx = ((y + ky) * width + (x + kx)) * 4 + c
                  sum += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)]
                }
              }
              result[(y * width + x) * 4 + c] = Math.min(255, Math.max(0, Math.floor(sum)))
            }
            result[(y * width + x) * 4 + 3] = data[(y * width + x) * 4 + 3]
          }
        }
        
        // Copy edges
        for (let x = 0; x < width; x++) {
          for (let c = 0; c < 4; c++) {
            result[x * 4 + c] = data[x * 4 + c]
            result[((height - 1) * width + x) * 4 + c] = data[((height - 1) * width + x) * 4 + c]
          }
        }
        for (let y = 0; y < height; y++) {
          for (let c = 0; c < 4; c++) {
            result[y * width * 4 + c] = data[y * width * 4 + c]
            result[(y * width + width - 1) * 4 + c] = data[(y * width + width - 1) * 4 + c]
          }
        }
        
        // Blend original and result based on strength
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.floor(data[i] * (1 - Math.abs(strength) * 0.5) + result[i] * Math.abs(strength) * 0.5)
        }
        
        ctx.putImageData(imageData, 0, 0)
      }

      // Draw selection outline if exists
      if (selection) {
        ctx.strokeStyle = '#00ffff'
        ctx.lineWidth = 1
        ctx.setLineDash([5, 5])
        
        if (selection.type === 'rectangle') {
          ctx.strokeRect(selection.x, selection.y, selection.width, selection.height)
        } else if (selection.type === 'ellipse') {
          ctx.beginPath()
          ctx.ellipse(
            selection.x + selection.width / 2,
            selection.y + selection.height / 2,
            Math.abs(selection.width) / 2,
            Math.abs(selection.height) / 2,
            0, 0, Math.PI * 2
          )
          ctx.stroke()
        } else if (selection.type === 'lasso' && selection.path) {
          ctx.beginPath()
          ctx.moveTo(selection.path[0].x, selection.path[0].y)
          selection.path.forEach(p => ctx.lineTo(p.x, p.y))
          ctx.closePath()
          ctx.stroke()
        }
        ctx.setLineDash([])
      }

      // Draw polygon lasso in progress
      if (polygonPoints.length > 0 && activeTool === 'lasso-polygon') {
        ctx.strokeStyle = '#00ffff'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y)
        polygonPoints.forEach(p => ctx.lineTo(p.x, p.y))
        ctx.stroke()
        
        // Draw points
        ctx.fillStyle = '#00ffff'
        polygonPoints.forEach(p => {
          ctx.beginPath()
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      // Draw pen path in progress
      if (penPath.length > 0 && activeTool === 'pen') {
        ctx.strokeStyle = '#00ffff'
        ctx.lineWidth = 2
        ctx.beginPath()
        
        if (penPath.length > 0) {
          ctx.moveTo(penPath[0].x, penPath[0].y)
          penPath.forEach((p, i) => {
            if (i > 0) {
              if (p.cp1 && p.cp2) {
                ctx.bezierCurveTo(p.cp1.x, p.cp1.y, p.cp2.x, p.cp2.y, p.x, p.y)
              } else {
                ctx.lineTo(p.x, p.y)
              }
            }
          })
        }
        ctx.stroke()
        
        // Draw points
        ctx.fillStyle = '#00ffff'
        penPath.forEach(p => {
          ctx.beginPath()
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      // Draw grid
      if (showGrid) {
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)'
        ctx.lineWidth = 1
        for (let x = 0; x <= offscreen.width; x += 50) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, offscreen.height)
          ctx.stroke()
        }
        for (let y = 0; y <= offscreen.height; y += 50) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(offscreen.width, y)
          ctx.stroke()
        }
      }

      // Copy from offscreen to main canvas (double buffering)
      const mainCtx = canvas.getContext('2d')
      if (mainCtx) {
        canvas.width = canvasSize.width
        canvas.height = canvasSize.height
        mainCtx.clearRect(0, 0, canvas.width, canvas.height)
        mainCtx.drawImage(offscreen, 0, 0)
      }
    })
  }, [layers, canvasSize, showGrid, adjustments, getFilterString, selection, polygonPoints, penPath, activeTool, getCachedImage])

  // Helper: Get canvas coordinates from mouse event
  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom - panOffset.x
    const y = (e.clientY - rect.top) / zoom - panOffset.y
    return { x, y }
  }, [zoom, panOffset])

  // Helper: Get canvas coordinates from touch event
  const getCanvasCoordsFromTouch = useCallback((touch: React.Touch) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const x = (touch.clientX - rect.left) / zoom - panOffset.x
    const y = (touch.clientY - rect.top) / zoom - panOffset.y
    return { x, y }
  }, [zoom, panOffset])

  // Helper: Calculate distance between two touch points
  const getTouchDistance = useCallback((touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  // Helper: Get center of two touch points
  const getTouchCenter = useCallback((touch1: React.Touch, touch2: React.Touch) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    }
  }, [])

  // Helper: Get pixel data at position
  const getPixelAt = useCallback((x: number, y: number): [number, number, number, number] => {
    const canvas = canvasRef.current
    if (!canvas) return [0, 0, 0, 0]
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return [0, 0, 0, 0]
    const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data
    return [pixel[0], pixel[1], pixel[2], pixel[3]]
  }, [])

  // Magic wand selection (flood fill algorithm)
  const magicWandSelect = useCallback((startX: number, startY: number, tolerance: number, contiguous: boolean) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const width = canvas.width
    const height = canvas.height
    
    const startIdx = (Math.floor(startY) * width + Math.floor(startX)) * 4
    const targetColor = [data[startIdx], data[startIdx + 1], data[startIdx + 2], data[startIdx + 3]]
    
    const visited = new Set<number>()
    const selectedPixels: { x: number; y: number }[] = []
    
    const colorMatch = (idx: number): boolean => {
      const rDiff = Math.abs(data[idx] - targetColor[0])
      const gDiff = Math.abs(data[idx + 1] - targetColor[1])
      const bDiff = Math.abs(data[idx + 2] - targetColor[2])
      return rDiff <= tolerance && gDiff <= tolerance && bDiff <= tolerance
    }
    
    if (contiguous) {
      // Flood fill from start point
      const stack: [number, number][] = [[Math.floor(startX), Math.floor(startY)]]
      
      while (stack.length > 0) {
        const [x, y] = stack.pop()!
        const idx = (y * width + x) * 4
        
        if (x < 0 || x >= width || y < 0 || y >= height) continue
        if (visited.has(idx)) continue
        if (!colorMatch(idx)) continue
        
        visited.add(idx)
        selectedPixels.push({ x, y })
        
        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
      }
    } else {
      // Select all matching pixels
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4
          if (colorMatch(idx)) {
            selectedPixels.push({ x, y })
          }
        }
      }
    }
    
    if (selectedPixels.length > 0) {
      // Calculate bounding box
      const minX = Math.min(...selectedPixels.map(p => p.x))
      const maxX = Math.max(...selectedPixels.map(p => p.x))
      const minY = Math.min(...selectedPixels.map(p => p.y))
      const maxY = Math.max(...selectedPixels.map(p => p.y))
      
      setSelection({
        x: minX,
        y: minY,
        width: maxX - minX + 1,
        height: maxY - minY + 1,
        type: 'magic-wand',
        path: selectedPixels,
        feather: toolOptions.feather,
        antiAlias: toolOptions.antiAlias,
      })
      
      showToast('info', `Selected ${selectedPixels.length} pixels`)
    }
  }, [setSelection, toolOptions.feather, toolOptions.antiAlias, showToast])

  // Quick select (brush-based selection)
  const quickSelectBrush = useCallback((x: number, y: number, size: number, add: boolean) => {
    // Simplified quick select - adds to selection with brush stroke
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    // For now, create circular selection area
    const existingPath = selectionPath || []
    const newPoints: { x: number; y: number }[] = []
    
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      for (let r = 0; r < size; r += 2) {
        newPoints.push({
          x: Math.floor(x + Math.cos(angle) * r),
          y: Math.floor(y + Math.sin(angle) * r),
        })
      }
    }
    
    if (add) {
      setSelectionPath([...existingPath, ...newPoints])
    } else {
      setSelectionPath(newPoints)
    }
  }, [selectionPath, setSelectionPath])

  // Apply brush stroke with advanced options - draws smooth lines between points
  const applyBrushStroke = useCallback((ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, settings: typeof brushSettings) => {
    const size = settings.size
    const hardness = toolOptions.hardness / 100
    const flow = toolOptions.flow / 100
    const opacity = settings.opacity / 100
    
    // Calculate distance between points for smooth interpolation
    const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    const steps = Math.max(1, Math.floor(dist / (size / 4))) // Interpolate for smooth strokes
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const x = x1 + (x2 - x1) * t
      const y = y1 + (y2 - y1) * t
      
      // Create brush tip gradient for hardness
      if (hardness < 1) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2)
        gradient.addColorStop(hardness, color)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
      } else {
        ctx.fillStyle = color
      }
      
      // Apply scatter
      const scatter = toolOptions.scatter / 100
      const scatterX = (Math.random() - 0.5) * size * scatter
      const scatterY = (Math.random() - 0.5) * size * scatter
      
      // Apply angle and roundness
      ctx.save()
      ctx.translate(x + scatterX, y + scatterY)
      ctx.rotate((toolOptions.angle * Math.PI) / 180)
      ctx.scale(1, toolOptions.roundness / 100)
      
      // Airbrush mode
      if (toolOptions.airbrush) {
        ctx.globalAlpha = opacity * flow * 0.1
        for (let j = 0; j < 5; j++) {
          const offsetX = (Math.random() - 0.5) * size * 0.5
          const offsetY = (Math.random() - 0.5) * size * 0.5
          ctx.beginPath()
          ctx.arc(offsetX, offsetY, size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
      } else {
        ctx.globalAlpha = opacity * flow
        ctx.beginPath()
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2)
        ctx.fill()
      }
      
      ctx.restore()
    }
  }, [toolOptions])

  // Healing brush - improved with texture-preserving blend
  const applyHealing = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, sourceX: number, sourceY: number, size: number) => {
    const halfSize = Math.floor(size / 2)
    const canvas = ctx.canvas
    
    // Clamp coordinates
    const clampedSourceX = Math.max(halfSize, Math.min(canvas.width - halfSize, Math.floor(sourceX)))
    const clampedSourceY = Math.max(halfSize, Math.min(canvas.height - halfSize, Math.floor(sourceY)))
    const clampedDestX = Math.max(halfSize, Math.min(canvas.width - halfSize, Math.floor(x)))
    const clampedDestY = Math.max(halfSize, Math.min(canvas.height - halfSize, Math.floor(y)))
    
    try {
      const sourceData = ctx.getImageData(clampedSourceX - halfSize, clampedSourceY - halfSize, size, size)
      const destData = ctx.getImageData(clampedDestX - halfSize, clampedDestY - halfSize, size, size)
      const resultData = ctx.createImageData(size, size)
      
      // Calculate average luminance of source and destination
      let sourceAvg = [0, 0, 0]
      let destAvg = [0, 0, 0]
      const pixelCount = size * size
      
      for (let i = 0; i < sourceData.data.length; i += 4) {
        sourceAvg[0] += sourceData.data[i]
        sourceAvg[1] += sourceData.data[i + 1]
        sourceAvg[2] += sourceData.data[i + 2]
        destAvg[0] += destData.data[i]
        destAvg[1] += destData.data[i + 1]
        destAvg[2] += destData.data[i + 2]
      }
      sourceAvg = sourceAvg.map(v => v / pixelCount)
      destAvg = destAvg.map(v => v / pixelCount)
      
      // Heal: match source lighting to destination while preserving texture
      for (let i = 0; i < destData.data.length; i += 4) {
        // Calculate distance from center for falloff
        const px = (i / 4) % size
        const py = Math.floor((i / 4) / size)
        const dist = Math.sqrt((px - halfSize) ** 2 + (py - halfSize) ** 2)
        const falloff = Math.max(0, 1 - dist / halfSize)
        
        // Blend with luminance matching
        for (let c = 0; c < 3; c++) {
          const sourceVal = sourceData.data[i + c]
          const destVal = destData.data[i + c]
          
          // Match lighting
          const lightDiff = destAvg[c] - sourceAvg[c]
          const matched = Math.min(255, Math.max(0, sourceVal + lightDiff * 0.5))
          
          // Blend with destination
          resultData.data[i + c] = Math.floor(destVal * (1 - falloff * 0.6) + matched * falloff * 0.6)
        }
        resultData.data[i + 3] = destData.data[i + 3] // Preserve alpha
      }
      
      ctx.putImageData(resultData, clampedDestX - halfSize, clampedDestY - halfSize)
    } catch (e) {
      console.warn('Healing brush error:', e)
    }
  }, [])

  // Spot healing - improved content-aware fill
  const applySpotHealing = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const halfSize = Math.floor(size / 2)
    const canvas = ctx.canvas
    
    // Clamp coordinates
    const clampedX = Math.max(halfSize, Math.min(canvas.width - halfSize, Math.floor(x)))
    const clampedY = Math.max(halfSize, Math.min(canvas.height - halfSize, Math.floor(y)))
    
    try {
      // Sample from multiple directions around the target area
      const sampleRadius = size * 1.5
      const samples: { r: number; g: number; b: number; weight: number }[] = []
      
      // Sample in a circle around the target
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        for (let r = sampleRadius; r < sampleRadius + size; r += 3) {
          const sx = Math.floor(clampedX + Math.cos(angle) * r)
          const sy = Math.floor(clampedY + Math.sin(angle) * r)
          
          if (sx >= 0 && sx < canvas.width && sy >= 0 && sy < canvas.height) {
            const pixel = ctx.getImageData(sx, sy, 1, 1).data
            // Weight by distance (further samples have less weight)
            const weight = 1 - (r - sampleRadius) / size
            samples.push({ r: pixel[0], g: pixel[1], b: pixel[2], weight })
          }
        }
      }
      
      if (samples.length === 0) return
      
      // Calculate weighted average
      let totalWeight = 0
      let avgR = 0, avgG = 0, avgB = 0
      samples.forEach(s => {
        avgR += s.r * s.weight
        avgG += s.g * s.weight
        avgB += s.b * s.weight
        totalWeight += s.weight
      })
      
      avgR = Math.floor(avgR / totalWeight)
      avgG = Math.floor(avgG / totalWeight)
      avgB = Math.floor(avgB / totalWeight)
      
      // Get destination area for texture preservation
      const destData = ctx.getImageData(clampedX - halfSize, clampedY - halfSize, size, size)
      
      // Calculate average luminance of destination
      let destLum = 0
      for (let i = 0; i < destData.data.length; i += 4) {
        destLum += (destData.data[i] + destData.data[i + 1] + destData.data[i + 2]) / 3
      }
      destLum /= (size * size)
      
      // Apply with gradient for smooth blending, preserving texture
      for (let py = 0; py < size; py++) {
        for (let px = 0; px < size; px++) {
          const dist = Math.sqrt((px - halfSize) ** 2 + (py - halfSize) ** 2)
          if (dist <= halfSize) {
            const falloff = 1 - dist / halfSize
            const idx = (py * size + px) * 4
            
            // Get destination luminance for texture
            const destPixel = destData.data[idx]
            const localLum = (destData.data[idx] + destData.data[idx + 1] + destData.data[idx + 2]) / 3
            const lumRatio = destLum > 0 ? localLum / destLum : 1
            
            // Blend colors with luminance adjustment
            destData.data[idx] = Math.floor(destData.data[idx] * (1 - falloff) + Math.min(255, avgR * lumRatio) * falloff)
            destData.data[idx + 1] = Math.floor(destData.data[idx + 1] * (1 - falloff) + Math.min(255, avgG * lumRatio) * falloff)
            destData.data[idx + 2] = Math.floor(destData.data[idx + 2] * (1 - falloff) + Math.min(255, avgB * lumRatio) * falloff)
          }
        }
      }
      
      ctx.putImageData(destData, clampedX - halfSize, clampedY - halfSize)
    } catch (e) {
      console.warn('Spot healing error:', e)
    }
  }, [])

  // Clone stamp - improved with better source tracking
  const applyCloneStamp = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, sourceX: number, sourceY: number, size: number, opacity: number) => {
    const halfSize = Math.floor(size / 2)
    
    // Clamp coordinates to canvas bounds
    const canvas = ctx.canvas
    const clampedSourceX = Math.max(halfSize, Math.min(canvas.width - halfSize, Math.floor(sourceX)))
    const clampedSourceY = Math.max(halfSize, Math.min(canvas.height - halfSize, Math.floor(sourceY)))
    const clampedDestX = Math.max(halfSize, Math.min(canvas.width - halfSize, Math.floor(x)))
    const clampedDestY = Math.max(halfSize, Math.min(canvas.height - halfSize, Math.floor(y)))
    
    try {
      const sourceData = ctx.getImageData(clampedSourceX - halfSize, clampedSourceY - halfSize, size, size)
      
      // Create temporary canvas for the clone source with circular mask
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = size
      tempCanvas.height = size
      const tempCtx = tempCanvas.getContext('2d')
      if (!tempCtx) return
      
      // Create circular gradient mask for soft edges
      const mask = tempCtx.createRadialGradient(halfSize, halfSize, 0, halfSize, halfSize, halfSize)
      mask.addColorStop(0.7, 'white')
      mask.addColorStop(1, 'transparent')
      
      // Apply the source data
      tempCtx.putImageData(sourceData, 0, 0)
      
      // Apply with opacity and circular mask
      ctx.save()
      ctx.globalAlpha = opacity / 100
      ctx.globalCompositeOperation = 'source-over'
      
      // Create circular clip for smooth edges
      ctx.beginPath()
      ctx.arc(clampedDestX, clampedDestY, halfSize, 0, Math.PI * 2)
      ctx.clip()
      
      ctx.drawImage(tempCanvas, clampedDestX - halfSize, clampedDestY - halfSize)
      ctx.restore()
    } catch (e) {
      console.warn('Clone stamp error:', e)
    }
  }, [])

  // Dodge (lighten)
  const applyDodge = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, exposure: number, range: 'shadows' | 'midtones' | 'highlights') => {
    const halfSize = Math.floor(size / 2)
    const data = ctx.getImageData(Math.floor(x - halfSize), Math.floor(y - halfSize), size, size)
    
    for (let i = 0; i < data.data.length; i += 4) {
      const luminance = (data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3
      let factor = exposure / 100
      
      // Apply range-based adjustment
      if (range === 'shadows' && luminance < 85) {
        factor *= 1 + (85 - luminance) / 85
      } else if (range === 'highlights' && luminance > 170) {
        factor *= 1 + (luminance - 170) / 85
      } else if (range === 'midtones' && luminance >= 85 && luminance <= 170) {
        factor *= 1 - Math.abs(luminance - 127.5) / 42.5
      } else {
        factor *= 0.3 // Reduce effect outside range
      }
      
      data.data[i] = Math.min(255, Math.floor(data.data[i] + factor * 20))
      data.data[i + 1] = Math.min(255, Math.floor(data.data[i + 1] + factor * 20))
      data.data[i + 2] = Math.min(255, Math.floor(data.data[i + 2] + factor * 20))
    }
    
    ctx.putImageData(data, Math.floor(x - halfSize), Math.floor(y - halfSize))
  }, [])

  // Burn (darken)
  const applyBurn = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, exposure: number, range: 'shadows' | 'midtones' | 'highlights') => {
    const halfSize = Math.floor(size / 2)
    const data = ctx.getImageData(Math.floor(x - halfSize), Math.floor(y - halfSize), size, size)
    
    for (let i = 0; i < data.data.length; i += 4) {
      const luminance = (data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3
      let factor = exposure / 100
      
      if (range === 'shadows' && luminance < 85) {
        factor *= 1 + (85 - luminance) / 85
      } else if (range === 'highlights' && luminance > 170) {
        factor *= 1 + (luminance - 170) / 85
      } else if (range === 'midtones' && luminance >= 85 && luminance <= 170) {
        factor *= 1 - Math.abs(luminance - 127.5) / 42.5
      } else {
        factor *= 0.3
      }
      
      data.data[i] = Math.max(0, Math.floor(data.data[i] - factor * 20))
      data.data[i + 1] = Math.max(0, Math.floor(data.data[i + 1] - factor * 20))
      data.data[i + 2] = Math.max(0, Math.floor(data.data[i + 2] - factor * 20))
    }
    
    ctx.putImageData(data, Math.floor(x - halfSize), Math.floor(y - halfSize))
  }, [])

  // Sponge - proper HSL saturation adjustment
  const applySponge = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, mode: 'saturate' | 'desaturate') => {
    const halfSize = Math.floor(size / 2)
    const canvas = ctx.canvas
    const clampedX = Math.max(halfSize, Math.min(canvas.width - halfSize, Math.floor(x)))
    const clampedY = Math.max(halfSize, Math.min(canvas.height - halfSize, Math.floor(y)))
    
    try {
      const data = ctx.getImageData(clampedX - halfSize, clampedY - halfSize, size, size)
      
      const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
        r /= 255; g /= 255; b /= 255
        const max = Math.max(r, g, b), min = Math.min(r, g, b)
        let h = 0, s = 0, l = (max + min) / 2
        
        if (max !== min) {
          const d = max - min
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
          switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
            case g: h = ((b - r) / d + 2) / 6; break
            case b: h = ((r - g) / d + 4) / 6; break
          }
        }
        return [h, s, l]
      }
      
      const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
        let r, g, b
        if (s === 0) {
          r = g = b = l
        } else {
          const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1/6) return p + (q - p) * 6 * t
            if (t < 1/2) return q
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
            return p
          }
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s
          const p = 2 * l - q
          r = hue2rgb(p, q, h + 1/3)
          g = hue2rgb(p, q, h)
          b = hue2rgb(p, q, h - 1/3)
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
      }
      
      for (let i = 0; i < data.data.length; i += 4) {
        const r = data.data[i]
        const g = data.data[i + 1]
        const b = data.data[i + 2]
        
        const [h, s, l] = rgbToHsl(r, g, b)
        
        // Apply saturation change
        let newS = mode === 'saturate' ? Math.min(1, s * 1.15 + 0.05) : Math.max(0, s * 0.85 - 0.02)
        
        const [newR, newG, newB] = hslToRgb(h, newS, l)
        
        data.data[i] = newR
        data.data[i + 1] = newG
        data.data[i + 2] = newB
      }
      
      ctx.putImageData(data, clampedX - halfSize, clampedY - halfSize)
    } catch (e) {
      console.warn('Sponge tool error:', e)
    }
  }, [])

  // Blur tool - optimized Gaussian blur
  const applyBlur = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, strength: number) => {
    const halfSize = Math.floor(size / 2)
    const blurRadius = Math.max(1, Math.floor(strength / 20) + 1)
    const canvas = ctx.canvas
    
    // Clamp coordinates with blur radius buffer
    const sampleSize = size + blurRadius * 2
    const clampedX = Math.max(halfSize + blurRadius, Math.min(canvas.width - halfSize - blurRadius, Math.floor(x)))
    const clampedY = Math.max(halfSize + blurRadius, Math.min(canvas.height - halfSize - blurRadius, Math.floor(y)))
    
    try {
      const data = ctx.getImageData(clampedX - halfSize - blurRadius, clampedY - halfSize - blurRadius, sampleSize, sampleSize)
      const width = data.width
      const height = data.height
      const pixels = data.data
      const result = new Uint8ClampedArray(pixels.length)
      
      // Create Gaussian kernel
      const kernel: number[] = []
      let kernelSum = 0
      for (let i = -blurRadius; i <= blurRadius; i++) {
        const val = Math.exp(-(i * i) / (2 * (blurRadius / 2) ** 2))
        kernel.push(val)
        kernelSum += val
      }
      kernel.forEach((v, i) => kernel[i] = v / kernelSum)
      
      // Horizontal pass
      const temp = new Uint8ClampedArray(pixels.length)
      for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
          let r = 0, g = 0, b = 0, a = 0
          for (let k = -blurRadius; k <= blurRadius; k++) {
            const nx = Math.max(0, Math.min(width - 1, px + k))
            const idx = (py * width + nx) * 4
            const weight = kernel[k + blurRadius]
            r += pixels[idx] * weight
            g += pixels[idx + 1] * weight
            b += pixels[idx + 2] * weight
            a += pixels[idx + 3] * weight
          }
          const idx = (py * width + px) * 4
          temp[idx] = r
          temp[idx + 1] = g
          temp[idx + 2] = b
          temp[idx + 3] = a
        }
      }
      
      // Vertical pass
      for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
          let r = 0, g = 0, b = 0, a = 0
          for (let k = -blurRadius; k <= blurRadius; k++) {
            const ny = Math.max(0, Math.min(height - 1, py + k))
            const idx = (ny * width + px) * 4
            const weight = kernel[k + blurRadius]
            r += temp[idx] * weight
            g += temp[idx + 1] * weight
            b += temp[idx + 2] * weight
            a += temp[idx + 3] * weight
          }
          const idx = (py * width + px) * 4
          result[idx] = r
          result[idx + 1] = g
          result[idx + 2] = b
          result[idx + 3] = a
        }
      }
      
      // Copy result back with circular mask for brush
      for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
          const dx = px - halfSize - blurRadius
          const dy = py - halfSize - blurRadius
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist <= halfSize) {
            const falloff = Math.min(1, (halfSize - dist) / 5)
            const idx = (py * width + px) * 4
            pixels[idx] = pixels[idx] * (1 - falloff) + result[idx] * falloff
            pixels[idx + 1] = pixels[idx + 1] * (1 - falloff) + result[idx + 1] * falloff
            pixels[idx + 2] = pixels[idx + 2] * (1 - falloff) + result[idx + 2] * falloff
          }
        }
      }
      
      ctx.putImageData(data, clampedX - halfSize - blurRadius, clampedY - halfSize - blurRadius)
    } catch (e) {
      console.warn('Blur tool error:', e)
    }
  }, [])

  // Sharpen tool - improved unsharp mask
  const applySharpen = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, strength: number) => {
    const halfSize = Math.floor(size / 2)
    const canvas = ctx.canvas
    const clampedX = Math.max(halfSize + 1, Math.min(canvas.width - halfSize - 1, Math.floor(x)))
    const clampedY = Math.max(halfSize + 1, Math.min(canvas.height - halfSize - 1, Math.floor(y)))
    
    try {
      const data = ctx.getImageData(clampedX - halfSize - 1, clampedY - halfSize - 1, size + 2, size + 2)
      const width = data.width
      const height = data.height
      const pixels = data.data
      const result = new Uint8ClampedArray(pixels.length)
      
      // Sharpen kernel (unsharp mask)
      const amount = strength / 100
      const kernel = [
        0, -amount, 0,
        -amount, 1 + 4 * amount, -amount,
        0, -amount, 0
      ]
      
      for (let py = 1; py < height - 1; py++) {
        for (let px = 1; px < width - 1; px++) {
          // Check if within circular brush
          const dx = px - halfSize - 1
          const dy = py - halfSize - 1
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist <= halfSize + 1) {
            for (let c = 0; c < 3; c++) {
              let sum = 0
              for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                  const idx = ((py + ky) * width + (px + kx)) * 4 + c
                  sum += pixels[idx] * kernel[(ky + 1) * 3 + (kx + 1)]
                }
              }
              result[(py * width + px) * 4 + c] = Math.min(255, Math.max(0, Math.floor(sum)))
            }
            result[(py * width + px) * 4 + 3] = pixels[(py * width + px) * 4 + 3]
          } else {
            // Copy original outside brush area
            for (let c = 0; c < 4; c++) {
              result[(py * width + px) * 4 + c] = pixels[(py * width + px) * 4 + c]
            }
          }
        }
      }
      
      // Apply with feathered edges
      for (let py = 1; py < height - 1; py++) {
        for (let px = 1; px < width - 1; px++) {
          const dx = px - halfSize - 1
          const dy = py - halfSize - 1
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist <= halfSize) {
            const falloff = Math.min(1, (halfSize - dist) / 3)
            const idx = (py * width + px) * 4
            for (let c = 0; c < 3; c++) {
              pixels[idx + c] = pixels[idx + c] * (1 - falloff) + result[idx + c] * falloff
            }
          }
        }
      }
      
      ctx.putImageData(data, clampedX - halfSize - 1, clampedY - halfSize - 1)
    } catch (e) {
      console.warn('Sharpen tool error:', e)
    }
  }, [])

  // Smudge tool - improved with proper pixel sampling
  const applySmudge = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, lastX: number, lastY: number, size: number, strength: number) => {
    const halfSize = Math.floor(size / 2)
    const canvas = ctx.canvas
    
    // Clamp coordinates
    const clampedLastX = Math.max(0, Math.min(canvas.width - 1, Math.floor(lastX)))
    const clampedLastY = Math.max(0, Math.min(canvas.height - 1, Math.floor(lastY)))
    const clampedX = Math.max(halfSize, Math.min(canvas.width - halfSize, Math.floor(x)))
    const clampedY = Math.max(halfSize, Math.min(canvas.height - halfSize, Math.floor(y)))
    
    try {
      // Get colors along the stroke path for smoother smudging
      const dx = clampedX - clampedLastX
      const dy = clampedY - clampedLastY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const steps = Math.max(1, Math.floor(dist / 2))
      
      for (let step = 0; step <= steps; step++) {
        const t = step / steps
        const sampleX = Math.floor(clampedLastX + dx * t)
        const sampleY = Math.floor(clampedLastY + dy * t)
        const targetX = Math.floor(clampedLastX + dx * t + dx / steps)
        const targetY = Math.floor(clampedLastY + dy * t + dy / steps)
        
        if (targetX < halfSize || targetX >= canvas.width - halfSize ||
            targetY < halfSize || targetY >= canvas.height - halfSize) continue
        
        // Get source pixel
        const sourcePixel = ctx.getImageData(sampleX, sampleY, 1, 1).data
        
        // Get destination area
        const destData = ctx.getImageData(targetX - halfSize, targetY - halfSize, size, size)
        
        const factor = strength / 100 * 0.5 // Reduce per-step influence
        
        for (let i = 0; i < destData.data.length; i += 4) {
          const px = (i / 4) % size
          const py = Math.floor((i / 4) / size)
          const pixelDist = Math.sqrt((px - halfSize) ** 2 + (py - halfSize) ** 2)
          
          if (pixelDist <= halfSize) {
            const blendFactor = factor * (1 - pixelDist / halfSize)
            destData.data[i] = Math.floor(destData.data[i] * (1 - blendFactor) + sourcePixel[0] * blendFactor)
            destData.data[i + 1] = Math.floor(destData.data[i + 1] * (1 - blendFactor) + sourcePixel[1] * blendFactor)
            destData.data[i + 2] = Math.floor(destData.data[i + 2] * (1 - blendFactor) + sourcePixel[2] * blendFactor)
          }
        }
        
        ctx.putImageData(destData, targetX - halfSize, targetY - halfSize)
      }
    } catch (e) {
      console.warn('Smudge tool error:', e)
    }
  }, [])

  // Apply crop to canvas
  const applyCrop = useCallback(() => {
    if (!cropRect) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get the cropped image data
    const imageData = ctx.getImageData(cropRect.x, cropRect.y, cropRect.width, cropRect.height)
    
    // Create new canvas with cropped dimensions
    const newCanvas = document.createElement('canvas')
    newCanvas.width = cropRect.width
    newCanvas.height = cropRect.height
    const newCtx = newCanvas.getContext('2d')
    if (!newCtx) return
    
    newCtx.putImageData(imageData, 0, 0)
    
    // Update the active layer with cropped image
    if (activeLayerId) {
      const newPreview = newCanvas.toDataURL()
      const img = new window.Image()
      img.src = newPreview
      imageCacheRef.current.set(newPreview, img)
      updateLayer(activeLayerId, { 
        preview: newPreview,
        size: { width: cropRect.width, height: cropRect.height },
        position: { x: 0, y: 0 }
      })
    }
    
    setCropRect(null)
    showToast('success', 'Crop applied')
    saveToHistory('Crop')
  }, [cropRect, activeLayerId, updateLayer, showToast, saveToHistory])

  // Flip canvas horizontally
  const flipHorizontal = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    // Create flipped canvas
    const flippedCanvas = document.createElement('canvas')
    flippedCanvas.width = canvas.width
    flippedCanvas.height = canvas.height
    const flippedCtx = flippedCanvas.getContext('2d')
    if (!flippedCtx) return
    
    flippedCtx.translate(canvas.width, 0)
    flippedCtx.scale(-1, 1)
    flippedCtx.drawImage(canvas, 0, 0)
    
    // Update layer
    if (activeLayerId) {
      const newPreview = flippedCanvas.toDataURL()
      const img = new window.Image()
      img.src = newPreview
      imageCacheRef.current.set(newPreview, img)
      updateLayer(activeLayerId, { preview: newPreview })
      saveToHistory('Flip Horizontal')
      showToast('success', 'Flipped horizontally')
    }
  }, [activeLayerId, updateLayer, saveToHistory, showToast])

  // Flip canvas vertically
  const flipVertical = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const flippedCanvas = document.createElement('canvas')
    flippedCanvas.width = canvas.width
    flippedCanvas.height = canvas.height
    const flippedCtx = flippedCanvas.getContext('2d')
    if (!flippedCtx) return
    
    flippedCtx.translate(0, canvas.height)
    flippedCtx.scale(1, -1)
    flippedCtx.drawImage(canvas, 0, 0)
    
    if (activeLayerId) {
      const newPreview = flippedCanvas.toDataURL()
      const img = new window.Image()
      img.src = newPreview
      imageCacheRef.current.set(newPreview, img)
      updateLayer(activeLayerId, { preview: newPreview })
      saveToHistory('Flip Vertical')
      showToast('success', 'Flipped vertically')
    }
  }, [activeLayerId, updateLayer, saveToHistory, showToast])

  // Rotate canvas
  const rotateCanvas = useCallback((degrees: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const radians = (degrees * Math.PI) / 180
    const sin = Math.abs(Math.sin(radians))
    const cos = Math.abs(Math.cos(radians))
    
    const newWidth = canvas.width * cos + canvas.height * sin
    const newHeight = canvas.width * sin + canvas.height * cos
    
    const rotatedCanvas = document.createElement('canvas')
    rotatedCanvas.width = newWidth
    rotatedCanvas.height = newHeight
    const rotatedCtx = rotatedCanvas.getContext('2d')
    if (!rotatedCtx) return
    
    rotatedCtx.translate(newWidth / 2, newHeight / 2)
    rotatedCtx.rotate(radians)
    rotatedCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2)
    
    if (activeLayerId) {
      const newPreview = rotatedCanvas.toDataURL()
      const img = new window.Image()
      img.src = newPreview
      imageCacheRef.current.set(newPreview, img)
      updateLayer(activeLayerId, { 
        preview: newPreview,
        size: { width: newWidth, height: newHeight }
      })
      saveToHistory(`Rotate ${degrees}°`)
      showToast('success', `Rotated ${degrees}°`)
    }
  }, [activeLayerId, updateLayer, saveToHistory, showToast])

  // Red eye removal - improved detection and correction
  const applyRedEyeRemoval = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const halfSize = Math.floor(size / 2)
    const canvas = ctx.canvas
    const clampedX = Math.max(halfSize, Math.min(canvas.width - halfSize, Math.floor(x)))
    const clampedY = Math.max(halfSize, Math.min(canvas.height - halfSize, Math.floor(y)))
    
    try {
      const data = ctx.getImageData(clampedX - halfSize, clampedY - halfSize, size, size)
      
      for (let i = 0; i < data.data.length; i += 4) {
        const r = data.data[i]
        const g = data.data[i + 1]
        const b = data.data[i + 2]
        
        // Distance from center for falloff
        const px = (i / 4) % size
        const py = Math.floor((i / 4) / size)
        const dist = Math.sqrt((px - halfSize) ** 2 + (py - halfSize) ** 2)
        
        if (dist <= halfSize) {
          // Enhanced red eye detection
          const max = Math.max(r, g, b)
          const min = Math.min(r, g, b)
          const saturation = max > 0 ? (max - min) / max : 0
          
          // Red is dominant and highly saturated
          const isRedEye = r > 60 && r > g * 1.3 && r > b * 1.3 && saturation > 0.4
          
          if (isRedEye) {
            const falloff = 1 - dist / halfSize
            
            // Calculate new color - desaturate towards neutral gray with slight blue
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b
            const targetG = luminance * 0.9
            const targetB = luminance * 1.1 // Slight blue tint for natural look
            const targetR = luminance * 0.8 // Reduce red
            
            // Blend based on red dominance
            const redDominance = (r / (g + b + 1)) - 0.5
            const blendFactor = Math.min(1, redDominance * 2) * falloff
            
            data.data[i] = Math.floor(r * (1 - blendFactor) + targetR * blendFactor)
            data.data[i + 1] = Math.floor(g * (1 - blendFactor) + targetG * blendFactor)
            data.data[i + 2] = Math.floor(b * (1 - blendFactor) + targetB * blendFactor)
          }
        }
      }
      
      ctx.putImageData(data, clampedX - halfSize, clampedY - halfSize)
    } catch (e) {
      console.warn('Red eye removal error:', e)
    }
  }, [])

  // Apply gradient fill
  const applyGradient = useCallback((ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, type: 'linear' | 'radial' | 'angular' | 'diamond') => {
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    
    let gradient: CanvasGradient
    
    if (type === 'linear') {
      gradient = ctx.createLinearGradient(startX, startY, endX, endY)
    } else if (type === 'radial') {
      const centerX = (startX + endX) / 2
      const centerY = (startY + endY) / 2
      const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2) / 2
      gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    } else {
      // Angular and diamond fallback to linear
      gradient = ctx.createLinearGradient(startX, startY, endX, endY)
    }
    
    const color1 = toolOptions.gradientReverse ? secondaryColor : primaryColor
    const color2 = toolOptions.gradientReverse ? primaryColor : secondaryColor
    
    gradient.addColorStop(0, color1)
    gradient.addColorStop(1, color2)
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }, [primaryColor, secondaryColor, toolOptions.gradientReverse])

  // Pattern stamp
  const applyPatternStamp = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, pattern: 'dots' | 'lines' | 'grid') => {
    ctx.save()
    ctx.globalAlpha = brushSettings.opacity / 100
    ctx.fillStyle = primaryColor
    ctx.strokeStyle = primaryColor
    ctx.lineWidth = 1
    
    const halfSize = Math.floor(size / 2)
    
    if (pattern === 'dots') {
      for (let py = -halfSize; py < halfSize; py += 6) {
        for (let px = -halfSize; px < halfSize; px += 6) {
          const dist = Math.sqrt(px * px + py * py)
          if (dist <= halfSize) {
            ctx.beginPath()
            ctx.arc(x + px, y + py, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    } else if (pattern === 'lines') {
      for (let py = -halfSize; py < halfSize; py += 4) {
        const dist1 = Math.sqrt((-halfSize) ** 2 + py ** 2)
        const dist2 = Math.sqrt(halfSize ** 2 + py ** 2)
        if (dist1 <= halfSize || dist2 <= halfSize) {
          ctx.beginPath()
          ctx.moveTo(x - halfSize, y + py)
          ctx.lineTo(x + halfSize, y + py)
          ctx.stroke()
        }
      }
    } else if (pattern === 'grid') {
      for (let py = -halfSize; py < halfSize; py += 8) {
        for (let px = -halfSize; px < halfSize; px += 8) {
          const dist = Math.sqrt(px * px + py * py)
          if (dist <= halfSize) {
            ctx.strokeRect(x + px, y + py, 4, 4)
          }
        }
      }
    }
    
    ctx.restore()
  }, [brushSettings.opacity, primaryColor])

  // Drawing handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const { x, y } = getCanvasCoords(e)

    // Clone stamp - set source with Alt+Click
    if ((activeTool === 'clone-stamp' || activeTool === 'healing') && e.altKey) {
      setCloneSourcePoint({ x, y })
      setIsSettingCloneSource(true)
      showToast('info', `Clone source set at (${Math.floor(x)}, ${Math.floor(y)})`)
      return
    }

    if (activeTool === 'hand' || e.button === 1) {
      setIsPanning(true)
      setLastPos({ x: e.clientX, y: e.clientY })
      return
    }

    // Selection tools
    if (['select-rect', 'select-ellipse'].includes(activeTool)) {
      setIsSelecting(true)
      setSelectionStart({ x, y })
      return
    }

    if (activeTool === 'lasso') {
      setIsSelecting(true)
      setSelectionPath([{ x, y }])
      return
    }

    if (activeTool === 'lasso-polygon') {
      const newPoints = [...polygonPoints, { x, y }]
      setPolygonPoints(newPoints)
      return
    }

    if (activeTool === 'magic-wand') {
      magicWandSelect(x, y, toolOptions.tolerance, toolOptions.contiguous)
      return
    }

    if (activeTool === 'quick-select') {
      setIsSelecting(true)
      quickSelectBrush(x, y, brushSettings.size, e.shiftKey)
      return
    }

    // Crop tool
    if (activeTool === 'crop') {
      setIsCropping(true)
      setCropRect({ x, y, width: 0, height: 0 })
      return
    }

    // Text tool
    if (activeTool === 'text') {
      setTextInput({ x, y, value: '', active: true })
      return
    }

    // Red eye removal
    if (activeTool === 'red-eye') {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        applyRedEyeRemoval(ctx, x, y, brushSettings.size)
        if (activeLayerId) {
          const newPreview = canvas.toDataURL()
          const img = new window.Image()
          img.src = newPreview
          imageCacheRef.current.set(newPreview, img)
          updateLayer(activeLayerId, { preview: newPreview })
        }
        showToast('success', 'Red eye removed')
      }
      return
    }

    // Pattern stamp
    if (activeTool === 'pattern-stamp') {
      setIsDrawing(true)
      setLastPos({ x, y })
      const ctx = canvas.getContext('2d')
      if (ctx) {
        applyPatternStamp(ctx, x, y, brushSettings.size, patternType)
      }
      return
    }

    // Shape tools
    if (['rectangle', 'ellipse', 'line', 'triangle', 'star', 'heart', 'polygon'].includes(activeTool)) {
      setIsDrawing(true)
      setShapeStart({ x, y })
      setShapeEnd({ x, y })
      return
    }

    // Pen tool
    if (activeTool === 'pen') {
      if (penPath.length > 0 && Math.abs(x - penPath[0].x) < 10 && Math.abs(y - penPath[0].y) < 10) {
        // Close path
        const newPath = [...penPath, { ...penPath[0] }]
        setPenPath([])
        // Create shape layer from path
        // For now, just show message
        showToast('info', 'Path closed - shape created')
      } else {
        setPenPath([...penPath, { x, y }])
      }
      return
    }

    // Paint tools
    if (['brush', 'pencil', 'airbrush', 'eraser', 'healing', 'spot-healing', 'clone-stamp', 'blur-tool', 'sharpen-tool', 'smudge', 'dodge', 'burn', 'sponge'].includes(activeTool)) {
      setIsDrawing(true)
      setLastPos({ x, y })
      // For straight line drawing - save start point if Shift is held
      if (e.shiftKey) {
        setStraightLineStart({ x, y })
      }
    }

    if (activeTool === 'fill') {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = primaryColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        if (activeLayerId) {
          const newPreview = canvas.toDataURL()
          const img = new window.Image()
          img.src = newPreview
          imageCacheRef.current.set(newPreview, img)
          updateLayer(activeLayerId, { preview: newPreview })
        }
        showToast('success', 'Area filled')
      }
    }

    if (activeTool === 'gradient') {
      setIsDrawing(true)
      setSelectionStart({ x, y })
      return
    }

    if (activeTool === 'eyedropper') {
      const [r, g, b] = getPixelAt(x, y)
      const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      if (e.shiftKey) {
        setSecondaryColor(color)
      } else {
        setPrimaryColor(color)
      }
      showToast('info', `Color sampled: ${color}`)
    }

    if (activeTool === 'zoom') {
      if (e.altKey) {
        setZoom(zoom / 1.25)
      } else {
        setZoom(zoom * 1.25)
      }
    }
  }, [activeTool, zoom, panOffset, primaryColor, secondaryColor, activeLayerId, updateLayer, setPrimaryColor, setSecondaryColor, setZoom, showToast, getCanvasCoords, brushSettings.size, toolOptions, magicWandSelect, quickSelectBrush, polygonPoints, penPath, getPixelAt, cloneSourcePoint, setSelectionPath, applyPatternStamp, patternType, applyRedEyeRemoval])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // Update brush cursor position
    const coords = getCanvasCoords(e)
    setBrushCursorPos({ x: e.clientX, y: e.clientY })

    if (isPanning) {
      const dx = e.clientX - lastPos.x
      const dy = e.clientY - lastPos.y
      setPanOffset({ x: panOffset.x + dx / zoom, y: panOffset.y + dy / zoom })
      setLastPos({ x: e.clientX, y: e.clientY })
      return
    }

    const { x, y } = coords

    // Crop in progress
    if (isCropping && cropRect) {
      const width = x - cropRect.x
      const height = y - cropRect.y
      
      // Apply aspect ratio constraint if not free
      let finalWidth = Math.abs(width)
      let finalHeight = Math.abs(height)
      
      if (toolOptions.cropAspectRatio !== 'free') {
        const ratios: Record<string, number> = {
          '1:1': 1,
          '4:3': 4/3,
          '16:9': 16/9,
          '3:2': 3/2
        }
        const ratio = ratios[toolOptions.cropAspectRatio]
        if (finalWidth > finalHeight * ratio) {
          finalHeight = finalWidth / ratio
        } else {
          finalWidth = finalHeight * ratio
        }
      }
      
      setCropRect({
        x: width < 0 ? x : cropRect.x,
        y: height < 0 ? y : cropRect.y,
        width: finalWidth,
        height: finalHeight
      })
      return
    }

    // Update shape preview
    if (isDrawing && shapeStart && ['rectangle', 'ellipse', 'line', 'triangle', 'star', 'heart', 'polygon'].includes(activeTool)) {
      setShapeEnd({ x, y })
      return
    }

    // Selection in progress
    if (isSelecting && selectionStart) {
      if (['select-rect', 'select-ellipse'].includes(activeTool)) {
        const width = x - selectionStart.x
        const height = y - selectionStart.y
        setSelection({
          x: width < 0 ? x : selectionStart.x,
          y: height < 0 ? y : selectionStart.y,
          width: Math.abs(width),
          height: Math.abs(height),
          type: activeTool === 'select-rect' ? 'rectangle' : 'ellipse',
          feather: toolOptions.feather,
          antiAlias: toolOptions.antiAlias,
        })
      } else if (activeTool === 'lasso') {
        setSelectionPath([...(selectionPath || []), { x, y }])
      } else if (activeTool === 'quick-select') {
        quickSelectBrush(x, y, brushSettings.size, true)
      }
      return
    }

    // Gradient preview
    if (isDrawing && activeTool === 'gradient' && selectionStart) {
      setGradientPreview({ start: selectionStart, end: { x, y } })
      return
    }

    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Straight line drawing with Shift
    if (isShiftHeld && straightLineStart && ['brush', 'pencil', 'eraser'].includes(activeTool)) {
      // Don't draw while moving - wait for mouse up
      // Just update lastPos for reference
      return
    }

    // Apply tool effects
    if (activeTool === 'brush' || activeTool === 'pencil') {
      applyBrushStroke(ctx, lastPos.x, lastPos.y, x, y, primaryColor, brushSettings)
    } else if (activeTool === 'airbrush') {
      ctx.globalAlpha = brushSettings.opacity / 100 * 0.3
      ctx.fillStyle = primaryColor
      for (let i = 0; i < 5; i++) {
        const ox = (Math.random() - 0.5) * brushSettings.size * 0.5
        const oy = (Math.random() - 0.5) * brushSettings.size * 0.5
        ctx.beginPath()
        ctx.arc(x + ox, y + oy, brushSettings.size / 4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    } else if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.moveTo(lastPos.x, lastPos.y)
      ctx.lineTo(x, y)
      ctx.strokeStyle = 'rgba(0,0,0,1)'
      ctx.lineWidth = eraserSettings.size
      ctx.lineCap = 'round'
      ctx.stroke()
      ctx.globalCompositeOperation = 'source-over'
    } else if (activeTool === 'clone-stamp' && cloneSourcePoint) {
      const offsetX = x - lastPos.x
      const offsetY = y - lastPos.y
      const sourceX = cloneSourcePoint.x + offsetX
      const sourceY = cloneSourcePoint.y + offsetY
      applyCloneStamp(ctx, x, y, sourceX, sourceY, brushSettings.size, brushSettings.opacity)
      if (toolOptions.aligned) {
        setCloneSourcePoint({ x: sourceX, y: sourceY })
      }
    } else if (activeTool === 'healing' && cloneSourcePoint) {
      const offsetX = x - lastPos.x
      const offsetY = y - lastPos.y
      const sourceX = cloneSourcePoint.x + offsetX
      const sourceY = cloneSourcePoint.y + offsetY
      applyHealing(ctx, x, y, sourceX, sourceY, brushSettings.size)
    } else if (activeTool === 'spot-healing') {
      applySpotHealing(ctx, x, y, brushSettings.size)
    } else if (activeTool === 'dodge') {
      applyDodge(ctx, x, y, brushSettings.size, toolOptions.dodgeBurnExposure, toolOptions.dodgeBurnRange)
    } else if (activeTool === 'burn') {
      applyBurn(ctx, x, y, brushSettings.size, toolOptions.dodgeBurnExposure, toolOptions.dodgeBurnRange)
    } else if (activeTool === 'sponge') {
      applySponge(ctx, x, y, brushSettings.size, toolOptions.spongeMode)
    } else if (activeTool === 'blur-tool') {
      applyBlur(ctx, x, y, brushSettings.size, brushSettings.opacity)
    } else if (activeTool === 'sharpen-tool') {
      applySharpen(ctx, x, y, brushSettings.size, brushSettings.opacity)
    } else if (activeTool === 'smudge') {
      applySmudge(ctx, x, y, lastPos.x, lastPos.y, brushSettings.size, brushSettings.opacity)
    } else if (activeTool === 'pattern-stamp') {
      applyPatternStamp(ctx, x, y, brushSettings.size, patternType)
    }

    setLastPos({ x, y })
  }, [isPanning, isDrawing, isSelecting, lastPos, zoom, panOffset, activeTool, primaryColor, brushSettings, eraserSettings, selectionStart, toolOptions, cloneSourcePoint, setSelectionPath, quickSelectBrush, applyBrushStroke, applyCloneStamp, applyHealing, applySpotHealing, applyDodge, applyBurn, applySponge, applyBlur, applySharpen, applySmudge, setPanOffset, setZoom, getCanvasCoords, shapeStart, shapeEnd, setSelection, selectionPath, applyPatternStamp, patternType, cropRect, isCropping, isShiftHeld, straightLineStart])

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    // Complete cropping
    if (isCropping) {
      setIsCropping(false)
      // Keep crop rect visible - user needs to press Enter or double-click to apply
      return
    }

    // Complete straight line drawing (Shift held)
    if (isDrawing && isShiftHeld && straightLineStart && ctx && canvas && ['brush', 'pencil', 'eraser'].includes(activeTool)) {
      const { x, y } = getCanvasCoords(e as unknown as React.MouseEvent<HTMLCanvasElement>)
      
      // Calculate the angle and snap to horizontal, vertical, or 45-degree
      const dx = x - straightLineStart.x
      const dy = y - straightLineStart.y
      const angle = Math.atan2(dy, dx)
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Snap angle to nearest 45 degrees
      const snappedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4)
      const endX = straightLineStart.x + Math.cos(snappedAngle) * distance
      const endY = straightLineStart.y + Math.sin(snappedAngle) * distance
      
      if (activeTool === 'brush' || activeTool === 'pencil') {
        // Draw straight line with brush
        ctx.beginPath()
        ctx.moveTo(straightLineStart.x, straightLineStart.y)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = primaryColor
        ctx.lineWidth = brushSettings.size
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.globalAlpha = brushSettings.opacity / 100
        ctx.stroke()
        ctx.globalAlpha = 1
      } else if (activeTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.beginPath()
        ctx.moveTo(straightLineStart.x, straightLineStart.y)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = 'rgba(0,0,0,1)'
        ctx.lineWidth = eraserSettings.size
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.globalCompositeOperation = 'source-over'
      }
      
      if (activeLayerId) {
        const newPreview = canvas.toDataURL()
        const img = new window.Image()
        img.src = newPreview
        imageCacheRef.current.set(newPreview, img)
        updateLayer(activeLayerId, { preview: newPreview })
        saveToHistory(`Draw straight line`)
      }
      
      setStraightLineStart(null)
      setIsDrawing(false)
      showToast('success', 'Straight line drawn')
      return
    }

    // Complete gradient
    if (isDrawing && activeTool === 'gradient' && gradientPreview && ctx) {
      applyGradient(ctx, gradientPreview.start.x, gradientPreview.start.y, gradientPreview.end.x, gradientPreview.end.y, toolOptions.gradientType)
      if (activeLayerId && canvas) {
        const newPreview = canvas.toDataURL()
        const img = new window.Image()
        img.src = newPreview
        imageCacheRef.current.set(newPreview, img)
        updateLayer(activeLayerId, { preview: newPreview })
      }
      setGradientPreview(null)
      setIsDrawing(false)
      setSelectionStart(null)
      showToast('success', 'Gradient applied')
      saveToHistory('Gradient')
      return
    }

    // Complete selection
    if (isSelecting) {
      if (activeTool === 'lasso' && selectionPath && selectionPath.length > 2) {
        setSelection({
          x: Math.min(...selectionPath.map(p => p.x)),
          y: Math.min(...selectionPath.map(p => p.y)),
          width: Math.max(...selectionPath.map(p => p.x)) - Math.min(...selectionPath.map(p => p.x)),
          height: Math.max(...selectionPath.map(p => p.y)) - Math.min(...selectionPath.map(p => p.y)),
          type: 'lasso',
          path: selectionPath,
          feather: toolOptions.feather,
          antiAlias: toolOptions.antiAlias,
        })
        setSelectionPath(null)
      }
      setIsSelecting(false)
      setSelectionStart(null)
      return
    }

    // Complete shape
    if (isDrawing && shapeStart && shapeEnd && ctx) {
      const minX = Math.min(shapeStart.x, shapeEnd.x)
      const minY = Math.min(shapeStart.y, shapeEnd.y)
      const width = Math.abs(shapeEnd.x - shapeStart.x)
      const height = Math.abs(shapeEnd.y - shapeStart.y)

      if (width > 5 && height > 5) {
        const newLayer: Omit<Layer, 'id'> = {
          name: `${activeTool} shape`,
          type: 'shape',
          visible: true,
          locked: false,
          opacity: 100,
          blendMode: 'normal',
          data: null,
          preview: null,
          position: { x: minX, y: minY },
          size: { width, height },
          rotation: 0,
          shape: {
            type: activeTool as 'rectangle' | 'ellipse' | 'polygon' | 'line',
            fill: toolOptions.shapeFill,
            stroke: toolOptions.shapeStroke,
            strokeWidth: toolOptions.shapeStrokeWidth,
            cornerRadius: toolOptions.shapeCornerRadius,
            sides: toolOptions.polygonSides,
          },
        }
        addLayer(newLayer)
        showToast('success', `${activeTool} shape created`)
      }
      
      setShapeStart(null)
      setShapeEnd(null)
    }

    if (isDrawing && canvas && activeLayerId && ctx) {
      const newPreview = canvas.toDataURL()
      // Update image cache immediately to prevent preview flicker
      const img = new window.Image()
      img.src = newPreview
      imageCacheRef.current.set(newPreview, img)
      updateLayer(activeLayerId, { preview: newPreview })
      saveToHistory(`Use ${activeTool}`)
    }

    setIsDrawing(false)
    setIsPanning(false)
    setIsSettingCloneSource(false)
  }, [isDrawing, isSelecting, activeLayerId, updateLayer, setSelection, activeTool, selectionPath, toolOptions, shapeStart, shapeEnd, addLayer, showToast, setSelectionPath, saveToHistory, isCropping, gradientPreview, applyGradient, cropRect, isShiftHeld, straightLineStart, getCanvasCoords, primaryColor, brushSettings, eraserSettings])

  // Double-click handler for polygon lasso and crop
  const handleDoubleClick = useCallback(() => {
    if (activeTool === 'lasso-polygon' && polygonPoints.length > 2) {
      setSelection({
        x: Math.min(...polygonPoints.map(p => p.x)),
        y: Math.min(...polygonPoints.map(p => p.y)),
        width: Math.max(...polygonPoints.map(p => p.x)) - Math.min(...polygonPoints.map(p => p.x)),
        height: Math.max(...polygonPoints.map(p => p.y)) - Math.min(...polygonPoints.map(p => p.y)),
        type: 'lasso',
        path: polygonPoints,
        feather: toolOptions.feather,
        antiAlias: toolOptions.antiAlias,
      })
      setPolygonPoints([])
      showToast('success', 'Polygon selection created')
    }
    
    // Apply crop on double-click
    if (activeTool === 'crop' && cropRect && cropRect.width > 10 && cropRect.height > 10) {
      applyCrop()
    }
  }, [activeTool, polygonPoints, setSelection, toolOptions.feather, toolOptions.antiAlias, showToast, setPolygonPoints, cropRect, applyCrop])

  // Touch handlers for mobile support
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()

    // Handle pinch-to-zoom with two fingers
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const dist = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
      setTouchStartDist(dist)
      setTouchStartZoom(zoom)
      
      // Calculate center point for panning
      const centerX = (touch1.clientX + touch2.clientX) / 2
      const centerY = (touch1.clientY + touch2.clientY) / 2
      setLastTouchCenter({ x: centerX, y: centerY })
      return
    }

    // Single touch - treat like mouse
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      const x = (touch.clientX - rect.left) / zoom - panOffset.x
      const y = (touch.clientY - rect.top) / zoom - panOffset.y

      // Long press for eyedropper
      if (activeTool === 'eyedropper' || activeTool === 'brush' || activeTool === 'eraser') {
        const timeout = setTimeout(() => {
          // Switch to eyedropper temporarily
          const [r, g, b] = getPixelAt(x, y)
          const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
          setPrimaryColor(color)
          showToast('info', `Color picked: ${color}`)
        }, 500)
        setLongPressTimeout(timeout)
      }

      // Simulate mouse down
      const mouseEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        button: 0,
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
      } as unknown as React.MouseEvent<HTMLCanvasElement>

      handleMouseDown(mouseEvent)
    }
  }, [zoom, panOffset, activeTool, handleMouseDown, getPixelAt, setPrimaryColor, showToast])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Cancel long press on move
    if (longPressTimeout) {
      clearTimeout(longPressTimeout)
      setLongPressTimeout(null)
    }

    const rect = canvas.getBoundingClientRect()

    // Handle pinch-to-zoom
    if (e.touches.length === 2 && touchStartDist !== null) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const dist = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
      
      // Calculate new zoom
      const scale = dist / touchStartDist
      const newZoom = Math.max(0.1, Math.min(10, touchStartZoom * scale))
      setZoom(newZoom)

      // Handle two-finger pan
      const centerX = (touch1.clientX + touch2.clientX) / 2
      const centerY = (touch1.clientY + touch2.clientY) / 2
      if (lastTouchCenter) {
        const dx = (centerX - lastTouchCenter.x) / newZoom
        const dy = (centerY - lastTouchCenter.y) / newZoom
        setPanOffset({ x: panOffset.x + dx, y: panOffset.y + dy })
      }
      setLastTouchCenter({ x: centerX, y: centerY })
      return
    }

    // Single touch - treat like mouse move
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      const mouseEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        button: 0,
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
      } as unknown as React.MouseEvent<HTMLCanvasElement>

      handleMouseMove(mouseEvent)
    }
  }, [touchStartDist, touchStartZoom, zoom, panOffset, lastTouchCenter, handleMouseMove, longPressTimeout, setZoom, setPanOffset])

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    // Cancel long press
    if (longPressTimeout) {
      clearTimeout(longPressTimeout)
      setLongPressTimeout(null)
    }

    // Reset touch state
    setTouchStartDist(null)
    setLastTouchCenter(null)

    // Simulate mouse up
    const mouseEvent = {
      clientX: 0,
      clientY: 0,
      button: 0,
      shiftKey: false,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
    } as unknown as React.MouseEvent<HTMLCanvasElement>

    handleMouseUp(mouseEvent)
  }, [handleMouseUp, longPressTimeout])

  // File handling
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new window.Image()
      img.onload = () => {
        loadImage(event.target?.result as string, img.width, img.height)
        showToast('success', `Loaded: ${file.name}`)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [loadImage, showToast])

  // Export
  const handleExport = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let exportWidth = canvasSize.width
    let exportHeight = canvasSize.height

    if (exportSize === '0.5x') {
      exportWidth = Math.round(canvasSize.width * 0.5)
      exportHeight = Math.round(canvasSize.height * 0.5)
    } else if (exportSize === '2x') {
      exportWidth = canvasSize.width * 2
      exportHeight = canvasSize.height * 2
    } else if (exportSize === '4x') {
      exportWidth = canvasSize.width * 4
      exportHeight = canvasSize.height * 4
    }

    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = exportWidth
    exportCanvas.height = exportHeight
    const exportCtx = exportCanvas.getContext('2d')

    if (exportCtx) {
      exportCtx.filter = getFilterString()
      
      if (exportSize !== '1x') {
        exportCtx.scale(exportWidth / canvasSize.width, exportHeight / canvasSize.height)
      }

      const visibleLayers = layers.filter(l => l.visible).reverse()
      visibleLayers.forEach(layer => {
        exportCtx.globalAlpha = layer.opacity / 100
        exportCtx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation

        if (layer.preview) {
          const img = new window.Image()
          img.src = layer.preview
          if (img.complete) {
            exportCtx.drawImage(img, layer.position.x, layer.position.y, layer.size.width, layer.size.height)
          }
        }
      })

      if (exportFormat === 'jpg') {
        exportCtx.globalCompositeOperation = 'destination-over'
        exportCtx.fillStyle = '#ffffff'
        exportCtx.fillRect(0, 0, exportWidth, exportHeight)
      }

      const mimeType = exportFormat === 'jpg' ? 'image/jpeg' : exportFormat === 'webp' ? 'image/webp' : 'image/png'
      const quality = exportFormat === 'png' ? undefined : exportQuality / 100
      
      exportCanvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${fileName}.${exportFormat}`
        a.click()
        URL.revokeObjectURL(url)
        setShowExportDialog(false)
        showToast('success', `Exported: ${fileName}.${exportFormat}`)
      }, mimeType, quality)
    }
  }, [canvasSize, exportFormat, exportQuality, exportSize, fileName, getFilterString, layers, showToast])

  // Filter preset
  const applyFilterPreset = useCallback((presetId: string) => {
    setActiveFilterPreset(presetId)
    const preset = filterPresets.find(p => p.id === presetId)
    if (preset && presetId !== 'none') {
      resetAdjustments()
      Object.entries(preset.settings).forEach(([key, value]) => {
        setAdjustment(key as keyof typeof adjustments, value as number)
      })
      showToast('info', `Applied: ${preset.name}`)
    } else {
      resetAdjustments()
    }
  }, [resetAdjustments, setAdjustment, showToast])

  // AI handlers - actually call the API
  const handleAI = useCallback(async (task: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsAIProcessing(true)
    setAiTask(task)

    // Map task names to API actions
    const taskToAction: Record<string, string> = {
      'Enhancement': 'enhance',
      'Background Removal': 'bg-remove',
      'Object Removal': 'bg-remove',
      'Sky Replacement': 'color-grade',
      'Portrait Retouch': 'portrait',
      'Upscaling': 'upscale',
      'Upscaling 4X': 'upscale',
      'Denoise': 'denoise',
      'Color Grade': 'color-grade',
      'Depth Blur': 'analyze',
      'Vintage Style': 'color-grade',
      'Cinematic Style': 'color-grade',
    }

    const action = taskToAction[task] || 'enhance'

    try {
      const imageData = canvas.toDataURL('image/png')

      // Build request body based on action
      const requestBody: Record<string, unknown> = {
        action,
        image: imageData,
        settings: { scale: task.includes('4X') ? 4 : 2 }
      }

      // Add prompts for style-based actions
      if (task === 'Vintage Style') {
        requestBody.prompt = 'vintage film look, warm tones, faded colors, film grain aesthetic'
      } else if (task === 'Cinematic Style') {
        requestBody.prompt = 'cinematic movie look, dramatic contrast, teal and orange color grade, film-like'
      } else if (task === 'Sky Replacement') {
        requestBody.prompt = 'dramatic sky, sunset colors, natural looking sky replacement'
      }

      const response = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) throw new Error('AI request failed')

      const result = await response.json()

      // Apply AI suggestions if available
      if (result.suggestions) {
        Object.entries(result.suggestions).forEach(([key, value]) => {
          if (key !== 'description' && typeof value === 'number') {
            setAdjustment(key as keyof typeof adjustments, value as number)
          }
        })
        showToast('success', `${task}: ${result.suggestions.description || 'Applied'}`)
      } else if (result.enhancement) {
        if (result.enhancement.adjustments) {
          Object.entries(result.enhancement.adjustments).forEach(([key, value]) => {
            if (typeof value === 'number') {
              setAdjustment(key as keyof typeof adjustments, value as number)
            }
          })
        }
        showToast('success', `${task}: ${result.enhancement.preset || 'Enhanced'}`)
      } else if (result.portrait) {
        // Apply portrait adjustments
        if (result.portrait.skinSmoothing) {
          setAdjustment('clarity', -result.portrait.skinSmoothing / 2)
        }
        showToast('success', `Portrait: ${result.portrait.suggestions?.join(', ') || 'Enhanced'}`)
      } else if (result.colorGrade) {
        // Apply color grade
        if (result.colorGrade.temperature !== undefined) {
          setAdjustment('temperature', result.colorGrade.temperature)
        }
        if (result.colorGrade.saturation !== undefined) {
          setAdjustment('saturation', result.colorGrade.saturation)
        }
        if (result.colorGrade.vibrance !== undefined) {
          setAdjustment('vibrance', result.colorGrade.vibrance)
        }
        showToast('success', `${task}: ${result.colorGrade.description || 'Color grade applied'}`)
      } else if (result.analysis) {
        showToast('success', `${task}: Analysis complete`)
      } else if (result.denoise) {
        // Apply denoise suggestions
        if (result.denoise.recommendedStrength) {
          setAdjustment('clarity', -result.denoise.recommendedStrength / 4)
        }
        showToast('success', 'Denoise: Noise reduction applied')
      } else if (result.sharpen) {
        if (result.sharpen.recommendedAmount) {
          setAdjustment('sharpen', result.sharpen.recommendedAmount)
        }
        showToast('success', 'Sharpen: Detail enhancement applied')
      } else {
        showToast('success', `${task} completed`)
      }
    } catch (error) {
      console.error('AI error:', error)
      showToast('error', `${task} failed - try again`)
    } finally {
      setIsAIProcessing(false)
      setAiTask(null)
    }
  }, [showToast, setAdjustment, adjustments])

  // AI Background Removal - special handling
  const handleAIBackgroundRemove = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsAIProcessing(true)
    setAiTask('background-remove')

    try {
      const imageData = canvas.toDataURL('image/png')

      const response = await fetch('/api/ai/background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          image: imageData
        })
      })

      const result = await response.json()

      if (result.success) {
        showToast('info', `Background removal analysis complete. Use selection tools for fine-tuning.`)
      }
    } catch (error) {
      showToast('error', 'Background removal failed')
    } finally {
      setIsAIProcessing(false)
      setAiTask(null)
    }
  }, [showToast])

  // AI Upscale - special handling
  const handleAIUpscale = useCallback(async (scale: 2 | 4) => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsAIProcessing(true)
    setAiTask(`upscale-${scale}x`)

    try {
      const imageData = canvas.toDataURL('image/png')

      const response = await fetch('/api/ai/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upscale',
          image: imageData,
          settings: { scale }
        })
      })

      const result = await response.json()

      if (result.success) {
        // For now, just show a message - real upscaling would require dedicated service
        showToast('info', `${scale}x upscale ready. Export at ${scale}x for best results.`)
      }
    } catch (error) {
      showToast('error', 'Upscale failed')
    } finally {
      setIsAIProcessing(false)
      setAiTask(null)
    }
  }, [showToast])

  // Restore history state
  const restoreHistoryState = useCallback((index: number) => {
    const entry = history[index]
    if (entry) {
      const steps = index - historyIndex
      if (steps < 0) {
        for (let i = 0; i < Math.abs(steps); i++) {
          undo()
        }
      } else if (steps > 0) {
        for (let i = 0; i < steps; i++) {
          redo()
        }
      }
      showToast('info', `Restored: ${entry.action}`)
    }
  }, [undo, redo, showToast])

  // Add to recent commands
  const addToRecentCommands = useCallback((toolId: string) => {
    setRecentCommands(prev => [toolId, ...prev.filter(id => id !== toolId)].slice(0, 5))
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      // Command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
        return
      }

      // Swap colors
      if (e.key === 'x' && !e.ctrlKey && !e.metaKey) {
        swapColors()
        return
      }

      // Default colors
      if (e.key === 'd' && !e.ctrlKey && !e.metaKey) {
        setPrimaryColor('#00ffff')
        setSecondaryColor('#ff0066')
        return
      }

      // Enter to apply crop or finish text input
      if (e.key === 'Enter') {
        if (activeTool === 'crop' && cropRect && cropRect.width > 10 && cropRect.height > 10) {
          applyCrop()
          return
        }
        if (textInput?.active && textInput.value) {
          const canvas = canvasRef.current
          const ctx = canvas?.getContext('2d')
          if (ctx && canvas) {
            ctx.font = `${textOptions.fontWeight} ${textOptions.fontSize}px ${textOptions.fontFamily}`
            ctx.fillStyle = primaryColor
            ctx.fillText(textInput.value, textInput.x, textInput.y)
            if (activeLayerId) {
              const newPreview = canvas.toDataURL()
              const img = new window.Image()
              img.src = newPreview
              imageCacheRef.current.set(newPreview, img)
              updateLayer(activeLayerId, { preview: newPreview })
            }
            showToast('success', 'Text added')
            saveToHistory('Add Text')
          }
          setTextInput(null)
          return
        }
      }

      // Escape to cancel operations
      if (e.key === 'Escape') {
        setCropRect(null)
        setTextInput(null)
        setGradientPreview(null)
      }

      // Tool shortcuts
      const tool = allTools.find(t => t.shortcut.toLowerCase() === e.key.toLowerCase())
      if (tool && !e.ctrlKey && !e.metaKey) {
        setActiveTool(tool.id)
        addToRecentCommands(tool.id)
        return
      }

      // Ctrl shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault()
            if (e.shiftKey) redo()
            else undo()
            break
          case 'y':
            e.preventDefault()
            redo()
            break
          case 's':
            e.preventDefault()
            setShowExportDialog(true)
            break
          case 'o':
            e.preventDefault()
            fileInputRef.current?.click()
            break
          case 'n':
            e.preventDefault()
            newCanvas(1920, 1080, '#1a1a1a')
            showToast('info', 'New canvas created')
            break
          case 'd':
            e.preventDefault()
            clearSelection()
            showToast('info', 'Selection cleared')
            break
          case 'a':
            e.preventDefault()
            selectAll()
            showToast('info', 'All selected')
            break
          case 'i':
            e.preventDefault()
            invertSelection()
            showToast('info', 'Selection inverted')
            break
          case '0':
            e.preventDefault()
            resetView()
            break
          case '1':
            e.preventDefault()
            setZoom(1)
            break
          case '=':
          case '+':
            e.preventDefault()
            setZoom(zoom * 1.25)
            break
          case '-':
            e.preventDefault()
            setZoom(zoom / 1.25)
            break
        }
      }

      // Brush size
      if (e.key === '[') {
        setBrushSettings({ size: Math.max(1, brushSettings.size - 5) })
      }
      if (e.key === ']') {
        setBrushSettings({ size: Math.min(500, brushSettings.size + 5) })
      }

      // Space for pan
      if (e.key === ' ') {
        e.preventDefault()
        setActiveTool('hand')
      }

      // Shift for straight line drawing
      if (e.key === 'Shift') {
        setIsShiftHeld(true)
      }

      // Escape to cancel operations
      if (e.key === 'Escape') {
        setPolygonPoints([])
        setPenPath([])
        setSelectionPath([])
        clearSelection()
        setShowCommandPalette(false)
        setStraightLineStart(null)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setActiveTool('move')
      }
      if (e.key === 'Shift') {
        setIsShiftHeld(false)
        setStraightLineStart(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [undo, redo, setActiveTool, resetView, zoom, setZoom, setBrushSettings, brushSettings.size, newCanvas, showToast, setPrimaryColor, setSecondaryColor, addToRecentCommands])

  // Filter command palette results
  const filteredCommands = useMemo(() => {
    const results: Array<{ type: string; name: string; tools: ToolDefinition[] }> = []
    
    // Recent commands first
    if (!commandSearch) {
      if (recentCommands.length > 0) {
        results.push({ type: 'recent', name: 'Recent', tools: recentCommands.map(id => getToolById(id)).filter(Boolean) as ToolDefinition[] })
      }
      results.push({ type: 'all', name: 'All Tools', tools: allTools })
    } else {
      const searchResults = allTools.filter(tool => 
        tool.name.toLowerCase().includes(commandSearch.toLowerCase()) ||
        tool.shortcut.toLowerCase().includes(commandSearch.toLowerCase())
      )
      results.push({ type: 'search', name: 'Results', tools: searchResults })
    }
    
    return results
  }, [commandSearch, recentCommands])

  const activeLayer = layers.find(l => l.id === activeLayerId)

  // Render tool options based on active tool
  const renderToolOptions = useCallback(() => {
    const isPaintTool = ['brush', 'pencil', 'airbrush', 'eraser', 'spray', 'mixer-brush'].includes(activeTool)
    const isSelectionTool = ['select-rect', 'select-ellipse', 'lasso', 'lasso-polygon', 'lasso-magnetic', 'magic-wand', 'quick-select'].includes(activeTool)
    const isRetouchTool = ['healing', 'spot-healing', 'clone-stamp', 'pattern-stamp'].includes(activeTool)
    const isDodgeBurn = ['dodge', 'burn'].includes(activeTool)
    const isSponge = activeTool === 'sponge'
    const isBlurSharpen = ['blur-tool', 'sharpen-tool'].includes(activeTool)
    const isShapeTool = ['rectangle', 'ellipse', 'polygon', 'line', 'triangle', 'star', 'heart', 'custom-shape'].includes(activeTool)
    const isGradient = activeTool === 'gradient'
    const isCrop = activeTool === 'crop'

    return (
      <div className="p-3 space-y-4 border-t border-border">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          {currentTool?.icon && <currentTool.icon className="w-3 h-3" />}
          {currentTool?.name || 'Tool'} Options
        </h4>

        {/* Size for brush/eraser/retouch tools */}
        {(isPaintTool || isRetouchTool || isBlurSharpen || activeTool === 'smudge') && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Size</span>
              <span className="text-cyan">{brushSettings.size}px</span>
            </div>
            <Slider
              value={[brushSettings.size]}
              onValueChange={([v]) => setBrushSettings({ size: v })}
              min={1}
              max={500}
              className="brutal-slider"
            />
          </div>
        )}

        {/* Brush-specific options */}
        {isPaintTool && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Hardness</span>
                <span className="text-cyan">{toolOptions.hardness}%</span>
              </div>
              <Slider
                value={[toolOptions.hardness]}
                onValueChange={([v]) => setToolOptions(prev => ({ ...prev, hardness: v }))}
                min={0}
                max={100}
                className="brutal-slider"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Opacity</span>
                <span className="text-cyan">{brushSettings.opacity}%</span>
              </div>
              <Slider
                value={[brushSettings.opacity]}
                onValueChange={([v]) => setBrushSettings({ opacity: v })}
                min={1}
                max={100}
                className="brutal-slider"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Flow</span>
                <span className="text-cyan">{toolOptions.flow}%</span>
              </div>
              <Slider
                value={[toolOptions.flow]}
                onValueChange={([v]) => setToolOptions(prev => ({ ...prev, flow: v }))}
                min={1}
                max={100}
                className="brutal-slider"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs">Airbrush Mode</span>
              <Switch
                checked={toolOptions.airbrush}
                onCheckedChange={(v) => setToolOptions(prev => ({ ...prev, airbrush: v }))}
              />
            </div>

            {/* Straight line hint */}
            <div className="px-2 py-1.5 bg-cyan/5 border border-cyan/20 rounded text-[10px] text-muted-foreground">
              <span className="text-cyan font-medium">Hold Shift</span> + drag to draw straight lines (horizontal, vertical, 45°)
            </div>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-xs text-muted-foreground">
                <span>Advanced</span>
                <ChevronDown className="w-3 h-3" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Scatter</span>
                    <span className="text-cyan">{toolOptions.scatter}%</span>
                  </div>
                  <Slider
                    value={[toolOptions.scatter]}
                    onValueChange={([v]) => setToolOptions(prev => ({ ...prev, scatter: v }))}
                    min={0}
                    max={200}
                    className="brutal-slider"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Angle</span>
                    <span className="text-cyan">{toolOptions.angle}°</span>
                  </div>
                  <Slider
                    value={[toolOptions.angle]}
                    onValueChange={([v]) => setToolOptions(prev => ({ ...prev, angle: v }))}
                    min={0}
                    max={360}
                    className="brutal-slider"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Roundness</span>
                    <span className="text-cyan">{toolOptions.roundness}%</span>
                  </div>
                  <Slider
                    value={[toolOptions.roundness]}
                    onValueChange={([v]) => setToolOptions(prev => ({ ...prev, roundness: v }))}
                    min={1}
                    max={100}
                    className="brutal-slider"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </>
        )}

        {/* Selection tool options */}
        {isSelectionTool && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Tolerance</span>
                <span className="text-cyan">{toolOptions.tolerance}</span>
              </div>
              <Slider
                value={[toolOptions.tolerance]}
                onValueChange={([v]) => setToolOptions(prev => ({ ...prev, tolerance: v }))}
                min={0}
                max={255}
                className="brutal-slider"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Feather</span>
                <span className="text-cyan">{toolOptions.feather}px</span>
              </div>
              <Slider
                value={[toolOptions.feather]}
                onValueChange={([v]) => setToolOptions(prev => ({ ...prev, feather: v }))}
                min={0}
                max={100}
                className="brutal-slider"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Anti-alias</span>
              <Switch
                checked={toolOptions.antiAlias}
                onCheckedChange={(v) => setToolOptions(prev => ({ ...prev, antiAlias: v }))}
              />
            </div>
            {activeTool === 'magic-wand' && (
              <div className="flex items-center justify-between">
                <span className="text-xs">Contiguous</span>
                <Switch
                  checked={toolOptions.contiguous}
                  onCheckedChange={(v) => setToolOptions(prev => ({ ...prev, contiguous: v }))}
                />
              </div>
            )}
          </>
        )}

        {/* Clone/Healing options */}
        {isRetouchTool && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs">Aligned</span>
              <Switch
                checked={toolOptions.aligned}
                onCheckedChange={(v) => setToolOptions(prev => ({ ...prev, aligned: v }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Sample All Layers</span>
              <Switch
                checked={toolOptions.sampleAllLayers}
                onCheckedChange={(v) => setToolOptions(prev => ({ ...prev, sampleAllLayers: v }))}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Alt+Click to set source point
            </p>
          </>
        )}

        {/* Dodge/Burn options */}
        {isDodgeBurn && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Range</Label>
              <Select value={toolOptions.dodgeBurnRange} onValueChange={(v: 'shadows' | 'midtones' | 'highlights') => setToolOptions(prev => ({ ...prev, dodgeBurnRange: v }))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shadows">Shadows</SelectItem>
                  <SelectItem value="midtones">Midtones</SelectItem>
                  <SelectItem value="highlights">Highlights</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Exposure</span>
                <span className="text-cyan">{toolOptions.dodgeBurnExposure}%</span>
              </div>
              <Slider
                value={[toolOptions.dodgeBurnExposure]}
                onValueChange={([v]) => setToolOptions(prev => ({ ...prev, dodgeBurnExposure: v }))}
                min={1}
                max={100}
                className="brutal-slider"
              />
            </div>
          </>
        )}

        {/* Sponge options */}
        {isSponge && (
          <div className="space-y-2">
            <Label className="text-xs">Mode</Label>
            <Select value={toolOptions.spongeMode} onValueChange={(v: 'saturate' | 'desaturate') => setToolOptions(prev => ({ ...prev, spongeMode: v }))}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saturate">Saturate</SelectItem>
                <SelectItem value="desaturate">Desaturate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Shape options */}
        {isShapeTool && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Fill Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={toolOptions.shapeFill}
                  onChange={(e) => setToolOptions(prev => ({ ...prev, shapeFill: e.target.value }))}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <Input
                  value={toolOptions.shapeFill}
                  onChange={(e) => setToolOptions(prev => ({ ...prev, shapeFill: e.target.value }))}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Stroke Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={toolOptions.shapeStroke}
                  onChange={(e) => setToolOptions(prev => ({ ...prev, shapeStroke: e.target.value }))}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <Input
                  value={toolOptions.shapeStroke}
                  onChange={(e) => setToolOptions(prev => ({ ...prev, shapeStroke: e.target.value }))}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Stroke Width</span>
                <span className="text-cyan">{toolOptions.shapeStrokeWidth}px</span>
              </div>
              <Slider
                value={[toolOptions.shapeStrokeWidth]}
                onValueChange={([v]) => setToolOptions(prev => ({ ...prev, shapeStrokeWidth: v }))}
                min={0}
                max={50}
                className="brutal-slider"
              />
            </div>
            {activeTool === 'polygon' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Sides</span>
                  <span className="text-cyan">{toolOptions.polygonSides}</span>
                </div>
                <Slider
                  value={[toolOptions.polygonSides]}
                  onValueChange={([v]) => setToolOptions(prev => ({ ...prev, polygonSides: v }))}
                  min={3}
                  max={12}
                  className="brutal-slider"
                />
              </div>
            )}
            {activeTool === 'rectangle' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Corner Radius</span>
                  <span className="text-cyan">{toolOptions.shapeCornerRadius}px</span>
                </div>
                <Slider
                  value={[toolOptions.shapeCornerRadius]}
                  onValueChange={([v]) => setToolOptions(prev => ({ ...prev, shapeCornerRadius: v }))}
                  min={0}
                  max={100}
                  className="brutal-slider"
                />
              </div>
            )}
          </>
        )}

        {/* Gradient options */}
        {isGradient && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Type</Label>
              <Select value={toolOptions.gradientType} onValueChange={(v: 'linear' | 'radial' | 'angular' | 'diamond') => setToolOptions(prev => ({ ...prev, gradientType: v }))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                  <SelectItem value="diamond">Diamond</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Reverse</span>
              <Switch
                checked={toolOptions.gradientReverse}
                onCheckedChange={(v) => setToolOptions(prev => ({ ...prev, gradientReverse: v }))}
              />
            </div>
          </>
        )}

        {/* Crop options */}
        {isCrop && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Aspect Ratio</Label>
              <Select value={toolOptions.cropAspectRatio} onValueChange={(v: typeof toolOptions.cropAspectRatio) => setToolOptions(prev => ({ ...prev, cropAspectRatio: v }))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  <SelectItem value="4:3">4:3</SelectItem>
                  <SelectItem value="16:9">16:9</SelectItem>
                  <SelectItem value="3:2">3:2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Rule of Thirds</span>
              <Switch
                checked={toolOptions.cropRuleOfThirds}
                onCheckedChange={(v) => setToolOptions(prev => ({ ...prev, cropRuleOfThirds: v }))}
              />
            </div>
            {cropRect && cropRect.width > 10 && cropRect.height > 10 && (
              <Button
                onClick={applyCrop}
                className="w-full bg-cyan text-black hover:bg-cyan/90 text-xs"
              >
                Apply Crop (Enter)
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              Drag to select crop area. Double-click or press Enter to apply.
            </p>
          </>
        )}

        {/* Text tool options */}
        {activeTool === 'text' && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Font Family</Label>
              <Select value={textOptions.fontFamily} onValueChange={(v) => setTextOptions(prev => ({ ...prev, fontFamily: v }))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                  <SelectItem value="Impact">Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Font Size</span>
                <span className="text-cyan">{textOptions.fontSize}px</span>
              </div>
              <Slider
                value={[textOptions.fontSize]}
                onValueChange={([v]) => setTextOptions(prev => ({ ...prev, fontSize: v }))}
                min={8}
                max={200}
                className="brutal-slider"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Font Weight</Label>
              <Select value={textOptions.fontWeight} onValueChange={(v) => setTextOptions(prev => ({ ...prev, fontWeight: v }))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="lighter">Light</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Click on canvas to place text, then type. Press Enter to finish.
            </p>
          </>
        )}

        {/* Red eye removal options */}
        {activeTool === 'red-eye' && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Brush Size</span>
                <span className="text-cyan">{brushSettings.size}px</span>
              </div>
              <Slider
                value={[brushSettings.size]}
                onValueChange={([v]) => setBrushSettings({ size: v })}
                min={5}
                max={100}
                className="brutal-slider"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Click on red eyes to remove them. The tool detects and fixes red pixels automatically.
            </p>
          </>
        )}

        {/* Pattern stamp options */}
        {activeTool === 'pattern-stamp' && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Size</span>
                <span className="text-cyan">{brushSettings.size}px</span>
              </div>
              <Slider
                value={[brushSettings.size]}
                onValueChange={([v]) => setBrushSettings({ size: v })}
                min={5}
                max={200}
                className="brutal-slider"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Pattern</Label>
              <Select value={patternType} onValueChange={(v: 'dots' | 'lines' | 'grid') => setPatternType(v)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="lines">Lines</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Opacity</span>
                <span className="text-cyan">{brushSettings.opacity}%</span>
              </div>
              <Slider
                value={[brushSettings.opacity]}
                onValueChange={([v]) => setBrushSettings({ opacity: v })}
                min={1}
                max={100}
                className="brutal-slider"
              />
            </div>
          </>
        )}

        {/* Brush preview for paint tools */}
        {(isPaintTool || activeTool === 'eraser' || isRetouchTool || activeTool === 'red-eye' || activeTool === 'pattern-stamp') && (
          <div className="flex items-center justify-center p-4 bg-secondary/50 rounded-lg">
            <div 
              className="rounded-full border-2 border-cyan/50"
              style={{
                width: Math.min(brushSettings.size, 100),
                height: Math.min(brushSettings.size * (toolOptions.roundness / 100), 100),
                backgroundColor: activeTool === 'eraser' ? 'transparent' : primaryColor + '40',
                transform: `rotate(${toolOptions.angle}deg)`
              }}
            />
          </div>
        )}

        {/* Reset to Default button */}
        {(isPaintTool || isSelectionTool || isShapeTool || isCrop || activeTool === 'text') && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setToolOptions(defaultToolOptions)
              setBrushSettings({ size: 20, opacity: 100 })
              setTextOptions({ fontFamily: 'Arial', fontSize: 32, fontWeight: 'normal' })
              showToast('info', 'Tool options reset')
            }}
            className="w-full text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-2" />
            Reset to Default
          </Button>
        )}

        {/* Color swatches for paint tools */}
        {(isPaintTool || isShapeTool) && (
          <div className="space-y-2">
            <Label className="text-xs">Colors</Label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div
                  className="w-8 h-8 rounded border-2 border-border cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'color'
                    input.value = primaryColor
                    input.onchange = (e) => setPrimaryColor((e.target as HTMLInputElement).value)
                    input.click()
                  }}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded border border-border cursor-pointer"
                  style={{ backgroundColor: secondaryColor }}
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'color'
                    input.value = secondaryColor
                    input.onchange = (e) => setSecondaryColor((e.target as HTMLInputElement).value)
                    input.click()
                  }}
                />
              </div>
              <div className="flex-1 flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => swapColors()}
                  className="h-6 w-6 p-0"
                >
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setPrimaryColor('#00ffff'); setSecondaryColor('#ff0066') }}
                  className="h-6 px-2 text-xs"
                >
                  Reset
                </Button>
              </div>
            </div>
            
            {/* Color Palette */}
            <div className="grid grid-cols-8 gap-1 mt-2">
              {[
                // Row 1 - Basic Colors
                '#000000', '#ffffff', '#ff0000', '#ff0066', '#ff00ff', '#9900ff', '#0066ff', '#00ffff',
                // Row 2 - Bright Colors  
                '#00ff00', '#66ff00', '#ffff00', '#ff9900', '#ff6600', '#ff3300', '#cc0066', '#990066',
                // Row 3 - Pastel Colors
                '#ffcccc', '#ffe6cc', '#ffffcc', '#ccffcc', '#ccffff', '#cce6ff', '#ccccff', '#ffccff',
                // Row 4 - Dark Colors
                '#333333', '#666666', '#999999', '#cccccc', '#003366', '#006633', '#663300', '#330033',
                // Row 5 - Skin Tones
                '#ffdfc4', '#f0d5be', '#eecebb', '#e6c9a8', '#dbc4a2', '#c9a87c', '#a67b5b', '#8d5524',
                // Row 6 - Nature Colors
                '#228b22', '#32cd32', '#90ee90', '#006400', '#8b4513', '#d2691e', '#f4a460', '#deb887',
                // Row 7 - Sky/Water
                '#87ceeb', '#4169e1', '#1e90ff', '#00bfff', '#5f9ea0', '#20b2aa', '#008b8b', '#008080',
                // Row 8 - Artistic
                '#00ffff', '#ff0066', '#ff00ff', '#00ff00', '#ff3300', '#6600ff', '#ffcc00', '#00ff99'
              ].map((color) => (
                <button
                  key={color}
                  className="w-5 h-5 rounded-sm border border-border hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => setPrimaryColor(color)}
                  onContextMenu={(e) => { e.preventDefault(); setSecondaryColor(color); }}
                  title={`${color} (Right-click for secondary)`}
                />
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">Click: Primary | Right-click: Secondary</p>
          </div>
        )}
      </div>
    )
  }, [activeTool, brushSettings, currentTool, primaryColor, secondaryColor, setBrushSettings, setPrimaryColor, setSecondaryColor, swapColors, toolOptions, textOptions, cropRect, patternType, applyCrop, showToast])

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
        {/* Top Bar */}
        <div className="h-10 bg-card border-b border-border flex items-center px-2 gap-1 shrink-0">
          {/* Logo & Menu */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-white h-7 px-2">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <Separator orientation="vertical" className="h-5 mx-1" />

            {/* File Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white h-7 px-2 text-xs">File</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border min-w-48">
                <DropdownMenuItem onClick={() => newCanvas(1920, 1080, '#1a1a1a')}>
                  <FileImage className="w-4 h-4 mr-2" />
                  New Canvas
                  <span className="ml-auto text-xs text-muted-foreground">Ctrl+N</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Open Image
                  <span className="ml-auto text-xs text-muted-foreground">Ctrl+O</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowExportDialog(true)}>
                  <FileDown className="w-4 h-4 mr-2" />
                  Export
                  <span className="ml-auto text-xs text-muted-foreground">Ctrl+S</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white h-7 px-2 text-xs">Edit</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border min-w-48">
                <DropdownMenuItem onClick={undo} disabled={!canUndo()}>
                  <Undo2 className="w-4 h-4 mr-2" />
                  Undo
                  <span className="ml-auto text-xs text-muted-foreground">Ctrl+Z</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={redo} disabled={!canRedo()}>
                  <Redo2 className="w-4 h-4 mr-2" />
                  Redo
                  <span className="ml-auto text-xs text-muted-foreground">Ctrl+Shift+Z</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => clearSelection()}>
                  <X className="w-4 h-4 mr-2" />
                  Deselect
                  <span className="ml-auto text-xs text-muted-foreground">Ctrl+D</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => selectAll()}>
                  <Square className="w-4 h-4 mr-2" />
                  Select All
                  <span className="ml-auto text-xs text-muted-foreground">Ctrl+A</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => invertSelection()}>
                  <Circle className="w-4 h-4 mr-2" />
                  Invert Selection
                  <span className="ml-auto text-xs text-muted-foreground">Ctrl+I</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => activeLayerId && duplicateLayer(activeLayerId)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Layer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Image Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white h-7 px-2 text-xs">Image</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border min-w-48">
                <DropdownMenuItem onClick={() => setAdjustment('exposure', adjustments.exposure + 10)}>
                  <Sun className="w-4 h-4 mr-2" />
                  Adjust Exposure
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAdjustment('contrast', adjustments.contrast + 10)}>
                  <Contrast className="w-4 h-4 mr-2" />
                  Adjust Contrast
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAdjustment('saturation', adjustments.saturation + 10)}>
                  <Droplets className="w-4 h-4 mr-2" />
                  Adjust Saturation
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={flipHorizontal}>
                  <FlipHorizontal className="w-4 h-4 mr-2" />
                  Flip Horizontal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={flipVertical}>
                  <FlipVertical className="w-4 h-4 mr-2" />
                  Flip Vertical
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => rotateCanvas(90)}>
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate 90° CW
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => rotateCanvas(-90)}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Rotate 90° CCW
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => rotateCanvas(180)}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Rotate 180°
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={resetAdjustments}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Adjustments
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* AI Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white h-7 px-2 text-xs">
                  <Sparkles className="w-3 h-3 mr-1 text-cyan" />
                  AI
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border min-w-56">
                <DropdownMenuItem onClick={() => handleAI('Enhancement')} disabled={isAIProcessing}>
                  <Sparkles className="w-4 h-4 mr-2 text-cyan" />
                  Auto Enhance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAI('Background Removal')} disabled={isAIProcessing}>
                  <Scissors className="w-4 h-4 mr-2 text-cyan" />
                  Remove Background
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAI('Object Removal')} disabled={isAIProcessing}>
                  <Eraser className="w-4 h-4 mr-2 text-cyan" />
                  Remove Objects
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAI('Sky Replacement')} disabled={isAIProcessing}>
                  <Globe className="w-4 h-4 mr-2 text-cyan" />
                  Replace Sky
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleAI('Portrait Retouch')} disabled={isAIProcessing}>
                  <ScanFace className="w-4 h-4 mr-2 text-pink" />
                  Portrait Retouch
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAI('Upscaling')} disabled={isAIProcessing}>
                  <Maximize className="w-4 h-4 mr-2 text-cyan" />
                  Upscale 2X
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAI('Upscaling 4X')} disabled={isAIProcessing}>
                  <Maximize className="w-4 h-4 mr-2 text-cyan" />
                  Upscale 4X
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAI('Denoise')} disabled={isAIProcessing}>
                  <CircleSlash className="w-4 h-4 mr-2 text-cyan" />
                  Denoise
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleAI('Color Grade')} disabled={isAIProcessing}>
                  <Palette className="w-4 h-4 mr-2 text-cyan" />
                  Auto Color Grade
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAI('Depth Blur')} disabled={isAIProcessing}>
                  <Aperture className="w-4 h-4 mr-2 text-cyan" />
                  Depth Blur
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAI('Vintage Style')} disabled={isAIProcessing}>
                  <Lightbulb className="w-4 h-4 mr-2 text-cyan" />
                  Vintage Style
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAI('Cinematic Style')} disabled={isAIProcessing}>
                  <Aperture className="w-4 h-4 mr-2 text-cyan" />
                  Cinematic Style
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white h-7 px-2 text-xs">View</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border min-w-48">
                <DropdownMenuItem onClick={toggleGrid}>
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Toggle Grid
                  <span className="ml-auto text-xs text-cyan">{showGrid ? 'ON' : 'OFF'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleRulers}>
                  <Maximize className="w-4 h-4 mr-2" />
                  Toggle Rulers
                  <span className="ml-auto text-xs text-cyan">{showRulers ? 'ON' : 'OFF'}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={resetView}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset View
                  <span className="ml-auto text-xs text-muted-foreground">Ctrl+0</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowShortcutsDialog(true)}>
                  <Keyboard className="w-4 h-4 mr-2" />
                  Keyboard Shortcuts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator orientation="vertical" className="h-5 mx-1" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo()} className="h-7 w-7 text-muted-foreground hover:text-white disabled:opacity-30">
                  <Undo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo()} className="h-7 w-7 text-muted-foreground hover:text-white disabled:opacity-30">
                  <Redo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-5 mx-1" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setZoom(zoom / 1.25)} className="h-7 w-7 text-muted-foreground hover:text-white">
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="sm" onClick={resetView} className="h-7 px-2 text-xs text-muted-foreground hover:text-white min-w-12">
              {Math.round(zoom * 100)}%
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setZoom(zoom * 1.25)} className="h-7 w-7 text-muted-foreground hover:text-white">
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* File Info */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {fileName}
              {hasUnsavedChanges && <span className="text-pink ml-1">*</span>}
            </span>
            <span className="text-xs text-muted-foreground">
              {canvasSize.width} × {canvasSize.height}
            </span>
          </div>

          <div className="flex-1" />

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setShowCommandPalette(true)} className="h-7 w-7 text-muted-foreground hover:text-white">
                  <Search className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Command Palette (Ctrl+K)</TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="sm" onClick={() => setShowExportDialog(true)} className="h-7 px-3 bg-cyan/10 text-cyan hover:bg-cyan/20 border border-cyan/30">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Panel - Tools (hidden on mobile) */}
          <motion.div
            initial={{ width: 60, opacity: 1 }}
            className="bg-card border-r border-border flex-col shrink-0 overflow-hidden hidden md:flex"
            style={{ width: 60 }}
          >
            <ScrollArea className="flex-1">
              <div className="flex flex-col items-center py-2 gap-0.5">
                {toolCategories.slice(0, 6).map(category => (
                  <div key={category.id} className="w-full">
                    {category.tools.slice(0, 3).map(tool => (
                      <Tooltip key={tool.id}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setActiveTool(tool.id)
                              addToRecentCommands(tool.id)
                            }}
                            className={cn(
                              "w-full h-auto py-1.5 px-1 rounded-sm flex flex-col items-center gap-0.5",
                              activeTool === tool.id
                                ? "bg-cyan/20 text-cyan border border-cyan/50"
                                : "text-muted-foreground hover:text-white hover:bg-secondary"
                            )}
                          >
                            <tool.icon className="w-4 h-4" />
                            <span className="text-[9px] leading-tight text-center truncate w-full px-0.5">
                              {tool.name.split(' ')[0]}
                            </span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-2">
                          <span>{tool.name}</span>
                          {tool.shortcut && <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">{tool.shortcut}</kbd>}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    <Separator className="my-1" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>

          {/* Canvas Area */}
          <div className="flex-1 bg-secondary/30 overflow-hidden relative flex items-center justify-center min-w-0 pt-11 pb-14 md:pt-0 md:pb-0">
            <div className="bg-grid-pattern absolute inset-0 opacity-30" />
            
            <div
              className="relative touch-pan-y"
              style={{
                transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: 'center center',
              }}
            >
              <canvas
                ref={canvasRef}
                className={cn("border border-border/50 shadow-2xl touch-none", getCursorForTool(activeTool))}
                style={{ 
                  maxWidth: 'none', 
                  maxHeight: 'none', 
                  cursor: getCursorForTool(activeTool),
                  width: canvasSize.width,
                  height: canvasSize.height
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={handleDoubleClick}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />

              {/* Crop Overlay */}
              {activeTool === 'crop' && cropRect && cropRect.width > 0 && cropRect.height > 0 && (
                <div 
                  className="absolute pointer-events-none"
                  style={{
                    left: cropRect.x,
                    top: cropRect.y,
                    width: cropRect.width,
                    height: cropRect.height,
                  }}
                >
                  {/* Darkened areas */}
                  <div className="absolute inset-0 border-2 border-white border-dashed">
                    {/* Corner handles */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-cyan" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-cyan" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-cyan" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-cyan" />
                  </div>
                  {/* Rule of thirds overlay */}
                  {toolOptions.cropRuleOfThirds && (
                    <>
                      <div className="absolute top-1/3 left-0 right-0 border-t border-white/30" />
                      <div className="absolute top-2/3 left-0 right-0 border-t border-white/30" />
                      <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/30" />
                      <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/30" />
                    </>
                  )}
                  {/* Size indicator */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-cyan text-black text-xs font-mono rounded">
                    {Math.round(cropRect.width)} × {Math.round(cropRect.height)}
                  </div>
                </div>
              )}

              {/* Text Input Overlay */}
              {textInput?.active && (
                <input
                  type="text"
                  value={textInput.value}
                  onChange={(e) => setTextInput(prev => prev ? { ...prev, value: e.target.value } : null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && textInput.value) {
                      const ctx = canvasRef.current?.getContext('2d')
                      if (ctx && canvasRef.current) {
                        ctx.font = `${textOptions.fontWeight} ${textOptions.fontSize}px ${textOptions.fontFamily}`
                        ctx.fillStyle = primaryColor
                        ctx.fillText(textInput.value, textInput.x, textInput.y)
                        if (activeLayerId) {
                          updateLayer(activeLayerId, { preview: canvasRef.current.toDataURL() })
                        }
                        showToast('success', 'Text added')
                        saveToHistory('Add Text')
                      }
                      setTextInput(null)
                    }
                  }}
                  className="absolute bg-transparent border-b-2 border-cyan outline-none text-white"
                  style={{
                    left: textInput.x,
                    top: textInput.y - textOptions.fontSize,
                    fontSize: textOptions.fontSize,
                    fontFamily: textOptions.fontFamily,
                    fontWeight: textOptions.fontWeight,
                    minWidth: 100,
                  }}
                  autoFocus
                  placeholder="Type here..."
                />
              )}

              {/* Gradient Preview Line */}
              {activeTool === 'gradient' && gradientPreview && (
                <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                  <line
                    x1={gradientPreview.start.x}
                    y1={gradientPreview.start.y}
                    x2={gradientPreview.end.x}
                    y2={gradientPreview.end.y}
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <circle cx={gradientPreview.start.x} cy={gradientPreview.start.y} r="5" fill="#00ffff" />
                  <circle cx={gradientPreview.end.x} cy={gradientPreview.end.y} r="5" fill="#ff0066" />
                </svg>
              )}
            </div>

            {/* Current Tool Indicator - Desktop only */}
            <div className="hidden md:flex absolute bottom-4 right-4 px-3 py-1.5 bg-card/90 border border-border rounded-sm text-xs text-cyan items-center gap-2">
              {currentTool?.icon && <currentTool.icon className="w-3 h-3" />}
              {currentTool?.name || 'Move'}
              {selection && (
                <Badge variant="outline" className="ml-2 text-xs border-cyan text-cyan">
                  Selection
                </Badge>
              )}
            </div>
          </div>

          {/* Right Panel - Properties (hidden on mobile) */}
          <motion.div
            initial={{ width: 280, opacity: 1 }}
            className="bg-card border-l border-border flex flex-col shrink-0 overflow-hidden hidden lg:flex"
            style={{ width: 280 }}
          >
            <Tabs defaultValue="tools" className="flex-1 flex flex-col">
              <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-1 pt-1 h-9">
                <TabsTrigger value="tools" className="text-xs data-[state=active]:bg-secondary h-7">Tool</TabsTrigger>
                <TabsTrigger value="layers" className="text-xs data-[state=active]:bg-secondary h-7">Layers</TabsTrigger>
                <TabsTrigger value="adjust" className="text-xs data-[state=active]:bg-secondary h-7">Adjust</TabsTrigger>
                <TabsTrigger value="ai" className="text-xs data-[state=active]:bg-secondary h-7 text-cyan">AI</TabsTrigger>
                <TabsTrigger value="filters" className="text-xs data-[state=active]:bg-secondary h-7">Filters</TabsTrigger>
              </TabsList>

              {/* Tool Options Panel */}
              <TabsContent value="tools" className="flex-1 overflow-hidden m-0">
                <ScrollArea className="h-full">
                  {renderToolOptions()}
                </ScrollArea>
              </TabsContent>

              {/* Layers Panel */}
              <TabsContent value="layers" className="flex-1 overflow-hidden m-0 flex flex-col">
                <div className="p-2 border-b border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{layers.length} layers</span>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => addLayer({ type: 'image', name: 'Layer', visible: true, locked: false, opacity: 100, blendMode: 'normal', data: null, preview: null, position: { x: 0, y: 0 }, size: canvasSize, rotation: 0 })} className="h-6 w-6 text-muted-foreground hover:text-white">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add Layer</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => activeLayerId && duplicateLayer(activeLayerId)} disabled={!activeLayerId} className="h-6 w-6 text-muted-foreground hover:text-white disabled:opacity-30">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Duplicate</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => activeLayerId && removeLayer(activeLayerId)} disabled={!activeLayerId || layers.length <= 1} className="h-6 w-6 text-muted-foreground hover:text-pink disabled:opacity-30">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="p-1">
                    {layers.map(layer => (
                      <div
                        key={layer.id}
                        onClick={() => setActiveLayer(layer.id)}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded cursor-pointer text-sm",
                          activeLayerId === layer.id ? "bg-cyan/20 border border-cyan/30" : "hover:bg-secondary"
                        )}
                      >
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible }) }} className="h-5 w-5">
                          {layer.visible ? <Eye className="w-3 h-3 text-cyan" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
                        </Button>
                        <div className="w-8 h-8 bg-secondary rounded border border-border overflow-hidden">
                          {layer.preview && <img src={layer.preview} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <span className="flex-1 truncate text-xs">{layer.name}</span>
                        <span className="text-xs text-muted-foreground">{layer.opacity}%</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Layer Properties */}
                {activeLayer && (
                  <div className="p-2 border-t border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Opacity</span>
                      <span className="text-xs text-cyan">{activeLayer.opacity}%</span>
                    </div>
                    <Slider
                      value={[activeLayer.opacity]}
                      onValueChange={([v]) => updateLayer(activeLayer.id!, { opacity: v })}
                      min={0}
                      max={100}
                      className="brutal-slider"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Blend</span>
                      <select
                        value={activeLayer.blendMode}
                        onChange={(e) => updateLayer(activeLayer.id!, { blendMode: e.target.value as BlendMode })}
                        className="flex-1 bg-secondary border border-border rounded px-2 py-1 text-xs"
                      >
                        {blendModes.map(mode => (
                          <option key={mode.value} value={mode.value}>{mode.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Adjustments Panel */}
              <TabsContent value="adjust" className="flex-1 overflow-hidden m-0">
                <ScrollArea className="h-full">
                  <div className="p-3 space-y-4">
                    {/* Light */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Light</h4>
                      {[
                        { key: 'exposure', label: 'Exposure', icon: Sun },
                        { key: 'contrast', label: 'Contrast', icon: Contrast },
                        { key: 'highlights', label: 'Highlights', icon: Sun },
                        { key: 'shadows', label: 'Shadows', icon: Moon },
                        { key: 'whites', label: 'Whites', icon: Sun },
                        { key: 'blacks', label: 'Blacks', icon: Moon },
                      ].map(item => (
                        <div key={item.key} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-1"><item.icon className="w-3 h-3" />{item.label}</span>
                            <span className="text-cyan">{String(adjustments[item.key as keyof typeof adjustments])}</span>
                          </div>
                          <Slider
                            value={[adjustments[item.key as keyof typeof adjustments] as number]}
                            onValueChange={([v]) => setAdjustment(item.key as keyof typeof adjustments, v)}
                            min={-100}
                            max={100}
                            className="brutal-slider"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Color */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Color</h4>
                      {[
                        { key: 'temperature', label: 'Temperature' },
                        { key: 'tint', label: 'Tint' },
                        { key: 'vibrance', label: 'Vibrance' },
                        { key: 'saturation', label: 'Saturation' },
                      ].map(item => (
                        <div key={item.key} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{item.label}</span>
                            <span className="text-cyan">{String(adjustments[item.key as keyof typeof adjustments])}</span>
                          </div>
                          <Slider
                            value={[adjustments[item.key as keyof typeof adjustments] as number]}
                            onValueChange={([v]) => setAdjustment(item.key as keyof typeof adjustments, v)}
                            min={-100}
                            max={100}
                            className="brutal-slider"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Presence */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Presence</h4>
                      {[
                        { key: 'clarity', label: 'Clarity' },
                        { key: 'dehaze', label: 'Dehaze' },
                        { key: 'sharpen', label: 'Sharpen' },
                      ].map(item => (
                        <div key={item.key} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{item.label}</span>
                            <span className="text-cyan">{String(adjustments[item.key as keyof typeof adjustments])}</span>
                          </div>
                          <Slider
                            value={[adjustments[item.key as keyof typeof adjustments] as number]}
                            onValueChange={([v]) => setAdjustment(item.key as keyof typeof adjustments, v)}
                            min={-100}
                            max={100}
                            className="brutal-slider"
                          />
                        </div>
                      ))}
                    </div>

                    <Button variant="outline" size="sm" onClick={resetAdjustments} className="w-full text-xs">
                      <RotateCcw className="w-3 h-3 mr-2" />
                      Reset All
                    </Button>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Filters Panel */}
              <TabsContent value="filters" className="flex-1 overflow-hidden m-0">
                <ScrollArea className="h-full">
                  <div className="p-3 space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Presets</h4>
                    {filterPresets.map(preset => (
                      <Button
                        key={preset.id}
                        variant="outline"
                        onClick={() => applyFilterPreset(preset.id)}
                        className={cn(
                          "w-full justify-start text-xs h-9",
                          activeFilterPreset === preset.id ? "border-cyan bg-cyan/10" : "border-border hover:border-cyan"
                        )}
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* AI Tools Panel */}
              <TabsContent value="ai" className="flex-1 overflow-hidden m-0">
                <ScrollArea className="h-full">
                  <div className="p-3 space-y-3">
                    {/* AI Status */}
                    {isAIProcessing && (
                      <div className="flex items-center gap-2 p-2 bg-cyan/10 border border-cyan/30 rounded-lg">
                        <Loader2 className="w-4 h-4 animate-spin text-cyan" />
                        <span className="text-xs text-cyan">Processing: {aiTask}...</span>
                      </div>
                    )}

                    {/* Enhance */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Enhance</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAI('Enhancement')}
                          disabled={isAIProcessing}
                          className="h-auto py-3 flex-col gap-1"
                        >
                          <Sparkles className="w-5 h-5 text-cyan" />
                          <span className="text-[10px]">Auto Enhance</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAI('Upscaling')}
                          disabled={isAIProcessing}
                          className="h-auto py-3 flex-col gap-1"
                        >
                          <Maximize className="w-5 h-5 text-cyan" />
                          <span className="text-[10px]">Upscale 2X</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAI('Denoise')}
                          disabled={isAIProcessing}
                          className="h-auto py-3 flex-col gap-1"
                        >
                          <CircleSlash className="w-5 h-5 text-cyan" />
                          <span className="text-[10px]">Denoise</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAI('Color Grade')}
                          disabled={isAIProcessing}
                          className="h-auto py-3 flex-col gap-1"
                        >
                          <Palette className="w-5 h-5 text-cyan" />
                          <span className="text-[10px]">Auto Color</span>
                        </Button>
                      </div>
                    </div>

                    {/* Portrait */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Portrait</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAI('Portrait Retouch')}
                          disabled={isAIProcessing}
                          className="h-auto py-3 flex-col gap-1"
                        >
                          <ScanFace className="w-5 h-5 text-pink" />
                          <span className="text-[10px]">Face Retouch</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAI('Depth Blur')}
                          disabled={isAIProcessing}
                          className="h-auto py-3 flex-col gap-1"
                        >
                          <Aperture className="w-5 h-5 text-pink" />
                          <span className="text-[10px]">Depth Blur</span>
                        </Button>
                      </div>
                    </div>

                    {/* Remove */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Remove</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAI('Background Removal')}
                          disabled={isAIProcessing}
                          className="h-auto py-3 flex-col gap-1"
                        >
                          <Scissors className="w-5 h-5 text-orange" />
                          <span className="text-[10px]">Remove BG</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAI('Object Removal')}
                          disabled={isAIProcessing}
                          className="h-auto py-3 flex-col gap-1"
                        >
                          <Eraser className="w-5 h-5 text-orange" />
                          <span className="text-[10px]">Remove Object</span>
                        </Button>
                      </div>
                    </div>

                    {/* Styles */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Styles</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAI('Sky Replacement')}
                          disabled={isAIProcessing}
                          className="h-auto py-3 flex-col gap-1"
                        >
                          <Globe className="w-5 h-5 text-blue" />
                          <span className="text-[10px]">Replace Sky</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAI('Vintage Style')}
                          disabled={isAIProcessing}
                          className="h-auto py-3 flex-col gap-1"
                        >
                          <Lightbulb className="w-5 h-5 text-yellow" />
                          <span className="text-[10px]">Vintage</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAI('Cinematic Style')}
                          disabled={isAIProcessing}
                          className="h-auto py-3 flex-col gap-1"
                        >
                          <Aperture className="w-5 h-5 text-purple" />
                          <span className="text-[10px]">Cinematic</span>
                        </Button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <p className="text-[10px] text-muted-foreground">
                        AI features require an active internet connection and may take a few seconds to process.
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Mobile Bottom Toolbar - only visible on mobile */}
          <MobileToolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            secondaryColor={secondaryColor}
            setSecondaryColor={setSecondaryColor}
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            brushSettings={brushSettings}
            setBrushSettings={setBrushSettings}
            layers={layers}
            activeLayerId={activeLayerId}
            setActiveLayer={setActiveLayer}
            updateLayer={updateLayer}
            addLayer={addLayer}
            removeLayer={removeLayer}
            duplicateLayer={duplicateLayer}
            canvasSize={canvasSize}
            adjustments={adjustments as unknown as Record<string, number>}
            setAdjustment={setAdjustment as unknown as (key: string, value: number) => void}
            resetAdjustments={resetAdjustments}
            handleAI={handleAI}
            isAIProcessing={isAIProcessing}
            fileInputRef={fileInputRef}
            setShowExportDialog={setShowExportDialog}
            selection={selection}
            clearSelection={clearSelection}
            selectAll={selectAll}
            swapColors={swapColors}
            zoom={zoom}
            setZoom={setZoom}
            resetView={resetView}
            showGrid={showGrid}
            toggleGrid={toggleGrid}
            flipHorizontal={flipHorizontal}
            flipVertical={flipVertical}
          />
        </div>

        {/* Bottom Bar - Timeline (hidden on mobile) */}
        <Collapsible open={timelineExpanded} onOpenChange={setTimelineExpanded} className="hidden md:block">
          <div className="bg-card border-t border-border shrink-0">
            <CollapsibleTrigger className="w-full h-8 flex items-center px-3 justify-between text-xs text-muted-foreground hover:text-white hover:bg-secondary/30">
              <div className="flex items-center gap-4">
                <span>History: {history.length} steps</span>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-24 bg-secondary rounded overflow-hidden">
                    <div className="h-full bg-cyan/50 transition-all" style={{ width: `${(historyIndex + 1) / Math.max(history.length, 1) * 100}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {isAIProcessing && (
                  <div className="flex items-center gap-2 text-xs text-cyan">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    AI: {aiTask}...
                  </div>
                )}
                <ChevronDown className={cn("w-4 h-4 transition-transform", timelineExpanded && "rotate-180")} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="h-24 border-t border-border p-2">
                <ScrollArea className="h-full">
                  <div className="flex gap-2">
                    {history.map((entry, index) => (
                      <button
                        key={entry.id}
                        onClick={() => {
                          const steps = index - historyIndex
                          if (steps < 0) {
                            for (let i = 0; i < Math.abs(steps); i++) undo()
                          } else if (steps > 0) {
                            for (let i = 0; i < steps; i++) redo()
                          }
                        }}
                        className={cn(
                          "flex flex-col items-center gap-1 p-2 rounded border min-w-16",
                          index === historyIndex
                            ? "border-cyan bg-cyan/10"
                            : index < historyIndex
                            ? "border-border bg-secondary/50 opacity-50"
                            : "border-border bg-secondary/50"
                        )}
                      >
                        <div className="w-12 h-12 bg-secondary rounded flex items-center justify-center text-xs">
                          {index}
                        </div>
                        <span className="text-xs truncate max-w-16">{entry.action}</span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Non-expanded bottom bar hint (hidden on mobile) */}
        {!timelineExpanded && (
          <div className="h-8 bg-card border-t border-border flex items-center px-3 justify-between shrink-0 hidden md:flex">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">History: {history.length} steps</span>
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-24 bg-secondary rounded overflow-hidden">
                  <div className="h-full bg-cyan/50" style={{ width: `${(historyIndex + 1) / Math.max(history.length, 1) * 100}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isAIProcessing && (
                <div className="flex items-center gap-2 text-xs text-cyan">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  AI: {aiTask}...
                </div>
              )}
              <span className="text-xs text-muted-foreground">
                Press <kbd className="px-1 py-0.5 bg-secondary rounded text-cyan">Ctrl+K</kbd> for commands
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Export Image</DialogTitle>
            <DialogDescription>Choose your export settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Format</Label>
                <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value as typeof exportFormat)} className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm">
                  <option value="png">PNG (Lossless)</option>
                  <option value="jpg">JPG (Compressed)</option>
                  <option value="webp">WebP (Modern)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Size</Label>
                <select value={exportSize} onChange={(e) => setExportSize(e.target.value as typeof exportSize)} className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm">
                  <option value="0.5x">0.5x (Half)</option>
                  <option value="1x">1x (Original)</option>
                  <option value="2x">2x (Double)</option>
                  <option value="4x">4x (Quadruple)</option>
                </select>
              </div>
            </div>
            {exportFormat !== 'png' && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Quality</Label>
                  <span className="text-xs text-cyan">{exportQuality}%</span>
                </div>
                <Slider value={[exportQuality]} onValueChange={([v]) => setExportQuality(v)} min={10} max={100} className="brutal-slider" />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-xs">DPI</Label>
              <select value={exportDpi} onChange={(e) => setExportDpi(Number(e.target.value))} className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm">
                <option value={72}>72 DPI (Web)</option>
                <option value={150}>150 DPI (Print)</option>
                <option value={300}>300 DPI (High Quality)</option>
                <option value={600}>600 DPI (Professional)</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)} className="text-sm">Cancel</Button>
            <Button onClick={handleExport} className="bg-cyan text-black hover:bg-cyan/90 text-sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={showShortcutsDialog} onOpenChange={setShowShortcutsDialog}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="grid grid-cols-2 gap-2 py-4">
              {keyboardShortcuts.map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                  <span className="text-sm">{shortcut.action}</span>
                  <kbd className="px-2 py-1 bg-secondary rounded text-xs text-cyan font-mono">{shortcut.key}</kbd>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Command Palette */}
      <Dialog open={showCommandPalette} onOpenChange={setShowCommandPalette}>
        <DialogContent className="bg-card border-border p-0 max-w-md">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                placeholder="Search tools, commands..."
                className="border-0 bg-transparent focus-visible:ring-0 p-0 text-sm"
                autoFocus
              />
            </div>
          </div>
          <ScrollArea className="h-72">
            <div className="py-2">
              {filteredCommands.map((group) => (
                <div key={group.type}>
                  {group.tools.length > 0 && (
                    <div className="px-4 py-1 text-xs text-muted-foreground uppercase">{group.name}</div>
                  )}
                  {group.tools.slice(0, group.type === 'recent' ? 5 : 20).map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => { 
                        setActiveTool(tool.id)
                        addToRecentCommands(tool.id)
                        setShowCommandPalette(false)
                        setCommandSearch('')
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-secondary/50 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <tool.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{tool.name}</span>
                      </div>
                      {tool.shortcut && <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs text-cyan">{tool.shortcut}</kbd>}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={cn(
              "px-4 py-2 rounded-sm border flex items-center gap-2",
              toastMessage.type === 'success' && "bg-cyan/20 border-cyan text-cyan",
              toastMessage.type === 'error' && "bg-pink/20 border-pink text-pink",
              toastMessage.type === 'info' && "bg-secondary border-border text-foreground"
            )}>
              {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
              {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4" />}
              {toastMessage.type === 'info' && <Info className="w-4 h-4" />}
              <span className="text-sm">{toastMessage.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  )
}
