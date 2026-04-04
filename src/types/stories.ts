export interface StoryPage {
  emoji: string;
  bg: string;
  text: string;
}

export interface Story {
  id: number;
  title: string;
  emoji: string;
  bg: string;
  tags: string[];
  free: boolean;
  pages: StoryPage[];
}

export type PlanType = 'free' | 'premium';

export interface UserState {
  name: string;
  email: string;
  firstName: string;
}

export interface ViewerState {
  storyIdx: number;
  page: number;
}

export interface AppState {
  user: UserState;
  plan: PlanType;
  viewer: ViewerState;
}
