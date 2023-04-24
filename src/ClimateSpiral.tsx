import React, { useRef, useEffect, useState } from "react";
import p5 from "p5";

interface ClimateSpiralProps {
  dataUrl: string;
}

const ClimateSpiral: React.FC<ClimateSpiralProps> = ({ dataUrl }) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const myP5Ref = useRef<p5 | null>(null);

  const currentRowRef = useRef(1);
  const currentMonthRef = useRef(0);

  const [buttonEnabled, setButtonEnabled] = useState(false);

  const handleClick = () => {
    if (myP5Ref.current) {
      currentRowRef.current = 1;
      currentMonthRef.current = 0;
      setButtonEnabled(false);
      myP5Ref.current.loop();
    }
  };

  useEffect(() => {
    const sketch = (p: p5) => {
      let data: any;
      let months: string[];

      let zeroRadius = 125;
      let oneRadius = 200;

      let currentRow = 1;
      let currentMonth = 0;

      let previousAnomaly = 0;

      p.preload = () => {
        data = p.loadTable(dataUrl, "csv", "header");
      };

      p.setup = () => {
        p.createCanvas(600, 600);
        months = [
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
          "Jan",
          "Feb",
        ];
      };

      const drawCircleAndLabel = (
        radius: number,
        label: string,
        offset: number = 10
      ) => {
        p.stroke(255);
        p.strokeWeight(2);
        p.noFill();
        p.circle(0, 0, radius * 2);
        p.fill(255);
        p.noStroke();
        p.text(label, radius + offset, 0);
      };

      p.draw = () => {
        if (!data) return;
        p.background(40, 44, 52);
        p.translate(p.width / 2, p.height / 2);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);

        drawCircleAndLabel(zeroRadius, "0°");
        drawCircleAndLabel(oneRadius, "1°");

        p.stroke(255);
        p.strokeWeight(2);
        p.noFill();
        p.circle(0, 0, 500);

        for (let i = 0; i < months.length; i++) {
          p.noStroke();
          p.fill(255);
          p.textSize(24);
          let angle = p.map(i, 0, months.length, 0, p.TWO_PI);
          p.push();
          let pos = new p5.Vector();
          pos.set(264, 0);
          pos.rotate(angle);
          p.translate(pos.x, pos.y);
          p.rotate(angle + p.PI / 2);
          p.text(months[i], 0, 0);
          p.pop();
        }

        let year = data.getRow(currentRowRef.current).get("Year");
        p.textSize(32);
        p.text(year, 0, 0);

        p.noFill();
        p.stroke(255);
        let firstValue = true;
        for (let j = 0; j < currentRowRef.current; j++) {
          let row = data.getRow(j);

          let totalMonths = months.length;
          if (j === currentRow - 1) {
            totalMonths = currentMonth;
          }

          for (let i = 0; i < totalMonths; i++) {
            let anomaly = row.get(months[i]);

            if (anomaly !== "***") {
              anomaly = parseFloat(anomaly as string);
              let angle = p.map(i, 0, months.length, 0, p.TWO_PI) - p.PI / 3;
              let pr = p.map(previousAnomaly, 0, 1, zeroRadius, oneRadius);
              let r = p.map(anomaly, 0, 1, zeroRadius, oneRadius);
              let pos1 = new p5.Vector();
              pos1.set(r, 0);
              pos1.rotate(angle);
              let pos2 = new p5.Vector();
              pos2.set(pr, 0);
              pos2.rotate(angle - p.PI / 6);

              if (!firstValue) {
                let avg = (anomaly + previousAnomaly) * 0.5;
                let cold = p.color(0, 0, 255);
                let warm = p.color(255, 0, 0);
                let zero = p.color(255);
                let lineColor = zero;
                if (avg < 0) {
                  lineColor = p.lerpColor(zero, cold, Math.abs(avg));
                } else {
                  lineColor = p.lerpColor(zero, warm, Math.abs(avg));
                }

                p.stroke(lineColor);
                p.line(pos1.x, pos1.y, pos2.x, pos2.y);
              }
              firstValue = false;
              previousAnomaly = anomaly;
            }
          }
        }

        currentMonthRef.current = currentMonthRef.current + 1;
        if (currentMonthRef.current === months.length) {
          currentMonthRef.current = 0;
          currentRowRef.current = currentRowRef.current + 1;
          if (currentRowRef.current === data.getRowCount()) {
            p.noLoop();
            setButtonEnabled(true);
          }
        }
      };
    };

    if (canvasRef.current && !myP5Ref.current) {
      myP5Ref.current = new p5(sketch, canvasRef.current);
    }

    return () => {
      myP5Ref.current?.remove();
    };
  }, [dataUrl]);

  return (
    <div>
      <div ref={canvasRef} data-testid="canvas"></div>
      {buttonEnabled && (
        <button
          onClick={handleClick}
          style={{ fontSize: "24px" }}
          aria-label="Restart animation"
        >
          🔄 Restart
        </button>
      )}
    </div>
  );
};

export default ClimateSpiral;
