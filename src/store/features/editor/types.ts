export interface EditorState {
    slides: unknown[];
    currentSlide: number;
    bottomSheet: {
        [key: string]: boolean
    };
    bottomSheetType: 'quiz' | 'text' | 'image' | 'layout';
    // other editor state
}
