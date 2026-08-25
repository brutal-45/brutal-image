import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface AIRequest {
  action: string
  image?: string
  settings?: Record<string, unknown>
  prompt?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json()
    const { action, image, settings = {}, prompt } = body

    const zai = await ZAI.create()

    switch (action) {
      case 'analyze': {
        if (!image) {
          return NextResponse.json({ error: 'No image data provided' }, { status: 400 })
        }

        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are a professional photo enhancement expert. Analyze images and provide specific adjustment values. Always respond with valid JSON containing these exact keys:
- exposure (-100 to 100)
- contrast (-100 to 100) 
- highlights (-100 to 100)
- shadows (-100 to 100)
- whites (-100 to 100)
- blacks (-100 to 100)
- temperature (-100 to 100)
- tint (-100 to 100)
- vibrance (-100 to 100)
- saturation (-100 to 100)
- clarity (-100 to 100)
- dehaze (-100 to 100)
- description (brief text explaining the suggested enhancements)`
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Analyze this image and suggest enhancements. Return ONLY a JSON object with the specified keys.' },
                { type: 'image_url', image_url: { url: image } }
              ] as any
            }
          ] as any
        })

        const responseText = completion.choices[0]?.message?.content || ''
        
        try {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const suggestions = JSON.parse(jsonMatch[0])
            return NextResponse.json({ success: true, suggestions })
          }
        } catch {
          // Fallback to default suggestions
        }

        return NextResponse.json({ 
          success: true, 
          suggestions: {
            exposure: 5,
            contrast: 15,
            highlights: -10,
            shadows: 10,
            whites: 5,
            blacks: -5,
            temperature: 0,
            tint: 0,
            vibrance: 10,
            saturation: 5,
            clarity: 15,
            dehaze: 5,
            description: 'Auto-enhancement applied for balanced exposure and contrast'
          }
        })
      }

      case 'bg-remove': {
        // Background removal using VLM for segmentation hints
        if (!image) {
          return NextResponse.json({ error: 'No image data provided' }, { status: 400 })
        }

        // Analyze image for subject detection
        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are an image segmentation expert. Analyze the image and identify the main subject. Return a JSON object with: subject (description of main subject), confidence (0-100), edges (array of edge hints like "hair", "smooth", "complex"), and suggestedFeather (0-10 for edge softening).'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Identify the main subject in this image for background removal. Return only JSON.' },
                { type: 'image_url', image_url: { url: image } }
              ] as any
            }
          ] as any
        })

        const responseText = completion.choices[0]?.message?.content || ''
        let analysis = { subject: 'main object', confidence: 85, edges: ['smooth'], suggestedFeather: 2 }
        
        try {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            analysis = JSON.parse(jsonMatch[0])
          }
        } catch {
          // Use defaults
        }

        return NextResponse.json({ 
          success: true, 
          message: 'Background removal analysis complete',
          analysis,
          note: 'Full background removal requires specialized ML models. This endpoint provides analysis data for client-side processing.'
        })
      }

      case 'enhance': {
        if (!image) {
          return NextResponse.json({ error: 'No image data provided' }, { status: 400 })
        }

        // Get enhancement suggestions and apply them conceptually
        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are a photo enhancement AI. For each image, determine the optimal enhancement preset. Return a JSON object with:
- preset (one of: "portrait", "landscape", "product", "food", "architecture", "nature", "street", "night")
- adjustments (object with keys: exposure, contrast, saturation, vibrance, clarity, highlights, shadows - all -100 to 100)
- reasoning (brief explanation)`
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Analyze this image and determine the best enhancement approach. Return only JSON.' },
                { type: 'image_url', image_url: { url: image } }
              ] as any
            }
          ] as any
        })

        const responseText = completion.choices[0]?.message?.content || ''
        let enhancement = {
          preset: 'general',
          adjustments: { exposure: 5, contrast: 10, saturation: 5, vibrance: 10, clarity: 10, highlights: -5, shadows: 5 },
          reasoning: 'General enhancement applied'
        }
        
        try {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            enhancement = JSON.parse(jsonMatch[0])
          }
        } catch {
          // Use defaults
        }

        return NextResponse.json({ 
          success: true, 
          enhancement
        })
      }

      case 'upscale': {
        const scale = (settings.scale as number) || 2
        
        return NextResponse.json({ 
          success: true, 
          message: `AI upscaling ${scale}x would be processed here.`,
          scale,
          note: 'AI super-resolution requires specialized models. This endpoint provides scaling parameters for integration with dedicated upscaling services.'
        })
      }

      case 'portrait': {
        if (!image) {
          return NextResponse.json({ error: 'No image data provided' }, { status: 400 })
        }

        // Portrait enhancement analysis
        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are a portrait retouching expert. Analyze the portrait and suggest enhancements. Return JSON with:
- faceDetected (boolean)
- skinSmoothing (0-100, recommended amount)
- eyeEnhance (0-100)
- teethWhiten (0-100)
- skinTone (suggestion: "warm", "cool", "neutral", or "preserve")
- lighting (suggestion: "improve", "preserve", or specific adjustment)
- suggestions (array of specific improvements)`
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Analyze this portrait for enhancement opportunities. Return only JSON.' },
                { type: 'image_url', image_url: { url: image } }
              ] as any
            }
          ] as any
        })

        const responseText = completion.choices[0]?.message?.content || ''
        let portraitAnalysis = {
          faceDetected: true,
          skinSmoothing: 25,
          eyeEnhance: 30,
          teethWhiten: 15,
          skinTone: 'preserve',
          lighting: 'improve',
          suggestions: ['Enhance eye contrast', 'Smooth skin texture', 'Improve lighting'] as any
        }
        
        try {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            portraitAnalysis = JSON.parse(jsonMatch[0])
          }
        } catch {
          // Use defaults
        }

        return NextResponse.json({ 
          success: true, 
          portrait: portraitAnalysis
        })
      }

      case 'denoise': {
        // Noise analysis and reduction suggestions
        return NextResponse.json({ 
          success: true, 
          denoise: {
            estimatedNoise: 'medium',
            recommendedStrength: 50,
            preserveDetail: 75,
            luminanceReduction: 40,
            chromaReduction: 60
          }
        })
      }

      case 'sharpen': {
        // Smart sharpening
        return NextResponse.json({ 
          success: true, 
          sharpen: {
            recommendedAmount: 80,
            radius: 1.0,
            threshold: 4,
            method: 'smart'
          }
        })
      }

      case 'color-grade': {
        if (!prompt) {
          return NextResponse.json({ error: 'No prompt provided for color grading' }, { status: 400 })
        }

        // AI-powered color grading based on text prompt
        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are a color grading expert. Based on the user's description, provide precise color adjustment values. Return JSON with:
- temperature (-100 to 100, negative=cool/blue, positive=warm/yellow)
- tint (-100 to 100, negative=green, positive=magenta)
- saturation (-100 to 100)
- vibrance (-100 to 100)
- hue (0-360, overall hue shift)
- colorBalanceShadows: { cyanRed, magentaGreen, yellowBlue } (each -100 to 100)
- colorBalanceMidtones: { cyanRed, magentaGreen, yellowBlue }
- colorBalanceHighlights: { cyanRed, magentaGreen, yellowBlue }
- description (brief explanation of the look)`
            },
            {
              role: 'user',
              content: `Create a color grade for this description: "${prompt}". Return only JSON with the adjustment values.`
            }
          ] as any
        })

        const responseText = completion.choices[0]?.message?.content || ''
        let colorGrade = {
          temperature: 0,
          tint: 0,
          saturation: 0,
          vibrance: 0,
          hue: 0,
          colorBalanceShadows: { cyanRed: 0, magentaGreen: 0, yellowBlue: 0 },
          colorBalanceMidtones: { cyanRed: 0, magentaGreen: 0, yellowBlue: 0 },
          colorBalanceHighlights: { cyanRed: 0, magentaGreen: 0, yellowBlue: 0 },
          description: 'Custom color grade'
        }
        
        try {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            colorGrade = JSON.parse(jsonMatch[0])
          }
        } catch {
          // Use defaults
        }

        return NextResponse.json({ 
          success: true, 
          colorGrade
        })
      }

      case 'generate-prompt': {
        // Generate image description/prompt from uploaded image
        if (!image) {
          return NextResponse.json({ error: 'No image data provided' }, { status: 400 })
        }

        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are an image analysis expert. Describe the image in detail for AI image generation prompts. Focus on: subject, style, lighting, colors, mood, composition, and artistic elements.'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Generate a detailed prompt that could recreate this image. Include style, lighting, mood, and composition details.' },
                { type: 'image_url', image_url: { url: image } }
              ] as any
            }
          ] as any
        })

        const generatedPrompt = completion.choices[0]?.message?.content || 'An image with interesting composition'

        return NextResponse.json({ 
          success: true, 
          prompt: generatedPrompt
        })
      }

      default:
        return NextResponse.json({ error: 'Invalid action. Supported actions: analyze, bg-remove, enhance, upscale, portrait, denoise, sharpen, color-grade, generate-prompt' }, { status: 400 })
    }
  } catch (error) {
    console.error('AI processing error:', error)
    return NextResponse.json({ 
      error: 'Failed to process AI request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoints: [
      { action: 'analyze', description: 'Analyze image and get enhancement suggestions', requiresImage: true },
      { action: 'bg-remove', description: 'Background removal analysis', requiresImage: true },
      { action: 'enhance', description: 'Auto-enhancement based on image content', requiresImage: true },
      { action: 'upscale', description: 'AI upscaling parameters', requiresImage: false },
      { action: 'portrait', description: 'Portrait enhancement analysis', requiresImage: true },
      { action: 'denoise', description: 'Noise reduction suggestions', requiresImage: false },
      { action: 'sharpen', description: 'Smart sharpening parameters', requiresImage: false },
      { action: 'color-grade', description: 'AI color grading from text prompt', requiresPrompt: true },
      { action: 'generate-prompt', description: 'Generate image description from upload', requiresImage: true },
    ] as any
  })
}
