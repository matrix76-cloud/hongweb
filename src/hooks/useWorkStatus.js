import { useEffect, useState } from 'react';
import { ReadWork } from '../service/WorkService';
import { WORKSTATUS } from '../utility/status';
const useWorkStatus = (latitude, longitude, checkdistance = 4) => {
    const [status, setStatus] = useState({
        newCount: 0,
        closedCount: 0,
        newSample: "",
        closedSample: ""
    });

    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!latitude || !longitude) return;

            try {
                const works = await ReadWork({ latitude, longitude, checkdistance });

                const newItems = works.filter(w => w.WORK_STATUS === WORKSTATUS.OPEN);
                const closedItems = works.filter(w => w.WORK_STATUS === WORKSTATUS.CLOSE);

                const sorted = [...newItems, ...closedItems];

                console.log("newItems", newItems);

                const newSample = newItems[0]?.WORKTYPE || "";
                const closedSample = closedItems[0]?.WORKTYPE || "";

                setStatus({
                    newCount: newItems.length,
                    closedCount: closedItems.length,
                    newSample,
                    closedSample
                });

                setItems(sorted);
            } catch (error) {
                console.error('Failed to fetch work items:', error);
                setStatus({
                    newCount: 0,
                    closedCount: 0,
                    newSample: "",
                    closedSample: ""
                });
                setItems([]);
            }
        };

        fetchData();
    }, [latitude, longitude, checkdistance]);

    return { status, items };
};

export default useWorkStatus;

