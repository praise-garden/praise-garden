//  /api/cloudflare/video-info/route.ts
// API endpoint to fetch video duration from Cloudflare Stream using authenticated API

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
        return NextResponse.json({ error: 'Missing video UID' }, { status: 400 });
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
        return NextResponse.json({ error: 'Missing Cloudflare credentials' }, { status: 500 });
    }

    try {
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${uid}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Cloudflare API error:', errorData);
            return NextResponse.json({
                error: errorData.errors?.[0]?.message || 'Failed to fetch video info'
            }, { status: response.status });
        }

        const data = await response.json();

        if (data.success && data.result) {
            return NextResponse.json({
                uid: data.result.uid,
                duration: data.result.duration,
                status: data.result.status?.state,
                thumbnail: data.result.thumbnail,
                preview: data.result.preview,
                created: data.result.created,
            });
        }

        return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    } catch (error) {
        console.error('Error fetching video info:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
