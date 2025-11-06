export type User = {
	email: string
	username: string
	avatar: string
	error?: string
}

export type EditUser = Omit<User, "avatar">
