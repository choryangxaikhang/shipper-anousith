import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import {ROOM} from "./apollo/index"

export default function QueryRoom (){

    const [queryRoom, { data: responData, loading }] = useLazyQuery(ROOM, {
      fetchPolicy: "cache-and-network",
    });

    useEffect(() => {
       queryRoom({
        variables:{
            where:{
                _id:undefined,
            },
        }
       })
    }, []);
    // console.log({ responData });

    return (
 
        <div className="form-group basic">
          <input
            type="search"
            className="form-control form-control-lg mb-2"
            // onChange={(e) => _onSearch(e)}
            placeholder="ຄົ້ນຫາ"
          />
        </div>
   
    );
}