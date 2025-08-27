import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // ESPN Hidden API endpoint for college football news
    const espnApiUrl = 'http://site.api.espn.com/apis/site/v2/sports/football/college-football/news'
    
    const response = await fetch(espnApiUrl, {
      headers: {
        'User-Agent': 'CFB-Betting-Tool/1.0',
        'Accept': 'application/json'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok) {
      console.error('ESPN API error:', response.status, response.statusText)
      return NextResponse.json({ 
        error: 'Failed to fetch ESPN news',
        articles: [] 
      }, { status: response.status })
    }

    const data = await response.json()
    
    // Process and clean ESPN news data
    const processedArticles = data.articles?.map((article: any) => ({
      id: article.id || Date.now() + Math.random(),
      headline: article.headline || article.title || 'No headline available',
      description: article.description || article.story || '',
      published: article.published || new Date().toISOString(),
      images: article.images || [],
      links: article.links || {},
      categories: article.categories || [],
      byline: article.byline || '',
      urgent: article.type === 'Breaking' || article.urgent === true,
      lastModified: article.lastModified || article.published,
      story: article.story || article.description || '',
      source: 'ESPN'
    })) || []

    // Filter for college football relevance
    const collegeFootballArticles = processedArticles.filter((article: any) => {
      const content = (article.headline + ' ' + article.description).toLowerCase()
      const cfbKeywords = [
        'college football', 'cfb', 'ncaa football', 'playoff', 'conference',
        'alabama', 'georgia', 'michigan', 'ohio state', 'texas', 'usc',
        'notre dame', 'florida', 'lsu', 'auburn', 'tennessee', 'penn state',
        'sec', 'big ten', 'big 12', 'acc', 'pac-12', 'recruiting', 'transfer portal'
      ]
      
      return cfbKeywords.some(keyword => content.includes(keyword))
    })

    console.log(`✅ ESPN API: Retrieved ${collegeFootballArticles.length} college football articles`)

    return NextResponse.json({
      success: true,
      source: 'ESPN',
      count: collegeFootballArticles.length,
      articles: collegeFootballArticles,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('ESPN API fetch error:', error)
    return NextResponse.json({ 
      error: 'Internal server error fetching ESPN news',
      articles: [],
      success: false 
    }, { status: 500 })
  }
}

// Additional ESPN endpoints for specific news types
export async function POST(request: Request) {
  try {
    const { type } = await request.json()
    
    let endpoint = 'http://site.api.espn.com/apis/site/v2/sports/football/college-football'
    
    switch (type) {
      case 'breaking':
        endpoint += '/news?type=breaking'
        break
      case 'scores':
        endpoint += '/scoreboard'
        break
      case 'rankings':
        endpoint += '/rankings'
        break
      default:
        endpoint += '/news'
    }

    const response = await fetch(endpoint, {
      headers: {
        'User-Agent': 'CFB-Betting-Tool/1.0',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      return NextResponse.json({ 
        error: `Failed to fetch ${type} from ESPN`,
        data: [] 
      }, { status: response.status })
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      type,
      data,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error(`ESPN ${type} fetch error:`, error)
    return NextResponse.json({ 
      error: 'Internal server error',
      data: [] 
    }, { status: 500 })
  }
}