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

  const [hoveredData, setHoveredData] = useState(null);
  return (
    <>
      <div>
        <h3 style={{ marginBottom: "1rem" }}>Leaderboard</h3>
        <div className="overflow-y">
          {loading
            ? "Loading... ⏳"
            : scoreboardData
                .sort((a, b) => a.time - b.time)
                .map((data, idx) => {
                  return (
                    <div
                      key={data.id}
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <p>{idx === 0 ? "👑" : idx + 1}</p>
                      <img
                        src={`https://lmgbcuolwhkqoowxnaik.supabase.co/storage/v1/object/public/blink_lobotomy/blink_lobotomy_${data.name}.png`}
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                        onMouseEnter={() => setHoveredData(data)}
                        onMouseLeave={() => setHoveredData(null)}
                      />
                      <p>
                        <em>{data.name === "" ? "Anonymous" : data.name}</em>{" "}
                        blinks <b>{data.blink_count}</b> times in{" "}
                        <b>{data.time}</b> seconds.
                      </p>
                    </div>
                  );
                })}
        </div>
      </div>
      {hoveredData !== null && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 99,
            background: "grey",
            borderRadius: "0.5rem",
            padding: "1rem",
          }}
        >
          <img
            src={`https://lmgbcuolwhkqoowxnaik.supabase.co/storage/v1/object/public/blink_lobotomy/blink_lobotomy_${hoveredData.name}.png`}
            style={{
              width: 600,
              height: 400,
            }}
          />
          <p>
            <em>{hoveredData.name === "" ? "Anonymous" : hoveredData.name}</em>{" "}
            blinks <b>{hoveredData.blink_count}</b> times in{" "}
            <b>{hoveredData.time}</b> seconds. Try to beat them!
          </p>
        </div>
      )}
    </>
  );
};

export default Scoreboard;
