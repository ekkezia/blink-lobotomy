import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const Scoreboard = ({ isSubmitting }) => {
  const [scoreboardData, setScoreboardData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch blink-lobotomy scoreboard data from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("blink-lobotomy").select("*");

      if (error) throw error;
      setScoreboardData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // refetch data every time isSubmitting is updated
    fetchData();
  }, [isSubmitting]);

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, zIndex: 1 }}>
      {loading
        ? "Loading... ⏳"
        : scoreboardData.map((data, idx) => {
            return (
              <div key={data.id}>
                {idx + 1}. <b>{data.name}</b> blinks <b>{data.blink_count}</b>{" "}
                times in <b>{data.time}</b> seconds.
              </div>
            );
          })}
    </div>
  );
};

export default Scoreboard;
