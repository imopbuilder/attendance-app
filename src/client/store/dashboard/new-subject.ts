import { create } from 'zustand';

type State = {
	loading: boolean;
};

type Action = {
	setloading: (loading: State['loading']) => void;
};

export const useNewSubject = create<State & Action>((set) => ({
	loading: false,
	setloading: (loading) => set((state) => ({ loading })),
}));
