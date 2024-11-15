import { Environment } from "@react-three/drei";
import GroundMap from "./map/Ground";
import RabbitController from "./controller/RabbitController";
import { Physics } from "@react-three/rapier";
import { useAtomValue } from "jotai";
import { playersAtom } from "../atoms/PlayerAtoms";
import ExController from "./controller/ExController";

export default function Scene() {
  const players = useAtomValue(playersAtom);
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <Physics debug>
        <GroundMap />
        {/* <RabbitController /> */}
        {players.map((player) => (
          <ExController player={player} key={player.id} />
        ))}
      </Physics>
    </>
  );
}
