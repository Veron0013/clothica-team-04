import { cookies } from "next/headers"
import { nextServer } from "./api"
import { User } from "@/types/user"
import { Note, NoteId, NotesData, Tag } from "@/types/note"
import { ApiQueryParams, SearchParams } from "./clientApi"
import { PER_PAGE } from "../vars"

export const checkServerSession = async () => {
	// Дістаємо поточні cookie
	const cookieStore = await cookies()
	const res = await nextServer.get("/auth/session", {
		headers: {
			// передаємо кукі далі
			Cookie: cookieStore.toString(),
		},
	})
	return res
}

export const getServerMe = async (): Promise<User> => {
	const cookieStore = await cookies()
	const { data } = await nextServer.get("/users/me", {
		headers: {
			Cookie: cookieStore.toString(),
		},
	})
	return data
}

export const fetchNoteByIdServer = async (id: NoteId): Promise<Note> => {
	const cookieStore = await cookies()
	const response = await nextServer.get<Note>(`/notes/${id}`, {
		headers: {
			Cookie: cookieStore.toString(),
		},
	})
	return response.data
}

export const createQueryParams = (search = "", page = 1, tag?: string): ApiQueryParams => {
	const params: SearchParams = {
		search,
		page,
		perPage: PER_PAGE,
	}
	//console.log(tag)
	if (tag !== "All") {
		params.tag = tag as Tag
	}

	return { params }
}

export const fetchNotesServer = async (queryParams: ApiQueryParams): Promise<NotesData> => {
	const cookieStore = await cookies()
	const response = await nextServer.get<NotesData>("/notes", {
		headers: {
			Cookie: cookieStore.toString(),
		},
		params: queryParams,
	})

	return response.data
}
