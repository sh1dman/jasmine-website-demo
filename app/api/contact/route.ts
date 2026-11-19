import { NextResponse } from 'next/server';

// On the live site this sends the message to the team's inbox. In this copy
// nothing is sent: the message is printed in the terminal where `npm run dev`
// is running, so you can check what the form submitted.
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, organization, position, email, subject, phone, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        console.log('\n[contact form] New message (not sent anywhere in this copy):');
        console.table({ name, organization, position, email, subject, phone, message });

        return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error handling contact form:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
