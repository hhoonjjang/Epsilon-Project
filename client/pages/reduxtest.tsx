import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { decrement, increment, counterAsync } from '@/module/features/counterSlice';

const TestComp = () => {
    const { value: count } = useAppSelector((state) => state.counter);
    const dispatch = useAppDispatch();

    return (
        <div>
            <div>{count}</div>
            <div>
                <button onClick={() => dispatch(increment())}>+ increment</button>
            </div>
            <div>
                <button onClick={() => dispatch(decrement())}>- decrement</button>
            </div>
            <div>
                <button onClick={() => dispatch(counterAsync(count + 1))}>+ async</button>
            </div>
            <div>
                <button onClick={() => dispatch(counterAsync(count - 1))}>- async</button>
            </div>
        </div>
    );
};

export default TestComp;
