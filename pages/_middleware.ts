import { NextRequest, NextResponse } from 'next/server'

const fallback = 'https://lachlanjc.com'
const airtable = {
  baseId: 'appuzj4fe64tpgmbR',
  tableName: 'Links',
  apiKey: process.env.AIRTABLE_API_KEY,
} as const

export default async (req: NextRequest) => {
  const slug = req.nextUrl.pathname.replace('/', '')
  if (slug.length === 0) {
    return NextResponse.redirect(fallback)
  }
  const destination = await findDestination(slug)
  if (destination) {
    return NextResponse.redirect(destination)
  } else {
    return NextResponse.redirect(fallback)
  }
}

const findDestination = async (slug: string): Promise<string | null> => {
  const records = await fetch(
    `https://api.airtable.com/v0/${airtable.baseId}/${airtable.tableName}`,
    { headers: { Authorization: `Bearer ${airtable.apiKey}` } }
  )
    .then((res) => res.json())
    .then((json) => json.records)
    .then((records: Array<{ fields: { Slug: string; URL: string } }>) =>
      records.map((record) => record.fields)
    )

  return records.find((link) => link.Slug === slug.toLowerCase())?.URL
}
