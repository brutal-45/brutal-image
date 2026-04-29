// Complete tool definitions for BRUTALIMAGE editor

import {
  MousePointer2, Move, Crop, Paintbrush, Eraser, PaintBucket, Type,
  Square, Circle, Minus, ZoomIn, Hand, PenTool, Lasso, Wand2,
  Sparkles, Bandage, Stamp, Sun, Moon, Droplets, Contrast, Aperture,
  CircleDot, Scissors, RotateCcw, FlipHorizontal, FlipVertical,
  Maximize, Minimize, Grid3X3, Pipette, Target, Layers, 
  Filter, Blend, Sparkles as SparklesIcon, Wand2 as Wand2Icon,
  Pen, Pencil, SprayCan, AirVent, CircleSlash, 
  RectangleHorizontal, Triangle, Hexagon, Star, Heart,
  ArrowRight, ArrowUp, ArrowDown, ArrowLeft, ArrowUpDown, 
  Highlighter, Eraser as EraserIcon, ScanFace, Eye, EyeOff,
  HandMetal, Crosshair, Scan, Move3D, RotateCw, Scaling, Waves,
  Globe, Brush, Palette, Lightbulb, Focus, Sparkles as SparklesIcon2,
  type LucideIcon
} from 'lucide-react'

export type ToolCategory = 'select' | 'transform' | 'paint' | 'retouch' | 'vector' | 'text' | 'ai' | 'view'

export interface ToolDefinition {
  id: string
  name: string
  shortcut: string
  category: ToolCategory
  icon: LucideIcon
  description: string
  modifiers?: string[]
}

// ============================================================================
// SELECTION TOOLS
// ============================================================================
export const selectionTools: ToolDefinition[] = [
  {
    id: 'select-rect',
    name: 'Rectangle Select',
    shortcut: 'M',
    category: 'select',
    icon: Square,
    description: 'Create rectangular selection',
    modifiers: ['Shift (Add)', 'Alt (Subtract)']
  },
  {
    id: 'select-ellipse',
    name: 'Ellipse Select',
    shortcut: 'M',
    category: 'select',
    icon: Circle,
    description: 'Create elliptical selection',
    modifiers: ['Shift (Add)', 'Alt (Subtract)']
  },
  {
    id: 'lasso',
    name: 'Lasso Tool',
    shortcut: 'L',
    category: 'select',
    icon: Lasso,
    description: 'Freehand selection',
    modifiers: ['Shift (Add)', 'Alt (Subtract)']
  },
  {
    id: 'lasso-polygon',
    name: 'Polygon Lasso',
    shortcut: 'L',
    category: 'select',
    icon: Target,
    description: 'Polygon selection with straight edges',
    modifiers: ['Shift (Add)', 'Alt (Subtract)']
  },
  {
    id: 'lasso-magnetic',
    name: 'Magnetic Lasso',
    shortcut: 'L',
    category: 'select',
    icon: Scan,
    description: 'Edge-detecting lasso',
    modifiers: ['Shift (Add)', 'Alt (Subtract)']
  },
  {
    id: 'magic-wand',
    name: 'Magic Wand',
    shortcut: 'W',
    category: 'select',
    icon: Wand2,
    description: 'Select similar colors',
    modifiers: ['Shift (Add)', 'Alt (Subtract)']
  },
  {
    id: 'quick-select',
    name: 'Quick Select',
    shortcut: 'W',
    category: 'select',
    icon: CircleDot,
    description: 'Paint to make selection',
    modifiers: ['Shift (Add)', 'Alt (Subtract)']
  },
  {
    id: 'select-subject',
    name: 'Select Subject',
    shortcut: '',
    category: 'select',
    icon: ScanFace,
    description: 'AI-powered subject selection'
  },
  {
    id: 'select-background',
    name: 'Select Background',
    shortcut: '',
    category: 'select',
    icon: Layers,
    description: 'AI-powered background selection'
  },
]

// ============================================================================
// TRANSFORM TOOLS
// ============================================================================
export const transformTools: ToolDefinition[] = [
  {
    id: 'move',
    name: 'Move Tool',
    shortcut: 'V',
    category: 'transform',
    icon: Move,
    description: 'Move layers and selections',
    modifiers: ['Shift (Constrain)', 'Alt (Copy)']
  },
  {
    id: 'crop',
    name: 'Crop Tool',
    shortcut: 'C',
    category: 'transform',
    icon: Crop,
    description: 'Crop and straighten image'
  },
  {
    id: 'perspective',
    name: 'Perspective Crop',
    shortcut: 'C',
    category: 'transform',
    icon: Grid3X3,
    description: 'Correct perspective distortion'
  },
  {
    id: 'rotate',
    name: 'Rotate View',
    shortcut: 'R',
    category: 'transform',
    icon: RotateCcw,
    description: 'Rotate canvas view'
  },
  {
    id: 'flip-h',
    name: 'Flip Horizontal',
    shortcut: '',
    category: 'transform',
    icon: FlipHorizontal,
    description: 'Flip image horizontally'
  },
  {
    id: 'flip-v',
    name: 'Flip Vertical',
    shortcut: '',
    category: 'transform',
    icon: FlipVertical,
    description: 'Flip image vertically'
  },
  {
    id: 'scale',
    name: 'Scale',
    shortcut: 'Ctrl+T',
    category: 'transform',
    icon: Maximize,
    description: 'Scale layer or selection'
  },
  {
    id: 'skew',
    name: 'Skew',
    shortcut: '',
    category: 'transform',
    icon: Minimize,
    description: 'Skew transformation'
  },
  {
    id: 'distort',
    name: 'Distort',
    shortcut: '',
    category: 'transform',
    icon: Waves,
    description: 'Free distort transformation'
  },
  {
    id: 'warp',
    name: 'Warp',
    shortcut: '',
    category: 'transform',
    icon: Move3D,
    description: 'Warp transformation'
  },
  {
    id: 'liquify',
    name: 'Liquify',
    shortcut: '',
    category: 'transform',
    icon: Droplets,
    description: 'Push and pull pixels'
  },
]

// ============================================================================
// PAINT TOOLS
// ============================================================================
export const paintTools: ToolDefinition[] = [
  {
    id: 'brush',
    name: 'Brush Tool',
    shortcut: 'B',
    category: 'paint',
    icon: Paintbrush,
    description: 'Paint with brush',
    modifiers: ['Shift (Straight line)', '[ ] (Size)']
  },
  {
    id: 'pencil',
    name: 'Pencil Tool',
    shortcut: 'B',
    category: 'paint',
    icon: Pencil,
    description: 'Draw with hard edges'
  },
  {
    id: 'airbrush',
    name: 'Airbrush',
    shortcut: 'B',
    category: 'paint',
    icon: AirVent,
    description: 'Soft spray painting'
  },
  {
    id: 'spray',
    name: 'Spray Paint',
    shortcut: '',
    category: 'paint',
    icon: SprayCan,
    description: 'Particle spray effect'
  },
  {
    id: 'mixer-brush',
    name: 'Mixer Brush',
    shortcut: '',
    category: 'paint',
    icon: Blend,
    description: 'Mix colors on canvas'
  },
  {
    id: 'eraser',
    name: 'Eraser Tool',
    shortcut: 'E',
    category: 'paint',
    icon: Eraser,
    description: 'Erase pixels'
  },
  {
    id: 'background-eraser',
    name: 'Background Eraser',
    shortcut: 'E',
    category: 'paint',
    icon: EraserIcon,
    description: 'Erase to transparency'
  },
  {
    id: 'fill',
    name: 'Paint Bucket',
    shortcut: 'G',
    category: 'paint',
    icon: PaintBucket,
    description: 'Fill with color'
  },
  {
    id: 'gradient',
    name: 'Gradient Tool',
    shortcut: 'G',
    category: 'paint',
    icon: Aperture,
    description: 'Create gradient fills'
  },
  {
    id: 'eyedropper',
    name: 'Eyedropper',
    shortcut: 'I',
    category: 'paint',
    icon: Pipette,
    description: 'Sample colors'
  },
]

// ============================================================================
// RETOUCH TOOLS
// ============================================================================
export const retouchTools: ToolDefinition[] = [
  {
    id: 'healing',
    name: 'Healing Brush',
    shortcut: 'J',
    category: 'retouch',
    icon: Bandage,
    description: 'Heal imperfections',
    modifiers: ['Alt (Sample source)']
  },
  {
    id: 'spot-healing',
    name: 'Spot Healing',
    shortcut: 'J',
    category: 'retouch',
    icon: SparklesIcon2,
    description: 'Quick spot removal'
  },
  {
    id: 'clone-stamp',
    name: 'Clone Stamp',
    shortcut: 'S',
    category: 'retouch',
    icon: Stamp,
    description: 'Clone pixels from source',
    modifiers: ['Alt (Sample source)']
  },
  {
    id: 'pattern-stamp',
    name: 'Pattern Stamp',
    shortcut: 'S',
    category: 'retouch',
    icon: Grid3X3,
    description: 'Paint with patterns'
  },
  {
    id: 'dodge',
    name: 'Dodge Tool',
    shortcut: 'O',
    category: 'retouch',
    icon: Sun,
    description: 'Lighten areas'
  },
  {
    id: 'burn',
    name: 'Burn Tool',
    shortcut: 'O',
    category: 'retouch',
    icon: Moon,
    description: 'Darken areas'
  },
  {
    id: 'sponge',
    name: 'Sponge Tool',
    shortcut: 'O',
    category: 'retouch',
    icon: Droplets,
    description: 'Adjust saturation'
  },
  {
    id: 'blur-tool',
    name: 'Blur Tool',
    shortcut: '',
    category: 'retouch',
    icon: Focus,
    description: 'Blur areas'
  },
  {
    id: 'sharpen-tool',
    name: 'Sharpen Tool',
    shortcut: '',
    category: 'retouch',
    icon: Focus,
    description: 'Sharpen areas'
  },
  {
    id: 'smudge',
    name: 'Smudge Tool',
    shortcut: '',
    category: 'retouch',
    icon: HandMetal,
    description: 'Push pixels around'
  },
  {
    id: 'red-eye',
    name: 'Red Eye Tool',
    shortcut: 'J',
    category: 'retouch',
    icon: Eye,
    description: 'Remove red eye'
  },
]

// ============================================================================
// VECTOR TOOLS
// ============================================================================
export const vectorTools: ToolDefinition[] = [
  {
    id: 'pen',
    name: 'Pen Tool',
    shortcut: 'P',
    category: 'vector',
    icon: Pen,
    description: 'Create paths and shapes',
    modifiers: ['Alt (Convert point)']
  },
  {
    id: 'rectangle',
    name: 'Rectangle Tool',
    shortcut: 'U',
    category: 'vector',
    icon: Square,
    description: 'Draw rectangle shapes',
    modifiers: ['Shift (Square)']
  },
  {
    id: 'ellipse',
    name: 'Ellipse Tool',
    shortcut: 'U',
    category: 'vector',
    icon: Circle,
    description: 'Draw ellipse shapes',
    modifiers: ['Shift (Circle)']
  },
  {
    id: 'polygon',
    name: 'Polygon Tool',
    shortcut: 'U',
    category: 'vector',
    icon: Hexagon,
    description: 'Draw polygon shapes'
  },
  {
    id: 'line',
    name: 'Line Tool',
    shortcut: 'U',
    category: 'vector',
    icon: Minus,
    description: 'Draw lines',
    modifiers: ['Shift (Constrain angle)']
  },
  {
    id: 'triangle',
    name: 'Triangle Tool',
    shortcut: 'U',
    category: 'vector',
    icon: Triangle,
    description: 'Draw triangles'
  },
  {
    id: 'star',
    name: 'Star Tool',
    shortcut: '',
    category: 'vector',
    icon: Star,
    description: 'Draw star shapes'
  },
  {
    id: 'heart',
    name: 'Heart Tool',
    shortcut: '',
    category: 'vector',
    icon: Heart,
    description: 'Draw heart shapes'
  },
  {
    id: 'custom-shape',
    name: 'Custom Shape',
    shortcut: 'U',
    category: 'vector',
    icon: CircleSlash,
    description: 'Custom shapes library'
  },
]

// ============================================================================
// TEXT TOOLS
// ============================================================================
export const textTools: ToolDefinition[] = [
  {
    id: 'text',
    name: 'Text Tool',
    shortcut: 'T',
    category: 'text',
    icon: Type,
    description: 'Add text',
    modifiers: ['Click (New text)', 'Drag (Text box)']
  },
  {
    id: 'text-vertical',
    name: 'Vertical Text',
    shortcut: 'T',
    category: 'text',
    icon: ArrowUpDown,
    description: 'Add vertical text'
  },
  {
    id: 'text-mask',
    name: 'Text Mask',
    shortcut: '',
    category: 'text',
    icon: Highlighter,
    description: 'Create text as mask'
  },
]

// ============================================================================
// AI TOOLS
// ============================================================================
export const aiTools: ToolDefinition[] = [
  {
    id: 'ai-enhance',
    name: 'Auto Enhance',
    shortcut: '',
    category: 'ai',
    icon: Sparkles,
    description: 'AI-powered one-click enhancement'
  },
  {
    id: 'ai-background-remove',
    name: 'Remove Background',
    shortcut: '',
    category: 'ai',
    icon: Scissors,
    description: 'AI-powered background removal'
  },
  {
    id: 'ai-portrait',
    name: 'Portrait Retouch',
    shortcut: '',
    category: 'ai',
    icon: ScanFace,
    description: 'AI face retouching and smoothing'
  },
  {
    id: 'ai-upscale-2x',
    name: 'Upscale 2X',
    shortcut: '',
    category: 'ai',
    icon: Maximize,
    description: 'AI 2x resolution upscaling'
  },
  {
    id: 'ai-upscale-4x',
    name: 'Upscale 4X',
    shortcut: '',
    category: 'ai',
    icon: Maximize,
    description: 'AI 4x resolution upscaling'
  },
  {
    id: 'ai-denoise',
    name: 'Denoise',
    shortcut: '',
    category: 'ai',
    icon: CircleSlash,
    description: 'AI noise reduction'
  },
  {
    id: 'ai-color-grade',
    name: 'Auto Color Grade',
    shortcut: '',
    category: 'ai',
    icon: Palette,
    description: 'AI-powered color grading'
  },
  {
    id: 'ai-object-remove',
    name: 'Remove Objects',
    shortcut: '',
    category: 'ai',
    icon: EraserIcon,
    description: 'AI content-aware object removal'
  },
  {
    id: 'ai-sky-replace',
    name: 'Replace Sky',
    shortcut: '',
    category: 'ai',
    icon: Globe,
    description: 'AI sky replacement'
  },
  {
    id: 'ai-depth-blur',
    name: 'Depth Blur',
    shortcut: '',
    category: 'ai',
    icon: Aperture,
    description: 'DSLR-style background blur'
  },
  {
    id: 'ai-style-vintage',
    name: 'Vintage Style',
    shortcut: '',
    category: 'ai',
    icon: Lightbulb,
    description: 'Apply vintage film look'
  },
  {
    id: 'ai-style-cinematic',
    name: 'Cinematic Style',
    shortcut: '',
    category: 'ai',
    icon: Aperture,
    description: 'Apply cinematic color grade'
  },
]

// ============================================================================
// VIEW TOOLS
// ============================================================================
export const viewTools: ToolDefinition[] = [
  {
    id: 'zoom',
    name: 'Zoom Tool',
    shortcut: 'Z',
    category: 'view',
    icon: ZoomIn,
    description: 'Zoom in and out',
    modifiers: ['Alt (Zoom out)']
  },
  {
    id: 'hand',
    name: 'Hand Tool',
    shortcut: 'H',
    category: 'view',
    icon: Hand,
    description: 'Pan canvas'
  },
]

// ============================================================================
// ALL TOOLS
// ============================================================================
export const allTools: ToolDefinition[] = [
  ...selectionTools,
  ...transformTools,
  ...paintTools,
  ...retouchTools,
  ...vectorTools,
  ...textTools,
  ...aiTools,
  ...viewTools,
]

// Tool categories with labels
export const toolCategories = [
  { id: 'select', name: 'Selection', tools: selectionTools },
  { id: 'transform', name: 'Transform', tools: transformTools },
  { id: 'paint', name: 'Paint', tools: paintTools },
  { id: 'retouch', name: 'Retouch', tools: retouchTools },
  { id: 'vector', name: 'Vector', tools: vectorTools },
  { id: 'text', name: 'Text', tools: textTools },
  { id: 'ai', name: 'AI Tools', tools: aiTools },
  { id: 'view', name: 'View', tools: viewTools },
] as const

// Get tool by ID
export function getToolById(id: string): ToolDefinition | undefined {
  return allTools.find(tool => tool.id === id)
}

// Get tools by category
export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return allTools.filter(tool => tool.category === category)
}
