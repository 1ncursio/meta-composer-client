import React, { useEffect, useState } from "react";
import {
  Scene,
  Box,
  Sphere,
  Cylinder,
  Plane,
  Sky,
  Text,
  Entity,
} from "@belivvr/aframe-react";
import { NextPage } from "next";

const VRPage: NextPage = () => {
  const [rendered, setRendered] = useState<boolean>(false);

  useEffect(() => {
    setRendered(true);

    if (typeof window !== "undefined") {
      require("aframe"); // eslint-disable-line global-require
    }
  }, [setRendered]);

  if (!rendered) {
    return <>loading</>;
  }

  return (
    <Scene>
      <Box
        position={{ x: -1, y: 0.5, z: -3 }}
        rotation={{ x: 0, y: 45, z: 0 }}
        color="#4CC3D9"
      />
      <Sphere
        position={{ x: 0, y: 1.25, z: -5 }}
        radius={1.25}
        color="#EF2D5E"
      />
      <Cylinder
        position={{ x: 1, y: 0.75, z: -3 }}
        radius={0.5}
        height={1.5}
        color="#FFC65D"
      />
      <Plane
        position={{ x: 0, y: 0, z: -4 }}
        rotation={{ x: -90, y: 0, z: 0 }}
        width={4}
        height={4}
        color="#7BC8A4"
      />
      <Text value="Hello World" position={{ x: 0, y: 1.5, z: -4 }} />
      <Sky color="#ECECEC" />
      <Entity
        handTrackingControls={{
          hand: "left",
          modelColor: "#ff0000",
          modelStyle: "mesh",
        }}
      />
      <Entity
        handTrackingControls={{
          hand: "right",
          modelColor: "#ff0000",
          modelStyle: "mesh",
        }}
      />
    </Scene>
  );
};

export default VRPage;
