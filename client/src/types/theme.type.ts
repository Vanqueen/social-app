
export interface ThemeType {
    primaryColor: string,
    backgroundColor: string
}

export interface UIState {
    themeModalIsOpen: boolean;
    editProfileModalOpen: boolean;
    editPostModalOpen: boolean;
    editPostId: string;
    theme: ThemeType;
}
