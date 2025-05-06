import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";

const HomePage = () => {
    const [search, setSearch] = useState("");
    const { data, isPending, isError } = useGetLpList({ search });


    if (isPending) return <div>Loading...</div>;
    if (isError) return <div>Error!</div>;

    console.log(data?.data.data?.map((lp) => lp.title));

    return (
        <div>
            <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border border-gray-400 rounded px-3 py-2 mb-4"
                placeholder="검색어를 입력하세요"
            />
            {(Array.isArray(data?.data.data) ? data.data.data : []).map((lp) => (
                <h1 key={lp.id}>{lp.title}</h1>
            ))}
        </div>
    );
};

export default HomePage;