export interface Snippet {
  id: string;
  title: string;
  description: string;
  category: 'Fundamentals' | 'Components' | 'Advanced' | 'Projects' | 'My Saved';
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  code: string;
  isDefault?: boolean;
  createdAt: number;
  updatedAt: number;
}

export type SplitOrientation = 'horizontal' | 'vertical';

export type ViewportDevice = 'full' | 'tablet' | 'mobile';

export interface ConsoleMessage {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export type EditorTheme = 'vs-dark' | 'vs-light' | 'tm-navy';
