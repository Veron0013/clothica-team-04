import { PER_PAGE } from "@/lib/vars";
import type {
  Note,
  NoteId,
  NotePost,
  NotesData,
  SortBy,
  Tag,
} from "@/types/note";
import { User } from "@/types/user";
import { nextServer } from "./api";

//axios.defaults.baseURL = MAIN_URL
//axios.defaults.headers.common["Authorization"] = `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`
export type LoginRequest = {
  phone: string;
  password: string;
};

export type ResetPasswordSendmailRequest = {
  email: string;
};

export type RestorePasswordRequest = {
  token: string;
  password: string;
};

export type RegisterRequest = {
  phone: string;
  password: string;
  username: string;
};

type CheckSessionRequest = {
  success: boolean;
};

export interface SearchParams {
  search: string;
  tag?: Tag;
  page?: number;
  perPage?: number;
  sortBy?: SortBy;
}

export interface ApiQueryParams {
  params: SearchParams;
}

// export type Category = {
// 	id: string
// 	name: string
// 	description: string
// 	createdAt: string
// 	updatedAt: string
// }

export const createQueryParams = (
  search = "",
  page = 1,
  tag?: string
): ApiQueryParams => {
  const params: SearchParams = {
    search,
    page,
    perPage: PER_PAGE,
  };
  //console.log(tag)
  if (tag !== "All") {
    params.tag = tag as Tag;
  }

  return { params };
};

export const fetchNotes = async (
  queryParams: ApiQueryParams
): Promise<NotesData> => {
  const refreshSession = await checkSession();
  if (refreshSession) {
    const response = await nextServer.get<NotesData>("/notes", queryParams);
    return response.data;
  } else {
    throw new Error(JSON.stringify({ message: "Session expired", code: 401 }));
  }
};

export const deleteNote = async (id: NoteId): Promise<Note> => {
  const refreshSession = await checkSession();
  if (refreshSession) {
    const response = await nextServer.delete<Note>(`/notes/${id}`);
    return response.data;
  } else {
    throw new Error(JSON.stringify({ message: "Session expired", code: 401 }));
  }
};

export const createNote = async (queryParams: NotePost): Promise<Note> => {
  const refreshSession = await checkSession();
  if (refreshSession) {
    const response = await nextServer.post<Note>("/notes", queryParams);
    return response.data;
  } else {
    throw new Error(JSON.stringify({ message: "Session expired", code: 401 }));
  }
};

export const updateNote = async (
  queryParams: NotePost,
  id: NoteId
): Promise<Note> => {
  const refreshSession = await checkSession();
  if (refreshSession) {
    const response = await nextServer.patch<Note>(`/notes/${id}`, queryParams);
    return response.data;
  } else {
    throw new Error(JSON.stringify({ message: "Session expired", code: 401 }));
  }
};

export const fetchNoteById = async (id: NoteId): Promise<Note> => {
  //const response = await axios.get<Note>(`${MAIN_URL}/${id}`)
  const refreshSession = await checkSession();

  if (refreshSession) {
    const response = await nextServer.get<Note>(`/notes/${id}`);
    return response.data;
  } else {
    throw new Error(JSON.stringify({ message: "Session expired", code: 401 }));
  }
};

////////////////////////////////////////

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};

export const getMe = async () => {
  const refreshSession = await checkSession();
  if (refreshSession) {
    const { data } = await nextServer.get<User>("/users/me");
    return data;
  } else {
    throw new Error(JSON.stringify({ message: "Session expired", code: 401 }));
  }
};

export type UpdateUserRequest = {
  username?: string;
  avatar?: File | null;
};

export const updateMe = async (payload: UpdateUserRequest) => {
  const refreshSession = await checkSession();

  if (refreshSession) {
    const formData = new FormData();

    if (payload.username) formData.append("username", payload.username);
    if (payload.avatar) formData.append("avatar", payload.avatar);

    const res = await nextServer.patch<User>("/users/me", formData);
    return res.data;
  } else {
    throw new Error(JSON.stringify({ message: "Session expired", code: 401 }));
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await nextServer.post("/upload", formData);
  return data.url;
};

export const passwordSendMail = async (email: ResetPasswordSendmailRequest) => {
  const res = await nextServer.post("/auth/request-reset-email", email);
  return res;
};

export const resetPassword = async (body: RestorePasswordRequest) => {
  const res = await nextServer.post("/auth/reset-password", body);
  return res;
};

////////////////////////////  категорії

const allCategoriesData = [
  {
    _id: {
      $oid: "690c9ce6a6276289c98fc006",
    },
    name: "Футболки та сорочки",
    img_url:
      "https://res.cloudinary.com/dyounr2tf/image/upload/v1762702733/T-shirt_j1z7yu.png",
  },
  {
    _id: {
      $oid: "690c9ce6a6276289c98fc007",
    },
    name: "Штани та джинси",
    img_url:
      "https://res.cloudinary.com/dyounr2tf/image/upload/v1762702730/jeans_u3ojk6.png",
  },
  {
    _id: {
      $oid: "690c9ce6a6276289c98fc008",
    },
    name: "Верхній одяг",
    img_url:
      "https://res.cloudinary.com/dyounr2tf/image/upload/v1762702727/jackets_xsivjo.png",
  },
  {
    _id: {
      $oid: "690c9ce6a6276289c98fc009",
    },
    name: "Топи та майки",
    img_url:
      "https://res.cloudinary.com/dyounr2tf/image/upload/v1762702726/tops_and_T-shirts_lcjhsy.png",
  },
  {
    _id: {
      $oid: "690c9ce6a6276289c98fc00a",
    },
    name: "Сукні та спідниці",
    img_url:
      "https://res.cloudinary.com/dyounr2tf/image/upload/v1762702729/dresses_oxsaxg.png",
  },
  {
    _id: {
      $oid: "690c9ce6a6276289c98fc00b",
    },
    name: "Домашній та спортивний одяг",
    img_url:
      "https://res.cloudinary.com/dyounr2tf/image/upload/v1762702726/home_clothes_pmxvwo.png",
  },
  {
    _id: {
      $oid: "690c9ce6a6276289c98fc00c",
    },
    name: "Худі та кофти",
    img_url:
      "https://res.cloudinary.com/dyounr2tf/image/upload/v1762702732/hoodie_rliq9q.png",
  },
  {
    _id: {
      $oid: "690c9d0ea6276289c98fc00d",
    },
    name: "Інше",
    img_url:
      "https://res.cloudinary.com/dyounr2tf/image/upload/v1762702725/other_vgjzdd.png",
  },
];

export type Category = { _id: { $oid: string }; name: string; img_url: string };
export type CategoriesListResponse = { categories: Category[] };

export const fetchCategories = ({
  show = 0,
  limit = 6,
}): Promise<{ data: CategoriesListResponse; total: number }> => {
  // імітація

  return new Promise((resolve) => {
    setTimeout(() => {
      const paginatedData = allCategoriesData.slice(show, show + limit);

      resolve({
        data: { categories: paginatedData },
        total: allCategoriesData.length,
      });
    }, 1000);
  });
};
