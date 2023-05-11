import { useQuery, useMutation } from 'react-query';
import axios from 'axios';

const UserList = () => {
    const postUserList = async () => {
        try {
            const data = await axios.post('http://13.125.251.97:8080/api/user/findUserList', '무엇이 필요하니?');
            return data.data;
        } catch (error) {
            console.log(error);
        }
    };
    const fetchUserList = async () => {
        try {
            const data = await axios.get('http://13.125.251.97:8080/api/user/userList?type=all');
            return data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const { isLoading, error, data } = useQuery('userList', fetchUserList);
    // const { data, isLoading, mutate, mutateAsync } = useMutation(postUserList);

    return (
        <div>
            {isLoading ? (
                <div>loading</div>
            ) : error ? (
                <div>error</div>
            ) : (
                data?.map((item: { name: string; age: number; email: string }, index: number) => {
                    return (
                        <div style={{ display: 'flex', columnGap: '10px' }} key={`outter-${index}`}>
                            <div key={item.name}>name : {item.name} </div>
                            <div key={item.name}>age : {item.age} </div>
                            <div key={item.name}>email : {item.email} </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default UserList;
