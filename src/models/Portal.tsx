import { Mesh, MeshStandardMaterial } from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    fruit001: Mesh;
    fruit002: Mesh;
    fruit003: Mesh;
    fruit004: Mesh;
    fruit005: Mesh;
    fruit006: Mesh;
    fruit007: Mesh;
    Object_4: Mesh;
    Object_5: Mesh;
    Object_6: Mesh;
    Object_7: Mesh;
  };
  materials: {
    ['fruit.001']: MeshStandardMaterial;
    ['fruit.002']: MeshStandardMaterial;
    ['fruit.003']: MeshStandardMaterial;
    ['fruit.004']: MeshStandardMaterial;
    ['fruit.005']: MeshStandardMaterial;
    ['fruit.006']: MeshStandardMaterial;
    ['fruit.007']: MeshStandardMaterial;
    portal: MeshStandardMaterial;
    Rock: MeshStandardMaterial;
    ['Rock.001']: MeshStandardMaterial;
    plant: MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/models/Portal.glb') as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <group position={[0, 1, -0.246]} rotation={[-1.571, 0, -1.915]}>
        <mesh
          geometry={nodes.fruit001.geometry}
          material={materials['fruit.001']}
          position={[-2.122, -0.774, -0.815]}
          rotation={[-1.57, 1.227, -Math.PI]}
          scale={0.053}
        />
        <mesh
          geometry={nodes.fruit002.geometry}
          material={materials['fruit.002']}
          position={[-2.09, -0.829, -0.818]}
          rotation={[-1.57, 1.227, -Math.PI]}
          scale={0.053}
        />
        <mesh
          geometry={nodes.fruit003.geometry}
          material={materials['fruit.003']}
          position={[2.215, 0.87, -0.821]}
          rotation={[-1.57, 1.227, -Math.PI]}
          scale={0.053}
        />
        <mesh
          geometry={nodes.fruit004.geometry}
          material={materials['fruit.004']}
          position={[2.234, 0.82, -0.874]}
          rotation={[-1.57, 1.227, -Math.PI]}
          scale={0.053}
        />
        <mesh
          geometry={nodes.fruit005.geometry}
          material={materials['fruit.005']}
          position={[0.432, -0.217, 3.121]}
          rotation={[-1.57, 1.227, -Math.PI]}
          scale={0.053}
        />
        <mesh
          geometry={nodes.fruit006.geometry}
          material={materials['fruit.006']}
          position={[0.518, -0.207, 3.105]}
          rotation={[-1.57, 1.227, -Math.PI]}
          scale={0.053}
        />
        <mesh
          geometry={nodes.fruit007.geometry}
          material={materials['fruit.007']}
          position={[0.456, -0.162, 3.125]}
          rotation={[-1.57, 1.227, -Math.PI]}
          scale={0.053}
        />
        <mesh geometry={nodes.Object_4.geometry} material={materials.portal} />
        <mesh geometry={nodes.Object_5.geometry} material={materials.Rock} />
        <mesh
          geometry={nodes.Object_6.geometry}
          material={materials['Rock.001']}
        />
        <mesh geometry={nodes.Object_7.geometry} material={materials.plant} />
      </group>
    </group>
  );
}

useGLTF.preload('/models/Portal.glb');
