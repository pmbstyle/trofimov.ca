import { html as about } from "@/config/about.md"
import { html as skills } from "@/config/skills.md"
import { html as contact } from "@/config/contact.md"
import { html as experience } from "@/config/experience.md"

export interface FileType {
	type: "folder" | "file"
	path: string
	name: string
	content?: string
}

const files: FileType[] = [
	{
		type: "folder",
		path: "~/projects/",
		name: "projects",
	},
	{
		type: "file",
		content: about,
		path: "~/",
		name: "about.md",
	},
	{
		type: "file",
		content: skills,
		path: "~/",
		name: "skills.md",
	},
	{
		type: "file",
		content: contact,
		path: "~/",
		name: "contact.md",
	},
	{
		type: "file",
		content: experience,
		path: "~/",
		name: "experience.md",
	},
	// {
	// 	type: "file",
	// 	content: logture,
	// 	path: "~/projects",
	// 	name: "logture.md",
	// },
]

export default files
