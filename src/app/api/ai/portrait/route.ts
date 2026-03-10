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
    
    // Portrait enhancement analysis
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a professional portrait retouching expert. Analyze the portrait and recommend specific enhancements. Return JSON with:
- faceDetected (boolean)
- faceCount (number)
- skinAnalysis: {
    tone (one of: "fair", "light", "medium", "tan", "dark"),
    texture (one of: "smooth", "normal", "rough"),
    blemishes (boolean),
    suggestedSmoothing (0-100)
  }
- eyeAnalysis: {
    brightness (0-100),
    sharpness (0-100),
    redEye (boolean),
    suggestedEnhancement (0-100)
  }
- teethAnalysis: {
    visible (boolean),
    whiteness (0-100),
    suggestedWhitening (0-100)
  }
- lightingAnalysis: {
    quality (one of: "studio", "natural", "harsh", "soft", "mixed"),
    direction (one of: "front", "side", "back", "top", "mixed"),
    suggestedImprovements (array of strings)
  }
- overallSuggestions (array of specific enhancement recommendations)
- recommendedPreset (one of: "natural", "glamour", "editorial", "vintage", "dramatic")`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this portrait in detail. Provide specific enhancement recommendations. Return only JSON.' },
            { type: 'image_url', image_url: { url: image } }
          ] as any
        }
      ] as any
    })

    const responseText = completion.choices[0]?.message?.content || ''
    let portraitAnalysis = {
      faceDetected: true,
      faceCount: 1,
      skinAnalysis: {
        tone: 'medium',
        texture: 'normal',
        blemishes: false,
        suggestedSmoothing: 20
      },
      eyeAnalysis: {
        brightness: 70,
        sharpness: 80,
        redEye: false,
        suggestedEnhancement: 25
      },
      teethAnalysis: {
        visible: true,
        whiteness: 80,
        suggestedWhitening: 10
      },
      lightingAnalysis: {
        quality: 'natural',
        direction: 'front',
        suggestedImprovements: ['Add subtle fill light', 'Enhance catchlights'] as any
      },
      overallSuggestions: ['Enhance eye contrast', 'Smooth skin texture slightly', 'Brighten teeth'],
      recommendedPreset: 'natural'
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
      portrait: portraitAnalysis,
      note: 'Full portrait enhancement requires specialized face processing. These settings guide client-side or dedicated API processing.'
    })
  } catch (error) {
    console.error('Portrait analysis error:', error)
    return NextResponse.json({ 
      error: 'Failed to analyze portrait',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
