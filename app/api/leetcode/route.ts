import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com/',
                'Origin': 'https://leetcode.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        
        if (!data || data?.errors) {
            console.error('LeetCode API Error:', data?.errors || 'Empty response');
        }

        return NextResponse.json(data || { error: 'No data returned from LeetCode' });
    } catch (error: any) {
        console.error('Proxy Route Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

