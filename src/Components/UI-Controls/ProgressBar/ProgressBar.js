import React, { useEffect, useState } from "react";

const ProgressBar = ({ percentage, color }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let currentProgress = 0;
        const interval = setInterval(() => {
            if (currentProgress < percentage) {
                currentProgress += 1;
                setProgress(currentProgress);
            } else {
                clearInterval(interval);
            }
        }, 15);

        return () => clearInterval(interval);
    }, [percentage]);

    return (
        <progress
            value={progress}
            max="100"
            className="top-category-product-progress"
            style={{ "--progress-color": color }}
        />
    );
};

export default ProgressBar;