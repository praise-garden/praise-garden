import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import FormRenderer from '@/components/public-form/FormRenderer';
import { FormConfig } from '@/types/form-config';
import { headers } from 'next/headers';

// Props for the page
interface PublicFormPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Helper to get base URL
async function getBaseUrl(): Promise<string> {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    return `${protocol}://${host}`;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PublicFormPageProps): Promise<Metadata> {
    const { id } = await params;

    try {
        const baseUrl = await getBaseUrl();
        const response = await fetch(`${baseUrl}/api/public/forms/${id}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            return {
                title: 'Form Not Found',
            };
        }

        const data = await response.json();
        const formName = data.name || 'Share Your Feedback';

        return {
            title: formName,
            description: 'We\'d love to hear about your experience!',
            openGraph: {
                title: formName,
                description: 'Share your testimonial with us',
                type: 'website',
            },
        };
    } catch {
        return {
            title: 'Share Your Feedback',
        };
    }
}

// Fetch form data (Server-side)
async function getFormConfig(id: string): Promise<FormConfig | null> {
    try {
        const baseUrl = await getBaseUrl();
        const response = await fetch(`${baseUrl}/api/public/forms/${id}`, {
            cache: 'no-store', // Always fetch fresh data for forms
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        // TODO: Add published status check here
        // if (data.status !== 'published') {
        //     return null;
        // }

        // Merge settings into FormConfig structure
        const formConfig: FormConfig = {
            ...data.settings,
            id: data.id ?? data.settings?.id ?? id,
            name: data.name ?? data.settings?.name ?? 'Feedback Form',
            projectId: data.project_id,
            theme: {
                backgroundColor: '#0A0A0A',
                logoUrl: '',
                primaryColor: '#A855F7',
                secondaryColor: '#22C55E',
                headingFont: 'Space Grotesk',
                bodyFont: 'Inter',
                ...(data.settings?.theme ?? {}),
            },
        };

        return formConfig;
    } catch (error) {
        console.error('Error fetching form config:', error);
        return null;
    }
}

// Public Form Page Component
export default async function PublicFormPage({ params }: PublicFormPageProps) {
    const { id } = await params;
    const formConfig = await getFormConfig(id);

    if (!formConfig) {
        notFound();
    }

    return (
        <main className="w-full h-screen overflow-hidden bg-gray-950">
            <FormRenderer formConfig={formConfig} />
        </main>
    );
}
