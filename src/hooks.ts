import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Typed versions of useDispatch and useSelector for use throughout the
 * application. Using these hooks instead of the base versions prevents
 * the need to import RootState and AppDispatch in every component.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
