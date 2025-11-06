import { Tag } from "@/types/note"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type NoteValues = {
	title: string
	content: string
	tag: Tag
}

type NoteStore = {
	draft: NoteValues
	setDraft: (newDraft: NoteValues) => void
	resetDraft: () => void
}

const initialDraft: NoteValues = {
	title: "",
	content: "",
	tag: "Todo" as Tag,
}

export const useTaskStore = create<NoteStore>()(
	persist(
		(set) => ({
			draft: initialDraft,
			setDraft: (newDraft) => set({ draft: newDraft }),
			resetDraft: () => set({ draft: initialDraft }),
		}),
		{
			name: "task-draft",
			partialize: (state) => ({ draft: state.draft }),
		}
	)
)
