import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function BasicPie({data}) {
  console.log(data);
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: data.p, label: "Patients" },
            { id: 1, value: data.d, label: "Doctors" },
          ],
        },
      ]}
      width={400}
      height={200}
    />
  );
}
