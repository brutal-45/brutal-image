import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, settings } = body

    if (!image) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 })
    }

    const zai = await ZAI.create()
    
    // Analyze image for background removal
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an image segmentation expert specializing in background removal. Analyze the image and provide detailed segmentation hints. Return JSON with:
- subject (description of main subject/foreground)
- background (description of background)
- complexity (one of: "simple", "moderate", "complex", "very-complex")
- edgeType (one of: "sharp", "soft", "hair", "transparent", "mixed")
- confidence (0-100)
- suggestedMethod (one of: "ai-segmentation", "color-key", "edge-detection", "manual-refinement")
- featherRadius (0-20, pixels for edge softening)
- refineEdges (boolean)
- colorSpillRemoval (boolean)
- suggestions (array of specific tips for this image)`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this image for background removal. Identify the main subject and suggest the best approach. Return only JSON.' },
            { type: 'image_url', image_url: { url: image } }
          ] as any
        }
      ]
    })

    const responseText = completion.choices[0]?.message?.content || ''
    let analysis = {
      subject: 'main object',
      background: 'generic background',
      complexity: 'moderate',
      edgeType: 'sharp',
      confidence: 85,
      suggestedMethod: 'ai-segmentation',
      featherRadius: 2,
      refineEdges: true,
      colorSpillRemoval: true,
      suggestions: ['Use AI segmentation for best results', 'Feather edges for natural look']
    }
    
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
      analysis,
      note: 'Full background removal requires specialized ML models. This analysis can guide client-side or server-side processing.'
    })
  } catch (error) {
    console.error('Background removal error:', error)
    return NextResponse.json({ 
      error: 'Failed to analyze image for background removal',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
