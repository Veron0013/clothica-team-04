import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
	title: "404 — Page not found | Notehub app",
	description: "Page not found. Sorry",
	openGraph: {
		title: `404 - Notehub app`,
		description: "Page not found.Sorry",
		url: `https://notehub-app-auth.vercel.app`,
		siteName: "NoteHub",
		images: [
			{
				url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
				width: 1200,
				height: 630,
				alt: "404 - Notehub",
			},
		],
		type: "website",
	},
}

const NotFound = () => {
	return (
		<div>
			<Link href="/">Go back home</Link>
			<h1>404 - Page not found</h1>
			<p>Sorry, the page you are looking for does not exist.</p>
		</div>
	)
}

export default NotFound
