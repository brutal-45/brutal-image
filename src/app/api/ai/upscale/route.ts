import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, width, height, settings } = body

    if (!image) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 })
    }

    const scale = settings?.scale || 2
    const targetWidth = width * scale
    const targetHeight = height * scale

    // Use VLM to analyze image for upscaling hints
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an image upscaling expert. Analyze the image and recommend upscaling parameters. Return JSON with:
- method (one of: "bicubic", "lanczos", "ai-enhanced")
- sharpenAfterUpscale (0-100)
- denoiseStrength (0-100)
- preserveDetails (boolean)
- recommendedScale (2, 4, or 8)`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Analyze this image for ${scale}x upscaling. Original size: ${width}x${height}. Target: ${targetWidth}x${targetHeight}. Return only JSON.` },
            { type: 'image_url', image_url: { url: image } }
          ] as any
        }
      ] as any
    })

    const responseText = completion.choices[0]?.message?.content || ''
    let upscaleSettings = {
      method: 'ai-enhanced',
      sharpenAfterUpscale: 30,
      denoiseStrength: 10,
      preserveDetails: true,
      recommendedScale: scale
    }
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        upscaleSettings = JSON.parse(jsonMatch[0])
      }
    } catch {
      // Use defaults
    }

    return NextResponse.json({
      success: true,
      originalSize: { width, height },
      targetSize: { width: targetWidth, height: targetHeight },
      scale,
      settings: upscaleSettings,
      note: 'Full AI upscaling requires specialized super-resolution models. Use these settings with dedicated upscaling APIs.'
    })
  } catch (error) {
    console.error('Upscale error:', error)
    return NextResponse.json({ 
      error: 'Failed to process upscale request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
