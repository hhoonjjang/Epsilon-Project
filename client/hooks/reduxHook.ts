import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux/es/types';
import type { RootState, AppDispatch } from '@/module/store';

// useDispatch는 thunkAction에 대해 타입 에러를 발생시키므로 커스터마이징해서 사용합니다.
export const useAppDispatch: () => AppDispatch = useDispatch;

// useSelector를 사용할 경우, 매번 state의 타입을 지정해줘야 하기 때문에 커스터마이징해서 사용합니다.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 이 방식은 Redux 공식 문서에도 권장하는 방법이라고 한다.
// 매번 state의 타입을 지정해줘야한느 경우와 불필요한 타입 에러를 없앤다.
