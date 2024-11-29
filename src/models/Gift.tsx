import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTFGiftResult } from '../types/gift';

type GiftProps = {
  colors?: Record<string, string>;
  opacity?: number;
} & JSX.IntrinsicElements['group'];
export function Gift({ colors = {}, opacity = 1, ...props }: GiftProps) {
  const { nodes, materials: originalMaterials } = useGLTF(
    '/models/Gift.glb',
  ) as GLTFGiftResult;

  const materials: GLTFGiftResult['materials'] =
    {} as GLTFGiftResult['materials'];

  // 모든 머티리얼을 복제하고 투명도 설정
  for (const [key, material] of Object.entries(originalMaterials)) {
    const clonedMaterial = material.clone();
    if (clonedMaterial instanceof THREE.MeshStandardMaterial) {
      clonedMaterial.transparent = opacity < 1;
      clonedMaterial.opacity = opacity;
    }
    materials[key as keyof GLTFGiftResult['materials']] = clonedMaterial;
  }
  Object.entries(colors).forEach(([materialName, color]) => {
    if (materialName in materials) {
      const material =
        materials[materialName as keyof GLTFGiftResult['materials']];
      if (material instanceof THREE.MeshStandardMaterial) {
        material.color.set(color);
      }
    }
  });

  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <mesh
          geometry={nodes.Cube_Material002_0.geometry}
          material={materials['Material.002']}
          position={[0, 87.051, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          geometry={nodes.Cube001_Material008_0.geometry}
          material={materials['Material.008']}
          position={[0, 133.106, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={112.697}
        />
        <mesh
          geometry={nodes.Cube003_Material009_0.geometry}
          material={materials['Material.009']}
          position={[0, 115.834, 0]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          scale={[89.714, 119.029, 138.183]}
        />
        <mesh
          geometry={nodes.Cube002_Material010_0.geometry}
          material={materials['Material.010']}
          position={[0, 115.007, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[89.714, 119.029, 138.183]}
        />
        <mesh
          geometry={nodes.Cube004_Material011_0.geometry}
          material={materials['Material.011']}
          position={[0, 296.715, 0]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          scale={[-22.4, 100, 46.061]}
        />
        <mesh
          geometry={nodes.Cube005_Material012_0.geometry}
          material={materials['Material.012']}
          position={[0, 279.347, 0]}
          rotation={[-Math.PI / 2, 0, Math.PI]}
          scale={[-16.163, 29.019, 21.927]}
        />
        <mesh
          geometry={nodes.Sphere_Material023_0.geometry}
          material={materials['Material.023']}
          position={[-22.78, 265.952, -19.769]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={8.294}
        />
        <mesh
          geometry={nodes.Sphere001_Material021_0.geometry}
          material={materials['Material.021']}
          position={[-22.78, 265.952, 16.017]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={8.294}
        />
        <mesh
          geometry={nodes.Sphere002_Material020_0.geometry}
          material={materials['Material.020']}
          position={[-22.78, 276.117, 7.403]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={9.816}
        />
        <mesh
          geometry={nodes.Sphere003_Material019_0.geometry}
          material={materials['Material.019']}
          position={[-22.78, 276.117, -9.051]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={9.816}
        />
        <mesh
          geometry={nodes.Sphere004_Material024_0.geometry}
          material={materials['Material.024']}
          position={[-22.78, 255.883, -14.891]}
          scale={8.294}
        />
        <mesh
          geometry={nodes.Sphere005_Material022_0.geometry}
          material={materials['Material.022']}
          position={[-22.768, 256.12, 7.637]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={8.294}
        />
        <mesh
          geometry={nodes.Sphere006_Material015_0.geometry}
          material={materials['Material.015']}
          position={[26.587, 265.952, -19.769]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={8.294}
        />
        <mesh
          geometry={nodes.Sphere007_Material016_0.geometry}
          material={materials['Material.016']}
          position={[26.587, 265.952, 16.017]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={8.294}
        />
        <mesh
          geometry={nodes.Sphere008_Material013_0.geometry}
          material={materials['Material.013']}
          position={[26.587, 276.117, 7.403]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={9.816}
        />
        <mesh
          geometry={nodes.Sphere009_Material014_0.geometry}
          material={materials['Material.014']}
          position={[26.587, 276.117, -9.051]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={9.816}
        />
        <mesh
          geometry={nodes.Sphere010_Material018_0.geometry}
          material={materials['Material.018']}
          position={[26.587, 255.883, -14.891]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={8.294}
        />
        <mesh
          geometry={nodes.Sphere011_Material017_0.geometry}
          material={materials['Material.017']}
          position={[26.598, 256.12, 7.637]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={8.294}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/models/Gift.glb');
